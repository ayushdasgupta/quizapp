import React, { useEffect, useState } from 'react';
import { getResults } from '../db';

const Result: React.FC<ResultProps> = ({ user, userAnswers, questions, resetQuiz }) => {
  const correctAnswers = userAnswers.filter((answer) => answer).length;
  const [pastResults, setPastResults] = useState<PastResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const results = await getResults(user.toLowerCase());
      setPastResults(results);
    };

    fetchResults();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Quiz over {user} 🎉</h2>
      <p className="text-lg text-center mb-4">
        You answered <span className="font-bold text-green-400">{correctAnswers}</span> out of{' '}
        <span className="font-bold text-blue-400">{questions.length}</span> questions correctly.
      </p>

      <button
        onClick={resetQuiz}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
      >
        Restart Quiz
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-3">📜 Past Attempts</h3>
      {pastResults.length === 0 ? (
        <p className="text-gray-400 text-center">No past attempts yet.</p>
      ) : (
        <ul className="space-y-2">
          {pastResults.map((attempt, index) => (
            <li
              key={index}
              className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
            >
              <span className="text-sm">
                <span className="font-bold">Attempt {index + 1}:</span>{' '}
                {attempt.score}/{attempt.total}
              </span>
              <span className="text-gray-400 text-xs">
                {new Date(attempt.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Result;
