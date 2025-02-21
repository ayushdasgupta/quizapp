import React, { useState, useEffect, useCallback } from 'react';
import questionData from './assets/question.json';
import Question from './components/question';
import Result from './components/Result';
import { saveResult } from './db.js';

const questions: QuestionType[] = questionData as QuestionType[];

const App: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [, setShowFeedback] = useState<null | boolean>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const instructions: string[] = [
    "For multiple-choice questions, select the one best answer (A, B, C, or D).",
    "For integer-type questions, write your numerical answer clearly.",
    "No calculators unless specified.",
    "You have 30 minutes to complete this quiz."
  ];
  const handleNextQuestion = useCallback((isCorrect: boolean) => {
    setShowFeedback(isCorrect);
    setUserAnswers((prev) => [...prev, isCorrect]);
  
    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setShowFeedback(null);
        setTimeLeft(30);
      } else {
        setIsQuizCompleted(true);
        const correctAnswers = [...userAnswers, isCorrect].filter(Boolean).length;
        await saveResult(name.toLowerCase(),correctAnswers, questions.length);
      }
    }, 1000);
  }, [currentQuestion,  userAnswers]);

  useEffect(() => {
    if (isNameSubmitted && !isQuizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            handleNextQuestion(false); 
            return 30; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, isNameSubmitted, isQuizCompleted,handleNextQuestion]);

  const handleSubmitName = () => {
    if (name.trim() !== "") {
      setIsNameSubmitted(true);
    } else {
      alert("Please enter your name before starting the quiz.");
    }
  };

 

  const resetQuiz = () => {
    setIsNameSubmitted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTimeLeft(30);
    setShowFeedback(null);
    setIsQuizCompleted(false);
    setName(""); // Reset name for a fresh start
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Quiz Platform</h1>

      {!isNameSubmitted ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 px-4 rounded-xl text-white placeholder:text-white border-2"
          />
          <button
            onClick={handleSubmitName}
            disabled={!name.trim()}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:bg-gray-500"
          >
            Start
          </button>
        </div>
      ) : isQuizCompleted ? (
        <>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Quiz Completed! 🎉</h2>
          <Result user={name} userAnswers={userAnswers} questions={questions} resetQuiz={resetQuiz} />
        </>
      ) : (
        <>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-lg mb-4">
            {instructions.map((instruction, index) => (
              <p key={index} className="text-gray-300">
                {index + 1}: {instruction}
              </p>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-4">
            Time Left: <span className="text-yellow-400">{timeLeft}s</span>
          </h2>
          
          <Question
            question={questions[currentQuestion]}
            onAnswerClick={handleNextQuestion}
          />
        </>
      )}
    </div>
  );
};

export default App;
