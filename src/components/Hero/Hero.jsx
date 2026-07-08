import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import "./Hero.css";

const slides = [
  {
    eyebrow: "CURATED FOR SERIOUS ASPIRANTS",
    title: "Books that move your preparation forward.",
    subtitle: "Trusted exam resources, thoughtful editions, and dependable delivery all in one place.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  },
  {
    eyebrow: "PREPARE WITH CLARITY",
    title: "Study smarter for every competitive exam.",
    subtitle: "Focused material for SSC, teaching, banking, and state-level examinations.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    eyebrow: "PICASSO PUBLICATIONS",
    title: "Turn preparation into measurable progress.",
    subtitle: "Quality books created to make difficult concepts easier to learn and revise.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((value) => (value + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-left">
        <AnimatePresence mode="wait">
          <Motion.div
            key={current}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <p className="hero-eyebrow">{slides[current].eyebrow}</p>
            <h1>{slides[current].title}</h1>
            <p className="hero-subtitle">{slides[current].subtitle}</p>
          </Motion.div>
        </AnimatePresence>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => scrollTo("new-arrivals")}>Explore new books</button>
          <button className="btn-secondary" onClick={() => scrollTo("top-selling")}>View bestsellers</button>
        </div>
        <div className="hero-trust">
          <div className="glass-card"><strong>10K+</strong><span>Learners served</span></div>
          <div className="glass-card"><strong>Fast</strong><span>Pan-India delivery</span></div>
          <div className="glass-card"><strong>100%</strong><span>Genuine books</span></div>
        </div>
      </div>
      <div className="hero-right">
        <AnimatePresence mode="wait">
          <Motion.img
            key={slides[current].image}
            src={slides[current].image}
            alt="A curated Picasso Publications study collection"
            loading="eager"
            initial={{ opacity: 0, scale: .97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .45 }}
          />
        </AnimatePresence>
        <div className="hero-image-label"><span>Editor's selection</span><strong>Built for your next milestone</strong></div>
      </div>
    </section>
  );
}
