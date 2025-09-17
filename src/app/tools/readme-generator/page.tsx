'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, Check, BookOpen, FileText, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateReadme, GenerateReadmeOutput } from '@/ai/flows/readme-generator';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Wrapper component to safely render HTML and prevent hydration errors
function MarkdownPreview({ markdown }: { markdown: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing on the server
  }

  // A simple markdown to HTML converter
  const toHtml = (md: string) => {
    return md
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');
  }

  return <div dangerouslySetInnerHTML={{ __html: toHtml(markdown) }} />;
}


export default function ReadmeGeneratorPage() {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [install, setInstall] = useState('');
  const [usage, setUsage] = useState('');
  const [packageJson, setPackageJson] = useState('');
  const [result, setResult] = useState<GenerateReadmeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!name.trim() && !purpose.trim() && !packageJson.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide some project details or a package.json.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateReadme({ name, purpose, install, usage, packageJson });
      setResult(res);
      toast({ title: 'README Generated', description: 'Your project README is ready.' });
    } catch (error) {
      console.error('Error generating README:', error);
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
    toast({ title: 'Copied to clipboard!' });
  };
  
  const downloadMarkdown = (markdown: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Downloading README.md' });
  };

  return (
    <ToolLayout 
      title="README.md Generator"
      description="Generate a professional README.md file by filling in fields or pasting your package.json.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" placeholder="My Awesome Project" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input id="purpose" placeholder="A tool to do amazing things" value={purpose} onChange={(e) => setPurpose(e.target.value)} disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="install">Installation</Label>
                <Input id="install" placeholder="npm install my-project" value={install} onChange={(e) => setInstall(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage</Label>
                <Input id="usage" placeholder="import project from 'my-project'" value={usage} onChange={(e) => setUsage(e.target.value)} disabled={isLoading} />
              </div>
               <div className="text-center text-sm text-muted-foreground">OR</div>
               <div className="space-y-2">
                <Label htmlFor="package-json">Paste package.json (Optional)</Label>
                <Textarea
                    id="package-json"
                    placeholder='{ "name": "my-project", "version": "1.0.0", ... }'
                    value={packageJson}
                    onChange={(e) => setPackageJson(e.target.value)}
                    className="h-32 font-mono text-xs"
                    disabled={isLoading}
                />
               </div>
              <Button onClick={handleGenerate} disabled={isLoading || (!name.trim() && !packageJson.trim())} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" />Generate README</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating your README...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is crafting a professional project page.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated README.md</CardTitle>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.markdown)}>
                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadMarkdown(result.markdown)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download .md
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-full rounded-lg border bg-background p-4 h-[600px] overflow-y-auto">
                <MarkdownPreview markdown={result.markdown} />
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your README will be previewed here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Fill in project details or paste a package.json to start.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
