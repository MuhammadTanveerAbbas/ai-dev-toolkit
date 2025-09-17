'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating boilerplate project files.
 *
 * - generateBoilerplate - A function that takes project requirements and generates files.
 * - GenerateBoilerplateInput - The input type for the generateBoilerplate function.
 * - GenerateBoilerplateOutput - The return type for the generateBoilerplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBoilerplateInputSchema = z.object({
  stack: z.string().describe('The primary technology stack (e.g., "Next.js with Tailwind CSS").'),
  options: z.array(z.string()).optional().describe('Additional options like "Include API route", "Add README.md".'),
});
export type GenerateBoilerplateInput = z.infer<typeof GenerateBoilerplateInputSchema>;

const FileSchema = z.object({
  path: z.string().describe('The full path of the file.'),
  content: z.string().describe('The content of the file.'),
});

const GenerateBoilerplateOutputSchema = z.object({
  files: z.array(FileSchema).describe('A list of generated files with their paths and content.'),
});
export type GenerateBoilerplateOutput = z.infer<typeof GenerateBoilerplateOutputSchema>;

export async function generateBoilerplate(input: GenerateBoilerplateInput): Promise<GenerateBoilerplateOutput> {
  return generateBoilerplateFlow(input);
}

const generateBoilerplatePrompt = ai.definePrompt({
  name: 'generateBoilerplatePrompt',
  input: {schema: GenerateBoilerplateInputSchema},
  output: {schema: GenerateBoilerplateOutputSchema},
  prompt: `You are an expert project scaffolding tool. Your task is to generate a complete set of boilerplate files for a new software project based on the user's requested stack and options.

**Stack**: {{{stack}}}
{{#if options}}
**Options**:
{{#each options}}
- {{{this}}}
{{/each}}
{{/if}}

Generate all the necessary files, including configuration files (e.g., package.json, tsconfig.json), entry points (e.g., src/index.ts, src/app/page.tsx), and basic directory structures. The generated code should be modern, follow best practices, and be ready for a developer to start building on.

Respond in valid JSON format with a list of file objects, each containing a 'path' and 'content'.
`,
});

const generateBoilerplateFlow = ai.defineFlow(
  {
    name: 'generateBoilerplateFlow',
    inputSchema: GenerateBoilerplateInputSchema,
    outputSchema: GenerateBoilerplateOutputSchema,
  },
  async input => {
    const {output} = await generateBoilerplatePrompt(input);
    return output!;
  }
);
