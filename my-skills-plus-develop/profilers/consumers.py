import asyncio
import json
import queue
import threading
import time
import os
import logging
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from google.cloud import speech, translate_v2 as translate

from .services.google_stt import get_streaming_config

logger = logging.getLogger("stt")

creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if creds:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds


class STTConsumer(AsyncWebsocketConsumer):

    # ---------------- CONNECT ----------------
    async def connect(self):
        self.language_code = self.scope["url_route"]["kwargs"]["language_code"]
        await self.accept()

        self.session_id = str(uuid.uuid4())[:8]

        logger.info("[%s] 🔌 CONNECTED language=%s", self.session_id, self.language_code)

        self.stop_event = threading.Event()
        self.loop = asyncio.get_running_loop()

        self.reset_session_state()

        self.speech_client = speech.SpeechClient()
        self.translate_client = translate.Client()

        self.start_time = time.time()

        self.start_stt_thread()

        self.forward_task = asyncio.create_task(self.forward_responses())
        self.silence_task = asyncio.create_task(self.silence_watch())

        logger.info("[%s] 🚀 Session initialized", self.session_id)

    # ---------------- RESET STATE ----------------
    def reset_session_state(self):

        self.audio_q = queue.Queue()
        self.responses_q = asyncio.Queue()

        self.final_text = ""
        self.last_partial = ""
        self.last_activity = time.time()

        self.SILENCE_SEC = 8

        self.recv_chunk_count = 0
        self.google_send_count = 0

        logger.info("[%s] 🔄 Session state reset", getattr(self, "session_id", "init"))

    # ---------------- START THREAD ----------------
    def start_stt_thread(self):

        self.stop_event.clear()

        logger.info("[%s] 🧵 Starting STT thread", self.session_id)

        self.thread = threading.Thread(
            target=self.consume_stt,
            daemon=True
        )
        self.thread.start()

    # ---------------- AUDIO GENERATOR ----------------
    def request_gen(self):

        while not self.stop_event.is_set():

            try:
                chunk = self.audio_q.get(timeout=1)
            except queue.Empty:
                continue

            if chunk is None:
                logger.info("[%s] 🛑 Audio generator stop signal", self.session_id)
                break

            self.google_send_count += 1

            yield speech.StreamingRecognizeRequest(audio_content=chunk)

    # ---------------- STT THREAD ----------------
    def consume_stt(self):

        logger.info("[%s] 🎙️ STT THREAD STARTED", self.session_id)

        last_health_log = time.time()

        while not self.stop_event.is_set():
            try:
                config = get_streaming_config(self.language_code)

                responses = self.speech_client.streaming_recognize(
                    config,
                    self.request_gen()
                )

                for r in responses:

                    if self.stop_event.is_set():
                        break

                    if not r.results or not r.results[0].alternatives:
                        continue

                    result = r.results[0]
                    transcript = result.alternatives[0].transcript

                    latency = time.time() - self.last_activity
                    self.last_activity = time.time()

                    self.loop.call_soon_threadsafe(
                        self.responses_q.put_nowait,
                        {
                            "transcript": transcript,
                            "is_final": result.is_final
                        }
                    )

                    if result.is_final:
                        logger.info(
                            "[%s] 🟢 FINAL | latency=%.2fs | text=%s",
                            self.session_id,
                            latency,
                            transcript[:80]
                        )
                    else:
                        logger.debug(
                            "[%s] 🟡 PARTIAL | latency=%.2fs | text=%s",
                            self.session_id,
                            latency,
                            transcript[:50]
                        )

                    if time.time() - last_health_log > 10:
                        logger.warning(
                            "[%s] ⚠️ STT ACTIVE CHECK (possible silence or mic issue)",
                            self.session_id
                        )
                        last_health_log = time.time()

            except Exception as e:
                logger.exception("[%s] ❌ STT ERROR", self.session_id)
                time.sleep(0.5)

        logger.info("[%s] 🧵 STT THREAD STOPPED", self.session_id)

    # ---------------- RECEIVE AUDIO ----------------
    async def receive(self, text_data=None, bytes_data=None):

        if not bytes_data or self.stop_event.is_set():
            return

        self.recv_chunk_count += 1

        self.audio_q.put(bytes_data)

        if self.recv_chunk_count % 50 == 0:
            logger.info(
                "[%s] 📊 AUDIO FLOW | chunks=%d | size=%d | queue=%d",
                self.session_id,
                self.recv_chunk_count,
                len(bytes_data),
                self.audio_q.qsize()
            )

    # ---------------- FORWARD RESPONSES ----------------
    async def forward_responses(self):

        logger.info("[%s] 🚀 Forward task started", self.session_id)

        try:
            while not self.stop_event.is_set():

                item = await self.responses_q.get()

                transcript = item["transcript"]
                is_final = item["is_final"]

                self.last_activity = time.time()

                if is_final:
                    self.final_text = (self.final_text + " " + transcript).strip()
                    self.last_partial = ""

                    await self.send(json.dumps({
                        "type": "partial_final",
                        "transcript": transcript
                    }))

                else:
                    self.last_partial = transcript

                    await self.send(json.dumps({
                        "type": "partial",
                        "transcript": transcript
                    }))

        except asyncio.CancelledError:
            logger.info("[%s] 🚫 forward task cancelled", self.session_id)

    # ---------------- SILENCE WATCH ----------------
    async def silence_watch(self):

        logger.info("[%s] 👀 Silence watcher started", self.session_id)

        try:
            while not self.stop_event.is_set():

                await asyncio.sleep(0.5)

                if not self.final_text:
                    continue

                gap = time.time() - self.last_activity

                if gap > self.SILENCE_SEC:

                    logger.warning(
                        "[%s] 🔇 SILENCE DETECTED | gap=%.2fs | text_len=%d",
                        self.session_id,
                        gap,
                        len(self.final_text)
                    )

                    try:
                        translated = self.translate_client.translate(
                            self.final_text,
                            target_language="en"
                        )["translatedText"]
                    except Exception as e:
                        logger.warning("[%s] ⚠️ translation failed: %s", self.session_id, e)
                        translated = self.final_text

                    await self.send(json.dumps({
                        "type": "done_stt",
                        "transcript_original": self.final_text,
                        "transcript_en": translated
                    }))

                    logger.info("[%s] ✅ Session finalized", self.session_id)

                    self.reset_stream()

        except asyncio.CancelledError:
            logger.info("[%s] 🚫 silence watcher cancelled", self.session_id)

    # ---------------- RESET STREAM ----------------
    def reset_stream(self):

        logger.warning("[%s] 🔄 STREAM RESET", self.session_id)

        self.stop_event.set()
        self.audio_q.put(None)

        if hasattr(self, "thread") and self.thread.is_alive():
            self.thread.join(timeout=3)

        logger.info("[%s] 🧵 old thread stopped", self.session_id)

        self.stop_event = threading.Event()
        self.reset_session_state()
        self.start_stt_thread()

        logger.info("[%s] 🚀 new stream started", self.session_id)

    # ---------------- DISCONNECT ----------------
    async def disconnect(self, close_code):

        duration = time.time() - self.start_time

        logger.info(
            "[%s] ❌ DISCONNECT | code=%s | duration=%.2fs",
            self.session_id,
            close_code,
            duration
        )

        self.stop_event.set()
        self.audio_q.put(None)

        if hasattr(self, "thread") and self.thread.is_alive():
            self.thread.join(timeout=3)

        for task_name in ["forward_task", "silence_task"]:
            task = getattr(self, task_name, None)
            if task:
                task.cancel()
                try:
                    await task
                except:
                    pass

        logger.info("[%s] 🧹 CLEANUP COMPLETE", self.session_id)














# import asyncio
# import json
# import queue
# import threading
# import time
# import os
# import logging
# import uuid

# from channels.generic.websocket import AsyncWebsocketConsumer
# from google.cloud import speech, translate_v2 as translate

# from .services.google_stt import get_streaming_config

# logger = logging.getLogger("stt")

# creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") 
# if creds:
#     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds


# class STTConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         self.language_code = self.scope["url_route"]["kwargs"]["language_code"]
#         await self.accept()

#         self.session_id = str(uuid.uuid4())[:8]

#         self.reset_session_state()

#         self.speech_client = speech.SpeechClient()
#         self.translate_client = translate.Client()

#         self.loop = asyncio.get_running_loop()

#         self.stop_event = threading.Event()

#         self.start_stt_thread()

#         self.forward_task = asyncio.create_task(self.forward_responses())
#         self.silence_task = asyncio.create_task(self.silence_watch())

#     # ---------------- SESSION RESET ----------------
#     def reset_session_state(self):

#         # FIX: thread-safe queue for audio
#         self.audio_q = queue.Queue()

#         # asyncio queue for websocket responses
#         self.responses_q = asyncio.Queue()

#         self.final_text = ""
#         self.last_partial = ""
#         self.last_activity = time.time()

#         self.SILENCE_SEC = 8

#         self.recv_chunk_count = 0
#         self.google_send_count = 0

#         self.last_recv_time = None
#         self.last_google_send_time = None

#     # ---------------- THREAD START ----------------
#     def start_stt_thread(self):

#         self.stop_event.clear()
#         self.thread = threading.Thread(target=self.consume_stt, daemon=True)
#         self.thread.start()

#     # ---------------- AUDIO STREAM ----------------
#     def request_gen(self):
#         while not self.stop_event.is_set():

#             try:
#                 chunk = self.audio_q.get(timeout=1)
#             except queue.Empty:
#                 continue

#             if chunk is None:
#                 break

#             yield speech.StreamingRecognizeRequest(audio_content=chunk)

#     # ---------------- STT THREAD ----------------
#     def consume_stt(self):

#         while not self.stop_event.is_set():
#             try:
#                 config = get_streaming_config(self.language_code)

#                 responses = self.speech_client.streaming_recognize(
#                     config,
#                     self.request_gen()
#                 )

#                 for r in responses:
#                     if not r.results or not r.results[0].alternatives:
#                         continue

#                     result = r.results[0]
#                     transcript = result.alternatives[0].transcript

#                     self.last_activity = time.time()

#                     self.loop.call_soon_threadsafe(
#                         self.responses_q.put_nowait,
#                         {
#                             "transcript": transcript,
#                             "is_final": result.is_final
#                         }
#                     )

#             except Exception as e:
#                 logger.exception("[%s] STT error", self.session_id)
#                 time.sleep(0.5)

#     # ---------------- RECEIVE AUDIO ----------------
#     async def receive(self, text_data=None, bytes_data=None):

#         if not bytes_data:
#             return

#         self.recv_chunk_count += 1

#         # FIX: batch protection (VERY IMPORTANT)
#         self.audio_q.put(bytes_data)

#     # ---------------- SEND TO FRONTEND ----------------
#     async def forward_responses(self):

#         while True:
#             item = await self.responses_q.get()

#             transcript = item["transcript"]
#             is_final = item["is_final"]

#             self.last_activity = time.time()

#             if is_final:
#                 self.final_text = (self.final_text + " " + transcript).strip()
#                 self.last_partial = ""

#                 await self.send(json.dumps({
#                     "type": "partial_final",
#                     "transcript": transcript
#                 }))
#             else:
#                 self.last_partial = transcript

#                 await self.send(json.dumps({
#                     "type": "partial",
#                     "transcript": transcript
#                 }))

#     # ---------------- SILENCE WATCH ----------------
#     async def silence_watch(self):

#         while True:
#             await asyncio.sleep(0.5)

#             if not self.final_text:
#                 continue

#             if time.time() - self.last_activity > self.SILENCE_SEC:

#                 try:
#                     translated = self.translate_client.translate(
#                         self.final_text,
#                         target_language="en"
#                     )["translatedText"]
#                 except:
#                     translated = self.final_text

#                 await self.send(json.dumps({
#                     "type": "done_stt",
#                     "transcript_original": self.final_text,
#                     "transcript_en": translated
#                 }))

#                 self.reset_stream()

#     # ---------------- RESET STREAM ----------------
#     def reset_stream(self):

#         logger.info("[%s] resetting stream", self.session_id)

#         # STOP OLD THREAD CLEANLY
#         self.stop_event.set()

#         self.audio_q.put(None)

#         self.final_text = ""
#         self.last_partial = ""

#         time.sleep(0.2)

#         self.start_stt_thread()

#     # ---------------- DISCONNECT ----------------
#     async def disconnect(self, close_code):

#         self.stop_event.set()

#         try:
#             self.audio_q.put(None)
#         except:
#             pass

#         if hasattr(self, "thread"):
#             self.thread.join(timeout=2)

#         if hasattr(self, "forward_task"):
#             self.forward_task.cancel()

#         if hasattr(self, "silence_task"):
#             self.silence_task.cancel()










# import asyncio
# import json
# import queue
# import threading
# import time
# import os
# import logging
# import uuid

# from channels.generic.websocket import AsyncWebsocketConsumer
# from google.cloud import speech, translate_v2 as translate

# from .services.google_stt import get_streaming_config

# logger = logging.getLogger("stt")

# creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") 
# if creds:
#     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds


# class STTConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.language_code = self.scope["url_route"]["kwargs"]["language_code"]
#         await self.accept()

#         self.session_id = str(uuid.uuid4())[:8]

#         self.last_recv_time = None
#         self.recv_chunk_count = 0

#         self.last_google_send_time = None
#         self.google_send_count = 0

#         logger.info("[%s] websocket connected", self.session_id)

#         self.audio_q = queue.Queue()
#         self.responses_q = asyncio.Queue()

#         self.final_text = ""
#         self.last_partial = ""
#         self.last_activity = time.time()

#         self.SILENCE_SEC = 8
#         self.MAX_ANSWER_TIME = 5

#         self.speech_client = speech.SpeechClient()
#         self.translate_client = translate.Client()

#         self.loop = asyncio.get_running_loop()

#         self.thread = threading.Thread(target=self.consume_stt, daemon=True)
#         self.thread.start()

#         self.forward_task = asyncio.create_task(self.forward_responses())
#         self.silence_task = asyncio.create_task(self.silence_watch())

#     # ---------------- AUDIO STREAM ----------------
#     def request_gen(self):

#         while True:
#             chunk = self.audio_q.get()

#             if chunk is None:
#                 logger.info("[%s] request_gen received stop signal", self.session_id)
#                 break

#             now = time.time()
#             self.google_send_count += 1

#             gap = None
#             if self.last_google_send_time is not None:
#                 gap = round((now - self.last_google_send_time) * 1000, 2)

#             self.last_google_send_time = now

#             logger.info(
#                 "[%s] GOOGLE_SEND chunk=%s bytes=%s qsize=%s gap_ms=%s",
#                 self.session_id,
#                 self.google_send_count,
#                 len(chunk),
#                 self.audio_q.qsize(),
#                 gap,
#             )

#             yield speech.StreamingRecognizeRequest(audio_content=chunk)

#     # ---------------- STT THREAD ----------------
#     def consume_stt(self):

#         try:
#             streaming_config = get_streaming_config(self.language_code)

#             responses = self.speech_client.streaming_recognize(
#                 streaming_config,
#                 self.request_gen()
#             )

#             for r in responses:

#                 if not r.results or not r.results[0].alternatives:
#                     continue

#                 result = r.results[0]
#                 transcript = result.alternatives[0].transcript

#                 logger.info(
#                     "[%s] GOOGLE_RESP final=%s transcript=%s",
#                     self.session_id,
#                     result.is_final,
#                     transcript,
#                 )

#                 self.loop.call_soon_threadsafe(
#                     self.responses_q.put_nowait,
#                     {
#                         "transcript": transcript,
#                         "is_final": result.is_final
#                     }
#                 )

#         except Exception as e:

#             logger.exception("[%s] STT exception", self.session_id)

#             self.loop.call_soon_threadsafe(
#                 self.responses_q.put_nowait,
#                 {"error": str(e)}
#             )

#     # ---------------- SEND TO FRONTEND ----------------
#     async def forward_responses(self):

#         while True:
#             item = await self.responses_q.get()

#             if "error" in item:
#                 await self.send(text_data=json.dumps({
#                     "type": "error",
#                     "message": item["error"]
#                 }))
#                 continue

#             transcript = item["transcript"]
#             is_final = item["is_final"]

#             self.last_activity = time.time()

#             if is_final:
#                 self.final_text = (self.final_text + " " + transcript).strip()
#                 self.last_partial = ""

#                 await self.send(text_data=json.dumps({
#                     "type": "partial_final",
#                     "transcript": transcript
#                 }))
#             else:
#                 self.last_partial = transcript

#                 await self.send(text_data=json.dumps({
#                     "type": "partial",
#                     "transcript": transcript
#                 }))

#     # ---------------- SILENCE WATCH ----------------
#     async def silence_watch(self):

#         while True:
#             await asyncio.sleep(0.3)

#             now = time.time()
#             have_text = bool(self.final_text.strip())

#             silence_elapsed = (now - self.last_activity) > self.SILENCE_SEC
#             forced_timeout = have_text and (now - self.last_activity > self.MAX_ANSWER_TIME)

#             if have_text and (silence_elapsed or forced_timeout):
#                 original_text = self.final_text.strip()

#                 try:
#                     translated = self.translate_client.translate(
#                         original_text,
#                         target_language="en"
#                     )["translatedText"]

#                 except Exception as e:
#                     translated = original_text

#                 await self.send(text_data=json.dumps({
#                     "type": "done_stt",
#                     "transcript_original": original_text,
#                     "transcript_en": translated
#                 }))

#                 self.final_text = ""
#                 self.last_partial = ""
#                 self.last_activity = time.time()

#     # ---------------- RECEIVE AUDIO ----------------
#     async def receive(self, text_data=None, bytes_data=None):
#         if bytes_data:
#             now = time.time()
#             self.recv_chunk_count += 1

#             gap = None
#             if self.last_recv_time is not None:
#                 gap = round((now - self.last_recv_time) * 1000, 2)

#             self.last_recv_time = now

#             logger.info(
#                 "[%s] WS_RECV chunk=%s bytes=%s gap_ms=%s qsize=%s",
#                 self.session_id,
#                 self.recv_chunk_count,
#                 len(bytes_data),
#                 gap,
#                 self.audio_q.qsize(),
#             )

#             self.audio_q.put(bytes_data)

#     # ---------------- DISCONNECT ----------------
#     async def disconnect(self, close_code):

#         logger.info("[%s] websocket disconnect", self.session_id)
#         self.audio_q.put(None)

#         if hasattr(self, "forward_task"):
#             self.forward_task.cancel()

#         if hasattr(self, "silence_task"):
#             self.silence_task.cancel()

#         if hasattr(self, "thread"):
#             self.thread.join(timeout=0.5)































# # from .services.google_stt import (
# #     get_speech_client,
# #     get_translate_client,
# #     get_streaming_config,
# # )
# # Global clients
# # speech_client = speech.SpeechClient()
# # translate_client = translate.Client()


# class STTConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.language_code = self.scope["url_route"]["kwargs"]["language_code"]
#         print("✅ CONNECT CALLED")
#         await self.accept()

#         self.audio_q = queue.Queue()
#         self.responses_q = asyncio.Queue()

#         self.final_text = ""
#         self.last_partial = ""
#         self.last_activity = time.time()
#         self.SILENCE_SEC = 3
#         self.MAX_ANSWER_TIME = 2

#         loop = asyncio.get_running_loop()
#         self.thread = threading.Thread(target=self.consume, args=(loop,), daemon=True)
#         self.thread.start()

#         # Start background tasks
#         self.forward_task = asyncio.create_task(self.forward_responses())
#         self.silence_task = asyncio.create_task(self.silence_watch())


#     async def disconnect(self, close_code):
#         print("❌ DISCONNECTED with code:", close_code)
#         self.audio_q.put(None)
#         for task in [self.forward_task, self.silence_task]:
#             task.cancel()
#         try:
#             self.thread.join(timeout=0.5)
#         except:
#             pass
#         print("[WS] disconnected")

#     # async def receive(self, text_data=None, bytes_data=None):
#     #     if bytes_data:
#     #         self.audio_q.put(bytes_data)

#     async def receive(self, text_data=None, bytes_data=None):
#         try:
#             if bytes_data:
#                 print("🎤 Received audio chunk:", len(bytes_data))
#                 self.audio_q.put(bytes_data)
            
#             if text_data:
#                 print("📩 Received text:", text_data)
    
#         # except Exception as e:
#         #     print("❌ ERROR in receive:", str(e))
#         except Exception as e:
#             print("🔥 FULL ERROR:", e)
#             import traceback
#             traceback.print_exc()

#     # ---- Internal functions ----

#     def request_gen(self):
#         while True:
#             chunk = self.audio_q.get()
#             if chunk is None:
#                 break
#             yield speech.StreamingRecognizeRequest(audio_content=chunk)

#     def consume(self, loop):
#         try:
#             speech_client = get_speech_client()  
#             streaming_config = get_streaming_config(self.language_code)
#             responses = speech_client.streaming_recognize(
#                 streaming_config,
#                 self.request_gen()
#             )
#             for r in responses:
#                 if not r.results or not r.results[0].alternatives:
#                     continue
#                 transcript = r.results[0].alternatives[0].transcript
#                 loop.call_soon_threadsafe(
#                     self.responses_q.put_nowait,
#                     {"transcript": transcript, "is_final": r.results[0].is_final}
#                 )
#         except Exception as e:
#             loop.call_soon_threadsafe(self.responses_q.put_nowait, {"error": str(e)})

#     async def forward_responses(self):
#         while True:
#             item = await self.responses_q.get()
#             if "error" in item:
#                 try:
#                     await self.send(text_data=json.dumps({
#                         "type": "error",
#                         "message": item["error"]
#                     }))
#                 except:
#                     pass
#                 continue

#             transcript, is_final = item["transcript"], item["is_final"]
#             self.last_activity = time.time()

#             if is_final:
#                 self.final_text = (self.final_text + " " + transcript).strip()
#                 self.last_partial = ""
#                 await self.send(text_data=json.dumps({
#                     "type": "partial_final",
#                     "transcript": transcript
#                 }))
#             else:
#                 self.last_partial = transcript
#                 await self.send(text_data=json.dumps({
#                     "type": "partial",
#                     "transcript": transcript
#                 }))

#     async def silence_watch(self):
#         while True:
#             await asyncio.sleep(0.3)
#             now = time.time()
#             have_text = bool(self.final_text.strip())
#             silence_elapsed = (now - self.last_activity) > self.SILENCE_SEC
#             forced_timeout = have_text and (now - self.last_activity > self.MAX_ANSWER_TIME)

#             if have_text and (silence_elapsed or forced_timeout):
#                 transcript_to_save = self.final_text.strip()

#                 try:
#                     translate_client = get_translate_client()
#                     translated = translate_client.translate(
#                         transcript_to_save, target_language="en"
#                     )["translatedText"]
#                 except Exception as e:
#                     translated = transcript_to_save
#                     print("[TRANSLATE] ❌", e)

#                 try:
#                     await self.send(text_data=json.dumps({
#                         "type": "done_stt",
#                         "transcript_original": transcript_to_save,
#                         "transcript_en": translated
#                     }))
#                 except:
#                     pass

#                 self.final_text = ""
#                 self.last_partial = ""
#                 self.last_activity = time.time()
