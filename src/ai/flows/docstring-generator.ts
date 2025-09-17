'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating docstrings and comments for code.
 *
 * - generateDocstrings - A function that takes a code file and returns the annotated code.
 * - GenerateDocstringsInput - The input type for the generateDocstrings function.
 * - GenerateDocstringsOutput - The return type for the generateDocstrings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocstringsInputSchema = z.object({
  code: z.string().describe('The content of the code file to be documented.'),
  language: z.string().describe('The programming language of the code (e.g., "python", "typescript").'),
});
export type GenerateDocstringsInput = z.infer<typeof GenerateDocstringsInputSchema>;

const GenerateDocstringsOutputSchema = z.object({
  annotatedCode: z.string().describe('The original code with inserted docstrings and comments.'),
});
export type GenerateDocstringsOutput = z.infer<typeof GenerateDocstringsOutputSchema>;

export async function generateDocstrings(input: GenerateDocstringsInput): Promise<GenerateDocstringsOutput> {
  return generateDocstringsFlow(input);
}

const generateDocstringsPrompt = ai.definePrompt({
  name: 'generateDocstringsPrompt',
  input: {schema: GenerateDocstringsInputSchema},
  output: {schema: GenerateDocstringsOutputSchema},
  prompt: `You are an expert technical writer who specializes in annotating code. Your task is to add clear, concise docstrings and inline comments to the provided code file to improve its readability and maintainability.

The code is written in **{{{language}}}**.

Analyze the code and insert documentation where appropriate. For functions and classes, add docstrings that explain their purpose, parameters (including types), and return values. Add inline comments to clarify complex or non-obvious logic.

Return the complete file content with the new docstrings and comments inserted. Do not change any of the existing code.

**Code to Document:**
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Respond in valid JSON format.
`,
});

const generateDocstringsFlow = ai.defineFlow(
  {
    name: 'generateDocstringsFlow',
    inputSchema: GenerateDocstringsInputSchema,
    outputSchema: GenerateDocstringsOutputSchema,
  },
  async input => {
    const {output} = await generateDocstringsPrompt(input);
    return output!;
  }
);
