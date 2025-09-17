'use server';
/**
 * @fileOverview This file defines a Genkit flow for building an SQL query from natural language.
 *
 * - buildSqlQuery - A function that takes a natural language query and schema, returning a SQL query.
 * - BuildSqlQueryInput - The input type for the buildSqlQuery function.
 * - BuildSqlQueryOutput - The return type for the buildSqlQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildSqlQueryInputSchema = z.object({
  query: z.string().describe('The natural language description of the data to retrieve.'),
  schema: z.string().describe('The database schema (e.g., CREATE TABLE statements).'),
});
export type BuildSqlQueryInput = z.infer<typeof BuildSqlQueryInputSchema>;

const BuildSqlQueryOutputSchema = z.object({
  sqlQuery: z.string().describe('The generated SQL query.'),
  assumptions: z.string().describe('An explanation of any assumptions made while translating the query.'),
});
export type BuildSqlQueryOutput = z.infer<typeof BuildSqlQueryOutputSchema>;

export async function buildSqlQuery(input: BuildSqlQueryInput): Promise<BuildSqlQueryOutput> {
  return buildSqlQueryFlow(input);
}

const buildSqlQueryPrompt = ai.definePrompt({
  name: 'buildSqlQueryPrompt',
  input: {schema: BuildSqlQueryInputSchema},
  output: {schema: BuildSqlQueryOutputSchema},
  prompt: `You are an expert SQL developer. Your task is to convert a natural language query into a SQL query, given a database schema.

**Database Schema:**
\`\`\`sql
{{{schema}}}
\`\`\`

**Natural Language Query**: "{{{query}}}"

Generate the corresponding SQL query. The query should be efficient and syntactically correct. Also, briefly explain any assumptions you made (e.g., about how tables join, or how to interpret ambiguous terms).

Respond in valid JSON format.
`,
});

const buildSqlQueryFlow = ai.defineFlow(
  {
    name: 'buildSqlQueryFlow',
    inputSchema: BuildSqlQueryInputSchema,
    outputSchema: BuildSqlQueryOutputSchema,
  },
  async input => {
    const {output} = await buildSqlQueryPrompt(input);
    return output!;
  }
);
