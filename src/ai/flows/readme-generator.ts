'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a README.md file.
 *
 * - generateReadme - A function that takes project details and returns Markdown content.
 * - GenerateReadmeInput - The input type for the generateReadme function.
 * - GenerateReadmeOutput - The return type for the generateReadme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadmeInputSchema = z.object({
  name: z.string().describe('The name of the project.'),
  purpose: z.string().describe('A brief description of the project\'s purpose.'),
  install: z.string().optional().describe('Installation instructions.'),
  usage: z.string().optional().describe('Usage instructions or examples.'),
  packageJson: z.string().optional().describe('The content of the package.json file, if available.'),
});
export type GenerateReadmeInput = z.infer<typeof GenerateReadmeInputSchema>;

const GenerateReadmeOutputSchema = z.object({
  markdown: z.string().describe('The generated README content in Markdown format.'),
});
export type GenerateReadmeOutput = z.infer<typeof GenerateReadmeOutputSchema>;

export async function generateReadme(input: GenerateReadmeInput): Promise<GenerateReadmeOutput> {
  return generateReadmeFlow(input);
}

const generateReadmePrompt = ai.definePrompt({
  name: 'generateReadmePrompt',
  input: {schema: GenerateReadmeInputSchema},
  output: {schema: GenerateReadmeOutputSchema},
  prompt: `You are an expert at creating high-quality README.md files for software projects. Your task is to generate a comprehensive and well-structured README based on the provided project details.

**Project Name:** {{{name}}}
**Purpose:** {{{purpose}}}
{{#if install}}
**Installation:** {{{install}}}
{{/if}}
{{#if usage}}
**Usage:** {{{usage}}}
{{/if}}
{{#if packageJson}}
**package.json content:**
\`\`\`json
{{{packageJson}}}
\`\`\`
Use the package.json to infer dependencies and scripts if installation/usage instructions are not provided.
{{/if}}

Create a README.md in Markdown format. The file should be well-organized with clear headings (e.g., ## Installation, ## Usage, ## Features). Include a project title, a brief introduction, and any other relevant sections based on the input.

Respond in valid JSON format.
`,
});

const generateReadmeFlow = ai.defineFlow(
  {
    name: 'generateReadmeFlow',
    inputSchema: GenerateReadmeInputSchema,
    outputSchema: GenerateReadmeOutputSchema,
  },
  async input => {
    const {output} = await generateReadmePrompt(input);
    return output!;
  }
);
