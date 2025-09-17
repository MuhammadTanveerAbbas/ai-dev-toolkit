'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a Git commit message.
 *
 * - generateCommitMessage - A function that takes a git diff and returns a commit message.
 * - GenerateCommitMessageInput - The input type for the generateCommitMessage function.
 * - GenerateCommitMessageOutput - The return type for the generateCommitMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommitMessageInputSchema = z.object({
  diff: z.string().describe('The git diff of the changes to be committed.'),
});
export type GenerateCommitMessageInput = z.infer<typeof GenerateCommitMessageInputSchema>;

const GenerateCommitMessageOutputSchema = z.object({
  commitMessage: z.string().describe('The generated single-line commit message.'),
});
export type GenerateCommitMessageOutput = z.infer<typeof GenerateCommitMessageOutputSchema>;

export async function generateCommitMessage(input: GenerateCommitMessageInput): Promise<GenerateCommitMessageOutput> {
  return generateCommitMessageFlow(input);
}

const generateCommitMessagePrompt = ai.definePrompt({
  name: 'generateCommitMessagePrompt',
  input: {schema: GenerateCommitMessageInputSchema},
  output: {schema: GenerateCommitMessageOutputSchema},
  prompt: `You are an expert at writing clear and concise Git commit messages. Your task is to summarize the provided git diff into a single, clear commit message.

**Git Diff:**
\`\`\`diff
{{{diff}}}
\`\`\`

Generate a single-line commit message that describes the changes.

Respond in valid JSON format.
`,
});

const generateCommitMessageFlow = ai.defineFlow(
  {
    name: 'generateCommitMessageFlow',
    inputSchema: GenerateCommitMessageInputSchema,
    outputSchema: GenerateCommitMessageOutputSchema,
  },
  async input => {
    const {output} = await generateCommitMessagePrompt(input);
    return output!;
  }
);
