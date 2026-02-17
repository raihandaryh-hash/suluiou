
# AI-Powered Parallel Self Projection

## Overview
Replace the current template-based projection system with dynamic AI-generated narratives. Instead of selecting from 2 hardcoded templates per pathway, the app will call an edge function that uses Lovable AI (Gemini) to generate a unique, personalized "Dirimu di Tahun 2030" narrative based on each student's specific HEXACO and RIASEC scores.

## How It Works Today
- `generateProjection()` in `src/lib/scoring.ts` picks 1 of 2 static templates per pathway based on the dominant HEXACO trait
- Every student with the same top pathway and dominant trait group gets the identical narrative

## What Changes

### 1. New Edge Function: `generate-projection`
- Receives: scores (HEXACO + RIASEC), top pathway info (name, careers, local industries), and top 3 trait labels
- Sends a carefully crafted Indonesian-language system prompt to Lovable AI (`google/gemini-3-flash-preview`) instructing it to write a vivid, second-person, 2030 narrative paragraph
- Returns the generated projection text
- Non-streaming (single response) since output is short (~150 words)
- Handles 429/402 rate limit errors gracefully

### 2. Update `supabase/config.toml`
- Register the new function with `verify_jwt = false` (public, same as assessment submission)

### 3. Update `AssessmentContext.tsx`
- Make `completeAssessment()` async
- After calculating scores and matches, call the edge function to get the AI projection
- Add a `generatingProjection` loading state
- Fall back to the existing template-based `generateProjection()` if the AI call fails

### 4. Update `Results.tsx`
- Show a loading skeleton/spinner for the projection section while AI generates
- Display the AI-generated text once ready

### 5. Update `AdminResultView.tsx`
- No changes needed -- it already reads projection from the database

## Technical Details

**Edge Function prompt strategy:**
```
You are a career narrative writer for Indonesian high school students.
Write a vivid, inspiring 2nd-person narrative set in 2030.
The student's profile: [scores + pathway details]
Write in Bahasa Indonesia, ~100-150 words, one paragraph.
Make it specific to their personality traits and chosen pathway.
```

**Fallback:** If the AI call fails (network error, rate limit), the app silently falls back to the existing template system so the user always sees a result.

**Files to create:**
- `supabase/functions/generate-projection/index.ts`

**Files to modify:**
- `supabase/config.toml` -- add function entry
- `src/context/AssessmentContext.tsx` -- async completion with AI call + loading state
- `src/pages/Results.tsx` -- loading indicator for projection section
