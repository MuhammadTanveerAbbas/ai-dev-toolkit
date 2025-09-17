'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating unit tests.
 *
 * - generateUnitTests - A function that takes code and a framework choice, returning test code.
 * - GenerateUnitTestsInput - The input type for the generateUnitTests function.
 * - GenerateUnitTestsOutput - The return type for the generateUnitTests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUnitTestsInputSchema = z.object({
  code: z.string().describe('The function or small code file to write unit tests for.'),
  framework: z.enum(['jest', 'vitest']).describe('The testing framework to use.'),
});
export type GenerateUnitTestsInput = z.infer<typeof GenerateUnitTestsInputSchema>;

const GenerateUnitTestsOutputSchema = z.object({
  testCode: z.string().describe('The generated unit test code.'),
});
export type GenerateUnitTestsOutput = z.infer<typeof GenerateUnitTestsOutputSchema>;

export async function generateUnitTests(input: GenerateUnitTestsInput): Promise<GenerateUnitTestsOutput> {
  return generateUnitTestsFlow(input);
}

const generateUnitTestsPrompt = ai.definePrompt({
  name: 'generateUnitTestsPrompt',
  input: {schema: GenerateUnitTestsInputSchema},
  output: {schema: GenerateUnitTestsOutputSchema},
  prompt: `You are an expert software engineer specializing in Test-Driven Development. Your task is to write a comprehensive suite of unit tests for the provided code snippet using the **{{{framework}}}** framework.

**Code to Test:**
\`\`\`
{{{code}}}
\`\`\`

Generate a complete test file. The tests should cover:
- Happy path scenarios with valid inputs.
- Edge cases and boundary conditions (e.g., null, undefined, empty values).
- Error handling and how the code behaves with invalid inputs.
- Mocks for any external dependencies or imports.

Ensure the tests are clear, well-structured, and follow modern best practices for the chosen framework. The generated code should be ready to run.

Respond in valid JSON format.
`,
});

const generateUnitTestsFlow = ai.defineFlow(
  {
    name: 'generateUnitTestsFlow',
    inputSchema: GenerateUnitTestsInputSchema,
    outputSchema: GenerateUnitTestsOutputSchema,
  },
  async input => {
    const {output} = await generateUnitTestsPrompt(input);
    return output!;
  }
);
