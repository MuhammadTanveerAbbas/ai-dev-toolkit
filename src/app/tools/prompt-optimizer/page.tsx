'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, Bot, Check, Lightbulb } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { optimizePrompt, OptimizePromptOutput } from '@/ai/flows/prompt-optimizer';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PromptOptimizerPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<OptimizePromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to optimize.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await optimizePrompt({ prompt });
      setResult(res);
      toast({ title: 'Prompt Optimized', description: 'Your prompt has been enhanced and variants have been generated.' });
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      toast({
        title: 'Optimization Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <ToolLayout 
      title="Prompt Optimizer"
      description="Paste a rough prompt to get an optimized version, plus alternative variants using different strategies.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Your Rough Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'tell me about dogs'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-80 font-mono text-sm"
              disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Optimizing...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Optimize Prompt</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Optimizing your prompt...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is engineering better prompts for you.</p>
            </div>
          )}

          {result && (
            <div className='space-y-4 min-h-[400px]'>
              <Card>
                <CardHeader>
                  <CardTitle>Primary Optimized Prompt</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border">
                      <code>{result.optimizedPrompt}</code>
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(result.optimizedPrompt, 'primary')}>
                    {copiedStates['primary'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>

              <Accordion type="multiple" className="w-full space-y-2">
                <AccordionItem value="variants" className="border-none">
                    <AccordionTrigger className="text-lg font-semibold -mb-2 p-0 hover:no-underline">
                        Alternative Variants
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-4">
                        {result.variants.map((variant, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{variant.title}</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className="relative">
                                        <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border">
                                            <code>{variant.prompt}</code>
                                        </pre>
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(variant.prompt, `variant-${index}`)}>
                                            {copiedStates[`variant-${index}`] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <Alert>
                                        <Lightbulb className="h-4 w-4" />
                                        <AlertTitle>Usage Tip</AlertTitle>
                                        <AlertDescription>{variant.tips}</AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Bot className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your optimized prompts will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Enter a rough prompt to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
