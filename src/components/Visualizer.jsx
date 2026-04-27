import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const Visualizer = forwardRef(({ text }, ref) => {
  const canvasRef = useRef(null);
  const speakingRef = useRef(false);
  const audioRef = useRef(null);
  const pausedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    pause: () => {
      pausedRef.current = true;
      if (audioRef.current) audioRef.current.pause();
      speakingRef.current = false;
      fetch("http://localhost:3000/trigger_unlock");
    },
    resume: () => {
      pausedRef.current = false;
      if (audioRef.current) audioRef.current.play();
      speakingRef.current = true;
    },
  }));

  // unlock audio once (Chrome autoplay policy)
  useEffect(() => {
    const unlock = () => {
      if (audioRef.current && !pausedRef.current) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("pointerdown", unlock);
    };
    document.addEventListener("pointerdown", unlock);
  }, []);

  // ORB VISUALIZER
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let time = 0;

    const draw = () => {
      requestAnimationFrame(draw);

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      time += 0.02;

      const speaking = speakingRef.current;

      const base =
        130 + Math.sin(time * (speaking ? 4 : 1.5)) * (speaking ? 25 : 8);

      const glow = speaking ? 40 : 15;

      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        base * 0.2,
        cx,
        cy,
        base,
      );

      gradient.addColorStop(0, "rgba(0,255,200,0.9)");
      gradient.addColorStop(0.4, "rgba(0,200,255,0.6)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.beginPath();
      ctx.arc(cx, cy, base, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, base + glow, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,200,0.25)";
      ctx.lineWidth = speaking ? 3 : 1;
      ctx.stroke();
    };

    draw();
  }, []);

  // EDGE TTS SPEECH
  useEffect(() => {
    if (!text) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setTimeout(() => {
      if (!pausedRef.current) {
        speakingRef.current = true;
      }
    }, 300);

    const audio = new Audio(
      `http://localhost:3000/tts?text=${encodeURIComponent(text)}`,
    );

    audioRef.current = audio;
    audio.preload = "auto";

    audio.onloadeddata = () => {
      if (!pausedRef.current) {
        audio.play().catch(() => {});
      }
    };

    audio.onended = () => {
      speakingRef.current = false;
      fetch("http://localhost:3000/trigger_unlock");
    };

    audio.onerror = () => {
      speakingRef.current = false;
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{
        maxWidth: "75vh",
        maxHeight: "75vh",
        display: "block",
      }}
    />
  );
});

export default Visualizer;
