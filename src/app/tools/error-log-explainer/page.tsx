'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, AlertTriangle, Check, Terminal, FileText, ChevronRight } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { explainErrorLog, ExplainErrorLogOutput } from '@/ai/flows/error-log-explainer';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ErrorLogExplainerPage() {
  const [log, setLog] = useState('');
  const [runtime, setRuntime] = useState('Node.js');
  const [result, setResult] = useState<ExplainErrorLogOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!log.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste an error log or stack trace.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await explainErrorLog({ log, runtime });
      setResult(res);
      toast({ title: 'Explanation Generated', description: 'The AI has analyzed your error log.' });
    } catch (error) {
      console.error('Error explaining log:', error);
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
      title: 'Copied explanation to clipboard!',
    });
  };

  return (
    <ToolLayout 
      title="Error Log Explainer & Fixer"
      description="Paste a stack trace or error log to get a plain-English explanation and step-by-step instructions to fix it.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Error Log & Runtime
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='space-y-2'>
              <Label htmlFor="runtime">Runtime (Optional)</Label>
              <Input 
                id="runtime" 
                placeholder="e.g., Node.js, Python, Browser" 
                value={runtime} 
                onChange={(e) => setRuntime(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Textarea
              placeholder="Paste your full error log or stack trace here..."
              value={log}
              onChange={(e) => setLog(e.target.value)}
              className="h-80 font-mono text-sm"
              disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !log.trim()} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Log...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Explain Error</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Analyzing your error log...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is diagnosing the issue.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Analysis & Fix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Explanation</AlertTitle>
                  <div className="flex items-start justify-between">
                    <AlertDescription>{result.explanation}</AlertDescription>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.explanation)}>
                      {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Alert>
                <div>
                  <h3 className="mb-2 font-semibold">Steps to Fix</h3>
                  <ul className="space-y-3">
                    {result.stepsToFix.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-md border bg-background p-3">
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        <span className="text-sm text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <AlertTriangle className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your error explanation will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste an error log to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
