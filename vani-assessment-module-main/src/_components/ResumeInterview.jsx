import { useState, useRef, useEffect } from "react";
import Loader from "./Loader";
import ErrorDialog from "./ErrorDialog";
import WavEncoder from "wav-encoder";
import InterviewQuestions from "./InterviewQuestions";

const ResumeInterview = ({ token, email, name }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("")
  const [type, setType] = useState('success');
  const [voiceData, setVoiceData] = useState([])
  const [mode, setMode] = useState("voice_page")
  const [transcript, setTranscript] = useState("");
  const [verified, setVerified] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("")
  const [buttonText, setButtonText] = useState(false)
  const [voices, setVoices] = useState([])
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  // Normalize text for comparison
  const normalize = (str) =>
    str.toLowerCase().replace(/[^\w\s]/g, "").trim();

  // Fuzzy similarity
  function similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;

    if (longerLength === 0) return 1.0;

    function editDistance(a, b) {
      const costs = [];
      for (let i = 0; i <= a.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= b.length; j++) {
          if (i === 0) costs[j] = j;
          else if (j > 0) {
            let newValue = costs[j - 1];
            if (a[i - 1] !== b[j - 1]) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) costs[b.length] = lastValue;
      }
      return costs[b.length];
    }

    return (longerLength - editDistance(longer, shorter)) / longerLength;
  }



  useEffect(() => {
    function loadVoices() {
      const allVoices = speechSynthesis.getVoices();
      setVoices(allVoices);

      const stored = localStorage.getItem("selectedVoice");
      if (stored) {
        const parsed = JSON.parse(stored); // { name, lang }
        const match = allVoices.find(
          (v) => v.name === parsed.name && v.lang === parsed.lang
        );
        if (match) {
          setSelectedVoice(match); 
        }
      }
    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);



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
      setTranscript("");
      setVerified(false);
      setButtonText(false)
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
        setAudioBlob(wavBlob)

        const REQUIRED_TEXT = document.getElementById("required").innerText;
        const score = similarity(normalize(transcriptRef.current), normalize(REQUIRED_TEXT));
      
        if (score >= 0.75) {
          setVerified(true);
          setMessage("");
        } else {
          setVerified(false);
          setMessage("Please read the complete paragraph before continuing.");
          setType("error");
        }
      };

      mediaRecorder.start();
      // Speech Recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        transcriptRef.current = text;
        setTranscript(text);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required to proceed.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecording(false);
    
    const REQUIRED_TEXT = document.getElementById("required").innerText;
    const score = similarity(normalize(transcript), normalize(REQUIRED_TEXT));
  
    if (score < 0.75) {
      setMessage("Please read the complete paragraph before continuing.");
      setType("error")
    }
  }

  async function handleAgree() {
    setIsProcessing(true)
    setButtonText(false)

    if(audioBlob){
       const formData = new FormData();
    formData.append("audio_file", audioBlob, "resume_terms.wav");
    formData.append("email", email || "");

    try {
      const res = await fetch(`https://api.myskillsplus.com/resume-voice/${token}/`, {
      // const res = await fetch(`http://127.0.0.1:8000/resume-voice/${token}/`, {
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
        setButtonText(true)
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
        <p className="text-lg bg-white p-8 mb-15 w-[70%]" id="required">
          I am {name} and I will be continuing the interview now.
        </p>

        <div className="flex gap-10 mt-5">
           {!recording &&  <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer" onClick={startRecording}>{buttonText ? "Re-Record" : "Start Recording"}</button>}
           {recording && <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer" onClick={stopRecording}>Stop Recording</button>}
     
           {verified && (
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
    return <InterviewQuestions data={voiceData} voice={selectedVoice} />
  }
}

export default ResumeInterview;

