'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, Database, FileText, Check, Lightbulb } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSqlQuery, BuildSqlQueryOutput } from '@/ai/flows/sql-query-builder';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SqlQueryBuilderPage() {
  const [query, setQuery] = useState('');
  const [schema, setSchema] = useState('');
  const [result, setResult] = useState<BuildSqlQueryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!query.trim() || !schema.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both a database schema and a natural language query.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await buildSqlQuery({ query, schema });
      setResult(res);
      toast({ title: 'SQL Query Generated' });
    } catch (error) {
      console.error('Error building SQL query:', error);
      toast({
        title: 'Generation Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <ToolLayout 
      title="SQL Query Builder"
      description="Build complex SQL queries using a natural language interface. Just provide your schema and your query.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your CREATE TABLE statements here...&#10;e.g., CREATE TABLE users (id INT, name VARCHAR(255));"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="h-56 font-mono text-sm"
                disabled={isLoading}
              />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Query
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Textarea
                placeholder="e.g., 'Find all users who signed up last week and order by name'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-28"
                disabled={isLoading}
              />
              <Button onClick={handleGenerate} disabled={isLoading || !query.trim() || !schema.trim()} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building Query...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" />Build SQL Query</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Building your SQL query...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is analyzing your request.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Generated SQL Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                    <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border">
                        <code>{result.sqlQuery}</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(result.sqlQuery)}>
                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Assumptions</AlertTitle>
                  <AlertDescription>{result.assumptions}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Database className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your SQL query will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Provide your schema and describe the data you want.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
