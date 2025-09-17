import Link from 'next/link';
import { ArrowRight, Code, Zap, Bot, Scale, Users, Award, User, GitCommit, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github } from 'lucide-react';

const features = [
  {
    icon: <GitCommit className="h-8 w-8 text-primary" />,
    title: 'AI Commit Message Generator',
    description: 'Summarize your git diffs into clear and conventional commit messages instantly.',
    href: '/tools/commit-message-generator',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Error Log Explainer & Fixer',
    description: 'Translate cryptic stack traces into plain English explanations and get step-by-step fixes.',
    href: '/tools/error-log-explainer',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'README.md Generator',
    description: 'Create a professional README.md file from your project details or package.json.',
    href: '/tools/readme-generator',
  },
  {
    icon: <Scale className="h-8 w-8 text-primary" />,
    title: 'Regex Generator & Tester',
    description: 'Generate complex regular expressions from plain English and test them live.',
    href: '/tools/regex-generator',
  },
];

const testimonials = [
  {
    quote: "The AI Commit Message Generator is a game-changer. It turns my chaotic diffs into clean, conventional commits. It saves me time and keeps our commit history pristine.",
    name: 'Julia Evans',
    role: 'Senior Software Engineer',
  },
  {
    quote: "I used to spend hours deciphering error logs. Now, the Error Log Explainer gives me clear, actionable steps in seconds. It has truly accelerated our debugging process.",
    name: 'Marcus Holloway',
    role: 'Lead Frontend Developer at TechCorp',
  },
  {
    quote: "As a freelancer, the Unit Test Generator is my secret weapon. It helps me deliver well-tested, robust code faster than ever, which keeps my clients extremely happy.",
    name: 'Aisha Khan',
    role: 'Freelance Web Developer',
  },
];

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48h145.6L256 196.8 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);


const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    {...props}
  >
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">AI Dev Toolkit</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/tools">
            <Button className="hidden sm:inline-flex">Explore Tools</Button>
          </Link>
          <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-6 w-6 transition-colors hover:text-primary" />
          </a>
        </div>
      </header>
      
      <main>
        <section className="flex flex-col items-center justify-center space-y-6 px-4 py-28 text-center md:py-48">
          <div className="mb-4 inline-block rounded-full bg-primary/10 p-4 text-primary">
            <Zap className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Build Smarter, Not Harder
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            A suite of 12 powerful, zero config AI tools designed to automate tedious developer tasks and supercharge your workflow.
          </p>
          <Link href="/tools">
            <Button size="lg" className="group font-bold">
              Explore The Tools
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </section>

        <section id="features" className="w-full bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              A Toolbox for Every Developer Task
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="flex transform flex-col items-center p-6 text-center transition-transform hover:scale-105 hover:shadow-xl">
                  {feature.icon}
                  <CardHeader className="p-0 pt-4">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-2">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="mt-12 text-center">
              <Link href="/tools">
                <Button variant="outline" size="lg" className="group font-bold">
                  And 8+ More Powerful Tools
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section id="benefits" className="w-full py-20 md:py-32">
          <div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
              <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-bold">Key Benefits</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why You'll Love This Toolkit</h2>
                  <p className="text-lg text-muted-foreground">
                      Stop wasting time on repetitive tasks and focus on what matters: building great software. Our tools are designed to integrate seamlessly into your workflow.
                  </p>
              </div>
              <div className="grid gap-6">
                  <div className="flex items-start gap-4">
                      <Zap className="mt-1 h-8 w-8 shrink-0 text-primary" />
                      <div>
                          <h3 className="text-xl font-bold">Boost Productivity</h3>
                          <p className="text-muted-foreground">Automate commit messages, generate documentation, and get instant feedback to speed up your development cycle.</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <Award className="mt-1 h-8 w-8 shrink-0 text-primary" />
                      <div>
                          <h3 className="text-xl font-bold">Improve Code Quality</h3>
                          <p className="text-muted-foreground">Enforce best practices, catch errors early, and write comprehensive tests with AI assistance.</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-4">
                      <Bot className="mt-1 h-8 w-8 shrink-0 text-primary" />
                      <div>
                          <h3 className="text-xl font-bold">Leverage AI Power</h3>
                          <p className="text-muted-foreground">Go beyond simple linting. Our AI understands context to provide meaningful, actionable insights for complex tasks.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

        <section id="testimonials" className="w-full bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Loved by Developers Worldwide
            </h2>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-6">
                  <CardContent className="p-0">
                    <p className="mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="ml-4">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
              <h2 className="mb-12 text-3xl font-bold tracking-tighter sm:text-4xl">
                  For Any Workflow
              </h2>
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center gap-2">
                      <Scale className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Freelance Projects</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Team Collaboration</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <Code className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Open Source</p>
                  </div>
                   <div className="flex flex-col items-center gap-2">
                      <Award className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Code Audits</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <Zap className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Rapid Prototyping</p>
                  </div>
                   <div className="flex flex-col items-center gap-2">
                      <Bot className="h-8 w-8 text-primary" />
                      <p className="font-semibold">Daily Stand-ups</p>
                  </div>
              </div>
          </div>
        </section>
        
        <section id="cta" className="w-full bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Build Smarter?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Get access to the full suite of stateless tools and start shipping better code today. No login required.
            </p>
            <div className="mt-8">
              <Link href="/tools">
                <Button size="lg" className="group font-bold">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row">
          <p className="font-bold text-sm text-muted-foreground">
            <a href="https://muhammadtanveerabbas.vercel.app/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary hover:underline">
              Made by Muhammad Tanveer Abbas
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/in/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
              <LinkedInIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://x.com/m_tanveerabbas" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">X</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
