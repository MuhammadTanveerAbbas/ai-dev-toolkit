'use client';

import { useState } from 'react';
import { Loader2, Wand2, Download, Package, File, FolderKanban } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateBoilerplate, GenerateBoilerplateOutput } from '@/ai/flows/boilerplate-generator';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const options = [
  { id: 'api-route', label: 'Include API route' },
  { id: 'readme', label: 'Add README.md' },
  { id: 'dockerfile', label: 'Include Dockerfile' },
] as const;

export default function BoilerplateGeneratorPage() {
  const [stack, setStack] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [result, setResult] = useState<GenerateBoilerplateOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!stack.trim()) {
      toast({
        title: 'Error',
        description: 'Please describe your project stack.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateBoilerplate({ stack, options: selectedOptions });
      setResult(res);
      toast({
        title: 'Boilerplate Generated',
        description: 'Your project files have been created.',
      });
    } catch (error) {
      console.error('Error generating boilerplate:', error);
      toast({
        title: 'Generation Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!result) return;
    const projectName = stack.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'project';
    const zip = new JSZip();
    const projectFolder = zip.folder(projectName);
    if (!projectFolder) {
        toast({ title: 'Error creating zip folder', variant: 'destructive'});
        return;
    }

    result.files.forEach(file => {
      // Ensure nested directories are created correctly.
      const pathParts = file.path.split('/').filter(p => p);
      let currentFolder: JSZip | null = projectFolder;
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentFolder = currentFolder.folder(pathParts[i]);
      }
      currentFolder.file(pathParts[pathParts.length - 1], file.content);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${projectName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Success',
        description: 'Your boilerplate code is downloading as a .zip file.',
      });
    } catch (error) {
       toast({
        title: 'Download Failed',
        description: 'Could not create the .zip file.',
        variant: 'destructive',
      });
    }
  };
  
  const handleOptionChange = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  return (
    <ToolLayout 
      title="Boilerplate Project Generator"
      description="Generate a downloadable, production-ready starter project from a description.">
      <div className="grid w-full gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Project Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stack">Stack Description</Label>
              <Input
                id="stack"
                placeholder="e.g., 'Next.js 14 app with TypeScript and Tailwind'"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.label)}
                        onCheckedChange={() => handleOptionChange(option.label)}
                        disabled={isLoading}
                    />
                    <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                    </div>
                ))}
                </div>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading || !stack.trim()} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Files...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Generate Project</>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Generating your project...</h2>
              <p className="mt-2 text-sm text-muted-foreground">The AI is creating a complete starter project.</p>
            </div>
          )}

          {result && (
            <Card className="min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Generated Project Files
                </CardTitle>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download .zip
                </Button>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full max-h-[500px] overflow-y-auto">
                  {result.files.map((file, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>
                          <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">{file.path}</span>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <pre className="p-4 bg-background rounded-md overflow-x-auto text-xs font-mono border">
                          <code>{file.content}</code>
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {!isLoading && !result && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-secondary p-4 text-center">
              <Package className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-6 text-xl font-semibold">Your project files will appear here</h2>
              <p className="mt-2 text-sm text-muted-foreground">Describe the project you want to start, select options, and click Generate.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
