'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating regular expressions.
 *
 * - generateRegex - A function that takes a description and returns a regex pattern and explanation.
 * - GenerateRegexInput - The input type for the generateRegex function.
 * - GenerateRegexOutput - The return type for the generateRegex function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRegexInputSchema = z.object({
  description: z.string().describe('A plain-English description of the pattern to match.'),
});
export type GenerateRegexInput = z.infer<typeof GenerateRegexInputSchema>;

const GenerateRegexOutputSchema = z.object({
  regex: z.string().describe('The generated regular expression pattern (without slashes).'),
  explanation: z.string().describe('A breakdown of how the regular expression works.'),
});
export type GenerateRegexOutput = z.infer<typeof GenerateRegexOutputSchema>;

export async function generateRegex(input: GenerateRegexInput): Promise<GenerateRegexOutput> {
  return generateRegexFlow(input);
}

const generateRegexPrompt = ai.definePrompt({
  name: 'generateRegexPrompt',
  input: {schema: GenerateRegexInputSchema},
  output: {schema: GenerateRegexOutputSchema},
  prompt: `You are a regular expression expert. Your task is to create a regex pattern based on a user's plain-English description.

**Description**: "{{{description}}}"

Generate the regex pattern. Do not include the leading and trailing slashes. Also provide a step-by-step explanation of how the pattern works to match the described text.

Respond in valid JSON format.
`,
});

const generateRegexFlow = ai.defineFlow(
  {
    name: 'generateRegexFlow',
    inputSchema: GenerateRegexInputSchema,
    outputSchema: GenerateRegexOutputSchema,
  },
  async input => {
    const {output} = await generateRegexPrompt(input);
    return output!;
  }
);
