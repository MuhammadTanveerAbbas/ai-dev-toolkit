'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, FileText, Check, Pilcrow, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateDocstrings, GenerateDocstringsOutput } from '@/ai/flows/docstring-generator';
import { useToast } from '@/hooks/use-toast';

export default function DocstringGeneratorPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<GenerateDocstringsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!code.trim() || !language.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both code and its language.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateDocstrings({ code, language });
      setResult(res);
      toast({ title: 'Documentation Generated', description: 'Your code has been annotated.' });
    } catch (error) {
      console.error('Error generating documentation:', error);
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

  const downloadFile = (code: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotated_code.${language.split(' ')[0]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'File downloaded!' });
  };

  return (
    <ToolLayout 
      title="Docstring & Comment Generator"
      description="Automatically generate clear and concise docstrings and inline comments for your code files.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Code Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" placeholder="e.g., python, typescript" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isLoading} />
               </div>
              <Textarea
                placeholder="Paste your code snippet or file content here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-80 font-mono text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleGenerate} disabled={isLoading || !code.trim()} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Docs...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" />Generate Docstrings</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating documentation...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is analyzing your code and writing comments.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Pilcrow className="h-5 w-5" />
                  Annotated Code
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.annotatedCode)}>
                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadFile(result.annotatedCode)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border max-h-[500px]">
                    <code>{result.annotatedCode}</code>
                </pre>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Pilcrow className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your annotated code will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste your code to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
