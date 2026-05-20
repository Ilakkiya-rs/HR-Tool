"use client"

import { useState, useRef, useEffect } from "react";
import Loader from "./Loader";
import ErrorDialog from "./ErrorDialog";
import WavEncoder from "wav-encoder";
import { useLocation } from "react-router-dom";
import InterviewQuestions from "./InterviewQuestions";

const ResumeInterview = ({ token, email, name, languageCode }) => {

  const location = useLocation();
  const pathname = location.pathname;

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("")
  const [type, setType] = useState('success');
  const [voiceData, setVoiceData] = useState([])
  const [mode, setMode] = useState("voice_page")
  const [recorded, setRecorded] = useState(false);
  const [translatedParagraph, setTranslatedParagraph] = useState("");
  const [paragraph, setParagraph] = useState(`I am ${name} and I will be continuing the interview now.`);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const RTL_LANGS = ["ur-IN"];

  const getTextDirection = (languageCode) =>
    RTL_LANGS.includes(languageCode) ? "rtl" : "ltr";

  useEffect(() => {
    if (voiceData) {
      console.log('✅ Data is now updated');
    }
  }, [voiceData]);

  // Fetch Google Cloud voices for the chosen language
  useEffect(() => {
    async function translateText() {
      if (!languageCode) return;

      if (languageCode.startsWith("en")) {
        setTranslatedParagraph(paragraph);
        return;
      }

      setIsProcessing(true)

      try {
        const res = await fetch(`https://api.myskillsplus.com/translate/`, {
        // const res = await fetch(`http://127.0.0.1:8000/translate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: paragraph, target_language: languageCode.split("-")[0] }),
        });
        const data = await res.json();
        // console.log(data)
        setTranslatedParagraph(data["Result"])
        // console.log(translatedParagraph)
        setIsProcessing(false)
      } catch (err) {
        console.error("Translation error:", err);
        setIsProcessing(false)
      }
    }

    translateText();
  }, [languageCode]);


  const convertBlobToWav = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

    const wavData = await WavEncoder.encode({
      sampleRate: audioBuffer.sampleRate,
      channelData: audioBuffer.numberOfChannels === 1
        ? [audioBuffer.getChannelData(0)]
        : [
          audioBuffer.getChannelData(0),
          audioBuffer.getChannelData(1)
        ]
    });

    return new Blob([wavData], { type: "audio/wav" });
  };


  async function startRecording() {
    try {
      setMessage("");
      setRecorded(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const rawBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const wavBlob = await convertBlobToWav(rawBlob);

        const url = URL.createObjectURL(wavBlob);
        setAudioURL(url);
        setAudioBlob(wavBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      setMessage("Microphone access denied");
      setType("error")
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setRecorded(true);
  }

  async function handleAgree() {
    setIsProcessing(true)

    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "resume_terms.wav");
      formData.append("email", email || "");

      let endpoint;
      if (pathname.includes('/skills/')) {
        endpoint = `https://api.myskillsplus.com/skills/resume_voice/${token}/`;
        // endpoint = `http://127.0.0.1:8000/skills/resume_voice/${token}/`;
      } else if (pathname.includes('/jobfit/')) {
        endpoint = `https://api.myskillsplus.com/jobfit/resume_voice/${token}/`;
        // endpoint = `http://127.0.0.1:8000/jobfit/resume_voice/${token}/`;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const voice_data = await res.json();
        setVoiceData(voice_data)

        if (res.ok) {
          setMessage(voice_data.message)
          setType('success')
          setIsProcessing(false);
          setTimeout(() => {
            setMode("ok")
          }, 2000);
        } else {
          setMessage(voice_data.error);
          setType('error')
          setIsProcessing(false)
        }
      } catch (err) {
        setMessage("An error occured. Please try again....");
        setType('error')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  if (mode === "voice_page") {
    return (
      <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 pt-25">
        <h1 className="text-4xl font-bold text-blue-900 mb-15">Terms for Resume Interview</h1>
        <span className="font-bold text-center mb-10 w-[90%]">
          Please read aloud the text below.
        </span>

        <p className="text-lg bg-white p-8 mb-8" id="required" dir={getTextDirection(languageCode)}>
          {translatedParagraph}
        </p>
        {audioURL && (
          <div className="mt-2 mb-7">
            <audio controls src={audioURL}></audio>
          </div>
        )}

        <div className="flex gap-10">
          {!recording && <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer" onClick={startRecording}>{recorded ? "Re-Record" : "Start Recording"}</button>}
          {recording && <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer" onClick={stopRecording}>Stop Recording</button>}

          {recorded && (
            <button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer"
              onClick={handleAgree}
            >
              Agree & Continue
            </button>
          )}
        </div>

        <Loader isLoading={isProcessing} />
        <ErrorDialog message={message} type={type} onClose={() => setMessage('')} />
      </div>
    );
  }

  if (mode === "ok") {
    return <InterviewQuestions data={voiceData} languageCode={languageCode} />
  }
}

export default ResumeInterview;

