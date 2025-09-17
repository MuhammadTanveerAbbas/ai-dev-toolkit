'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, FileText, Check, Bug } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fixCode, FixCodeOutput } from '@/ai/flows/code-fixer';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CodeFixerPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<FixCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!code.trim() || !error.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both the error message and the code snippet.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fixCode({ code, error });
      setResult(res);
      toast({ title: 'Fix Generated', description: 'A patch has been suggested for your code.' });
    } catch (err) {
      console.error('Error generating fix:', err);
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
    toast({ title: 'Copied patch to clipboard!' });
  };

  return (
    <ToolLayout 
      title="Error-to-Code Fix Snippets"
      description="Paste an error message and your code to get an AI-generated patch.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bug className="h-5 w-5" /> Error and Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your error message or stack trace here..."
                value={error}
                onChange={(e) => setError(e.target.value)}
                className="h-32 font-mono text-sm"
                disabled={isLoading}
              />
              <Textarea
                placeholder="Paste the related code snippet here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-56 font-mono text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleGenerate} disabled={isLoading || !code.trim() || !error.trim()} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Fix...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" />Generate Fix</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating your code fix...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is analyzing the error and crafting a patch.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Suggested Patch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Explanation</AlertTitle>
                  <AlertDescription>{result.explanation}</AlertDescription>
                </Alert>
                <div className="relative">
                  <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border">
                    <code className="whitespace-pre-wrap">{result.patch}</code>
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(result.patch)}>
                    {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Bug className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your code fix will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste your error and code to get a patch.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
