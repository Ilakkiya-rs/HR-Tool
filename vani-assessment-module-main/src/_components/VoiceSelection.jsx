import React, { useState, useEffect } from 'react'
import { MicOff, Play, Pause } from 'lucide-react';
import InterviewQuestions from './InterviewQuestions';

const VoiceSelection = ({ data }) => {

    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState("select");

    const paragraph =
        "This is a sample paragraph. Please listen carefully to the voice and choose the one you prefer.";

    useEffect(() => {
        const loadVoices = () => {
            const synthVoices = window.speechSynthesis.getVoices();
            setVoices(synthVoices);
        };

        // Some browsers delay voice loading
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); // initial attempt
    }, [selectedVoice]);

    const speak = (para) => {
        if (!selectedVoice) return;

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(para);
        utterance.voice = selectedVoice;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    function handleConfirm() {
        console.log("Selected Voice:", selectedVoice);
        console.log("data", data);
        setStep("final");
    }

    if (step === "select") {
        return (
            <div className='w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-24'>
                <h1 className="text-4xl font-bold text-blue-900 mb-8">Make Listening Easy – Choose Your Voice</h1>
                <div className='bg-white rounded-xl p-8 mb-8'>
                    <p className="text-lg mb-8">{paragraph}</p>
                    <div className='flex justify-between'>
                        <select
                            className="w-90 p-2 border rounded-lg"
                            onChange={(e) => {
                                const selected = voices.find((v) => v.name === e.target.value);
                                setSelectedVoice(selected);

                                localStorage.setItem(
                                    "selectedVoice",
                                    JSON.stringify({ name: selected.name, lang: selected.lang })
                                );

                            }}
                        >
                            <option value="">Select a voice</option>
                            {voices.map((voice, index) => (
                                <option key={index} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => speak(paragraph)}
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
            </div>
        )
    }

    if (step === "final") {
        return <InterviewQuestions data={data} voice={selectedVoice} />
    }
}

export default VoiceSelection