'use server';
/**
 * @fileOverview This file defines a Genkit flow for explaining error logs and suggesting fixes.
 *
 * - explainErrorLog - A function that takes an error log and returns an explanation and fix.
 * - ExplainErrorLogInput - The input type for the explainErrorLog function.
 * - ExplainErrorLogOutput - The return type for the explainErrorLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainErrorLogInputSchema = z.object({
  log: z.string().describe('The full error log or stack trace.'),
  runtime: z.string().optional().describe('The runtime environment (e.g., "Node.js", "Python").'),
});
export type ExplainErrorLogInput = z.infer<typeof ExplainErrorLogInputSchema>;

const ExplainErrorLogOutputSchema = z.object({
  explanation: z.string().describe('A clear explanation of what the error means.'),
  stepsToFix: z.array(z.string()).describe('A step-by-step guide on how to fix the error.'),
});
export type ExplainErrorLogOutput = z.infer<typeof ExplainErrorLogOutputSchema>;

export async function explainErrorLog(input: ExplainErrorLogInput): Promise<ExplainErrorLogOutput> {
  return explainErrorLogFlow(input);
}

const explainErrorLogPrompt = ai.definePrompt({
  name: 'explainErrorLogPrompt',
  input: {schema: ExplainErrorLogInputSchema},
  output: {schema: ExplainErrorLogOutputSchema},
  prompt: `You are an expert software diagnostician. Your task is to analyze the following error log, explain what it means in simple terms, and provide a step-by-step guide to fix it.
{{#if runtime}}
The runtime environment is **{{{runtime}}}**.
{{/if}}

**Error Log:**
\`\`\`
{{{log}}}
\`\`\`

Provide a clear, concise explanation of the root cause of this error. Then, provide a list of actionable steps to resolve the issue.

Respond in valid JSON format.
`,
});

const explainErrorLogFlow = ai.defineFlow(
  {
    name: 'explainErrorLogFlow',
    inputSchema: ExplainErrorLogInputSchema,
    outputSchema: ExplainErrorLogOutputSchema,
  },
  async input => {
    const {output} = await explainErrorLogPrompt(input);
    return output!;
  }
);
