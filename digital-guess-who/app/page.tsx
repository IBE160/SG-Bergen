import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { JoinGameForm } from "@/components/home/join-game-form";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Navbar */}
      <nav className="w-full flex justify-center border-b h-16 bg-background/80 backdrop-blur-md fixed top-0 z-50 transition-all duration-300">
        <div className="w-full max-w-6xl flex justify-between items-center px-6">
            <Link href="/" className="flex gap-2 items-center font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
               <span className="text-2xl">🕵️‍♀️</span>
               <span>Guess Who</span>
            </Link>
            <div className="flex items-center gap-4">
               {!hasEnvVars ? (
                  <EnvVarWarning />
                ) : (
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                )}
                <ThemeSwitcher />
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 animate-in fade-in duration-700">
         <div className="w-full max-w-5xl flex flex-col gap-12">
            <Hero />
            
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto items-stretch">
                {/* Create Game Section */}
                <div className="flex-1 flex flex-col gap-6 p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 5v14M5 12h14"/></svg>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">Start Fresh</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Host a new game session and invite a friend using a unique game code.
                        </p>
                    </div>
                    <div className="mt-auto pt-4">
                        <Link href="/game-lobby/create" passHref className="w-full">
                            <Button size="lg" className="w-full text-lg font-semibold h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                              Create New Game
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center md:flex-col relative">
                   <div className="h-px w-full md:w-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-border to-transparent absolute"></div>
                   <span className="relative px-3 py-1 text-muted-foreground text-xs font-bold bg-background border rounded-full z-10 uppercase tracking-widest">OR</span>
                </div>

                {/* Join Game Section */}
                <div className="flex-1 flex flex-col gap-6 p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">Join Friend</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                            Have a code? Enter it below to jump straight into an existing lobby.
                        </p>
                    </div>
                    <div className="mt-auto">
                        <JoinGameForm />
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-8 text-center text-sm text-muted-foreground bg-card/30 backdrop-blur-md">
        <p className="flex items-center justify-center gap-2">
           Digital Guess Who © 2025
        </p>
      </footer>
    </main>
  );
}