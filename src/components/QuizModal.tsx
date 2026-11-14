'use client';

import React, { useState } from 'react';
import { QUIZ_TOPICS, QuizTopic } from '../data/missions';
import { soundManager } from '../services/soundManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAwardXp: (xp: number) => void;
}

export const QuizModal: React.FC<Props> = ({ isOpen, onClose, onAwardXp }) => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentTopic: QuizTopic = QUIZ_TOPICS[topicIndex] || QUIZ_TOPICS[0];
  const question = currentTopic.questions[currentQuestion];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      soundManager.playSignal();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundManager.playBeep(300, 0.15, 'sawtooth');
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < currentTopic.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      soundManager.playBeep(750, 0.05);
    } else {
      setIsFinished(true);
      const scorePercent = Math.round((correctCount / currentTopic.questions.length) * 100);
      const earnedXp = correctCount * 30 + (scorePercent === 100 ? 50 : 0);
      onAwardXp(earnedXp);
      if (scorePercent >= 66) {
        soundManager.playFanfare();
      }
    }
  };

  const handleReset = () => {
    setTopicIndex((prev) => (prev + 1) % QUIZ_TOPICS.length);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="pixel-panel w-full max-w-xl bg-[#071426] border-4 border-black p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[#5ce1e6]">
                MULTIVERSE TRIVIA RECON
              </h2>
              <span className="font-mono text-[10px] text-[#ffe066]">
                {currentTopic.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn text-xs px-2 py-1 !bg-[#e53935] !text-white"
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <div className="flex flex-col gap-3">
            {/* Question Progress & Text */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8fb8c4]">
              <span>QUESTION {currentQuestion + 1} OF {currentTopic.questions.length}</span>
              <span className="text-[#6fc041] font-pixel text-[8px]">
                SCORE: {correctCount} / {currentQuestion + (isAnswered ? 1 : 0)}
              </span>
            </div>

            <div className="p-3 bg-[#0a1a2e] border-2 border-black font-readable text-lg text-white">
              {question.prompt}
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-2">
              {question.options.map((option, idx) => {
                let btnStyle = 'border-black bg-[#06101e] text-[#e8f4f8] hover:border-[#5ce1e6]';
                if (isAnswered) {
                  if (idx === question.correctIndex) {
                    btnStyle = 'border-black !bg-[#6fc041] !text-black font-bold';
                  } else if (idx === selectedAnswer) {
                    btnStyle = 'border-black !bg-[#e53935] !text-white line-through';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full p-2.5 text-left border-2 font-mono text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === question.correctIndex && <span>✓ CORRECT</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next button */}
            {isAnswered && (
              <div className="flex flex-col gap-2 p-2 bg-[#030914] border border-[#1a3a5c]">
                <p className="font-mono text-xs text-[#8fb8c4]">
                  💡 {question.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="pixel-btn text-xs py-1.5 self-end !bg-[#ffe066] !text-black"
                >
                  NEXT QUESTION ➔
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-4xl animate-bounce">🏆</span>
            <h3 className="font-pixel text-sm text-[#ffe066]">RECON QUIZ COMPLETED!</h3>
            <p className="font-mono text-base text-[#e8f4f8]">
              You answered {correctCount} of {currentTopic.questions.length} questions correctly!
            </p>
            <div className="px-4 py-2 bg-[#0c2238] border-2 border-black font-pixel text-xs text-[#6fc041]">
              +{correctCount * 30 + (correctCount === currentTopic.questions.length ? 50 : 0)} XP AWARDED!
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleReset}
                className="pixel-btn text-xs !bg-[#3a8fd4] !text-white"
              >
                NEXT TOPIC ➔
              </button>
              <button
                type="button"
                onClick={onClose}
                className="pixel-btn text-xs !bg-[#6fc041] !text-black"
              >
                RETURN TO MAP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
