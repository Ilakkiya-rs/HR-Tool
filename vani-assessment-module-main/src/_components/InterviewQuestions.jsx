import React, { useState, useEffect, useRef } from 'react';
import ErrorDialog from './ErrorDialog';
import VoiceWave from './Waves';
import DisplayResult from './ResultDisplay';

const InterviewQuestions = ({ data, voice }) => {
  const [isProcessingInterview, setIsProcessingInterview] = useState(false);

  const [currentQuestionShowing, setCurrentQuestionShowing] = useState(0);
  const [userAnswersRecorded, setUserAnswersRecorded] = useState([]);
  const [userAttemptedQuestions, setUserAttemptedQuestions] = useState(new Set());
  const [userAssessmentComplete, setUserAssessmentComplete] = useState(false);
  const [userAssessmentResult, setUserAssessmentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interview-specific states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [message, setMessage] = useState("")
  const [type, setType] = useState('success');

  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
  const totalQuestions = data.assessment.length;

  if (data.keyword === "start") {
    // Normal fresh start
    setUserAnswersRecorded(new Array(totalQuestions).fill(null));
    setUserAttemptedQuestions(new Set());

    setTimeout(() => {
      startFlow(data.assessment[0].question);
    }, 500);

  } else if (data.keyword === "resume") {

    // Pre-fill answers & attempted questions from backend
    const answersArray = new Array(totalQuestions).fill(null);
    const attemptedSet = new Set();
    let lastAnsweredIndex = -1;

    data.assessment.forEach((q, idx) => {
      if (q.answer && q.answer.trim() !== "") {
        answersArray[idx] = q.answer.trim();
        attemptedSet.add(idx);
        lastAnsweredIndex = idx; // keep updating until last one
      }
    });

    setUserAnswersRecorded(answersArray);
    setUserAttemptedQuestions(attemptedSet);

    // Jump to the first unanswered question after the last answered one
    const nextIndex = lastAnsweredIndex + 1 < totalQuestions ? lastAnsweredIndex + 1 : totalQuestions - 1;
    setCurrentQuestionShowing(nextIndex);

    // Start flow from that question
    setTimeout(() => {
      startFlow(data.assessment[nextIndex].question);
    }, 500);
  }
}, [data.keyword, data.assessment]);


useEffect(() => {
  const handleUnloadOrOffline = () => {
    if (data.keyword === "start") {
      // More reliable than fetch
      navigator.sendBeacon(
        `https://api.myskillsplus.com/pause/${data.token}`,
        // `http://127.0.0.1:8000/pause/${data.token}`,
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



  // ✅ Function to speak text with callback
  const speakText = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;


    utterance.onstart = () => setIsPlaying(true);

    utterance.onend = () => {
      setIsPlaying(false);
      if (callback) callback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // ✅ Start question + recording prompt
  const startFlow = (question) => {
    // Stop anything ongoing
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Step 1: Speak the question
    speakText(question, () => {
      // Step 2: After delay, speak recording prompt
      setTimeout(() => {
        speakText("Recording in progress... Please speak clearly.", () => {
          // Step 3: Start recording after prompt
          setIsRecording(true);
          startRecording();
        });
      }, 2000);
    });
  };

  const startRecording = async () => {
  setTranscript("");
  setIsRecording(true);
  setRecordingComplete(false);
  finalTranscriptRef.current = "";
  setAudioChunks([]);

  // ---- Speech Recognition ----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.continuous = true;
  recognitionRef.current.interimResults = true;
  recognitionRef.current.lang = "en-US";

  recognitionRef.current.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscriptRef.current += result[0].transcript + " ";
      } else {
        interimTranscript += result[0].transcript;
      }
    }
    const currentTranscript = finalTranscriptRef.current + interimTranscript;
    if (currentTranscript.trim()) setTranscript(currentTranscript.trim());
  };

  recognitionRef.current.onerror = (event) => {
    // Restart recognition on certain errors
    if (event.error === "no-speech" || event.error === "aborted") {
      recognitionRef.current.start();
    }
  };

  recognitionRef.current.onend = () => {
    // Automatically restart recognition so user can speak later
    if (isRecording) recognitionRef.current.start();
  };

  recognitionRef.current.start();

  // ---- MediaRecorder for Audio ----
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) setAudioChunks((prev) => [...prev, event.data]);
    };
    mediaRecorderRef.current.start();
  } catch (err) {
    setMessage("Error accessing microphone")
    setType("error")
  }
};

  const stopRecording = (questionIndex) => {
  return new Promise((resolve) => {
    const questionData = data.assessment[questionIndex];

    // Stop speech recognition first
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        stopMediaRecorder();
      };
      recognitionRef.current.stop();
    } else {
      stopMediaRecorder();
    }

    function stopMediaRecorder() {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.onstop = async () => {
            await finishRecording(questionIndex, questionData, resolve);
          };
          mediaRecorderRef.current.stop();
        } else {
          finishRecording(questionIndex, questionData, resolve);
        }
      } else {
        finishRecording(questionIndex, questionData, resolve);
      }
    }
  });
};


const finishRecording = async (questionIndex, questionData, resolve) => {
  const finalTranscript = (finalTranscriptRef.current || "").trim();

  // Always resolve, even if no audioChunks
  try {
    const audioBlob =
      audioChunks.length > 0
        ? new Blob(audioChunks, { type: "audio/wav" })
        : new Blob([], { type: "audio/wav" });

    const audioFile = new File([audioBlob], `question_${questionIndex + 1}.wav`, { type: "audio/wav" });

    const answer_json = {
      question_id: questionData.id,
      question: questionData.question,
      transcript: finalTranscript,
    };

    const formData = new FormData();
    formData.append("audio_file", audioFile);
    formData.append("answer", JSON.stringify(answer_json));
    formData.append("question_id", questionData.id);
    formData.append("email", data.email);

    const res = await fetch(
      `https://api.myskillsplus.com/save-answer/${data.token}/${questionData.id}/`,
      // `http://127.0.0.1:8000/save-answer/${data.token}/${questionData.id}/`,
      { method: "POST", body: formData }
    );

    const new_data = await res.json();
  } catch (err) {
    setMessage("Error uploading answer");
    setType("error")
  }

  saveCurrentAnswer(finalTranscript, questionIndex);
  resetRecordingState();

  resolve(); // ✅ Always resolve
};


  const saveCurrentAnswer = (answer, index) => {
    const trimmed = (answer || "").trim();

    // ✅ Save answer array
    setUserAnswersRecorded((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = trimmed.length > 0 ? trimmed : null;
      return newAnswers;
    });

    // ✅ Mark question as attempted if transcript is not empty
    setUserAttemptedQuestions((prev) => {
      const newSet = new Set(prev);
      if (trimmed.length > 0) {
        newSet.add(index);
      }
      return newSet;
    });
  };


  const resetRecordingState = () => {
    setTranscript("");
    finalTranscriptRef.current = "";
    setAudioChunks([]);
    setRecordingComplete(false);
    setIsRecording(false);
  };


  const handleNext = async () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    const questionIndex = currentQuestionShowing; // capture now

    if (isRecording) {
      await stopRecording(questionIndex);
    } else {
      saveCurrentAnswer(finalTranscriptRef.current, questionIndex);
      resetRecordingState();
    }

    // ✅ Move to next question only AFTER saving
    if (questionIndex < data.assessment.length - 1) {
      setCurrentQuestionShowing(questionIndex + 1);
      setTimeout(() => {
        startFlow(data.assessment[questionIndex + 1].question);
      }, 500);
    } else {
      if (window.confirm("Submit your interview?")) {
        handleSubmitAssessment();
      }
    }
  };



  const handleSubmitAssessment = async () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    // Wait a moment for any pending updates
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      setIsProcessingInterview(true);
      const response = await fetch(`https://api.myskillsplus.com/submit-paper/${data.token}/`, {
      // const response = await fetch(`http://127.0.0.1:8000/submit-paper/${data.token}/`, {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email
        }),
      });

      if (response.ok) {
        const resultData = await response.json();
        setUserAssessmentResult(resultData);
        setUserAssessmentComplete(true);
      } else {
        setMessage(resultData.error);
        setType('error')
        setIsProcessingInterview(false)
      }
    } catch (error) {
      setMessage("Error Submitted Assessment");
      setType('error')
    } finally {
      setIsProcessingInterview(false);
    }
  };

  const handlePause = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`https://api.myskillsplus.com/pause/${data.token}/`, {
      // const response = await fetch(`http://127.0.0.1:8000/pause/${data.token}/`, {
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
          location.reload()
        }, 500);
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
      setType("error")
    } finally {
      setIsLoading(false);
    }
  }


  if (userAssessmentComplete && userAssessmentResult) {
    return <DisplayResult results={userAssessmentResult} />;
  }

  if (isProcessingInterview) {
    return (
      <div className="w-screen bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#616161]">You responses to the questions are being processed....</h2>
          <p className="text-[#9E9E9E] mt-2">Thanks for your patience....</p>
        </div>
      </div>
    );
  }

  // Active question screen
  const currentQuestionData = data.assessment[currentQuestionShowing];
  const totalQuestions = data.assessment.length;
  const questionsAttempted = userAttemptedQuestions.size;

  return (

    <div className="w-screen bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen relative">

      <div className="max-w-4xl mx-auto px-4 py-8 pt-28">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#424242]">Technical Interview</h1>
            <span>Question {currentQuestionShowing + 1} of {totalQuestions}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-[#424242] flex-1 pr-4">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Recording Section */}
          <div className="min-h-[80%] border-2 border-dashed border-[#E0E0E0] rounded-lg p-8 text-center">
            <div>
              {isPlaying && <VoiceWave isPlaying={isPlaying} />}
              {isRecording && <VoiceWave isRecording={isRecording} />}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#757575]">
            <p className="mt-1">Completed: {questionsAttempted}/{totalQuestions}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:cursor-pointer font-medium rounded-lg hover:bg-[#FAFAFA] border border-[#E0E0E0] transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
      <div className='bg-white p-4 w-full flex justify-end gap-2 fixed left-0 top-0 shadow-xl'>
        {data.keyword === "start" && (
          <button
          onClick={handlePause}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:cursor-pointer font-medium rounded-lg hover:bg-[#FAFAFA] border border-[#E0E0E0] transition-colors"
        >
          Pause Interview
        </button>
        )}
        <button
          onClick={handleSubmitAssessment}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors hover:cursor-pointer"
        >
          Submit Interview
        </button>
      </div>
      <ErrorDialog message={message} type={type} onClose={() => setMessage('')} />

    </div>
  );
}

export default InterviewQuestions


