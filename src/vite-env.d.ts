/// <reference types="vite/client" />
interface QuestionType {
    id: number;
    type: 'mcq' | 'integer';
    question: string;
    answerOption?: { text: string; isCorrect: boolean }[];
    answer?: number; 
}


interface ResultProps {
    userAnswers: boolean[];
    questions: { id: number; type: string; question: string }[];
    resetQuiz: () => void;
    user:string
}

interface PastResult {
    id: number;
    score: number;
    total: number;
    timestamp: string;
}
interface AnswerOption {
    text: string;
    isCorrect: boolean;
}

interface QuestionProps {
    question: {
        id: number;
        type: 'mcq' | 'integer';
        question: string;
        answerOption?: AnswerOption[];
        answer?: number; 
    };
    onAnswerClick: (isCorrect: boolean) => void;
}
