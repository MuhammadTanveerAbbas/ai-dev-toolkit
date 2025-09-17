'use client';

import { useState, useMemo } from 'react';
import { Loader2, Wand2, Copy, Check, Terminal, HelpCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRegex, GenerateRegexOutput } from '@/ai/flows/regex-generator';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

export default function RegexGeneratorPage() {
  const [description, setDescription] = useState('');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<GenerateRegexOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a description for the regex.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateRegex({ description });
      setResult(res);
      toast({ title: 'Regex Generated' });
    } catch (error) {
      console.error('Error generating regex:', error);
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

  const highlightedMatches = useMemo(() => {
    if (!result || !testString) return <span>{testString}</span>;
    try {
      const regex = new RegExp(result.regex, 'g');
      const parts = testString.split(regex);
      const matches = [...testString.matchAll(regex)];
      
      if (matches.length === 0) {
          return <span>{testString}</span>;
      }
      
      return parts.map((part, i) => (
        <span key={i}>
          {part}
          {matches[i] && (
            <mark className="bg-primary/20 text-primary-foreground rounded-sm px-1">
              {matches[i][0]}
            </mark>
          )}
        </span>
      ));

    } catch (e) {
      console.error("Regex error:", e);
      return <span className="text-destructive">{testString}</span>;
    }
  }, [result, testString]);


  return (
    <ToolLayout 
      title="Regex Generator & Live Tester"
      description="Generate and test regular expressions from plain English descriptions.">
      <div className="w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Regex Description
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="e.g., 'a valid email address', 'a URL slug', 'a 6-digit OTP'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !description.trim()} className="w-full sm:w-auto">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Generate Regex</>
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Generating your regex...</h2>
            <p className="mt-2 text-sm text-muted-foreground">The AI is crafting the perfect pattern.</p>
          </div>
        )}

        {result && (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Regex</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Regex Pattern</AlertTitle>
                  <div className="flex items-center justify-between">
                    <AlertDescription className="font-mono text-sm">/{result.regex}/</AlertDescription>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.regex)}>
                      {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Alert>
                <Alert>
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Explanation</AlertTitle>
                  <AlertDescription>{result.explanation}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Live Tester</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter a string to test the regex against..."
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="h-24 font-mono text-sm"
                  />
                  <div className="rounded-md border bg-background p-4 min-h-[88px]">
                      <p className="text-sm font-mono whitespace-pre-wrap break-words">
                        {highlightedMatches}
                      </p>
                  </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && !result && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
            <Terminal className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Your regex will appear here</h2>
            <p className="mt-2 text-sm text-muted-foreground">Describe the pattern you need in plain English.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
