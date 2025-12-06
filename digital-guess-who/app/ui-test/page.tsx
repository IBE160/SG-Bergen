import { Button } from "@/components/ui/button";

export default function UITestPage() {
  return (
    <div className="min-h-screen p-10 space-y-8">
      <h1 className="text-3xl font-bold">UI Library & Global Styles Setup</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 rounded flex items-center justify-center bg-primary text-primary-foreground font-bold">Primary</div>
          <div className="h-24 rounded flex items-center justify-center bg-secondary text-secondary-foreground font-bold">Secondary</div>
          <div className="h-24 rounded flex items-center justify-center bg-destructive text-destructive-foreground font-bold">Destructive</div>
          <div className="h-24 rounded flex items-center justify-center bg-card text-card-foreground border font-bold">Card</div>
          <div className="h-24 rounded flex items-center justify-center bg-background text-foreground border font-bold">Background</div>
          <div className="h-24 rounded flex items-center justify-center bg-muted text-muted-foreground font-bold">Muted</div>
          <div className="h-24 rounded flex items-center justify-center bg-accent text-accent-foreground font-bold">Accent</div>
          <div className="h-24 rounded flex items-center justify-center bg-popover text-popover-foreground border font-bold">Popover</div>
        </div>
      </section>
    </div>
  );
}
