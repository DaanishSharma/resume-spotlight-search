import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

function CopyItem({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group flex items-center gap-3 text-left text-muted-foreground hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      <span>{value}</span>
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60" />}
    </button>
  );
}

export function ContactFooter() {
  return (
    <footer className="mx-auto max-w-[960px] px-6 pb-16">
      <h2 className="section-label">05 / Contact</h2>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <CopyItem icon={Mail} value="daanish1sharma@gmail.com" />
        <CopyItem icon={Phone} value="+91 7975122208" />
        <a href="https://linkedin.com/in/daanish-sharma-a7a828196" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
          <Linkedin className="h-4 w-4" /> linkedin.com/in/daanish-sharma-a7a828196
        </a>
        <a href="https://github.com/daanishsharma" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
          <Github className="h-4 w-4" /> github.com/daanishsharma
        </a>
        <span className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-4 w-4" /> Bengaluru, India
        </span>
      </div>
    </footer>
  );
}
