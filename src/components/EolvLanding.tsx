import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  type MotionValue,
} from "framer-motion";
import {
  Home,
  Info,
  Sparkles,
  Gamepad2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Layers,
  Feather,
  Radio,
  Eye,
  Server,
  Cookie,
  Bot,
  Send,
  Wifi,
} from "lucide-react";

/* ---------- Lock Screen ---------- */

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(320);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setWidth(trackRef.current.offsetWidth - 68);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const progress = useTransform(x, [0, width], [0, 1]);
  const labelOpacity = useTransform(progress, [0, 0.6], [1, 0]);
  const fillWidth = useTransform(progress, (p) => `${Math.min(p, 1) * 100}%`);

  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden px-6 py-14"
      initial={{ opacity: 1 }}
      animate={unlocked ? { opacity: 0, scale: 1.08, filter: "blur(20px)" } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => unlocked && onUnlock()}
    >
      {/* Ambient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.16 55 / 0.35), transparent 60%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.14 30 / 0.35), transparent 60%)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Time */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center"
      >
        <div className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="mt-2 font-display text-7xl font-light tabular-nums text-foreground">
          {time.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </motion.div>

      {/* Title */}
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="glow-warm font-display text-[clamp(5rem,18vw,12rem)] font-light leading-none"
        >
          Eolv
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-md text-balance text-lg text-muted-foreground"
        >
          Privacy and security for the casual.
        </motion.p>
      </div>

      {/* Slide to unlock */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="w-full max-w-sm"
      >
        <div ref={trackRef} className="glass relative h-16 w-full overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: fillWidth,
              background:
                "linear-gradient(90deg, oklch(0.55 0.14 45 / 0.4), oklch(0.78 0.15 55 / 0.5))",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ opacity: labelOpacity }}
          >
            <div className="relative overflow-hidden">
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                slide to unlock
              </span>
              <div className="shimmer absolute inset-0" />
            </div>
          </motion.div>

          <motion.button
            aria-label="Slide to unlock"
            drag="x"
            dragConstraints={{ left: 0, right: width }}
            dragElastic={0.05}
            dragMomentum={false}
            style={{ x }}
            onDragEnd={() => {
              if (x.get() > width * 0.85) {
                x.set(width);
                setUnlocked(true);
              } else {
                x.set(0);
              }
            }}
            className="absolute left-1 top-1 flex h-14 w-14 cursor-grab items-center justify-center rounded-full glass-strong active:cursor-grabbing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lock className="h-5 w-5 text-foreground" strokeWidth={1.5} />
          </motion.button>
        </div>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
          drag the handle right
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Dock ---------- */

type PageKey = "home" | "about" | "features" | "ai" | "games" | "privacy";
const DOCK_ITEMS: {
  key: PageKey;
  label: string;
  icon: typeof Home;
  gradient: string;
}[] = [
  { key: "home", label: "Home", icon: Home, gradient: "from-amber-400 to-orange-600" },
  { key: "about", label: "About", icon: Info, gradient: "from-sky-400 to-indigo-600" },
  { key: "features", label: "Features", icon: Sparkles, gradient: "from-fuchsia-400 to-rose-600" },
  { key: "ai", label: "AI", icon: Bot, gradient: "from-violet-400 to-cyan-600" },
  { key: "games", label: "Games", icon: Gamepad2, gradient: "from-emerald-400 to-teal-600" },
  { key: "privacy", label: "Privacy", icon: ShieldCheck, gradient: "from-yellow-300 to-amber-600" },
];

function DockIcon({
  item,
  mouseX,
  onClick,
}: {
  item: (typeof DOCK_ITEMS)[number];
  mouseX: MotionValue<number>;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [bouncing, setBouncing] = useState(0);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeRaw = useTransform(distance, [-140, 0, 140], [56, 92, 56]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 150, damping: 12 });
  const Icon = item.icon;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <motion.div
        initial={false}
        className="pointer-events-none absolute -top-12 whitespace-nowrap rounded-full glass px-3 py-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        {item.label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-white/10" />
      </motion.div>

      <motion.button
        ref={ref}
        style={{ width: size, height: size }}
        onClick={() => {
          setBouncing((b) => b + 1);
          onClick();
        }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          key={bouncing}
          animate={
            bouncing
              ? {
                  y: [0, -22, 0, -10, 0],
                  scale: [1, 1.05, 1, 1.02, 1],
                }
              : {}
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-[0_10px_30px_-8px_oklch(0_0_0/0.6),inset_0_1px_0_oklch(1_0_0/0.4)]`}
        >
          <Icon className="h-1/2 w-1/2 text-white drop-shadow-lg" strokeWidth={2} />
        </motion.div>
      </motion.button>
    </div>
  );
}

function Dock({ current, onNavigate }: { current: PageKey; onNavigate: (k: PageKey) => void }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass-strong flex items-end gap-3 rounded-3xl px-4 pb-3 pt-4"
      >
        {DOCK_ITEMS.map((item) => (
          <div key={item.key} className="flex flex-col items-center">
            <DockIcon item={item} mouseX={mouseX} onClick={() => onNavigate(item.key)} />
            <div
              className={`mt-1 h-1 w-1 rounded-full transition-colors ${
                current === item.key ? "bg-foreground" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Reveal wrapper ---------- */

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Home ---------- */

function HomePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);
  const orbY = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <div className="relative">
      <section className="relative flex min-h-[92vh] items-center justify-center px-6">
        <motion.div
          aria-hidden
          style={{ y: orbY }}
          className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        >
          <div
            className="h-full w-full rounded-full float-slow"
            style={{
              background: "radial-gradient(circle, oklch(0.72 0.16 55 / 0.4), transparent 60%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-warm-glow shadow-[0_0_10px_var(--warm-glow)]" />
            Now in soft launch
          </motion.div>
          <h1 className="glow-warm font-display text-[clamp(3rem,9vw,7rem)] font-light leading-[0.95]">
            Eolv — A modular ecosystem
            <br />
            <span className="italic text-warm-glow">built for clarity.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-muted-foreground">
            Privacy-first. Warm. Cinematic. Yours.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button className="glass-strong group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]">
              Explore the OS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Read the manifesto
            </button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-muted-foreground/60"
        >
          scroll
        </motion.div>
      </section>

      {/* Scroll cards */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="mb-16 max-w-3xl font-display text-5xl font-light leading-tight">
            An operating system that <span className="italic text-warm-glow">breathes</span> with
            you.
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Cinematic", body: "Every motion tuned. Every surface warm." },
            { title: "Private", body: "Nothing leaves your device. Ever." },
            { title: "Modular", body: "Compose your world one panel at a time." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="glass group relative overflow-hidden rounded-3xl p-8">
                <div className="mb-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  0{i + 1}
                </div>
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="mt-3 text-muted-foreground">{c.body}</p>
                <div className="absolute inset-x-0 -bottom-32 h-32 bg-gradient-to-t from-warm/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- About ---------- */

function AboutPage() {
  const pillars = [
    { icon: Feather, title: "Clarity", body: "No dark patterns. No noise. Only what serves you." },
    { icon: Sparkles, title: "Warmth", body: "Software should feel human, not sterile." },
    { icon: Layers, title: "Modularity", body: "Every part composable. Every part removable." },
    { icon: ShieldCheck, title: "Privacy", body: "Your data lives with you, and only you." },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Our philosophy
        </p>
        <h1 className="font-display text-6xl font-light leading-[1.05]">
          We build software the way
          <br />
          <span className="italic text-warm-glow">a warm room welcomes you home.</span>
        </h1>
      </Reveal>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="glass rounded-3xl p-8">
                <Icon className="h-8 w-8 text-warm-glow" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-3xl">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Mockup slide-in */}
      <Reveal delay={0.2} y={80}>
        <div className="mt-24">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <div className="mb-4 flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-white/30" />
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.6 }}
                    className="glass h-24 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
            an EolvOS workspace, sketched
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- Features ---------- */

function FeaturesPage() {
  const feats = [
    {
      icon: ShieldCheck,
      title: "Privacy-first architecture",
      body: "Nothing is collected. Nothing is sent. The network is optional.",
    },
    {
      icon: Layers,
      title: "Modular workspace",
      body: "Add, remove, rearrange. Every panel earns its place.",
    },
    {
      icon: Sparkles,
      title: "Liquid glass UI",
      body: "Depth, blur, warmth. A surface you want to touch.",
    },
    {
      icon: Radio,
      title: "Ecosystem-in-the-making",
      body: "Apps, tools, and games — quietly interoperating.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <h1 className="max-w-3xl font-display text-6xl font-light leading-[1.05]">
          Small ideas, <span className="italic text-warm-glow">carefully arranged.</span>
        </h1>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {feats.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 0.1} y={60}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="glass group relative h-full overflow-hidden rounded-3xl p-8"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-warm/40 to-warm-glow/20">
                  <Icon className="h-6 w-6 text-warm-glow" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-3xl">{f.title}</h3>
                <p className="mt-3 max-w-md text-muted-foreground">{f.body}</p>
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-warm/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Free AI ---------- */

const FREE_AI_ENDPOINT = "https://text.pollinations.ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function AiPage() {
  const [prompt, setPrompt] = useState("How can I make my laptop more private?");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Eolv Assistant. I use a free online API instead of Lovable AI, so you can try AI without adding a paid key.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    const question = prompt.trim();
    if (!question || loading) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const systemPrompt =
        "You are Eolv Assistant, a friendly privacy and security helper. Keep answers casual, practical, and concise.";
      const response = await fetch(
        `${FREE_AI_ENDPOINT}/${encodeURIComponent(`${systemPrompt}\n\nUser: ${question}`)}`,
      );

      if (!response.ok) {
        throw new Error(`Free AI request failed with ${response.status}`);
      }

      const answer = (await response.text()).trim();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer || "I could not generate a response this time." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "The free online AI is unavailable right now. Try again later, or ask a simpler privacy/security question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          <Wifi className="h-4 w-4 text-warm-glow" strokeWidth={1.5} />
          Free online API
        </p>
        <h1 className="max-w-3xl font-display text-6xl font-light leading-[1.05]">
          Eolv Assistant,
          <br />
          <span className="italic text-warm-glow">without Lovable AI.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          This page calls Pollinations text generation directly from the browser. It does not need a
          paid key, but prompts are sent to that free online service, so avoid private information.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="glass mt-12 overflow-hidden rounded-3xl p-4">
          <div className="max-h-[420px] space-y-3 overflow-y-auto p-2">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-warm/30 text-foreground"
                      : "bg-black/30 text-muted-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="rounded-2xl bg-black/30 px-4 py-3 text-sm text-muted-foreground">
                thinking with the free API…
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex gap-3 rounded-full bg-black/30 p-2">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void askAssistant();
              }}
              className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground/50"
              placeholder="Ask about privacy, security, or Eolv…"
            />
            <button
              onClick={() => void askAssistant()}
              disabled={loading || !prompt.trim()}
              className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" strokeWidth={1.5} />
              Ask
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- Games ---------- */

function GamesPage() {
  const [open, setOpen] = useState<"snake" | "ball" | "typing" | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());

  const easterEggs = [
    { key: "snake", label: "Snake", hint: "the slithery one", pos: "top-8 left-8" },
    { key: "ball", label: "Bouncing Ball", hint: "keeps going", pos: "top-32 right-12" },
    { key: "typing", label: "Typing Sprint", hint: "how fast?", pos: "bottom-40 left-1/3" },
  ] as const;

  return (
    <div className="relative mx-auto min-h-[80vh] max-w-6xl px-6 py-24">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Hidden corners
        </p>
        <h1 className="max-w-3xl font-display text-6xl font-light leading-[1.05]">
          Every OS deserves a <span className="italic text-warm-glow">playground.</span>
        </h1>
        <p className="mt-6 max-w-lg text-muted-foreground">
          Three tiny games live inside Eolv. Find their icons scattered across this page. Click one
          to play.
        </p>
      </Reveal>

      <div className="relative mt-16 h-[520px] rounded-3xl glass overflow-hidden">
        {/* Floating easter egg icons */}
        {easterEggs.map((egg, i) => (
          <motion.button
            key={egg.key}
            onClick={() => {
              setOpen(egg.key);
              setDiscovered((d) => new Set(d).add(egg.key));
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
            whileHover={{ scale: 1.15, rotate: 8 }}
            className={`absolute ${egg.pos} group flex items-center gap-2`}
          >
            <div className="glass-strong flex h-14 w-14 items-center justify-center rounded-2xl">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gamepad2 className="h-6 w-6 text-warm-glow" strokeWidth={1.5} />
              </motion.div>
            </div>
            <div className="glass rounded-full px-3 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
              {egg.label} · {egg.hint}
            </div>
          </motion.button>
        ))}

        {/* Ambient text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground/60">
            {discovered.size === 0
              ? "hover around, something is hiding"
              : `${discovered.size}/3 discovered`}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-2xl rounded-3xl p-6"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 rounded-full glass px-3 py-1 text-xs uppercase tracking-widest"
              >
                close
              </button>
              {open === "snake" && <SnakeGame />}
              {open === "ball" && <BallGame />}
              {open === "typing" && <TypingGame />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Snake ----- */
function SnakeGame() {
  const SIZE = 20;
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([5, 5]);
  const dir = useRef<[number, number]>([1, 0]);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
      };
      const nd = map[e.key];
      if (!nd) return;
      const [cx, cy] = dir.current;
      if (cx + nd[0] === 0 && cy + nd[1] === 0) return;
      dir.current = nd;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (dead) return;
    const id = setInterval(() => {
      setSnake((s) => {
        const [hx, hy] = s[0];
        const [dx, dy] = dir.current;
        const nh: [number, number] = [hx + dx, hy + dy];
        if (
          nh[0] < 0 ||
          nh[0] >= SIZE ||
          nh[1] < 0 ||
          nh[1] >= SIZE ||
          s.some(([x, y]) => x === nh[0] && y === nh[1])
        ) {
          setDead(true);
          return s;
        }
        const grew = nh[0] === food[0] && nh[1] === food[1];
        if (grew) {
          setScore((v) => v + 1);
          setFood([Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)]);
        }
        return [nh, ...(grew ? s : s.slice(0, -1))];
      });
    }, 120);
    return () => clearInterval(id);
  }, [dead, food]);

  const reset = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    dir.current = [1, 0];
    setScore(0);
    setDead(false);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-2xl">Snake</h3>
        <div className="text-sm text-muted-foreground">score {score}</div>
      </div>
      <div
        className="grid gap-[2px] rounded-2xl bg-black/40 p-2"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              className={`aspect-square rounded-[3px] ${
                isSnake
                  ? "bg-warm-glow"
                  : isFood
                    ? "bg-warm shadow-[0_0_10px_var(--warm-glow)]"
                    : "bg-white/[0.03]"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>arrow keys or WASD</span>
        {dead ? (
          <button onClick={reset} className="glass rounded-full px-3 py-1 text-foreground">
            game over · restart
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ----- Bouncing Ball ----- */
function BallGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const balls: { x: number; y: number; vx: number; vy: number; r: number; h: number }[] = [
      { x: 100, y: 100, vx: 3, vy: 2, r: 18, h: 40 },
    ];
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      balls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r || b.x > c.width - b.r) b.vx *= -1;
        if (b.y < b.r || b.y > c.height - b.r) b.vy *= -1;
        const grad = ctx.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 2, b.x, b.y, b.r);
        grad.addColorStop(0, `oklch(0.85 0.15 ${b.h})`);
        grad.addColorStop(1, `oklch(0.45 0.15 ${b.h})`);
        ctx.fillStyle = grad;
        ctx.shadowColor = `oklch(0.7 0.15 ${b.h})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    const onClick = (e: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      balls.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        r: 10 + Math.random() * 18,
        h: Math.random() * 360,
      });
      setClicks((v) => v + 1);
    };
    c.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-2xl">Bouncing Balls</h3>
        <div className="text-sm text-muted-foreground">{clicks + 1} orbs</div>
      </div>
      <canvas
        ref={ref}
        width={640}
        height={360}
        className="w-full cursor-crosshair rounded-2xl bg-black/40"
      />
      <p className="mt-3 text-xs text-muted-foreground">click to add more.</p>
    </div>
  );
}

/* ----- Typing ----- */
function TypingGame() {
  const words =
    "clarity warmth privacy modular cinema quiet glass ecosystem soft light dock hover slide reveal home".split(
      " ",
    );
  const [target, setTarget] = useState(() =>
    Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" "),
  );
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typed.length && start === null) setStart(Date.now());
    if (typed === target && start) setDone(true);
  }, [typed, target, start]);

  const elapsed = start ? (done ? (Date.now() - start) / 1000 : (Date.now() - start) / 1000) : 0;
  const wpm =
    start && typed.length
      ? Math.round(typed.split(" ").filter(Boolean).length / (elapsed / 60) || 0)
      : 0;

  const reset = () => {
    setTarget(
      Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" "),
    );
    setTyped("");
    setStart(null);
    setDone(false);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-2xl">Typing Sprint</h3>
        <div className="text-sm text-muted-foreground">
          {done ? `${wpm} wpm` : start ? `${elapsed.toFixed(1)}s` : "start typing"}
        </div>
      </div>
      <div className="rounded-2xl bg-black/40 p-6 font-mono text-lg leading-relaxed">
        {target.split("").map((ch, i) => {
          const t = typed[i];
          const cls =
            t == null
              ? "text-muted-foreground/50"
              : t === ch
                ? "text-warm-glow"
                : "text-red-400 underline";
          return (
            <span key={i} className={cls}>
              {ch}
            </span>
          );
        })}
      </div>
      <input
        autoFocus
        value={typed}
        onChange={(e) => !done && setTyped(e.target.value)}
        className="mt-3 w-full rounded-full glass px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-warm-glow"
        placeholder="type here…"
      />
      {done && (
        <button onClick={reset} className="mt-3 glass rounded-full px-4 py-2 text-sm">
          again
        </button>
      )}
    </div>
  );
}

/* ---------- Privacy ---------- */

function PrivacyPage() {
  const stats = [
    { icon: Server, label: "Optional AI API", value: "1" },
    { icon: Eye, label: "Trackers", value: "0" },
    { icon: Cookie, label: "Cookies set", value: "0" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">Privacy</p>
        <h1 className="max-w-3xl font-display text-6xl font-light leading-[1.05]">
          No tracking. No server.
          <br />
          <span className="italic text-warm-glow">Everything runs locally.</span>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="glass rounded-3xl p-8 text-center">
                <Icon className="mx-auto h-8 w-8 text-warm-glow" strokeWidth={1.5} />
                <div className="mt-6 font-display text-7xl font-light glow-warm">{s.value}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="glass mt-12 rounded-3xl p-10">
          <h3 className="font-display text-3xl">How Eolv thinks about your data</h3>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            {[
              "The core site is static. The AI page only sends prompts when you press Ask.",
              "No analytics and no fingerprinting are added by Eolv.",
              "Anything you type in the games stays in this browser tab.",
              "Close the tab and every trace is gone.",
            ].map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex items-start gap-3"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-glow shadow-[0_0_8px_var(--warm-glow)]" />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-16 text-center text-sm text-muted-foreground/60">
          Eolv — Privacy and security for the casual.
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- Root ---------- */

export function EolvLanding() {
  const [locked, setLocked] = useState(true);
  const [page, setPage] = useState<PageKey>("home");

  const pages: Record<PageKey, React.ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    features: <FeaturesPage />,
    ai: <AiPage />,
    games: <GamesPage />,
    privacy: <PrivacyPage />,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {locked && <LockScreen key="lock" onUnlock={() => setLocked(false)} />}
      </AnimatePresence>

      {!locked && (
        <>
          {/* Menu bar */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-3 text-xs text-muted-foreground"
          >
            <div className="glass rounded-full px-4 py-1.5 font-display text-sm text-foreground">
              Eolv
            </div>
            <div className="glass rounded-full px-4 py-1.5 uppercase tracking-[0.25em] capitalize">
              {page}
            </div>
          </motion.div>

          <main className="pb-40 pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {pages[page]}
              </motion.div>
            </AnimatePresence>
          </main>

          <Dock current={page} onNavigate={setPage} />
        </>
      )}
    </div>
  );
}
