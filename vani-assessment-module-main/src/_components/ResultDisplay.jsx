import React, { useState, useEffect } from 'react';
import { Award, FileText, Zap } from 'lucide-react';

const DisplayResult = ({results}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);


  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setAnimationStep(1), 300);
    setTimeout(() => setAnimationStep(2), 600);
    setTimeout(() => setAnimationStep(3), 900);
  }, []);
//     const formatDate = () => {
//       const now = new Date();
//       return now.toLocaleDateString('en-US', { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     };

//     const generateTranscriptContent = () => {
//       let content = `
// ╔═════════════════════════════════════════════════════════════════════════════════╗
// ║                          ASSESSMENT RESULTS TRANSCRIPT                          ║
// ╠═════════════════════════════════════════════════════════════════════════════════╣    
// ║ Job Fit Score: ${results.Result.overall_score.padEnd(36)}                             ║               
// ║ Questions Answered: ${results.Result.questions_answered}/${results.Result.total_questions}                                                         ║
// ║ Generated: ${formatDate().padEnd(36)}                                 ║
// ╚═════════════════════════════════════════════════════════════════════════════════╝

// ══════════════════════════════════════════════════════════════════════════════════
//                             SKILLS PERFORMANCE SUMMARY
// ══════════════════════════════════════════════════════════════════════════════════

// `;

// content += `┌─────────────────────────────────────────────────────────────────────────────────┐
// │ ASSESSMENT FEEDBACK                                                             │
// ├─────────────────────────────────────────────────────────────────────────────────┤
// │                                                                                 │`;

//         // Word wrap the remarks text
//         const words = results.Result.remarks.split(' ');
//         let currentLine = '';
//         const maxLineLength = 75;
        
//         words.forEach(word => {
//           if ((currentLine + word).length > maxLineLength) {
//             content += `\n│ ${currentLine.padEnd(79)} │`;
//             currentLine = word + ' ';
//           } else {
//             currentLine += word + ' ';
//           }
//         });
        
//         if (currentLine.trim()) {
//           content += `\n│ ${currentLine.trim().padEnd(79)} │`;
//         }

//         content += `\n└─────────────────────────────────────────────────────────────────────────────────┘

// `;

//       content += `══════════════════════════════════════════════════════════════════════════════════
//                          QUESTIONS AND ANSWERS TRANSCRIPT
// ══════════════════════════════════════════════════════════════════════════════════

// `;

//       results.Result.data.forEach((answer, index) => {
//         const hasAnswer = answer.answer && answer.answer.trim() !== '';
        
//         content += `╭─────────────────────────────────────────────────────────────────────────────────╮
// │ QUESTION ${index + 1}                                                                      │
// ├─────────────────────────────────────────────────────────────────────────────────┤
// │ Question ID: ${answer.id}                                                                  │
// │                                                                                 │
// │ QUESTION:                                                                       │`;

//         // Word wrap the question
//         const questionWords = answer.question.split(' ');
//         let currentQuestionLine = '';
//         const maxLineLength = 75;
        
//         questionWords.forEach(word => {
//           if ((currentQuestionLine + word).length > maxLineLength) {
//             content += `\n│ ${currentQuestionLine.padEnd(79)} │`;
//             currentQuestionLine = word + ' ';
//           } else {
//             currentQuestionLine += word + ' ';
//           }
//         });
        
//         if (currentQuestionLine.trim()) {
//           content += `\n│ ${currentQuestionLine.trim().padEnd(79)} │`;
//         }

//         content += `\n│                                                                                 │
// │ ANSWER:                                                                         │`;

//         if (hasAnswer) {
//           // Word wrap the answer
//           const answerWords = answer.answer.split(' ');
//           let currentAnswerLine = '';
          
//           answerWords.forEach(word => {
//             if ((currentAnswerLine + word).length > maxLineLength) {
//               content += `\n│ ${currentAnswerLine.padEnd(79)} │`;
//               currentAnswerLine = word + ' ';
//             } else {
//               currentAnswerLine += word + ' ';
//             }
//           });
          
//           if (currentAnswerLine.trim()) {
//             content += `\n│ ${currentAnswerLine.trim().padEnd(79)} │`;
//           }
//         } else {
//           content += `\n│ [No answer provided]                                                            │`;
//         }

//         content += `\n╰─────────────────────────────────────────────────────────────────────────────────╯

// `;
//       });

//       content += `══════════════════════════════════════════════════════════════════════════════════
//                                   END OF TRANSCRIPT
// ══════════════════════════════════════════════════════════════════════════════════

// Generated on: ${formatDate()}
// Overall Performance: ${results.Result.overall_score}

// This transcript contains the complete assessment results including all questions,
// answers, and detailed performance feedback for each evaluated skill.

// © Assessment Platform - Confidential Document
// `;

//       return content;
//     };

//     const transcriptContent = generateTranscriptContent();
//     const blob = new Blob([transcriptContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Assessment_Results_${results.Result.assessment_id}_${new Date().toISOString().split('T')[0]}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

  const FloatingParticle = ({ delay, size, position }) => (
    <div 
      className="absolute bg-indigo-400 rounded-full opacity-20 animate-bounce"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        animationDelay: `${delay}s`,
        animationDuration: '3s'
      }}
    ></div>
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticle delay={0} size={8} position={{x: 10, y: 20}} />
      <FloatingParticle delay={1} size={12} position={{x: 85, y: 30}} />
      <FloatingParticle delay={2} size={6} position={{x: 20, y: 80}} />
      <FloatingParticle delay={0.5} size={10} position={{x: 75, y: 70}} />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 shadow-2xl hover:bg-indigo-700 transition-colors">
              <Award className="w-10 h-10 text-white z-10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 blur-lg opacity-50 animate-pulse"></div>
            </div>

            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#424242] via-[#616161] to-[#757575] bg-clip-text text-transparent">
                Assessment Results
              </h1>
              <p className="text-[#9E9E9E] text-xl mt-2">Your comprehensive skills evaluation</p>
            </div>
          </div>
        </div>

        {/* Overall Score Display */}
        <div className={`relative bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-3xl p-8 mb-10 shadow-2xl shadow-indigo-200 transform transition-all duration-1000 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 shadow-xl">
                <Zap className="w-16 h-16 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 blur-xl opacity-40 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                  Job Fit Score: {results.Result.overall_score}
                </h2>
                <div className="inline-flex px-4 py-2 rounded-full text-base font-semibold bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 border border-indigo-200">
                  {results.Result.overall_score}
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {/* Remark Section */}
        <div className={`mb-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`} style={{ transitionDelay: '600ms' }}>
          <div className="relative bg-white rounded-2xl shadow-xl border border-[#F5F5F5] overflow-hidden">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 blur-lg opacity-40"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#424242] mb-2">Assessment Feedback</h3>
                  <p className="text-[#757575]">Detailed analysis of your performance</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <p className="text-[#616161] leading-relaxed text-lg">
                  {results.Result.remarks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayResult;


