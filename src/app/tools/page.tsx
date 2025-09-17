'use client';

import Link from 'next/link';
import {
  Bot,
  Zap,
  TestTube2,
  GitCommit,
  Database,
  Terminal,
  Home,
  Code,
  FileText,
  Book,
  Wrench,
  Search,
  BookOpen,
  Package,
  Github,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const tools = [
  {
    icon: <GitCommit className="h-8 w-8 text-primary" />,
    title: 'AI Commit Message Generator',
    description: 'Summarize git diffs into clear, conventional commit messages.',
    href: '/tools/commit-message-generator',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Error Log Explainer & Fixer',
    description: 'Translate cryptic stack traces into plain English and get step-by-step fixes.',
    href: '/tools/error-log-explainer',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'README.md Generator',
    description: 'Create professional README files from project details or a package.json.',
    href: '/tools/readme-generator',
  },
  {
    icon: <Terminal className="h-8 w-8 text-primary" />,
    title: 'Regex Generator & Tester',
    description: 'Generate and test regular expressions from plain English descriptions.',
    href: '/tools/regex-generator',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Prompt Optimizer',
    description: 'Refine and enhance your AI prompts to get better, more accurate results.',
    href: '/tools/prompt-optimizer',
    isNew: true,
  },
  {
    icon: <TestTube2 className="h-8 w-8 text-primary" />,
    title: 'Unit Test Generator',
    description: 'Automatically generate unit tests for your functions using Jest or Vitest.',
    href: '/tools/unit-test-generator',
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Error-to-Code Fix Snippets',
    description: 'Get minimal, AI-generated code patches to fix specific errors.',
    href: '/tools/code-fixer',
  },
  {
    icon: <Database className="h-8 w-8 text-primary" />,
    title: 'SQL Query Builder',
    description: 'Build complex SQL queries from natural language and a database schema.',
    href: '/tools/sql-query-builder',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Docstring & Comment Generator',
    description: 'Automatically add docstrings and inline comments to your code files.',
    href: '/tools/docstring-generator',
  },
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: 'Boilerplate Project Generator',
    description: 'Generate a downloadable starter project for various frameworks.',
    href: '/tools/boilerplate-generator',
    isNew: true,
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Lightweight Code Reviewer',
    description: 'Get a targeted AI code review focused on security, performance, or readability.',
    href: '/tools/code-reviewer',
  },
  {
    icon: <Book className="h-8 w-8 text-primary" />,
    title: 'Schema-to-Docs Generator',
    description: 'Convert an OpenAPI or GraphQL schema into human-readable documentation.',
    href: '/tools/schema-docs-generator',
  },
];


export default function ToolsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
       <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">AI Dev Toolkit</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" passHref>
             <Button variant="ghost" size="icon" aria-label="Home">
                <Home className="h-5 w-5" />
             </Button>
          </Link>
          <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-6 w-6 transition-colors hover:text-primary" />
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center p-4 py-12 sm:p-6 md:py-16">
        <div className="mb-12 max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Developer's AI Toolkit</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A collection of 12 powerful, stateless AI tools to streamline your development workflow. No login required.
          </p>
        </div>

        <div className="grid w-full max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="flex h-full transform flex-col justify-start p-5 transition-all hover:scale-105 hover:shadow-xl focus:scale-105 focus:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    {tool.icon}
                    {tool.isNew && <Badge>New</Badge>}
                  </div>
                  <div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </main>
      
       <footer className="w-full border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>More tools coming soon. Found an issue? <a href="https://github.com/muhammadtanveerabbas/ai-dev-toolkit/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Let us know</a>.</p>
        </div>
      </footer>
    </div>
  );
}