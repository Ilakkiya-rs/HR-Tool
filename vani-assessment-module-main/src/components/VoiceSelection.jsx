"use client";

import React, { useState, useEffect, useRef } from 'react'
import { MicOff, Play, Pause } from 'lucide-react';
import InterviewQuestions from './InterviewQuestions';
import Loader from './Loader';

const VoiceSelection = ({ data, languageCode }) => {

    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState("select");
    const [translatedParagraph, setTranslatedParagraph] = useState("");
    const [isProcessing, setIsProcessing] = useState("");

    const RTL_LANGS = ["ur-IN"];

    const getTextDirection = (languageCode) =>
      RTL_LANGS.includes(languageCode) ? "rtl" : "ltr";

    const translateText = async (text, targetLang) => {
        try {
            console.log(targetLang)
            const res = await fetch(`https://api.myskillsplus.com/translate/`, {
            // const res = await fetch(`http://127.0.0.1:8000/translate/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target_language: targetLang }),
            });
            const translationData = await res.json();
            // console.log(translationData)
            return translationData["Result"];
        } catch (err) {
            console.error("Translation error:", err);
            return text;
        }
    };

    async function fetchUntilSuccess(url, options, maxRetries = 10, delay = 1000) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
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


    // Fetch Google Cloud voices for the chosen language
    useEffect(() => {
        async function fetchVoicesAndTranslate() {
            // console.log("data inside:", data)
            if (!languageCode) return;
            setIsProcessing(true)

            try {
                const voicesData = await fetchUntilSuccess(
                  `https://api.myskillsplus.com/voices?language_code=${languageCode}`,
                //   `http://127.0.0.1:8000/voices?language_code=${languageCode}`,
                  { method: "GET" }
                );
                setVoices(voicesData.voices || []);

                let translated = "This is a sample paragraph. Please listen carefully to the voice and choose the one you prefer.";

                 // Skip translation if language is English
                if (!languageCode.toLowerCase().startsWith("en")) {
                  translated = await translateText(translated, languageCode.split("-")[0]);
                }
                
                setTranslatedParagraph(translated);

                setIsProcessing(false)

            } catch (err) {
                console.error("Error fetching voices:", err);
                setIsProcessing(false)
            }
        }

        fetchVoicesAndTranslate();
    }, [languageCode]);


    const audioRef = useRef(null);

    const speak = async (para) => {
        if (!selectedVoice) return;
        console.log(selectedVoice)
        setIsPlaying(true);

        try {
            const res = await fetch(`https://api.myskillsplus.com/tts/`, {
            // const res = await fetch(`http://127.0.0.1:8000/tts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: para,
                    language_code: selectedVoice.language_codes[0],
                    voice_name: selectedVoice.name,
                    ssml_gender: selectedVoice.ssml_gender
                }),
            });

            const audioBlob = await res.blob();
            const url = URL.createObjectURL(audioBlob);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => setIsPlaying(false);

            audio.play();
        } catch (err) {
            console.error("Error playing TTS:", err);
            setIsPlaying(false);
        }
    };

    const stopSpeech = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };


    function handleConfirm() {
        setStep("final");
    }

    if (step === "select") {
        return (
            <div className='w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-24'>
                <h1 className="text-4xl font-bold text-blue-900 mb-8">Make Listening Easy – Choose Your Voice</h1>
                <div className='bg-white rounded-xl p-8 mb-8 min-w-[80%]'>
                    <p className="text-lg mb-8" dir={getTextDirection(languageCode)}>{translatedParagraph}</p>
                    <div className='flex justify-between'>
                        <select
                            className="w-90 p-2 border rounded-lg"
                            onChange={(e) => {
                                const selected = voices.find((v) => v.name === e.target.value);
                                setSelectedVoice(selected);

                                localStorage.setItem(
                                    "selectedVoice",
                                    JSON.stringify(selected)
                                );

                            }}
                        >
                            <option value="">Select a voice</option>
                            {voices.map((voice, index) => (
                                <option key={index} value={voice.name}>
                                    {voice.name} ({voice.language_codes.join(", ")}) –{" "}
                                    {voice.ssml_gender}
                                </option>
                            ))}
                        </select>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => speak(translatedParagraph)}
                                disabled={isPlaying}
                                className={`p-3 rounded-full border flex gap-5 hover:cursor-pointer transition-colors ${isPlaying
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#EEEEEE]'
                                    }`}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}{isPlaying ? "" : "Play"}
                            </button>

                            {isPlaying && (
                                <button
                                    onClick={stopSpeech}
                                    className="p-3 rounded-full flex gap-5 hover:cursor-pointer bg-[#FFCDD2] text-[#E53935] hover:bg-[#EF9A9A] transition-colors"
                                >
                                    <MicOff size={20} /> Stop
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <button className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer' onClick={handleConfirm}>Continue</button>
                <Loader isLoading={isProcessing} />
            </div>
            
        )
    }

    if (step === "final") {
        return <InterviewQuestions data={data} languageCode={selectedVoice.language_codes[0]}/>

    }
}

export default VoiceSelection

