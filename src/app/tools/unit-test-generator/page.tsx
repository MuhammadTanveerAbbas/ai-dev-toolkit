'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, Check, TestTube2, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { generateUnitTests, GenerateUnitTestsOutput } from '@/ai/flows/unit-test-generator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function UnitTestGeneratorPage() {
  const [code, setCode] = useState('');
  const [framework, setFramework] = useState<'jest' | 'vitest'>('jest');
  const [result, setResult] = useState<GenerateUnitTestsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide the code to test.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateUnitTests({ code, framework });
      setResult(res);
      toast({ title: 'Unit Tests Generated', description: 'A test file has been created for your code.' });
    } catch (error) {
      console.error('Error writing unit tests:', error);
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

  const downloadTestFile = (testCode: string) => {
    const blob = new Blob([testCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.spec.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Downloading test file...' });
  };

  return (
    <ToolLayout 
      title="Unit Test Generator"
      description="Paste a function or small file to automatically generate a complete test file using Jest or Vitest.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTube2 className="h-5 w-5"/> Code and Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Testing Framework</Label>
                    <RadioGroup defaultValue="jest" onValueChange={(value: 'jest' | 'vitest') => setFramework(value)} className="flex items-center space-x-4 pt-2" disabled={isLoading}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="jest" id="jest" />
                            <Label htmlFor="jest" className="font-normal">Jest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vitest" id="vitest" />
                            <Label htmlFor="vitest" className="font-normal">Vitest</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <Textarea
                    placeholder="Paste your function or component code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-80 font-mono text-sm"
                    disabled={isLoading}
                />
                 <Button onClick={handleGenerate} disabled={isLoading || !code.trim()} className="w-full">
                    {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Writing Tests...</>
                    ) : (
                    <><Wand2 className="mr-2 h-4 w-4" />Generate Unit Tests</>
                    )}
                </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Writing your unit tests...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is considering edge cases and happy paths.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated Test File</CardTitle>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.testCode)}>
                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadTestFile(result.testCode)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download .spec.js
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="relative">
                 <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border max-h-[500px]">
                    <code>{result.testCode}</code>
                </pre>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <TestTube2 className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your unit tests will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Provide your code to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
