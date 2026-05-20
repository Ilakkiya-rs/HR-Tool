import uuid
from profilers import isot_api
from profilers.models import Skill, JobProfiles


def encode_to_alphanumeric(num):
    chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    charsLen = len(chars)
    s = ""
    while num:
        s = chars[num % charsLen] + s
        num //= charsLen

    return s.zfill(6)


def decode_from_alphanumeric(encoded):
    chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    charsLen = len(chars)
    num = 0
    for char in encoded:
        num = num * charsLen + chars.index(char)
    return num


def skill_data(profile):
    print("0000000000",profile)
    skills = Skill.objects.filter(profile=profile)
    print('skills',skills)

    if(len(skills)==0):
        return[]

    isot_path_addrs = skills.values_list("isot_path_addr", flat=True)
    files = isot_api.get_files(isot_path_addrs)
    ancestors = isot_api.get_bulk_ancestors(isot_path_addrs)

    zipped = zip(skills, files, ancestors)
    data = [
        {
            "id": skill.id,
            "isot_path_addr": skill.isot_path_addr,
            "isot_file": file,
            "ancestors": ans["ancestors"],
            "rating": skill.ratings,
        }
        for skill, file, ans in zipped
    ]

    return data



# def skill_data(profile):
#     print("0000000000",profile)
#     skills = Skill.objects.filter(profile=profile)
#     print('skills',skills)
#     isot_path_addrs = skills.values_list("isot_path_addr", flat=True)
#     files = isot_api.get_files(isot_path_addrs)
#     ancestors = isot_api.get_bulk_ancestors(isot_path_addrs)

#     if(len(skills)==0):
#         return[]


#     zipped = zip(skills, files, ancestors)
#     data = [
#         {
#             "id": skill.id,
#             "isot_path_addr": skill.isot_path_addr,
#             "isot_file": file,
#             "ancestors": ans["ancestors"],
#             "rating": skill.ratings,
#         }
#         for skill, file, ans in zipped
#     ]

#     return data




def get_rating_obj_2(ratings):

    for rating in ratings:
        print("rating", rating["isot_rating_id"])
        if rating["isot_rating_id"] != " ":
            return rating["rating"]
    return 0


def Average(lst):
    if len(lst) == 0:
        return 0
    sum_of_list = 0
    for i in range(len(lst)):
        sum_of_list += lst[i]
    average = sum_of_list / len(lst)
    return round(average, 2)


def only_skill_data(skills, dict_review_user_skills):
    isot_path_addrs = skills.values_list("isot_path_addr", flat=True)
    files = isot_api.get_files(isot_path_addrs)

    zipped = zip(skills, files)
    data = [
        {
            "id": skill.id,
            "isot_path_addr": skill.isot_path_addr,
            "skill_name": file["proxy_skill"]["name"] if file.get("proxy_skill") and file["proxy_skill"].get("name") else file.get("name", ""),
            "user_rating": get_rating_obj_2([skill.ratings[1]] if len(skill.ratings) == 2 else [skill.ratings[0]]),
            "peer_avg_rating": round(Average(dict_review_user_skills[skill.id])),
            "tags": file["tags"],
        }
        for skill, file, in zipped
    ]

    return data


def review_skill_data(profile):
    skills = Skill.objects.filter(profile=profile)
    isot_path_addrs = skills.values_list("isot_path_addr", flat=True)
    files = isot_api.get_files(isot_path_addrs)
    ancestors = isot_api.get_bulk_ancestors(isot_path_addrs)

    zipped = zip(skills, files, ancestors)
    data = [
        {
            "id": skill.id,
            "isot_file_id": skill.isot_path_addr,
            "isot_file": file,
            "ancestors": ans["ancestors"],
            "rating": [{"rating": 1, "comment": "", "isot_rating_id": "ratings/2"}],
        }
        for skill, file, ans in zipped
    ]

    return data


def skill_data_(profile):
    skills = Skill.objects.filter(profile=profile)
    file_ids = skills.values_list("isot_path_addr", flat=True)
    files = isot_api.get_files(file_ids)
    ancestors = isot_api.get_bulk_ancestors(file_ids)

    # Grouping skills by ancestors
    zipped = zip(skills, files, ancestors)
    ans_skills_mapping = {}
    for skill, file, ans in zipped:
        # print(file,file.get("rating_type",0),skill.rating - 1)
        ans_names = tuple(a["name"] for a in ans["ancestors"])
        main_ans_name = ans_names[-1]
        if main_ans_name not in ans_skills_mapping:
            ans_skills_mapping[main_ans_name] = []

        ans_skills_mapping[main_ans_name].append(
            {
                "id": skill.id,
                "isot_path_addr": skill.isot_path_addr,
                "isot_file": file,
                "rating": skill.ratings,
                # "comment": skill.comment,
            }
        )

    data = []
    for ans, skills in ans_skills_mapping.items():
        data.append({"ancestors": ans, "skills": skills})

    all_skills = []
    for skills_child in data:
        all_skills.extend(skills_child["skills"])

    return data


def get_job_profile(job_id):
    try:
        job_profile = JobProfiles.objects.get(id=job_id)
        return job_profile.shortlisted
    except JobProfiles.DoesNotExist:
        return None


def generate_token() -> str:
    return str(uuid.uuid4())


import os
import tempfile
import numpy as np
import webrtcvad
import librosa
import boto3
from datetime import datetime, timedelta
from django.utils.timezone import now
from dotenv import load_dotenv
from .models import RecruiterAssessmentAssignmentQuestions  # import your model

# Load env
load_dotenv()
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "ap-south-1"),
)
# ---- helpers ----
class Frame:
    def __init__(self, bytes, timestamp, duration):
        self.bytes = bytes
        self.timestamp = timestamp
        self.duration = duration

def int16_to_bytes(np_int16_array):
    return np_int16_array.tobytes()

def frame_generator(frame_duration_ms, audio_int16, sample_rate):
    n = int(sample_rate * frame_duration_ms / 1000)
    offset, timestamp = 0, 0.0
    while offset + n <= len(audio_int16):
        chunk = audio_int16[offset: offset + n]
        yield Frame(int16_to_bytes(chunk), timestamp, n / sample_rate)
        timestamp += n / sample_rate
        offset += n

def vad_collector(sample_rate, frame_duration_ms, padding_duration_ms, vad, frames):
    num_padding_frames = int(padding_duration_ms / frame_duration_ms)
    ring_buffer, voiced_frames, segments = [], [], []
    triggered = False
    for frame in frames:
        is_speech = vad.is_speech(frame.bytes, sample_rate)
        if not triggered:
            ring_buffer.append((frame, is_speech))
            if len([f for f, s in ring_buffer if s]) > (0.9 * len(ring_buffer)):
                triggered = True
                start_time = ring_buffer[0][0].timestamp
                voiced_frames.extend([f for f, s in ring_buffer])
                ring_buffer = []
        else:
            voiced_frames.append(frame)
            ring_buffer.append((frame, is_speech))
            if len([f for f, s in ring_buffer if not s]) > num_padding_frames:
                end_time = voiced_frames[-1].timestamp + voiced_frames[-1].duration
                segments.append((start_time, end_time))
                triggered = False
                ring_buffer, voiced_frames = [], []
    if triggered and voiced_frames:
        end_time = voiced_frames[-1].timestamp + voiced_frames[-1].duration
        segments.append((start_time, end_time))
    return segments

def download_s3_to_tmp(bucket, key):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    with tmp:
        s3.download_fileobj(bucket, key, tmp)
    return tmp.name

def ms_to_utc(ms):
    return datetime.utcfromtimestamp(ms / 1000.0) if ms else None


# ---- main function ----
def process_response_audio(response_id: int, s3_key: str, key: str,
                           tts_end_ts_ms: int = None,
                           recording_start_ts_ms: int = None,
                           recording_stop_ts_ms: int = None,
                           transcript_en: str = None):
    tmp_path = None
    try:
        # 1. Download audio
        tmp_path = download_s3_to_tmp(S3_BUCKET, s3_key)
        y, sr = librosa.load(tmp_path, sr=None, mono=True)

        # resample to 16k
        if sr != 16000:
            y = librosa.resample(y, orig_sr=sr, target_sr=16000)
            sr = 16000
        int16 = (y * 32767.0).astype(np.int16)

        # 2. VAD (only for response boundaries)
        vad = webrtcvad.Vad(3)
        frames = list(frame_generator(30, int16, sr))
        segments = vad_collector(sr, 30, 300, vad, frames)

        if segments:
            first_s, _ = segments[0]
            _, last_e = segments[-1]
            response_start_offset_s = float(first_s)
            response_end_offset_s = float(last_e)
            response_duration_s = response_end_offset_s - response_start_offset_s
        else:
            response_start_offset_s = response_end_offset_s = None
            response_duration_s = 0.0

        # 3. Absolute timestamps
        recording_start_ts = ms_to_utc(recording_start_ts_ms)
        tts_end_ts = ms_to_utc(tts_end_ts_ms)
        response_start_time = (
            recording_start_ts + timedelta(seconds=response_start_offset_s)
            if recording_start_ts is not None and response_start_offset_s is not None
            else None
        )
        response_end_time = (
            recording_start_ts + timedelta(seconds=response_end_offset_s)
            if recording_start_ts is not None and response_end_offset_s is not None
            else None
        )
        speech_latency_s = (
            (response_start_time - tts_end_ts).total_seconds()
            if response_start_time is not None and tts_end_ts is not None
            else None
        )

        # 4. Pauses (use librosa.effects.split)
        intervals = librosa.effects.split(y, top_db=30)
        speech_segments = [(start / sr, end / sr) for start, end in intervals]

        gaps = [speech_segments[i][0] - speech_segments[i-1][1]
                for i in range(1, len(speech_segments))]

        pause_threshold = 0.6
        pause_count = sum(1 for g in gaps if g >= pause_threshold)
        avg_pause_duration_s = (sum(gaps) / len(gaps)) if gaps else 0.0

        # 5. Speech rate
        words = [w for w in (transcript_en or "").split() if w.strip()]
        word_count = len(words)
        duration_min = (response_duration_s / 60.0) if response_duration_s > 0 else (len(y) / sr) / 60.0
        speech_rate_wpm = (word_count / duration_min) if duration_min else 0.0

        # 6. Prosody (pitch + energy)
        flat_tone_flag = False
        try:
            f0 = librosa.yin(y, fmin=75, fmax=600, sr=sr)
            f0_valid = f0[~np.isnan(f0)]
            pitch_cv = float(np.std(f0_valid) / (np.mean(f0_valid) + 1e-8)) if len(f0_valid) > 2 else 1.0
            rms = librosa.feature.rms(y=y)[0]
            energy_cv = float(np.std(rms) / (np.mean(rms) + 1e-8))
            flat_tone_flag = (pitch_cv < 0.15) and (energy_cv < 0.20)
        except Exception:
            pass

        # 7. Suspicion scoring
        suspicion = 0.0
        if speech_latency_s is not None and speech_latency_s < 1.5 and flat_tone_flag:
            suspicion += 0.4
        if speech_rate_wpm > 180:
            suspicion += 0.2
        if response_duration_s >= 30.0 and pause_count == 0:
            suspicion += 0.3
        suspicion_score = min(1.0, suspicion)

        suspicion_label = "Possibly Read/Scripted" if suspicion_score > 0.6 else None

        # 8. Update DB via Django ORM
        RecruiterAssessmentAssignmentQuestions.objects.filter(pk=response_id).update(
            response_start_time=response_start_time,
            response_end_time=response_end_time,
            response_duration=timedelta(seconds=response_duration_s),
            speech_latency=f"{round(speech_latency_s,3)} seconds" if speech_latency_s else None,
            speech_rate=round(float(speech_rate_wpm), 2),
            pause_count=int(pause_count),
            avg_pause_duration=timedelta(seconds=avg_pause_duration_s),
            flat_tone_flag=bool(flat_tone_flag),
            suspicion_score=round(float(suspicion_score), 2),
            suspicion_flag=suspicion_label,
            processed_at=now(),
            processing_state="done"
        )

        return {
            "response_id": response_id,
            "suspicion_score": suspicion_score,
            "speech_rate": speech_rate_wpm,
            "pause_count": pause_count,
            "flat_tone_flag": flat_tone_flag
        }

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
