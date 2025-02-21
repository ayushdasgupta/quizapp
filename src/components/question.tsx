import React, { useState, useEffect } from 'react';


const Question: React.FC<QuestionProps> = ({ question, onAnswerClick }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState<boolean | null>(null);

  useEffect(() => {
    setSelectedAnswerIndex(null);
    setIsWrong(null);
    setUserInput('');
  }, [question]);

  const handleMCQClick = (index: number, isCorrect: boolean) => {
    setSelectedAnswerIndex(index);
    setIsWrong(!isCorrect);
    onAnswerClick(isCorrect);
  };

  const handleIntegerSubmit = () => {
    if (question.answer !== undefined) {
      const isCorrect = parseInt(userInput) === question.answer;
      setIsWrong(!isCorrect);
      onAnswerClick(isCorrect);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
      <p className="text-lg font-semibold text-white mb-4">
        {question.id}. {question.question}
      </p>

      {/* MCQ Question */}
      {question.type === 'mcq' && question.answerOption ? (
        <ul className="space-y-3">
          {question.answerOption.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleMCQClick(index, option.isCorrect)}
                className={`w-full p-3 rounded-md text-white font-medium transition-all
                  ${selectedAnswerIndex === index ? 
                    (option.isCorrect ? 'bg-green-600' : 'bg-red-600') 
                    : 'bg-gray-700 hover:bg-gray-600'}
                `}
              >
                {option.text}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // Integer Type Question
        <div className="flex flex-col space-y-3">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your answer"
            className="p-2 text-white placeholder:text-white bg-gray-700 rounded-md"
          />
          <button
            onClick={handleIntegerSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Submit
          </button>
        </div>
      )}

      {/* Answer Feedback */}
      {isWrong !== null && (
        <p
          className={`mt-4 text-lg font-semibold ${
            isWrong ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {isWrong ? 'Wrong Answer ❌' : 'Correct Answer ✅'}
        </p>
      )}
    </div>
  );
};

export default Question;
