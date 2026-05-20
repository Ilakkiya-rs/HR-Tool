"use client";
import React, { useState, useEffect, useRef } from "react";
import VoiceWave from "./Waves";
import DisplayResult from "./ResultDisplay";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import ErrorDialog from "./ErrorDialog";
import { finishAndUpload } from "../utils/finishAndUpload";

const InterviewQuestions = ({ data, languageCode }) => {

  const location = useLocation();
  const pathname = location.pathname;

  const [assessment, setAssessment] = useState(data.assessment);
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [userAssessmentComplete, setUserAssessmentComplete] = useState(false);
  const [userAssessmentResult, setUserAssessmentResult] = useState(null);

  const wsRef = useRef(null);
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const workletNodeRef = useRef(null);
  const lastSendTimeRef = useRef(Date.now());
  const silenceFrame = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isSubmittingRef = useRef(false);

  const ttsEndRef = useRef(null);
  const recStartRef = useRef(null);
  const recStopRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  // Add these refs to your component
  const lastAudioTimeRef = useRef(0);
  const healthCheckIntervalRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);
  const visibilityListenerRef = useRef(null);

  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [livePartial, setLivePartial] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [pendingSave, setPendingSave] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingTTS, setLoadingTTS] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);



  const RTL_LANGS = ["ur-IN"];

  const getTextDirection = (languageCode) =>
    RTL_LANGS.includes(languageCode) ? "rtl" : "ltr";

  useEffect(() => {
    // console.log("data inside questions: ", data);
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;

      setIsUserScrolling(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom on new messages (only if user not scrolling)
  useEffect(() => {
    if (!isUserScrolling && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, displayedQuestion, transcript, livePartial, isUserScrolling]);

  useEffect(() => {
    async function init() {
      setIsLoading(true);

      try {
        let translatedQuestions = data.assessment.map(q => q.question);

        // Only call translation API if language is NOT English
        if (!languageCode.toLowerCase().startsWith("en")) {
          const res = await fetch(`https://api.myskillsplus.com/translate/`, {
          // const res = await fetch(`http://127.0.0.1:8000/translate/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: data.assessment.map((d) => d.question),
              target_language: languageCode.split("-")[0],
            }),
          });

          const translated = await res.json();
          translatedQuestions = translated.Result;
        }

        // Build new array with translated or original
        const updatedAssessment = data.assessment.map((q, i) => ({
          ...q,
          question_translated: translatedQuestions[i],
        }));

        // Update state
        setAssessment(updatedAssessment);

        // 🔥 Send to backend as FormData
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("questions", JSON.stringify(updatedAssessment));

        let endpoint;
        if (pathname.includes('/skills/')) {
          endpoint = `https://api.myskillsplus.com/skills/save_translated_questions/${data.token}/`;
          // endpoint = `http://127.0.0.1:8000/skills/save_translated_questions/${data.token}/`;
        } else if (pathname.includes('/jobfit/')) {
          endpoint = `https://api.myskillsplus.com/jobfit/save_translated_questions/${data.token}/`;
          // endpoint = `http://127.0.0.1:8000/jobfit/save_translated_questions/${data.token}/`;
        }

        await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [languageCode, data.assessment]);


  useEffect(() => {
    if (!pendingSave) return;
    const { idx, transcript_original, transcript_en } = pendingSave;

    let cancelled = false;
    (async () => {
      try {
        const result = await sendToSaveEndpoint(idx, transcript_original, transcript_en);
        if (cancelled) return;

        if (result.isLast) {
          handleSubmitAssessment();
        } else {
          if (!isSubmittingRef.current) {
            const nextIdx = idx + 1;
            setCurrentQ(nextIdx);
            setTimeout(() => {
              playQuestion(assessment[nextIdx].question_translated, nextIdx);
            }, 60);
          } else {
            // user initiated submit — don't start next question
          }
        }
      } catch (err) {
        console.error("[pendingSave effect] error saving answer", err);
      } finally {
        setPendingSave(null);
      }
    })();

    return () => { cancelled = true; };
  }, [pendingSave, assessment]);

  useEffect(() => {
    const handleUnloadOrOffline = () => {
      if (data.keyword === "start") {

        let endpoint;
        if (pathname.includes('/skills/')) {
          endpoint = `https://api.myskillsplus.com/skills/pause/${data.token}/`;
          // endpoint = `http://127.0.0.1:8000/skills/pause/${data.token}/`;
        } else if (pathname.includes('/jobfit/')) {
          endpoint = `https://api.myskillsplus.com/jobfit/pause/${data.token}/`;
          // endpoint = `http://127.0.0.1:8000/jobfit/pause/${data.token}/`;
        }

        // More reliable than fetch
        navigator.sendBeacon(
          endpoint,
          JSON.stringify({ email: data.email })
        );
      }
    };

    window.addEventListener("beforeunload", handleUnloadOrOffline);
    window.addEventListener("offline", handleUnloadOrOffline);

    return () => {
      window.removeEventListener("beforeunload", handleUnloadOrOffline);
      window.removeEventListener("offline", handleUnloadOrOffline);
    };
  }, [data.keyword, data.token, data.email]);


  const revealTextWhilePlaying = (text, audio) => {
    const words = text.split(" ");
    let cancel = false;

    const updateText = () => {
      if (cancel) return;

      const duration = audio.duration || 1;
      const currentTime = audio.currentTime;
      const wordInterval = duration / words.length;

      const visibleCount = Math.min(
        words.length,
        Math.floor(currentTime / wordInterval)
      );

      setDisplayedQuestion(words.slice(0, visibleCount).join(" "));

      if (!audio.paused && !audio.ended) {
        requestAnimationFrame(updateText);
      }
    };

    audio.onplay = () => {
      requestAnimationFrame(updateText);
    };

    return () => {
      cancel = true;
    };
  };

  //Play Question
  const playQuestion = async (text, idx) => {
    if (!assessment[idx]) return;
    if (isPlaying) return;

    if (wsRef.current) stopRecording();

    setTranscript("");
    setLivePartial("");

    setIsPlaying(true);
    setDisplayedQuestion("");
    setLoadingTTS(true);

    ttsEndRef.current = null;
    recStartRef.current = null;
    recStopRef.current = null;

    const parsed = JSON.parse(localStorage.getItem("selectedVoice") || "{}");

    try {
      const res = await fetchUntilSuccess(`https://api.myskillsplus.com/tts/`, {
      // const res = await fetchUntilSuccess(`http://127.0.0.1:8000/tts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language_code: parsed.language_codes?.[0],
          language_name: parsed.name,
          ssml_gender: parsed.ssml_gender,
        }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      const cancelReveal = revealTextWhilePlaying(text, audio);

      setTimeout(() => setLoadingTTS(false), 500);

      audio.onended = () => {
        setIsPlaying(false);
        cancelReveal();
        ttsEndRef.current = Date.now();
        startRecording(idx);
      };


      console.log("[PlayQuestion] Calling audio.play()...");
      await audio.play();
      console.log("✅ audio.play() resolved (playback started)");
    } catch (e) {
      console.error("TTS error", e);
      setIsPlaying(false);
      setLoadingTTS(false);
      ttsEndRef.current = Date.now();
      startRecording(idx);
    }
  };


  // Main recording functions with Chrome audio worklet fixes
  const startRecording = async (idx) => {
    if (isRecording || wsRef.current) stopRecording();

    setTranscript("");
    setLivePartial("");
    setIsRecording(true);

    recStartRef.current = Date.now();

    // Setup WebSocket with enhanced connection management
    wsRef.current = new WebSocket(`wss://api.myskillsplus.com/ws/stt/${languageCode}/`);
    // wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/stt/${languageCode}/`);
    wsRef.current.binaryType = "arraybuffer";

    silenceFrame.current = new Int16Array(320); // 20ms silence @16kHz

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      if (isRecording && event.code !== 1000) { // 1000 is normal closure
        console.warn('Unexpected WebSocket closure during recording');
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "partial_final") {
        setTranscript(prev => (prev + " " + msg.transcript).trim());
      } else if (msg.type === "partial") {
        setLivePartial(msg.transcript);
      } else if (msg.type === "done_stt") {
        setPendingSave({
          idx,
          transcript_original: msg.transcript_original,
          transcript_en: msg.transcript_en,
        });
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
      video: false
    });

    mediaStreamRef.current = stream;

    const audioCtx = new AudioContext();
    console.log(audioCtx.sampleRate);
    let audioBuffer = [];
    let bufferSize = 0;
    const TARGET_SIZE = 4096;

    let gapCount = 0;
    let stats = {
      total: 0,
      gaps: 0,
      maxGap: 0,
    };

    let silenceStart = null;
    const SILENCE_LIMIT = 8000;
    const SILENCE_THRESHOLD = 0.01;

    // Add state monitoring for AudioContext
    audioCtx.onstatechange = () => {
      console.log('AudioContext state changed to:', audioCtx.state);
      if (audioCtx.state === 'suspended') {
        console.warn('AudioContext suspended, attempting to resume...');
        audioCtx.resume().catch(console.error);
      }
    };

    await audioCtx.audioWorklet.addModule("/recorderWorkletProcessor.js");
    const source = audioCtx.createMediaStreamSource(stream);
    const workletNode = new AudioWorkletNode(audioCtx, "recorder-worklet-processor");

    // Track last audio time for debugging
    lastAudioTimeRef.current = Date.now();

    let BUFFER_LIMIT = 5; // ~100ms–150ms

    workletNode.port.onmessage = (event) => {
      const audioData = event.data.audioData || event.data;

      const inputSampleRate = audioCtx.sampleRate;
      const resampled = downsampleBuffer(audioData, inputSampleRate, 16000);
      const buf = floatTo16BitPCM(resampled);

      audioBuffer.push(new Uint8Array(buf.buffer));

      if (audioBuffer.length >= BUFFER_LIMIT) {

        const merged = mergeBuffers(audioBuffer);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(merged);
        }

        audioBuffer = [];
      }
    };

    // Keep the node alive with proper connection
    const devNull = audioCtx.createGain();
    devNull.gain.value = 0;
    workletNode.connect(devNull);
    devNull.connect(audioCtx.destination);

    // =========================
    // SILENCE KEEP-ALIVE LOOP
    // =========================
    const keepAliveInterval = setInterval(() => {
      if (!wsRef.current || !isRecording) return;

      const gap = Date.now() - lastSendTimeRef.current;

      if (gap > 1000) {
        console.warn("⚠️ No audio sent for 1s — check mic/worklet");
      }
    }, 1000);

    const healthCheckInterval = setInterval(() => {
      if (!wsRef.current) return;

      const recording = mediaRecorderRef.current?.state === "recording";
      if (!recording) return;

      if (wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ WebSocket not open");
      }

      if (audioCtxRef.current?.state === "suspended") {
        console.warn("⚠️ AudioContext suspended → resuming");
        audioCtxRef.current.resume().catch(console.error);
      }

      const now = Date.now();
      const gap = now - lastAudioTimeRef.current;

      if (gap > 3000) {
        console.warn("⚠️ No audio detected for 3s");
      }
    }, 2000);

    healthCheckIntervalRef.current = healthCheckInterval;
    keepAliveIntervalRef.current = keepAliveInterval;

    // Resume context if needed
    if (audioCtx.state !== "running") {
      await audioCtx.resume();
    }

    source.connect(workletNode);
    audioCtxRef.current = audioCtx;
    workletNodeRef.current = workletNode;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorder.start();

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isRecording) {
        console.warn('Tab backgrounded during recording');
      } else if (document.visibilityState === 'visible' && isRecording) {
        // Resume audio context if needed
        audioCtxRef.current?.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    visibilityListenerRef.current = handleVisibilityChange;
  };

  // Stop Recording with enhanced cleanup
  const stopRecording = () => {
    setIsRecording(false);
    recStopRef.current = Date.now();

    // Clear health check interval
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
    }

    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current)
    }

    // Remove visibility change listener
    if (visibilityListenerRef.current) {
      document.removeEventListener('visibilitychange', visibilityListenerRef.current);
      visibilityListenerRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    if (workletNodeRef.current) {
      // Send stop signal to worklet processor
      workletNodeRef.current.port.postMessage({ command: 'stop' });
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => { });
      audioCtxRef.current = null;
    }

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) { }
      wsRef.current = null;
    }

    console.log("✅ Cleanup complete");
  };

  // Saving Answer — returns a Promise that resolves once onstop handler completes
  const sendToSaveEndpoint = (idx, transcript_original, transcript_en) => {
    return new Promise((resolve, reject) => {

      if (!mediaRecorderRef.current || !assessment[idx]) {
        // nothing to save; resolve with isLast = false
        resolve({ ok: true, isLast: idx === assessment.length - 1 });
        return;
      }

      let word;
      if (pathname.includes('/skills/')) {
        word = "skills";
      } else if (pathname.includes('/jobfit/')) {
        word = "jobfit";
      }

      // attach onstop handler
      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsSaving(true);
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

          // Call helper here
          await finishAndUpload(blob, word, {
            email: data.email,
            token: data.token,
            question: assessment[idx].question,
            questionId: assessment[idx].id,
            transcript_en,
            transcript_original,
            question_translated: assessment[idx].question_translated,
            tts_end_ts_ms: ttsEndRef.current,
            recording_start_ts_ms: recStartRef.current,
            recording_stop_ts_ms: recStopRef.current
          });

          setChatHistory(prev => [
            ...prev,
            { type: "question", id: assessment[idx].id, text: assessment[idx].question_translated },
            { type: "answer", id: assessment[idx].id, text: transcript_original }
          ]);

          // update answeredQuestions state
          setAnsweredQuestions((prev) => {
            if (!prev.includes(assessment[idx].id)) {
              return [...prev, assessment[idx].id];
            }
            return prev;
          });

          // clear audio chunks
          audioChunksRef.current = [];


          // Resolve and tell caller if this was last question
          resolve({ ok: true, isLast: idx === assessment.length - 1 });

        } catch (err) {
          console.error("[sendToSaveEndpoint] save error", err);
          reject(err);
        } finally {
          setIsSaving(false)
        }
      };

      // trigger stop (this will call the onstop above)
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        } else {
          // already stopped; call handler manually
          mediaRecorderRef.current.onstop();
        }
      } catch (e) {
        console.error("[sendToSaveEndpoint] stop error", e);
        reject(e);
      }
    });
  };

  function mergeBuffers(buffers) {
    let length = 0;

    buffers.forEach(b => length += b.length);

    let tmp = new Uint8Array(length);
    let offset = 0;

    buffers.forEach(b => {
      tmp.set(b, offset);
      offset += b.length;
    });

    return tmp;
  }

  function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) return buffer;
    const ratio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  function floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Uint8Array(buffer);
  }

  useEffect(() => {
    if (!isLoading && data.assessment.length > 0 && !hasStarted) {
      setHasStarted(true);
      let startIndex = 0;

      if (data.keyword === "resume") {
        // ✅ Collect answered question IDs
        const answered = data.assessment.filter(q => q.answer).map(q => q.id);
        setAnsweredQuestions(answered);

        // ✅ Build chat history directly from data.assessment
        const history = data.assessment
          .filter(q => q.answer) // only answered ones
          .map(q => [
            { type: "question", id: q.id, text: q.question_translated },
            { type: "answer", id: q.id, text: q.answer_original }
          ])
          .flat();

        setChatHistory(history);

        // ✅ Find first unanswered question
        const firstUnansweredIndex = data.assessment.findIndex(q => !q.answer);
        if (firstUnansweredIndex === -1) {
          setResults("completed");
          return;
        }
        startIndex = firstUnansweredIndex;
      }

      // ✅ Start flow from first or next unanswered question
      setCurrentQ(startIndex);
      playQuestion(assessment[startIndex].question_translated, startIndex);
    }
  }, [isLoading, data.assessment, assessment]);



  const ensureSaveBefore = async (nextAction) => {
    if (pendingSave) {
      const { idx, transcript_original, transcript_en } = pendingSave;
      await sendToSaveEndpoint(idx, transcript_original, transcript_en);
      setPendingSave(null);
    }

    else if ((transcript || livePartial) && mediaRecorderRef.current) {
      const idx = currentQ;
      const transcript_original = transcript || livePartial;
      const transcript_en = transcript || livePartial;

      await sendToSaveEndpoint(idx, transcript_original, transcript_en);
    }
    await nextAction();
  };

  async function fetchUntilSuccess(url, options, maxRetries = 5, delay = 2000) {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const res = await fetch(url, options);
        if (res.ok) {
          return res;
        } else {
          console.warn(`Fetch failed [${res.status}], retrying...`);
        }
      } catch (err) {
        console.warn(`Fetch error, retrying...`, err);
      }

      attempt++;
      await new Promise(r => setTimeout(r, delay));
    }

    throw new Error(`Failed after ${maxRetries} retries: ${url}`);
  }


  const handleSubmitAssessment = async () => {
    isSubmittingRef.current = true;

    const isLastQ = currentQ === assessment.length - 1;

    if (!isLastQ) {
      // still in middle → must ensure save
      await ensureSaveBefore(doSubmit);
    } else {
      // last question already saved by pendingSave → skip save
      await doSubmit();
    }
  };

  const doSubmit = async () => {
    setIsPlaying(false);
    setMessage("");
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.onended = null;
      audioRef.current = null;
    }

    if (isRecording || wsRef.current) {
      stopRecording();
    }

    const skills = JSON.parse(localStorage.getItem("userRatedSkills") || "[]");

    let endpoint;
    if (pathname.includes('/skills/')) {
      endpoint = `https://api.myskillsplus.com/skills/submit/${data.token}/`;
      // endpoint = `http://127.0.0.1:8000/skills/submit/${data.token}/`;
    } else if (pathname.includes('/jobfit/')) {
      endpoint = `https://api.myskillsplus.com/jobfit/submit/${data.token}/`;
      // endpoint = `http://127.0.0.1:8000/jobfit/submit/${data.token}/`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          skills: skills
        }),
      });

      const resultData = await response.json();
      if (response.ok) {
        setUserAssessmentResult(resultData);
        setUserAssessmentComplete(true);
        localStorage.removeItem("userRatedSkills");
      } else {
        setMessage(resultData.error);
        setType('error');
      }
    } catch (error) {
      setMessage("Error Submitted Assessment");
      setType('error');
    } finally {
      setIsLoading(false);
    }
  };


  const handlePause = async () => {
    await ensureSaveBefore(async () => {
      setIsLoading(true);
      setMessage("");

      // Stop any ongoing audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }

      // Stop any ongoing recording / audio / WebSocket connections
      if (isRecording || wsRef.current) {
        stopRecording();
      }

      let endpoint;
      if (pathname.includes('/skills/')) {
        endpoint = `https://api.myskillsplus.com/skills/pause/${data.token}/`;
        // endpoint = `http://127.0.0.1:8000/skills/pause/${data.token}/`;
      } else if (pathname.includes('/jobfit/')) {
        endpoint = `https://api.myskillsplus.com/jobfit/pause/${data.token}/`;
        // endpoint = `http://127.0.0.1:8000/jobfit/pause/${data.token}/`;
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email
          }),
        });

        const pause_data = await response.json();

        if (!response.ok) {
          setMessage(pause_data.error);
          setType('error')
        } else {
          setMessage(pause_data.message)
          setType('success')
          setTimeout(() => {
            window.location.reload()
          }, 500);
        }
      } catch (err) {
        setMessage("Server error. Please try again later.");
        setType("error")
      } finally {
        setIsLoading(false);
      }
    });
  };

  // if (results) return <DisplayResult results={results} />;
  if (isLoading || loadingTTS || isSaving) return <Loader isLoading={true} />;

  if (userAssessmentComplete && userAssessmentResult) {
    return <DisplayResult results={userAssessmentResult} />;
  }

  return (
    <div className="p-8 pt-30">

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex flex-col space-y-4 py-10 px-4 overflow-y-auto bg-[#FAFAFA] rounded-2xl shadow-inner">
        {!loadingTTS && chatHistory.map((msg, i) => (
          <div
            key={`${msg.type}-${msg.id}-${i}`}
            className={`flex ${msg.type === "question" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[40%] rounded-2xl px-4 py-2 text-sm shadow border 
          ${msg.type === "question"
                  ? "bg-blue-200 text-[#212121] border-blue-400"
                  : "bg-green-200 text-[#212121] border-green-400"
                }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Current Question (progressively revealed) */}
        {assessment[currentQ] && (
          <div className="flex justify-start">
            <div className="max-w-[40%] rounded-2xl px-4 py-2 text-sm bg-blue-200 text-[#212121] shadow border border-blue-400" dir={getTextDirection(languageCode)}>
              {displayedQuestion || assessment[currentQ].question_translated}
            </div>
          </div>
        )}

        {/* Current Answer (live transcript) */}
        {(isRecording || transcript || livePartial) && (
          <div className="flex justify-end">
            <div className="max-w-[40%] rounded-2xl px-4 py-2 text-sm bg-green-200 text-[#212121] shadow border border-green-400" dir={getTextDirection(languageCode)}>
              {transcript || livePartial || "..."}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-4 bg-[#FAFAFA]">
          {isPlaying && <VoiceWave isPlaying={isPlaying} />}
          {isRecording && <VoiceWave isRecording={isRecording} />}
        </div>

        <div ref={chatEndRef} />
      </div>


      <div className="mt-4 flex flex-col items-center text-[#757575] text-sm">
        <p>
          Answered: {answeredQuestions.length} / {assessment.length}
        </p>
      </div>


      <div className="bg-white p-4 px-15 w-full flex justify-between items-center gap-2 fixed left-0 top-0 shadow-xl">
        <div>
          <p className="font-bold text-xl">
            Question {currentQ + 1} of {assessment.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePause}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-lg hover:cursor-pointer"
          >
            Pause Interview
          </button>

          <button
            onClick={handleSubmitAssessment}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-lg hover:cursor-pointer"
          >
            Submit Interview
          </button>
        </div>
      </div>
      <ErrorDialog message={message} type={type} onClose={() => setMessage("")} />
    </div>
  );
};

export default InterviewQuestions;

