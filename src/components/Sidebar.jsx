import { useEffect, useRef, useState } from "react";

export default function Sidebar({ data }) {
  const [previous, setPrevious] = useState({
    emotion: null,
    sentiment: null,
  });

  const lastRef = useRef({
    emotion: null,
    sentiment: null,
  });

  // update previous when new data arrives
  useEffect(() => {
    if (!data) return;

    setPrevious({
      emotion: lastRef.current.emotion,
      sentiment: lastRef.current.sentiment,
    });

    lastRef.current = {
      emotion: data.emotion,
      sentiment: data.sentiment,
    };
  }, [data]);

  const analysis = {
    emotion: data?.emotion || "Waiting...",
    sentiment: data?.sentiment || "Waiting...",
    prevEmotion: previous?.emotion || "—",
    prevSentiment: previous?.sentiment || "—",
    query: data?.query || "",
    status: "Live WebSocket",
  };

  const items = [
    { key: "emotion", label: "Current Emotion" },
    { key: "prevEmotion", label: "Previous Emotion" },
    { key: "sentiment", label: "Overall Sentiment" },
    { key: "prevSentiment", label: "Previous Sentiment" },
    { key: "query", label: "What You're Saying" },
  ];

  return (
    <>
      <h1 className="sidebar-title">AI Analysis</h1>

      {items.map(({ key, label }) => (
        <div className="card" key={key}>
          <div className="label">{label}</div>
          <div className="value">{analysis[key]}</div>
        </div>
      ))}
    </>
  );
}
