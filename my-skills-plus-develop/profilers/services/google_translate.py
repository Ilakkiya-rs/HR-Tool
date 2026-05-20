from google.cloud import translate_v2 as translate

def get_translate_client():
    return translate.Client()


def translate_text(text, target_lang: str = "en"):
    try:
        if not text:
            return text

        client = get_translate_client()

        res = client.translate(text, target_language=target_lang)

        return res.get("translatedText") or text

    except Exception as e:
        print(f"Translation error: {e}")
        return text












# from google.cloud import translate_v2 as translate

# translate_client = translate.Client()

# def translate_text(text, target_lang: str = "en"):
#     try:
#         if not text:
#             return text

#         res = translate_client.translate(text, target_language=target_lang)

#         if isinstance(text, str):
#             return res.get("translatedText") or text
#         else:
#             return [item.get("translatedText") or orig for item, orig in zip(res, text)]
#     except Exception as e:
#         print(f"Translation error: {e}")
#         return text

















# from google.cloud import translate_v2 as translate

# translate_client = translate.Client()

# def translate_text(text, target_lang: str = "en"):
#     if not text:
#         return "" if isinstance(text, str) else []

#     # Google client can handle list[str] directly
#     res = translate_client.translate(text, target_language=target_lang)

#     if isinstance(text, str):
#         # res is a dict in this case
#         return res.get("translatedText") or text
#     else:
#         # res is a list of dicts, one per string
#         return [item.get("translatedText") or orig for item, orig in zip(res, text)]

