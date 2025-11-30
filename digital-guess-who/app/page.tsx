import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { JoinGameForm } from "@/components/join-game-form";
import { Button } from "@/components/ui/button";

// Separate component to fetch and display user-specific content
async function GameOptions() {
  if (!hasEnvVars) {
    return (
      <>
         <Hero />
         <main className="flex-1 flex flex-col gap-6 px-4">
           <h2 className="font-medium text-xl mb-4">Connect Supabase</h2>
           <ConnectSupabaseSteps />
         </main>
      </>
    );
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return (
        <div className="flex flex-col gap-8 w-full max-w-md items-center mt-10">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-bold">Welcome!</h1>
             <p className="text-muted-foreground">Join an existing game or create a new one.</p>
          </div>
          
          <JoinGameForm />
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button asChild className="w-full" variant="outline">
             <Link href="/game-lobby">Create New Game</Link>
          </Button>
       </div>
      );
    }

    // Not logged in
    return (
      <>
        <Hero />
        <main className="flex-1 flex flex-col gap-6 px-4">
          <h2 className="font-medium text-xl mb-4">Next steps</h2>
          <SignUpUserSteps />
        </main>
      </>
    );

  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return <p className="text-red-500">Error loading game options. Please check console.</p>;
  }
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Digital Guess Who</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense fallback={<div className="flex items-center gap-2">Loading auth...</div>}>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full items-center">
          <Suspense fallback={<div className="p-10 text-center">Loading game options...</div>}>
            <GameOptions />
          </Suspense>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}