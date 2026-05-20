from google.cloud import speech

def get_speech_client():
    return speech.SpeechClient()


def get_streaming_config(language_code: str = "en-US"):
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=language_code,
        enable_automatic_punctuation=True,
        model="latest_long"
    )

    return speech.StreamingRecognitionConfig(
        config=config,
        interim_results=True,
        single_utterance=False,
    )







# # profilers/services/google_stt.py
# from google.cloud import speech, translate_v2 as translate

# _speech_client = None
# _translate_client = None

# def get_speech_client():
#     global _speech_client
#     if _speech_client is None:
#         _speech_client = speech.SpeechClient()
#     return _speech_client

# def get_translate_client():
#     global _translate_client
#     if _translate_client is None:
#         _translate_client = translate.Client()
#     return _translate_client

# def get_streaming_config(language_code: str = "en-US"):
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=16000,
#         language_code=language_code,
#         enable_automatic_punctuation=True,
#         model="latest_long"
#     )
#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=True,
#         single_utterance=False,
#     )
#     return streaming_config
