'use server';
/**
 * @fileOverview This file defines a Genkit flow for optimizing AI prompts.
 *
 * - optimizePrompt - A function that takes a rough prompt and returns optimized versions.
 * - OptimizePromptInput - The input type for the optimizePrompt function.
 * - OptimizePromptOutput - The return type for the optimizePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizePromptInputSchema = z.object({
  prompt: z.string().describe('The user-provided rough prompt to be optimized.'),
});
export type OptimizePromptInput = z.infer<typeof OptimizePromptInputSchema>;

const PromptVariantSchema = z.object({
  title: z.string().describe('A short title for the prompt variant (e.g., "Chain-of-Thought Version").'),
  prompt: z.string().describe('The optimized prompt text.'),
  tips: z.string().describe('Usage tips for this specific prompt variant.'),
});

const OptimizePromptOutputSchema = z.object({
  optimizedPrompt: z.string().describe('The primary optimized version of the prompt.'),
  variants: z.array(PromptVariantSchema).describe('A list of alternative prompt variants with different strategies.'),
});
export type OptimizePromptOutput = z.infer<typeof OptimizePromptOutputSchema>;

export async function optimizePrompt(input: OptimizePromptInput): Promise<OptimizePromptOutput> {
  return optimizePromptFlow(input);
}

const optimizePromptPrompt = ai.definePrompt({
  name: 'optimizePromptPrompt',
  input: {schema: OptimizePromptInputSchema},
  output: {schema: OptimizePromptOutputSchema},
  prompt: `You are an expert in prompt engineering. Your task is to take a user's rough prompt and rewrite it to be more effective for a large language model. You should also provide several alternative variants using different prompting strategies.

**User's Rough Prompt:**
"{{{prompt}}}"

First, create a primary, optimized version of the prompt that is clear, specific, and provides good context.

Then, create at least two alternative variants. Examples of strategies include:
- **Chain-of-Thought**: Instruct the model to think step-by-step.
- **Role-Playing**: Assign a specific persona to the model (e.g., "You are a world-class marketer...").
- **Zero-Shot CoT**: Add "Let's think step by step" to the end.
- **Structured Output**: Request the output in a specific format like JSON or Markdown.

For each variant, provide a title, the prompt text, and a brief tip on when to use it.

Respond in valid JSON format.
`,
});

const optimizePromptFlow = ai.defineFlow(
  {
    name: 'optimizePromptFlow',
    inputSchema: OptimizePromptInputSchema,
    outputSchema: OptimizePromptOutputSchema,
  },
  async input => {
    const {output} = await optimizePromptPrompt(input);
    return output!;
  }
);
