import { useEffect, useState, useRef } from "react";

export default function SummaryPanel() {
  const [summary, setSummary] = useState("");
  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);

  const fetched = useRef(false);
  const audioRef = useRef(null);

  const API = "http://localhost:3000"; // 🔥 replace this

  /* 🧠 Fetch summary */
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API}/summarize`);
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        console.error("Summary fetch failed", err);
      }
    };

    fetchSummary();
  }, []);

  /* 📚 Fetch articles + videos */
  useEffect(() => {
    if (!summary) return;

    const fetchArticles = async () => {
      try {
        const res = await fetch(`${API}/articles`);
        const data = await res.json();
        setLinks(data.links || []);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Articles fetch failed", err);
      }
    };

    fetchArticles();
  }, [summary]);

  /* 🔊 Speak summary */
  useEffect(() => {
    if (!summary) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(`${API}/tts?text=${encodeURIComponent(summary)}`);

    audioRef.current = audio;
    audio.preload = "auto";

    audio.onloadeddata = () => {
      audio.play().catch(() => {});
    };

    audio.onerror = () => {
      console.error("TTS failed");
    };

    return () => {
      audio.pause();
    };
  }, [summary]);

  /* 🎥 Helpers */
  const getVideoUrl = (url) => {
    try {
      return decodeURIComponent(url.split("uddg=")[1] || url);
    } catch {
      return url;
    }
  };

  const getThumbnail = (url) => {
    try {
      const decoded = getVideoUrl(url);
      const match =
        decoded.match(/v=([^&]+)/) || decoded.match(/youtu\.be\/([^?]+)/);
      if (!match) return "";
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    } catch {
      return "";
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        height: "100%",
        overflowY: "auto",
        color: "#000000", // ✅ ALL TEXT BLACK
        background: "#f8fbff",
      }}
    >
      {/* SUMMARY */}
      <div style={{ marginBottom: "30px" }}>
        <h2 className="sidebar-title" style={{ color: "#0284c7" }}>
          Session Summary
        </h2>

        <div
          className="card"
          style={{
            fontSize: "15px",
            lineHeight: "1.7",
            padding: "20px",
            color: "#000000",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {summary || "Summary will appear here..."}
        </div>
      </div>

      {/* ARTICLES */}
      <div>
        <h2 className="sidebar-title" style={{ color: "#0284c7" }}>
          Helpful Articles
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Source</th>
              <th style={th}>Open</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link, i) => (
              <tr key={i}>
                <td style={td}>{link.title}</td>
                <td style={td}>{link.source}</td>
                <td style={td}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-btn"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIDEOS */}
      <div style={{ marginTop: "35px" }}>
        <h2 className="sidebar-title" style={{ color: "#0284c7" }}>
          Helpful Videos
        </h2>

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {videos.map((video, i) => (
            <a
              key={i}
              href={getVideoUrl(video.url)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                gap: "12px",
                padding: "10px",
                background: "#ffffff",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#000000",
                alignItems: "center",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "0.2s",
              }}
            >
              <img
                src={getThumbnail(video.url)}
                alt="thumb"
                style={{
                  width: "120px",
                  height: "68px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                {video.title}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* TABLE STYLES */
const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid rgba(0,0,0,0.1)",
  color: "#000000",
  fontWeight: "600",
};

const td = {
  padding: "12px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  color: "#000000",
};
