import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DimensionScores,
  PathwayMatch,
  calculateScores,
  matchPathways,
  generateProjection,
} from '@/lib/scoring';
import { questions } from '@/data/questions';
import { pathways } from '@/data/pathways';

interface AssessmentState {
  answers: Record<number, number>;
  currentQuestion: number;
  isComplete: boolean;
  scores: DimensionScores | null;
  pathwayMatches: PathwayMatch[] | null;
  projection: string | null;
}

interface AssessmentContextType extends AssessmentState {
  setAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>({
    answers: {},
    currentQuestion: 0,
    isComplete: false,
    scores: null,
    pathwayMatches: null,
    projection: null,
  });

  const setAnswer = (questionId: number, value: number) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  };

  const nextQuestion = () => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, questions.length - 1),
    }));
  };

  const prevQuestion = () => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 0),
    }));
  };

  const completeAssessment = () => {
    const scores = calculateScores(state.answers, questions);
    const matches = matchPathways(scores, pathways);
    const projection = generateProjection(matches[0], scores);

    setState((prev) => ({
      ...prev,
      isComplete: true,
      scores,
      pathwayMatches: matches,
      projection,
    }));
  };

  const resetAssessment = () => {
    setState({
      answers: {},
      currentQuestion: 0,
      isComplete: false,
      scores: null,
      pathwayMatches: null,
      projection: null,
    });
  };

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        setAnswer,
        nextQuestion,
        prevQuestion,
        completeAssessment,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}