import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DimensionScores,
  PathwayMatch,
  matchPathways,
  generateProjection,
} from '@/lib/scoring';
import { combineScores } from '@/lib/scoringNew';
import { hexacoQuestions } from '@/data/hexacoQuestions';
import { sdsQuestions } from '@/data/sdsQuestions';
import { pathways } from '@/data/pathways';
import { api } from '@/services/api';

export interface StudentProfile {
  name: string;
  province: string;
  familyBackground: string;
  aspiration: string;
}

export type AssessmentStage = 'profile' | 'hexaco' | 'sds' | 'submitting';

interface AssessmentState {
  stage: AssessmentStage;
  hexacoAnswers: Record<number, number>;       // questionId -> 1..5
  sdsAnswers: Record<string, boolean>;         // questionId -> true (suka/mampu/menarik)
  hexacoIndex: number;                          // 0..59
  sdsSection: 1 | 2 | 3;
  isComplete: boolean;
  scores: DimensionScores | null;
  hollandCode: string | null;
  pathwayMatches: PathwayMatch[] | null;
  projection: string | null;
  generatingProjection: boolean;
  layer1: string | null;
  generatingLayer1: boolean;
  studentProfile: StudentProfile | null;
}

interface AssessmentContextType extends AssessmentState {
  // Profile
  setStudentProfile: (p: StudentProfile) => void;
  // HEXACO
  setHexacoAnswer: (id: number, value: number) => void;
  nextHexaco: () => void;
  prevHexaco: () => void;
  // SDS
  toggleSds: (id: string) => void;
  goToSdsSection: (section: 1 | 2 | 3) => void;
  // Lifecycle
  startHexaco: () => void;
  startSds: () => void;
  completeAssessment: () => void;            // sync — only computes & stores scores
  triggerLayer1: () => Promise<void>;        // async — fetches profile narrative on demand
  triggerProjection: () => Promise<void>;    // async — fetches AI narrative on demand
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

const initialState: AssessmentState = {
  stage: 'profile',
  hexacoAnswers: {},
  sdsAnswers: {},
  hexacoIndex: 0,
  sdsSection: 1,
  isComplete: false,
  scores: null,
  hollandCode: null,
  pathwayMatches: null,
  projection: null,
  generatingProjection: false,
  layer1: null,
  generatingLayer1: false,
  studentProfile: null,
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setStudentProfile = (profile: StudentProfile) => {
    setState((prev) => ({ ...prev, studentProfile: profile, stage: 'hexaco' }));
  };

  const setHexacoAnswer = (id: number, value: number) => {
    setState((prev) => ({
      ...prev,
      hexacoAnswers: { ...prev.hexacoAnswers, [id]: value },
    }));
  };

  const nextHexaco = () => {
    setState((prev) => ({
      ...prev,
      hexacoIndex: Math.min(prev.hexacoIndex + 1, hexacoQuestions.length - 1),
    }));
  };

  const prevHexaco = () => {
    setState((prev) => ({
      ...prev,
      hexacoIndex: Math.max(prev.hexacoIndex - 1, 0),
    }));
  };

  const toggleSds = (id: string) => {
    setState((prev) => {
      const next = { ...prev.sdsAnswers };
      if (next[id]) delete next[id];
      else next[id] = true;
      return { ...prev, sdsAnswers: next };
    });
  };

  const goToSdsSection = (section: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, sdsSection: section }));
  };

  const startHexaco = () => setState((p) => ({ ...p, stage: 'hexaco' }));
  const startSds = () => setState((p) => ({ ...p, stage: 'sds', sdsSection: 1 }));

  // Pure & instant: compute scores → match pathways → store. No AI here.
  // Caller redirects to /results immediately, then triggers AI from the page.
  const completeAssessment = () => {
    const { scores, hollandCode } = combineScores(state.hexacoAnswers, state.sdsAnswers);
    const matches = matchPathways(scores, pathways);
    const fallbackProjection = generateProjection(matches[0], scores);

    setState((prev) => ({
      ...prev,
      stage: 'submitting',
      isComplete: true,
      scores,
      hollandCode,
      pathwayMatches: matches,
      projection: fallbackProjection, // static template — shown only if AI fails
      generatingProjection: false,
    }));
  };

  // Called by /results after first paint. Safe to call multiple times — it
  // short-circuits if a non-fallback projection already exists or a request
  // is already in flight.
  const triggerProjection = async () => {
    const cur = state;
    if (cur.generatingProjection) return;
    if (!cur.scores || !cur.pathwayMatches || cur.pathwayMatches.length === 0) return;

    const topMatch = cur.pathwayMatches[0];

    setState((prev) => ({ ...prev, generatingProjection: true }));

    try {
      const projection = await api.generateProjection({
        scores: cur.scores,
        hollandCode: cur.hollandCode,
        pathway: {
          name: topMatch.pathway.name,
          careers: topMatch.pathway.careers,
          localIndustries: topMatch.pathway.localIndustries,
        },
        topTraits: topMatch.topTraits,
        studentProfile: cur.studentProfile ?? {
          name: '',
          province: '',
          familyBackground: '',
          aspiration: '',
        },
      });

      if (projection) {
        setState((prev) => ({ ...prev, projection, generatingProjection: false }));
      } else {
        // Keep fallback already in state. User sees something instead of nothing.
        setState((prev) => ({ ...prev, generatingProjection: false }));
      }
    } catch (err) {
      console.warn('AI projection error, using fallback:', err);
      setState((prev) => ({ ...prev, generatingProjection: false }));
    }
  };

  const resetAssessment = () => setState(initialState);

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        setStudentProfile,
        setHexacoAnswer,
        nextHexaco,
        prevHexaco,
        toggleSds,
        goToSdsSection,
        startHexaco,
        startSds,
        completeAssessment,
        triggerProjection,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
