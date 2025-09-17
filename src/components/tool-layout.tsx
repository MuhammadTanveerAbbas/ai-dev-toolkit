'use client';

import Link from "next/link";
import { Home, Code, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function ToolLayout({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">AI Dev Toolkit</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/tools" passHref>
             <Button variant="ghost" size="icon" aria-label="Back to Tools">
                <Home className="h-5 w-5" />
             </Button>
          </Link>
          <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-6 w-6 transition-colors hover:text-primary" />
          </a>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center p-4 py-8 sm:p-6 md:py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
