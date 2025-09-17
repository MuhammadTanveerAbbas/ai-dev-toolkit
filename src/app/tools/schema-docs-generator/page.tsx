'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Wand2, Copy, Check, Book, Upload } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSchemaDocs, GenerateSchemaDocsOutput } from '@/ai/flows/schema-docs-generator';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Wrapper component to safely render HTML and prevent hydration errors
function DocsPreview({ markdown }: { markdown: string }) {
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

export default function SchemaDocsGeneratorPage() {
  const [schema, setSchema] = useState('');
  const [format, setFormat] = useState<'openapi' | 'graphql'>('openapi');
  const [result, setResult] = useState<GenerateSchemaDocsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!schema.trim()) {
      toast({ title: 'Error', description: 'Please paste or upload a schema.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateSchemaDocs({ schema, format });
      setResult(res);
      toast({ title: 'Documentation Generated', description: 'Your schema has been converted to docs and examples.' });
    } catch (error) {
      console.error('Error generating docs:', error);
      toast({ title: 'Generation Failed', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSchema(content);
        toast({ title: 'File Uploaded', description: file.name });
      };
      reader.readAsText(file);
    }
  };

  return (
    <ToolLayout 
      title="Schema-to-Docs + Examples"
      description="Paste or upload an OpenAPI/GraphQL schema to generate human-readable documentation and request examples.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Book className="h-5 w-5" /> Schema Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup defaultValue="openapi" onValueChange={(value: 'openapi' | 'graphql') => setFormat(value)} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="openapi" id="openapi" disabled={isLoading} /><Label htmlFor="openapi">OpenAPI</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="graphql" id="graphql" disabled={isLoading} /><Label htmlFor="graphql">GraphQL</Label></div>
            </RadioGroup>
            <Textarea
              placeholder={`Paste your ${format.toUpperCase()} schema here (JSON or YAML)...`}
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="h-80 font-mono text-sm"
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleGenerate} disabled={isLoading || !schema.trim()} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate Docs</>}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json,.yaml,.yml" className="hidden" />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating documentation...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is converting your schema into docs and examples.</p>
            </div>
          )}

          {result && (
            <Tabs defaultValue="docs" className="w-full min-h-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="docs">Documentation</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              <TabsContent value="docs">
                <Card>
                  <CardHeader><CardTitle>Generated Documentation</CardTitle></CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-full rounded-lg border bg-background p-4 h-[500px] overflow-y-auto">
                    <DocsPreview markdown={result.documentation} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="examples">
                <Card>
                  <CardHeader><CardTitle>Request Examples</CardTitle></CardHeader>
                  <CardContent className="space-y-4 max-h-[550px] overflow-y-auto">
                    {result.examples.map((example, index) => (
                      <div key={index} className="space-y-2">
                        <Label>{example.language}</Label>
                        <div className="relative">
                          <pre className="p-4 bg-background rounded-md overflow-x-auto text-sm font-mono border"><code>{example.snippet}</code></pre>
                          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(example.snippet, `ex-${index}`)}>
                            {copiedStates[`ex-${index}`] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {!isLoading && !result && (
             <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
                <Book className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">Your documentation will appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">Paste or upload a schema to get started.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
