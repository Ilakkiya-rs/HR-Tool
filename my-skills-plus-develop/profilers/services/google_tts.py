from google.cloud import texttospeech

def get_tts_client():
    return texttospeech.TextToSpeechClient()


def synthesize_speech(text, language_code="en-US", voice_name=None, ssml_gender="NEUTRAL"):
    client = get_tts_client()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice_params = {
        "language_code": language_code,
        "ssml_gender": texttospeech.SsmlVoiceGender[ssml_gender.upper()],
    }

    if voice_name:
        voice_params["name"] = voice_name

    voice = texttospeech.VoiceSelectionParams(**voice_params)

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )

    return response.audio_content

from google.cloud import texttospeech

def list_voices(language_code=None):
    client = get_tts_client()

    response = client.list_voices(language_code=language_code)

    voices = []
    for v in response.voices:
        name = str(v.name or "")

        # Skip invalid / empty names
        if not name:
            continue

        # Skip unsupported voices (this is your main issue)
        if not any(x in name for x in ["Wavenet", "Neural2", "Chirp", "Standard"]):
            continue

        voices.append({
            "name": name,
            "label": f"{name} ({v.language_codes[0]}) - {texttospeech.SsmlVoiceGender(v.ssml_gender).name}",
            "language_codes": [str(code) for code in v.language_codes],
            "ssml_gender": str(texttospeech.SsmlVoiceGender(v.ssml_gender).name),
            "natural_sample_rate_hertz": int(v.natural_sample_rate_hertz),
        })

    return voices


# def list_voices(language_code=None):
#     client = get_tts_client()  

#     response = client.list_voices(language_code=language_code)

#     voices = []
#     for v in response.voices:
#         voices.append({
#             "name": str(v.name),
#             "language_codes": [str(code) for code in v.language_codes],
#             "ssml_gender": str(texttospeech.SsmlVoiceGender(v.ssml_gender).name),
#             "natural_sample_rate_hertz": int(v.natural_sample_rate_hertz),
#         })

#     return voices









# from google.cloud import texttospeech

# client = texttospeech.TextToSpeechClient()

# def synthesize_speech(text, language_code="en-US", voice_name=None, ssml_gender="NEUTRAL"):

#     synthesis_input = texttospeech.SynthesisInput(text=text)

#     voice_params = {
#         "language_code": language_code,
#         "ssml_gender": texttospeech.SsmlVoiceGender[ssml_gender.upper()],
#     }
#     if voice_name:
#         voice_params["name"] = voice_name

#     voice = texttospeech.VoiceSelectionParams(**voice_params)

#     audio_config = texttospeech.AudioConfig(
#         audio_encoding=texttospeech.AudioEncoding.MP3
#     )

#     response = client.synthesize_speech(
#         input=synthesis_input, voice=voice, audio_config=audio_config
#     )

#     return response.audio_content



# def list_voices(language_code=None):
#     try:
#         response = client.list_voices(language_code=language_code)
#         print("API Response:", response)  # Log the full response
#         voices = []
#         for v in response.voices:
#             voices.append({ 
#                 "name": str(v.name),
#                 "language_codes": [str(code) for code in v.language_codes],
#                 "ssml_gender": str(texttospeech.SsmlVoiceGender(v.ssml_gender).name),
#                 "natural_sample_rate_hertz": int(v.natural_sample_rate_hertz),
#             })
#         return voices
#     except Exception as e:
#         print("Error fetching voices:", str(e))  # Log the error
#         return []
