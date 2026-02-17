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
import { supabase } from '@/integrations/supabase/client';

interface AssessmentState {
  answers: Record<number, number>;
  currentQuestion: number;
  isComplete: boolean;
  scores: DimensionScores | null;
  pathwayMatches: PathwayMatch[] | null;
  projection: string | null;
  generatingProjection: boolean;
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
    generatingProjection: false,
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

  const completeAssessment = async () => {
    const scores = calculateScores(state.answers, questions);
    const matches = matchPathways(scores, pathways);
    const fallbackProjection = generateProjection(matches[0], scores);
    const topMatch = matches[0];

    // Set complete immediately with fallback, then try AI
    setState((prev) => ({
      ...prev,
      isComplete: true,
      scores,
      pathwayMatches: matches,
      projection: fallbackProjection,
      generatingProjection: true,
    }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-projection', {
        body: {
          scores,
          pathway: {
            name: topMatch.pathway.name,
            careers: topMatch.pathway.careers,
            localIndustries: topMatch.pathway.localIndustries,
          },
          topTraits: topMatch.topTraits,
        },
      });

      if (!error && data?.projection) {
        setState((prev) => ({
          ...prev,
          projection: data.projection,
          generatingProjection: false,
        }));
      } else {
        console.warn('AI projection failed, using fallback:', error);
        setState((prev) => ({ ...prev, generatingProjection: false }));
      }
    } catch (err) {
      console.warn('AI projection error, using fallback:', err);
      setState((prev) => ({ ...prev, generatingProjection: false }));
    }
  };

  const resetAssessment = () => {
    setState({
      answers: {},
      currentQuestion: 0,
      isComplete: false,
      scores: null,
      pathwayMatches: null,
      projection: null,
      generatingProjection: false,
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
