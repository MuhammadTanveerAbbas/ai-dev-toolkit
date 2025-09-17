'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating documentation from an API schema.
 *
 * - generateSchemaDocs - A function that takes a schema and returns documentation.
 * - GenerateSchemaDocsInput - The input type for the generateSchemaDocs function.
 * - GenerateSchemaDocsOutput - The return type for the generateSchemaDocs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSchemaDocsInputSchema = z.object({
  schema: z.string().describe('The OpenAPI or GraphQL schema content (JSON or YAML).'),
  format: z.enum(['openapi', 'graphql']).describe('The format of the provided schema.'),
});
export type GenerateSchemaDocsInput = z.infer<typeof GenerateSchemaDocsInputSchema>;

const ExampleSchema = z.object({
    language: z.string().describe('The language of the example snippet (e.g., "cURL", "JavaScript").'),
    snippet: z.string().describe('The example request code snippet.'),
});

const GenerateSchemaDocsOutputSchema = z.object({
  documentation: z.string().describe('The human-readable documentation in Markdown format.'),
  examples: z.array(ExampleSchema).describe('A list of example requests for the API.'),
});
export type GenerateSchemaDocsOutput = z.infer<typeof GenerateSchemaDocsOutputSchema>;

export async function generateSchemaDocs(input: GenerateSchemaDocsInput): Promise<GenerateSchemaDocsOutput> {
  return generateSchemaDocsFlow(input);
}

const generateSchemaDocsPrompt = ai.definePrompt({
  name: 'generateSchemaDocsPrompt',
  input: {schema: GenerateSchemaDocsInputSchema},
  output: {schema: GenerateSchemaDocsOutputSchema},
  prompt: `You are an expert technical writer specializing in API documentation. Your task is to convert a raw API schema into human-readable documentation with clear examples.

**Schema Format:** {{{format}}}

**Schema Content:**
\`\`\`
{{{schema}}}
\`\`\`

Analyze the schema and generate the following:
1.  **Human-Readable Documentation**: A clear, well-structured guide in Markdown that explains the available endpoints, types, queries, or mutations.
2.  **Example Requests**: Provide at least two practical example requests, such as a 'cURL' command and a 'JavaScript' (fetch) snippet.

Respond in valid JSON format.
`,
});

const generateSchemaDocsFlow = ai.defineFlow(
  {
    name: 'generateSchemaDocsFlow',
    inputSchema: GenerateSchemaDocsInputSchema,
    outputSchema: GenerateSchemaDocsOutputSchema,
  },
  async input => {
    const {output} = await generateSchemaDocsPrompt(input);
    return output!;
  }
);
