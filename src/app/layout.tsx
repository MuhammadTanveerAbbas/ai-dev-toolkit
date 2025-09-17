import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: {
    default: "AI Dev Toolkit | Supercharge Your Development Workflow",
    template: "%s | AI Dev Toolkit",
  },
  description:
    "An all-in-one suite of powerful, AI-driven tools for modern developers to build better, faster, and more efficiently. Boost productivity and improve code quality.",
  keywords: [
    "AI developer tools",
    "code review",
    "accessibility audit",
    "Next.js",
    "React",
    "developer productivity",
  ],
  applicationName: "AI Dev Toolkit",
  authors: [{ name: "Muhammad Tanveer Abbas" }],
  creator: "Muhammad Tanveer Abbas",
  publisher: "Muhammad Tanveer Abbas",
  icons: {
    icon: "/fevicon.png",
  },
  openGraph: {
    title: "AI Dev Toolkit | Supercharge Your Development Workflow",
    description:
      "An all-in-one suite of powerful, AI-driven tools designed to boost productivity and improve code quality.",
    type: "website",
    locale: "en_US",
    siteName: "AI Dev Toolkit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${orbitron.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Dev Toolkit",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description:
                "An all-in-one suite of powerful, AI-driven tools for modern developers to build better, faster, and more efficiently.",
              offers: {
                "@type": "Offer",
                price: "0",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
