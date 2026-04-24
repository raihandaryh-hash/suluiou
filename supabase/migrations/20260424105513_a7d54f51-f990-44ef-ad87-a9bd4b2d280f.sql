-- Allow anonymous (post-assessment) clients to fill in the AI-generated
-- layer1_text exactly once, after the row has already been inserted.
-- The USING clause restricts updates to rows where layer1_text is still NULL,
-- so a row's narrative cannot be overwritten or tampered with afterwards.
CREATE POLICY "Anyone can fill empty layer1_text"
ON public.assessment_results
FOR UPDATE
TO anon, authenticated
USING (layer1_text IS NULL)
WITH CHECK (true);