import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, Sparkles, FileText, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border/50 glass-subtle sticky top-0 z-50 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">LegalAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-primary/10">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 glass-subtle">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Legal Analysis</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter max-w-4xl mx-auto leading-[1.1]">
            Understand Your Legal Documents <span className="text-primary">Instantly.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            LegalAI uses advanced Gemini RAG to analyze, summarize, and extract insights from your legal documents in
            seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 group"
              >
                Try it for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-24 text-left">
            {[
              {
                icon: <FileText className="w-6 h-6 text-primary" />,
                title: "Deep Analysis",
                description: "Automatic extraction of key clauses, risks, and obligations using AI.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-primary" />,
                title: "RAG-Powered Chat",
                description: "Ask questions directly to your documents and get accurate, sourced answers.",
              },
              {
                icon: <Lock className="w-6 h-6 text-primary" />,
                title: "Privacy First",
                description: "Enterprise-grade encryption and secure processing for all legal materials.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl glass hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold">LegalAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 LegalAI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
