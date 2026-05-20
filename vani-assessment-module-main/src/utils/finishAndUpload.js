// Convert Blob -> mono 16kHz PCM16 WAV Blob (no external deps)
export async function convertBlobToWav(blob, targetSampleRate = 16000) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  // OfflineAudioContext to resample/downmix to mono at targetSampleRate
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * targetSampleRate), targetSampleRate);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start(0);
  const rendered = await offline.startRendering();
  const mono = rendered.getChannelData(0); // Float32Array at targetSampleRate

  // encode to PCM16 WAV
  function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    }

    let offset = 0;
    writeString(view, offset, "RIFF"); offset += 4;
    view.setUint32(offset, 36 + samples.length * 2, true); offset += 4;
    writeString(view, offset, "WAVE"); offset += 4;
    writeString(view, offset, "fmt "); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // subchunk1size
    view.setUint16(offset, 1, true); offset += 2;  // PCM
    view.setUint16(offset, 1, true); offset += 2;  // mono
    view.setUint32(offset, sampleRate, true); offset += 4; // byte rate later
    view.setUint32(offset, sampleRate * 2, true); offset += 4; // byteRate = sampleRate * channels * bytesPerSample
    view.setUint16(offset, 2, true); offset += 2; // blockAlign
    view.setUint16(offset, 16, true); offset += 2; // bitsPerSample
    writeString(view, offset, "data"); offset += 4;
    view.setUint32(offset, samples.length * 2, true); offset += 4;

    // write PCM16 samples
    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  const wavBuffer = encodeWAV(mono, targetSampleRate);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

// presign_upload -> returns { url, key }
export async function getPresign(questionId) {
  const res = await fetch(`https://api.myskillsplus.com/presign_upload/`, {
  // const res = await fetch(`http://127.0.0.1:8000/presign_upload/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_id: questionId }),
  });
  if (!res.ok) throw new Error("presign failed");
  return res.json();
}

export async function uploadToS3Presigned(url, wavBlob) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "audio/wav" },
    body: wavBlob,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("S3 upload failed: " + text);
  }
}

// notify backend to create response row and enqueue worker
export async function notifySave({ email, token, question, questionId, s3_key, audio_filename, tts_end_ts_ms, recording_start_ts_ms, recording_stop_ts_ms, transcript_en, transcript_original, question_translated, blob, word }) {
  const answer_json = {
    question_id: questionId,
    question: question,
    transcript: transcript_en,
    transcript_original: transcript_original,
    question_translated: question_translated,
    tts_end_ts_ms: tts_end_ts_ms,
    recording_start_ts_ms: recording_start_ts_ms,
    recording_stop_ts_ms: recording_stop_ts_ms,
    s3_key: s3_key,
    audio_filename: audio_filename
  };

  const formData = new FormData();
  formData.append("answer", JSON.stringify(answer_json));
  formData.append("email", email);
  formData.append("audio_file", blob);

  let endpoint;
  if (word === "skills") {
    endpoint = `https://api.myskillsplus.com/skills/save_answer/${token}/${questionId}/`;
    // endpoint = `http://127.0.0.1:8000/skills/save_answer/${token}/${questionId}/`;
  } else if (word === "jobfit") {
    endpoint = `https://api.myskillsplus.com/jobfit/save_answer/${token}/${questionId}/`;
    // endpoint = `http://127.0.0.1:8000/jobfit/save_answer/${token}/${questionId}/`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("save_answer failed: " + text);
  }

  return res.json();
}

// convenience - end-to-end
export async function finishAndUpload(audioBlob, word, meta) {
  const wavBlob = await convertBlobToWav(audioBlob);
  const presign = await getPresign(meta.questionId);
  await uploadToS3Presigned(presign.url, wavBlob);

  // const presign = {key: 'question_1/6da0db39ef6f4b7da815846d6068d138.wav'}

  // choose a filename for DB (optional)
  const audio_filename = presign.key.split("/").pop();

  const result = await notifySave({
    email: meta.email,
    token: meta.token,
    question: meta.question,
    questionId: meta.questionId,
    s3_key: presign.key,
    audio_filename,
    tts_end_ts_ms: meta.tts_end_ts_ms,
    recording_start_ts_ms: meta.recording_start_ts_ms,
    recording_stop_ts_ms: meta.recording_stop_ts_ms || Date.now(),
    transcript_en: meta.transcript_en,
    transcript_original: meta.transcript_original,
    question_translated: meta.question_translated,
    blob: wavBlob,
    word: word,
  });

  return result;
}

