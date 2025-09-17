'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, GitCommit, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCommitMessage, GenerateCommitMessageOutput } from '@/ai/flows/commit-message-generator';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CommitMessageGeneratorPage() {
  const [diff, setDiff] = useState('');
  const [result, setResult] = useState<GenerateCommitMessageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!diff.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste a git diff to generate a commit message.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateCommitMessage({ diff });
      setResult(res);
      toast({ title: 'Commit Message Generated' });
    } catch (error) {
      console.error('Error generating commit message:', error);
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
      title="AI Commit Message Generator"
      description="Paste a git diff or changed files to automatically generate a clear and concise commit message.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Git Diff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your git diff here..."
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="h-96 font-mono text-sm"
              disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !diff.trim()} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Message...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Generate Commit Message</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating commit message...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is analyzing your changes.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Generated Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <GitCommit className="h-4 w-4" />
                  <AlertTitle>Suggested Commit Message</AlertTitle>
                   <div className="flex items-center justify-between">
                    <AlertDescription className="font-mono text-sm">{result.commitMessage}</AlertDescription>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.commitMessage)}>
                      {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Alert>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <GitCommit className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your commit message will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste a git diff to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
