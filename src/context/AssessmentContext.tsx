import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
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
import { buildTopHexacoTraits } from '@/lib/hexacoTraits';
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
  consentGiven: boolean;
  hydrating: boolean;
}

interface AssessmentContextType extends AssessmentState {
  // Profile
  setStudentProfile: (p: StudentProfile) => void;
  setConsent: (given: boolean) => void;
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
  consentGiven: false,
  hydrating: true,
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  // 1) Hydrate from DB on mount if there is a student session.
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
    return () => {
      active = false;
    };
  }, []);

  // 2) Auto-save (debounced) any time answers/stage change after hydration.
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

  // Save profile only. Routing decisions belong to the router (see /profile → /consent).
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

    // Mark progress as completed so future logins skip resume.
    const session = getStudentSession();
    if (session) {
      void markProgressCompleted(session);
    }
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

  const triggerLayer1 = async () => {
    const cur = state;
    if (cur.generatingLayer1 || cur.layer1) return;
    if (!cur.scores) return;

    setState((prev) => ({ ...prev, generatingLayer1: true }));

    try {
      const hexaco = {
        H: cur.scores.honesty,
        E: cur.scores.emotionality,
        X: cur.scores.extraversion,
        A: cur.scores.agreeableness,
        C: cur.scores.conscientiousness,
        O: cur.scores.openness,
      };
      const riasec = {
        R: cur.scores.realistic,
        I: cur.scores.investigative,
        A: cur.scores.artistic,
        S: cur.scores.social,
        E: cur.scores.enterprising,
        C: cur.scores.conventional,
      };
      const layer1 = await api.generateLayer1({
        hexaco,
        riasec,
        hollandCode: cur.hollandCode,
        topHexacoTraits: buildTopHexacoTraits(hexaco as unknown as Record<string, number>),
        profile: {
          aspiration: cur.studentProfile?.aspiration,
          // learningStyle / careerCertainty / contributionGoal not yet collected
        },
      });
      setState((prev) => ({ ...prev, layer1: layer1 ?? null, generatingLayer1: false }));
    } catch (err) {
      console.warn('AI layer1 error, using fallback:', err);
      setState((prev) => ({ ...prev, generatingLayer1: false }));
    }
  };

  const resetAssessment = () => {
    hydratedRef.current = true; // prevent re-hydration overwriting reset
    setState({ ...initialState, hydrating: false });
  };

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
