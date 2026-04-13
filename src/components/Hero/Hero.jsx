import React, { useState, useEffect } from "react";
import "./Hero.css";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "UPSC",
    subtitle: "Crack Civil Services with the Best Books",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  },
  {
    title: "SSC",
    subtitle: "Prepare Smart for SSC Exams",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc"
  },
  {
    title: "Banking",
    subtitle: "Ace Banking Exams with Confidence",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // ✅ Auto slide (slightly slower = smoother)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">

      {/* LEFT */}
      <div className="hero-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              {slides[current].title} <br />
              <span>{slides[current].subtitle}</span>
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Explore Books
          </button>

          <button className="btn-secondary">
            Top Sellers
          </button>
        </div>

        <div className="hero-trust">
          <div className="glass-card">✅ 10K+ Students</div>
          <div className="glass-card">🚚 Fast Delivery</div>
          <div className="glass-card">💯 Genuine Books</div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[current].image}
            src={slides[current].image}
            alt="Books"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            exit={{ opacity: 0, x: -30 }}
            transition={{
              opacity: { duration: 0.5 },
              x: { duration: 0.5 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </AnimatePresence>
      </div>

    </section>
  );
};

export default Hero;