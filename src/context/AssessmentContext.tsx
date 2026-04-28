import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { DimensionScores, computeTopTraits } from '@/lib/scoring';
import { combineScores } from '@/lib/scoringNew';
import { hexacoQuestions } from '@/data/hexacoQuestions';
import { sdsQuestions } from '@/data/sdsQuestions';
import { getPathwayName } from '@/data/pathways';
import { api } from '@/services/api';

import { getStudentSession } from '@/lib/classSession';
import {
  fetchProgress,
  rowToSnapshot,
  saveProgress,
  markProgressCompleted,
} from '@/lib/progress';

export interface StudentProfile {
  // Identitas (auto dari Google / guest, tetap disimpan agar AI/PDF konsisten).
  name: string;
  // Field Step 0 baru (Kloter 9):
  province: string;
  familyBackground: string;
  learningStyle: string;
  careerCertainty: string;
  contributionGoal: string;
  educationPlan: string;
  aspiration: string;
}

/** True jika 6 field wajib Step 0 sudah terisi. Aspirasi opsional. */
export function isProfileComplete(p: StudentProfile | null | undefined): boolean {
  if (!p) return false;
  return Boolean(
    p.province &&
      p.familyBackground &&
      p.learningStyle &&
      p.careerCertainty &&
      p.contributionGoal &&
      p.educationPlan,
  );
}

export type AssessmentStage = 'profile' | 'hexaco' | 'hexaco-done' | 'sds' | 'submitting';

interface AssessmentState {
  stage: AssessmentStage;
  hexacoAnswers: Record<number, number>;
  sdsAnswers: Record<string, boolean>;
  hexacoIndex: number;
  sdsSection: 1 | 2 | 3;
  isComplete: boolean;
  scores: DimensionScores | null;
  hollandCode: string | null;
  sdsCounts: { R: number; I: number; A: number; S: number; E: number; C: number } | null;
  topTraits: string[];
  /** Programs the student picked in Layer 2 (1–2 ids). */
  selectedPathways: string[];
  projection: string | null;
  generatingProjection: boolean;
  layer1: string | null;
  generatingLayer1: boolean;
  studentProfile: StudentProfile | null;
  consentGiven: boolean;
  hydrating: boolean;
}

interface AssessmentContextType extends AssessmentState {
  setStudentProfile: (p: StudentProfile) => void;
  setConsent: (given: boolean) => void;
  setHexacoAnswer: (id: number, value: number) => void;
  nextHexaco: () => void;
  prevHexaco: () => void;
  jumpToHexaco: (index: number) => void;
  finishHexaco: () => void;
  toggleSds: (id: string) => void;
  goToSdsSection: (section: 1 | 2 | 3) => void;
  startHexaco: () => void;
  startSds: () => void;
  completeAssessment: () => void;
  togglePathway: (id: string) => void;
  triggerLayer1: () => Promise<void>;
  triggerProjection: () => Promise<void>;
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
  sdsCounts: null,
  topTraits: [],
  selectedPathways: [],
  projection: null,
  generatingProjection: false,
  layer1: null,
  generatingLayer1: false,
  studentProfile: null,
  consentGiven: false,
  hydrating: true,
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const session = getStudentSession();
      if (!session) {
        setState((p) => ({ ...p, hydrating: false }));
        hydratedRef.current = true;
        return;
      }
      try {
        const row = await fetchProgress(session);
        if (!active) return;
        if (row) {
          const snap = rowToSnapshot(row);
          setState((p) => ({
            ...p,
            studentProfile: snap.studentProfile,
            hexacoAnswers: snap.hexacoAnswers,
            sdsAnswers: snap.sdsAnswers,
            stage: snap.stage,
            hexacoIndex: snap.hexacoIndex,
            sdsSection: snap.sdsSection,
            consentGiven: snap.consentGiven,
            hydrating: false,
          }));
        } else {
          setState((p) => ({ ...p, hydrating: false }));
        }
      } catch (err) {
        console.warn('hydrate progress failed:', err);
        if (active) setState((p) => ({ ...p, hydrating: false }));
      } finally {
        hydratedRef.current = true;
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (state.isComplete) return;
    const session = getStudentSession();
    if (!session) return;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      void saveProgress(session, {
        studentProfile: state.studentProfile,
        hexacoAnswers: state.hexacoAnswers,
        sdsAnswers: state.sdsAnswers,
        stage: state.stage,
        hexacoIndex: state.hexacoIndex,
        sdsSection: state.sdsSection,
        consentGiven: state.consentGiven,
      });
    }, 600);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [
    state.studentProfile,
    state.hexacoAnswers,
    state.sdsAnswers,
    state.stage,
    state.hexacoIndex,
    state.sdsSection,
    state.consentGiven,
    state.isComplete,
  ]);

  const setStudentProfile = (profile: StudentProfile) => {
    setState((prev) => ({ ...prev, studentProfile: profile }));
  };

  const setConsent = (given: boolean) => {
    setState((prev) => ({ ...prev, consentGiven: given }));
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

  const jumpToHexaco = (index: number) => {
    setState((prev) => ({
      ...prev,
      hexacoIndex: Math.max(0, Math.min(index, hexacoQuestions.length - 1)),
    }));
  };

  const finishHexaco = () => setState((p) => ({ ...p, stage: 'hexaco-done' }));

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

  // Compute scores only. No pathway matching — Layer 2 is now student-driven.
  const completeAssessment = () => {
    const { scores, hollandCode, sdsCounts } = combineScores(state.hexacoAnswers, state.sdsAnswers);
    const topTraits = computeTopTraits(scores);

    setState((prev) => ({
      ...prev,
      stage: 'submitting',
      isComplete: true,
      scores,
      hollandCode,
      sdsCounts,
      topTraits,
      projection: null,
      generatingProjection: false,
    }));

    const session = getStudentSession();
    if (session) void markProgressCompleted(session);
  };

  // Toggle a program selection. Cap at 2 picks.
  const togglePathway = (id: string) => {
    setState((prev) => {
      const has = prev.selectedPathways.includes(id);
      if (has) {
        return { ...prev, selectedPathways: prev.selectedPathways.filter((x) => x !== id) };
      }
      if (prev.selectedPathways.length >= 2) return prev; // cap
      return { ...prev, selectedPathways: [...prev.selectedPathways, id] };
    });
  };

  const triggerProjection = async () => {
    const cur = state;
    if (cur.generatingProjection) return;
    if (!cur.scores) return;

    setState((prev) => ({ ...prev, generatingProjection: true }));

    try {
      const hexaco = {
        H: cur.scores.honesty, E: cur.scores.emotionality, X: cur.scores.extraversion,
        A: cur.scores.agreeableness, C: cur.scores.conscientiousness, O: cur.scores.openness,
      };
      const { interpretHEXACO, interpretHolland, detectTension } = await import('@/lib/narrativePrep');
      const hexacoEntries = (Object.entries(hexaco) as Array<[keyof typeof hexaco, number]>);
      const sortedHEXACO = [...hexacoEntries].sort((a, b) => b[1] - a[1]);
      const topTwoHEXACO = sortedHEXACO.slice(0, 2).map(([dim, score]) => ({
        dim,
        interpretation: interpretHEXACO(dim, score),
      }));
      const hollandNarrative = cur.hollandCode ? interpretHolland(cur.hollandCode) : '';
      const tensionPair = detectTension(hexaco);

      const projection = await api.generateProjection({
        scores: cur.scores,
        hollandCode: cur.hollandCode,
        hollandNarrative,
        topTwoHEXACO,
        tensionPair,
        topTraits: cur.topTraits,
        selectedPathways: cur.selectedPathways,
        selectedPathwayNames: cur.selectedPathways.map(getPathwayName),
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
        setState((prev) => ({ ...prev, generatingProjection: false }));
      }
    } catch (err) {
      console.warn('AI projection error:', err);
      setState((prev) => ({ ...prev, generatingProjection: false }));
    }
  };

  const triggerLayer1 = async () => {
    const cur = state;
    if (cur.generatingLayer1 || cur.layer1) return;
    if (!cur.scores) return;

    setState((prev) => ({ ...prev, generatingLayer1: true }));

    try {
      const hexaco = {
        H: cur.scores.honesty, E: cur.scores.emotionality, X: cur.scores.extraversion,
        A: cur.scores.agreeableness, C: cur.scores.conscientiousness, O: cur.scores.openness,
      };
      const riasec = {
        R: cur.scores.realistic, I: cur.scores.investigative, A: cur.scores.artistic,
        S: cur.scores.social, E: cur.scores.enterprising, C: cur.scores.conventional,
      };
      const { buildHEXACOInterpretations, interpretHolland, detectTension } = await import('@/lib/narrativePrep');
      const hexacoInterpretations = buildHEXACOInterpretations(hexaco);
      const hollandNarrative = cur.hollandCode ? interpretHolland(cur.hollandCode) : '';
      const tensionPair = detectTension(hexaco);

      const layer1 = await api.generateLayer1({
        hexaco,
        riasec,
        hollandCode: cur.hollandCode,
        hollandNarrative,
        hexacoInterpretations,
        tensionPair,
        profile: {
          province: cur.studentProfile?.province,
          familyBackground: cur.studentProfile?.familyBackground,
          learningStyle: cur.studentProfile?.learningStyle,
          careerCertainty: cur.studentProfile?.careerCertainty,
          contributionGoal: cur.studentProfile?.contributionGoal,
          aspiration: cur.studentProfile?.aspiration,
        },
      });
      setState((prev) => ({ ...prev, layer1: layer1 ?? null, generatingLayer1: false }));
    } catch (err) {
      console.warn('AI layer1 error:', err);
      setState((prev) => ({ ...prev, generatingLayer1: false }));
    }
  };

  const resetAssessment = () => {
    hydratedRef.current = true;
    setState({ ...initialState, hydrating: false });
  };

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        setStudentProfile,
        setConsent,
        setHexacoAnswer,
        nextHexaco,
        prevHexaco,
        jumpToHexaco,
        finishHexaco,
        toggleSds,
        goToSdsSection,
        startHexaco,
        startSds,
        completeAssessment,
        togglePathway,
        triggerLayer1,
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
