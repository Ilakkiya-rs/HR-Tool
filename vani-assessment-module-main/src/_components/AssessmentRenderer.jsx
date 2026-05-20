'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import AssessmentResults from './AssessmentResult';

const AssessmentRenderer = ({ assessmentData, userData }) => {

  const [currentAssessmentData, setCurrentAssessmentData] = useState(assessmentData);
  const [savedUserData, setSavedUserData] = useState(userData);
  const questionContainerRef = useRef(null);

  const [selectedSkills, setSelectedSkills] = useState(currentAssessmentData.skills);

  const [isProcessing, setIsProcessing] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interview-specific states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(""); // Hold final transcript
  const isStoppedByUserRef = useRef(false); // Track if user manually stopped

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setRecordingTime(0);
    finalTranscriptRef.current = ""; // Reset transcript buffer
    isStoppedByUserRef.current = false; // Reset stop flag

    // Start recording timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started for question", currentQuestion + 1);
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended for question", currentQuestion + 1);

      // Only process if user manually stopped (not automatic restart)
      if (isStoppedByUserRef.current) {
        const finalTranscript = finalTranscriptRef.current.trim();
        console.log("Processing final transcript on end:", finalTranscript);

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setRecordingComplete(true);

          // Update userAnswers array
          setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion] = finalTranscript;
            console.log("Updated userAnswers on end:", newAnswers);
            return newAnswers;
          });
        }
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      // Don't restart on error, let user handle it
      setIsRecording(false);
    };

    recognitionRef.current.onresult = (event) => {
      console.log("Speech recognition result event fired for question", currentQuestion + 1);
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        console.log(`Result ${i}: ${result[0].transcript} (final: ${result.isFinal})`);

        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
          console.log("Updated final transcript for question", currentQuestion + 1, ":", finalTranscriptRef.current);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Show interim results in UI for better UX
      const currentTranscript = finalTranscriptRef.current + interimTranscript;
      if (currentTranscript.trim()) {
        setTranscript(currentTranscript.trim());
      }
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    console.log("Stop recording called for question", currentQuestion + 1);
    isStoppedByUserRef.current = true; // Mark as user-initiated stop

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);

    // Clear recording timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Process the final transcript immediately
    const finalTranscript = finalTranscriptRef.current.trim();
    console.log("Processing final transcript on stop:", finalTranscript);

    if (finalTranscript) {
      setTranscript(finalTranscript);
      setRecordingComplete(true);

      // Update userAnswers array
      setUserAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = finalTranscript;
        console.log("Updated userAnswers on stop:", newAnswers);
        return newAnswers;
      });
    } else {
      // If no transcript, still mark as complete but empty
      setRecordingComplete(true);
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Cleanup effects
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Load existing transcript for current question
  useEffect(() => {
    console.log("Loading transcript for question", currentQuestion + 1, ":", userAnswers[currentQuestion]);

    if (userAnswers[currentQuestion]) {
      setTranscript(userAnswers[currentQuestion]);
      setRecordingComplete(true);
    } else {
      setTranscript("");
      setRecordingComplete(false);
    }

    // Reset recording state when changing questions
    setIsRecording(false);
    setRecordingTime(0);
    isStoppedByUserRef.current = false;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Reset transcript buffer
    finalTranscriptRef.current = "";
  }, [currentQuestion, userAnswers]);

  useEffect(() => {
    if (currentAssessmentData) {

      setSelectedSkills(currentAssessmentData.skills);

      // Initialize answers array with empty values
      setUserAnswers(new Array(currentAssessmentData.assessment.assessment.questions.length).fill(null));

      // Reset attempted questions
      setAttemptedQuestions(new Set());

      // Set timer based on time_limit from instructions
      const timeLimit = currentAssessmentData.time_limit_minutes;
      if (timeLimit) {
        setTimeRemaining(timeLimit * 60);
      }

      setIsLoading(false);
      setAssessmentComplete(false);
    }
  }, [currentAssessmentData]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || assessmentComplete) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);

      if (timeRemaining === 1) {
        handleSubmitAssessment();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, assessmentComplete]);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleNext = () => {
    // Stop current speech before moving to next
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    if (currentQuestion < currentAssessmentData.assessment.assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      setTimeout(() => {
        const nextQuestionData = currentAssessmentData.assessment.assessment.questions[currentQuestion + 1];
        speakQuestion(nextQuestionData.question);
      }, 500);
    } else {
      if (window.confirm("Submit your interview? All recordings will be processed.")) {
        handleSubmitAssessment();
      }
    }
  };

  const handlePrevious = () => {
    // Stop current speech before moving to previous
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);

      setTimeout(() => {
        const prevQuestionData = currentAssessmentData.assessment.assessment.questions[currentQuestion - 1];
        speakQuestion(prevQuestionData.question);
      }, 500);
    }
  };

  const speakQuestion = (question) => {
    if (isMuted) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
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

    // Prepare submission data
    const submissionData = {
      individual_profile_id: savedUserData.individual_profile_id,
      assessment_id: currentAssessmentData.assessment_id,
      skills: selectedSkills,
      answers: userAnswers.map((answer, index) => ({
        question_id: currentAssessmentData.assessment.assessment.questions[index].id,
        question: currentAssessmentData.assessment.assessment.questions[index].question,
        transcript: answer || "",
        skill_assessed: currentAssessmentData.assessment.assessment.questions[index].skill_assessed,
        category: currentAssessmentData.assessment.assessment.questions[index].category
      }))
    };

    try {
      setIsProcessing(true);
      // Replace with your actual API endpoint
      const response = await fetch('https://api.myskillsplus.com/vani-submit-assessment/', {
      // const response = await fetch('http://127.0.0.1:8000/vani-submit-assessment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const resultData = await response.json();
        setAssessmentResult(resultData);
        setAssessmentComplete(true);
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-play first question on load
  useEffect(() => {
    if (!isLoading && currentAssessmentData && currentQuestion === 0) {
      setTimeout(() => {
        speakQuestion(currentAssessmentData.assessment.assessment.questions[0].question);
      }, 1000);
    }
  }, [isLoading, currentAssessmentData]);

  // Handle re-record functionality
  const handleReRecord = () => {
    setTranscript("");
    setRecordingComplete(false);
    finalTranscriptRef.current = "";

    // Clear from userAnswers array
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = null;
      return newAnswers;
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#616161]">Preparing your interview...</h2>
          <p className="text-[#9E9E9E] mt-2">Please ensure your microphone is working</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#616161]">Processing your interview...</h2>
          <p className="text-[#9E9E9E] mt-2">Please wait while we analyze your responses</p>
        </div>
      </div>
    );
  }

  if (assessmentComplete && assessmentResult) {
    return <AssessmentResults results={assessmentResult} />;
  }

  // Active question screen
  const currentQuestionData = currentAssessmentData.assessment.assessment.questions[currentQuestion];
  const totalQuestions = currentAssessmentData.assessment.assessment.questions.length;
  const questionsAttempted = attemptedQuestions.size;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#424242]">Technical Interview</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-full ${isMuted ? 'bg-[#FFCDD2] text-[#E53935]' : 'bg-[#F5F5F5] text-[#757575]'} hover:bg-[#EEEEEE] transition-colors`}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {timeRemaining !== null && (
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${timeRemaining < 300 ? 'bg-[#FFCDD2] text-[#C62828]' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                  Time: {formatTime(timeRemaining)}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-[#757575]">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
              {currentQuestionData.skill_assessed}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-[#424242] flex-1 pr-4">
              {currentQuestionData.question}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => speakQuestion(currentQuestionData.question)}
                disabled={isPlaying}
                className={`p-3 rounded-full transition-colors ${isPlaying
                    ? 'bg-green-100 text-green-600'
                    : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#EEEEEE]'
                  }`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {isPlaying && (
                <button
                  onClick={stopSpeech}
                  className="p-3 rounded-full bg-[#FFCDD2] text-[#E53935] hover:bg-[#EF9A9A] transition-colors"
                >
                  <MicOff size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Recording Section */}
          <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-colors ${isRecording
                  ? 'bg-[#FFCDD2] text-[#E53935] animate-pulse'
                  : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#EEEEEE]'
                }`}>
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </div>

              <h3 className="text-lg font-semibold text-[#424242] mb-2">
                {isRecording ? 'Recording your answer...' : 'Click to record your answer'}
              </h3>
              {isRecording && (
                <p className="text-sm text-[#757575] mb-2">
                  Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={handleToggleRecording}
                  className="px-6 py-3 bg-[#E53935] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors flex items-center space-x-2"
                >
                  <Mic size={20} />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  onClick={handleToggleRecording}
                  className="px-6 py-3 bg-[#E53935] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors flex items-center space-x-2"
                >
                  <MicOff size={20} />
                  <span>Stop Recording</span>
                </button>
              )}
              {transcript && (
                <button
                  onClick={handleReRecord}
                  className="px-6 py-3 bg-[#757575] text-white rounded-lg font-medium hover:bg-[#616161] transition-colors flex items-center space-x-2"
                >
                  <RefreshCw size={20} />
                  <span>Re-record</span>
                </button>
              )}
            </div>

            {/* Transcription Display */}
            {transcript && (
              <div className="bg-[#FAFAFA] rounded-lg p-4 mt-4">
                <h4 className="font-medium text-[#616161] mb-2">Your Response:</h4>
                <p className="text-[#424242] text-left">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#757575]">
            <p>Category: {currentQuestionData.category}</p>
            <p className="mt-1">Completed: {questionsAttempted}/{totalQuestions}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentQuestion > 0
                  ? 'bg-white text-[#616161] hover:bg-[#FAFAFA] border border-[#E0E0E0]'
                  : 'bg-[#F5F5F5] text-[#BDBDBD] cursor-not-allowed'
                }`}
            >
              Previous
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-white text-[#616161] font-medium rounded-lg hover:bg-[#FAFAFA] border border-[#E0E0E0] transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRenderer;