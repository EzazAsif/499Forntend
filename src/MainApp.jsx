import { useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Visualizer from "./components/Visualizer";
import RightSidebar from "./components/RightSidebar";
import Header from "./components/Header";
import SummaryPanel from "./components/SummaryPanel";
import "./App.css";

export default function MainApp() {
  const [wsData, setWsData] = useState({
    emotion: "Waiting...",
    sentiment: "Waiting...",
    query: "",
    answer: "",
  });

  const [isPaused, setIsPaused] = useState(false);
  const visualizerRef = useRef(null);
  // summarize handler
  const handleSummarize = async () => {
    setShowSummary(true);

    // later replace with API call
    setSummaryData({
      summary:
        "The client appears to be experiencing elevated stress levels associated with workload and uncertainty about future goals. Throughout the session, emotional tone shifted from frustration to reflective calm. The client expressed concerns about productivity, self-expectations, and difficulty maintaining focus. There are indications of mild anxiety patterns and cognitive overthinking. However, the client also demonstrated openness to structured coping strategies and showed positive engagement when discussing actionable steps. The recommended direction includes gradual workload structuring, scheduled breaks, grounding exercises, and maintaining realistic expectations. Reinforcing positive progress and encouraging consistent routines may improve emotional stability. Continued monitoring of emotional variance and stress triggers is advised.",
      links: [
        {
          title: "How to Manage Stress Effectively",
          source: "Psychology Today",
          url: "https://www.psychologytoday.com",
        },
        {
          title: "CBT Techniques for Anxiety",
          source: "VeryWellMind",
          url: "https://www.verywellmind.com",
        },
        {
          title: "Grounding Exercises Guide",
          source: "Healthline",
          url: "https://www.healthline.com",
        },
      ],
    });
  };
  const [showSummary, setShowSummary] = useState(false);

  const [summaryData, setSummaryData] = useState({
    summary: "",
    links: [],
  });

  // websocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setWsData(data);
    };

    return () => ws.close();
  }, []);

  // pause / resume handlers
  const handlePause = () => {
    visualizerRef.current?.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    visualizerRef.current?.resume();
    setIsPaused(false);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "70px 1fr",
        height: "100vh",
      }}
    >
      {/* HEADER */}
      <Header
        onPause={handlePause}
        onResume={handleResume}
        isPaused={isPaused}
        onSummarize={handleSummarize}
      />

      {/* MAIN */}
      <div
        className="app"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr 420px",
          minHeight: 0,
        }}
      >
        <div className="sidebar">
          <Sidebar data={wsData} />
        </div>

        <div className="main">
          <div className="glow"></div>
          {showSummary ? (
            <SummaryPanel
              summary={summaryData.summary}
              links={summaryData.links}
            />
          ) : (
            <Visualizer ref={visualizerRef} text={wsData.answer} />
          )}
        </div>

        <RightSidebar data={wsData} />
      </div>
    </div>
  );
}
