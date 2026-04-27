import React, { useEffect, useRef } from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";
/* ─── Dot Grid ────────────────────────────────────────────── */

const COLS = 13;
const CENTER = 6;
const RADIUS = 6.2;
const PERIOD_MS = 1900;
const MAX_DIST = 6.2;
const TEAL_PALETTE = [
  "#1F6B78",
  "#2E7E8C",
  "#3E8E9C",
  "#5A9EA8",
  "#7BB8C2",
  "#9ECDD5",
];

function buildDots() {
  const dots = [];
  for (let i = 0; i < COLS * COLS; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const dist = Math.sqrt((col - CENTER) ** 2 + (row - CENTER) ** 2);
    const isOuter = dist > RADIUS;
    if (isOuter) {
      dots.push({ isOuter: true, delayMs: 0, color: "" });
    } else {
      const phase = (dist / MAX_DIST) * (PERIOD_MS / 2);
      const delayMs = Math.round(-(PERIOD_MS / 2 - phase));
      const ci = Math.min(
        Math.floor(dist / (MAX_DIST / (TEAL_PALETTE.length - 1))),
        TEAL_PALETTE.length - 1,
      );
      dots.push({ isOuter: false, delayMs, color: TEAL_PALETTE[ci] });
    }
  }
  return dots;
}

const DOTS = buildDots();

/* ─── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav>
      <a href="#" className="nav-logo" aria-label="Monoসেবা home">
        <span className="mono">Mono</span>
        <span className="seva">সেবা</span>
      </a>
      <ul className="nav-links">
        <li>
          <a href="#how-it-works">How It Works</a>
        </li>
        <li>
          <a href="#science">Our Research</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
      <button className="nav-cta">Get Early Access</button>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let hoverRaf = null;

    const handleMouseMove = (e) => {
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = null;
        const rect = grid.getBoundingClientRect();
        const col = Math.min(
          12,
          Math.max(0, Math.floor((e.clientX - rect.left) / (rect.width / 13))),
        );
        const row = Math.min(
          12,
          Math.max(0, Math.floor((e.clientY - rect.top) / (rect.height / 13))),
        );
        const fromIdx = row * 13 + col;
        const dots = grid.querySelectorAll(".dot:not(.dot-outer)");
        const allDots = grid.querySelectorAll(".dot");

        allDots.forEach((dot, i) => {
          if (dot.classList.contains("dot-outer")) return;
          const dr = Math.floor(i / 13) - row;
          const dc = (i % 13) - col;
          const dist = Math.sqrt(dr * dr + dc * dc);
          const delay = dist * 20;
          const scale = Math.max(0.65, 1.5 - dist * 0.12);

          dot.style.transition = `transform 500ms ease-out ${delay}ms`;
          dot.style.transform = `scale(${scale})`;

          setTimeout(
            () => {
              dot.style.transition = "";
              dot.style.transform = "";
            },
            500 + delay + 100,
          );
        });

        void fromIdx;
        void dots;
      });
    };

    grid.addEventListener("mousemove", handleMouseMove);
    return () => grid.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" aria-hidden="true" />
        Multimodal AI · Empathetic Intelligence
      </div>

      <h1 className="hero-headline serif" id="hero-headline">
        True Empathy,
        <br />
        <em>Decoded.</em>
      </h1>

      <p className="hero-sub">
        <strong style={{ fontWeight: 500, color: "var(--deep-slate)" }}>
          Mono
          <span
            style={{
              fontFamily: "'Hind Siliguri', sans-serif",
              color: "var(--teal)",
            }}
          >
            সেবা
          </span>
        </strong>{" "}
        is an intelligent conversational companion. By seamlessly analyzing your
        words, tone of voice, and subtle facial expressions, it understands your
        true emotional state — providing a safe space and genuine care.
      </p>

      <div className="hero-actions">
        <button className="btn-primary" onClick={() => navigate("/app")}>
          Start a Session
        </button>
        <button className="btn-ghost">Watch Demo</button>
      </div>

      <div className="dot-grid-wrap" aria-hidden="true">
        <span className="dot-grid-label">Emotional Signal Processing</span>
        <div className="dot-grid" id="dotGrid" ref={gridRef}>
          {DOTS.map((dot, i) => (
            <div
              key={i}
              className={`dot${dot.isOuter ? " dot-outer" : ""}`}
              style={
                !dot.isOuter
                  ? {
                      animationDelay: `${dot.delayMs}ms`,
                      background: dot.color,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────────── */
function Features() {
  return (
    <section
      className="features"
      id="how-it-works"
      aria-labelledby="features-title"
    >
      <div className="features-header reveal">
        <p className="section-label">The Multimodal Engine</p>
        <h2
          className="section-title serif"
          id="features-title"
          style={{ margin: "0 auto", textAlign: "center" }}
        >
          Three Lenses.
          <br />
          One Understanding.
        </h2>
      </div>

      <div className="features-grid">
        <article className="feature-card text reveal reveal-delay-1">
          <div className="feature-icon" aria-hidden="true">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 12h8M8 8h8M8 16h5"
                stroke="#5A9EA8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="#5A9EA8"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <span className="feature-tag">Text</span>
          <h3 className="feature-title serif">Context-Aware Conversation</h3>
          <p className="feature-body">
            More than just a chatbot. Monoসেবা reads between the lines of your
            conversation to grasp your true intent, tracking semantic patterns
            and emotional subtext across the full dialogue arc.
          </p>
        </article>

        <article className="feature-card audio reveal reveal-delay-2">
          <div className="feature-icon" aria-hidden="true">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 18V5l12-2v13"
                stroke="#E89A8A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="18" r="3" stroke="#E89A8A" strokeWidth="1.8" />
              <circle
                cx="18"
                cy="16"
                r="3"
                stroke="#E89A8A"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <span className="feature-tag">Audio</span>
          <h3 className="feature-title serif">Vocal Tone Analysis</h3>
          <p className="feature-body">
            It isn't just what you say, but how you say it. Our audio encoders
            understand the pitch, rhythm, and prosody of your voice — detecting
            hesitation, tremor, and warmth that words alone cannot convey.
          </p>
        </article>

        <article className="feature-card visual reveal reveal-delay-3">
          <div className="feature-icon" aria-hidden="true">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="10"
                r="4"
                stroke="#2C3E50"
                strokeWidth="1.8"
              />
              <path
                d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
                stroke="#2C3E50"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="feature-tag">Visual</span>
          <h3 className="feature-title serif">Micro-Emotion Detection</h3>
          <p className="feature-body">
            Captures fleeting, 0.04-second micro-expressions to recognize
            feelings you might not even realize you're showing — bridging the
            gap between what is said and what is truly felt.
          </p>
        </article>
      </div>
    </section>
  );
}

/* ─── Science ─────────────────────────────────────────────── */
function Science() {
  return (
    <section className="science" id="science" aria-labelledby="science-title">
      <div className="science-inner">
        <p className="section-label reveal">Built on Research</p>
        <h2
          className="section-title serif reveal reveal-delay-1"
          id="science-title"
        >
          Built on Groundbreaking
          <br />
          AI Research.
        </h2>
        <div
          className="science-divider reveal reveal-delay-2"
          aria-hidden="true"
        />
        <p className="science-body reveal reveal-delay-2">
          Powered by advanced cross-modal attention mechanisms, Monoসেবা
          overcomes the &ldquo;neutral dominance&rdquo; of standard AI. It
          accurately maps your feelings across 8 distinct emotional states and
          continuous sentiment spectrums, ensuring you receive the precise
          empathetic response you need.
        </p>

        <div className="stats-row">
          <div className="stat-card reveal reveal-delay-1">
            <div className="stat-number">
              8<span>+</span>
            </div>
            <div className="stat-label">
              Distinct emotional states mapped in real time
            </div>
          </div>
          <div className="stat-card reveal reveal-delay-2">
            <div className="stat-number">
              0<span>.04s</span>
            </div>
            <div className="stat-label">Micro-expression detection speed</div>
          </div>
          <div className="stat-card reveal reveal-delay-3">
            <div className="stat-number">
              3<span>×</span>
            </div>
            <div className="stat-label">
              Modalities fused for holistic understanding
            </div>
          </div>
          <div
            className="stat-card reveal reveal-delay-3"
            style={{ transitionDelay: ".48s" }}
          >
            <div className="stat-number">
              94<span>%</span>
            </div>
            <div className="stat-label">
              Emotional recognition accuracy in trials
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Quote ───────────────────────────────────────────────── */
function Quote() {
  return (
    <section className="quote-section" aria-labelledby="quote-text">
      <span className="quote-mark reveal" aria-hidden="true">
        &ldquo;
      </span>
      <p className="quote-text serif reveal reveal-delay-1" id="quote-text">
        The most powerful form of care begins with truly being heard — not just
        in words, but in every silent signal the human body gives.
      </p>
      <p className="quote-author reveal reveal-delay-2">
        — Monoসেবা Design Principle
      </p>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer id="contact">
      <div className="footer-inner">
        <div className="footer-brand">
          <div>
            <span className="mono">Mono</span>
            <span className="seva">সেবা</span>
          </div>
          <p className="footer-tagline">
            Care of the Heart &nbsp;·&nbsp; হৃদয়ের সেবা
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Product</h4>
          <ul>
            <li>
              <a href="#">How It Works</a>
            </li>
            <li>
              <a href="#">Research</a>
            </li>
            <li>
              <a href="#">Early Access</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Ethics</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Use</a>
            </li>
            <li>
              <a href="#">Data Safety</a>
            </li>
            <li>
              <a href="#">Accessibility</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 Monoসেবা. All rights reserved.</span>
        <span>Made with care &nbsp;·&nbsp; Dhaka, Bangladesh</span>
      </div>
    </footer>
  );
}

/* ─── App ─────────────────────────────────────────────────── */
export default function WelcomePage() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="landing">
        <Nav />
        <Hero />
        <Features />
        <Science />
        <Quote />
        <Footer />
      </div>
    </>
  );
}
