export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-center items-center p-6 rounded-full bg-primary/10 mb-4 ring-4 ring-primary/20">
        <div className="text-7xl drop-shadow-lg">🕵️‍♀️</div> 
      </div>
      <h1 className="text-5xl font-black tracking-tighter lg:text-7xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Digital Guess Who
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
        The classic game of deduction, reimagined. <br className="hidden md:block"/>
        Ask smart questions. Eliminate suspects. <span className="text-foreground font-semibold">Reveal the truth.</span>
      </p>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
    </div>
  );
}