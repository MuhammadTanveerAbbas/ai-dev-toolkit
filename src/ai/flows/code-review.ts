'use server';
/**
 * @fileOverview This file defines a Genkit flow for a lightweight code review assistant.
 *
 * - reviewCode - A function that takes a code diff and a review focus, returning a list of issues.
 * - ReviewCodeInput - The input type for the reviewCode function.
 * - ReviewCodeOutput - The return type for the reviewCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewCodeInputSchema = z.object({
  diff: z.string().describe('The code diff or files to be reviewed.'),
  focus: z.enum(['security', 'performance', 'readability', 'best-practices']).describe('The area of focus for the review.'),
});
export type ReviewCodeInput = z.infer<typeof ReviewCodeInputSchema>;

const IssueSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the issue.'),
  description: z.string().describe('A detailed description of the issue found.'),
  suggestion: z.string().describe('The suggested code change to fix the issue.'),
});

const ReviewCodeOutputSchema = z.object({
  issues: z.array(IssueSchema).describe('A prioritized list of issues and code suggestions.'),
});
export type ReviewCodeOutput = z.infer<typeof ReviewCodeOutputSchema>;

export async function reviewCode(input: ReviewCodeInput): Promise<ReviewCodeOutput> {
  return reviewCodeFlow(input);
}

const reviewCodePrompt = ai.definePrompt({
  name: 'reviewCodePrompt',
  input: {schema: ReviewCodeInputSchema},
  output: {schema: ReviewCodeOutputSchema},
  prompt: `You are an expert code review assistant. Your task is to provide a targeted review of the provided code diff, focusing specifically on **{{{focus}}}**.

Analyze the following code changes and identify relevant issues. For each issue, provide a priority, a clear description, and a specific code suggestion for how to fix it.

**Code Diff to Review:**
\`\`\`diff
{{{diff}}}
\`\`\`

Focus your entire review on **{{{focus}}}**.

Respond in valid JSON format.
`,
});

const reviewCodeFlow = ai.defineFlow(
  {
    name: 'reviewCodeFlow',
    inputSchema: ReviewCodeInputSchema,
    outputSchema: ReviewCodeOutputSchema,
  },
  async input => {
    const {output} = await reviewCodePrompt(input);
    return output!;
  }
);
