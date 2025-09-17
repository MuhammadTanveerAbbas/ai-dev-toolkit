'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating code fixes from errors.
 *
 * - fixCode - A function that takes an error and code snippet and returns a patch.
 * - FixCodeInput - The input type for the fixCode function.
 * - FixCodeOutput - The return type for the fixCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FixCodeInputSchema = z.object({
  error: z.string().describe('The error message or stack trace.'),
  code: z.string().describe('The code snippet that is causing the error.'),
});
export type FixCodeInput = z.infer<typeof FixCodeInputSchema>;

const FixCodeOutputSchema = z.object({
  patch: z.string().describe('The minimal patch or diff of the lines to change to fix the code. Use a standard diff format.'),
  explanation: z.string().describe('A brief explanation of the fix.'),
});
export type FixCodeOutput = z.infer<typeof FixCodeOutputSchema>;

export async function fixCode(input: FixCodeInput): Promise<FixCodeOutput> {
  return fixCodeFlow(input);
}

const fixCodePrompt = ai.definePrompt({
  name: 'fixCodePrompt',
  input: {schema: FixCodeInputSchema},
  output: {schema: FixCodeOutputSchema},
  prompt: `You are an expert software developer who excels at debugging. Your task is to analyze an error message and a related code snippet, and then provide a minimal patch to fix the issue.

**Error Message:**
\`\`\`
{{{error}}}
\`\`\`

**Code Snippet:**
\`\`\`
{{{code}}}
\`\`\`

Based on the error, provide a patch in a standard diff format that corrects the code. Also, provide a brief explanation of what caused the error and how the patch fixes it. The explanation should be concise and easy to understand for a developer.

Respond in valid JSON format.
`,
});

const fixCodeFlow = ai.defineFlow(
  {
    name: 'fixCodeFlow',
    inputSchema: FixCodeInputSchema,
    outputSchema: FixCodeOutputSchema,
  },
  async input => {
    const {output} = await fixCodePrompt(input);
    return output!;
  }
);
