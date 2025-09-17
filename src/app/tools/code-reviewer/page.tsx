'use client';

import { useState } from 'react';
import { Circle, AlertCircle, CheckCircle, Loader2, FileText, Bot, Search } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { reviewCode, ReviewCodeOutput } from '@/ai/flows/code-reviewer';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type FocusArea = 'security' | 'performance' | 'readability' | 'best-practices';

export default function CodeReviewerPage() {
  const [diff, setDiff] = useState('');
  const [focus, setFocus] = useState<FocusArea>('best-practices');
  const [reviewResult, setReviewResult] = useState<ReviewCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReview = async () => {
    if (!diff.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste a code diff or file to review.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setReviewResult(null);
    try {
      const result = await reviewCode({ diff, focus });
      setReviewResult(result);
      toast({ title: 'Review Complete', description: 'The AI has finished reviewing your code.' });
    } catch (error) {
      console.error('Error reviewing code:', error);
      toast({
        title: 'Review Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityIcon = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'Low':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <ToolLayout 
      title="Lightweight Code Review Assistant"
      description="Get a targeted, AI-powered code review focused on security, performance, or best practices.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Code Diff & Review Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="focus-select">Review Focus</Label>
                <Select value={focus} onValueChange={(value: FocusArea) => setFocus(value)} disabled={isLoading}>
                    <SelectTrigger id="focus-select">
                        <SelectValue placeholder="Select a focus area" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="best-practices">Best Practices</SelectItem>
                        <SelectItem value="readability">Readability</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Textarea
              placeholder="Paste your git diff or code files here..."
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="h-80 font-mono text-sm"
              disabled={isLoading}
            />
            <Button onClick={handleReview} disabled={isLoading || !diff.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><Search className="mr-2 h-4 w-4" />Review Code</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Our AI is reviewing your code...</h2>
              <p className="mt-2 text-sm text-muted-foreground">Focusing on {focus}. This may take a few moments.</p>
            </div>
          )}

          {reviewResult && (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    <span>Review Results</span>
                    <Badge variant="secondary">{reviewResult.issues.length} issues found</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewResult.issues.length > 0 ? (
                  <Accordion type="multiple" className="w-full space-y-2">
                    {reviewResult.issues.map((issue, index) => (
                      <AccordionItem value={`item-${index}`} key={index} className="rounded-lg border bg-background px-4">
                        <AccordionTrigger className="py-3 hover:no-underline">
                           <div className="flex items-center gap-3 font-semibold">
                              {getPriorityIcon(issue.priority)}
                              <span>{issue.priority} Priority Issue</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4">
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                          <div className="relative">
                            <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm font-mono border">
                              <code>{issue.suggestion}</code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="mt-4 font-semibold">Excellent Code!</p>
                    <p>Our AI found no issues related to {focus}. Great work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !reviewResult && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Bot className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Ready for Review</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste your code on the left to get an instant, AI-powered review.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
