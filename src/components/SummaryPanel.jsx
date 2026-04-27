import { useEffect, useState, useRef } from "react";

export default function SummaryPanel() {
  const [summary, setSummary] = useState("");
  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);

  const fetched = useRef(false);
  const audioRef = useRef(null);

  /* 🧠 Fetch summary */
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:3000/summarize");
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
        const res = await fetch("http://localhost:3000/articles");
        const data = await res.json();
        setLinks(data.links || []);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Articles fetch failed", err);
      }
    };

    fetchArticles();
  }, [summary]);

  /* 🔊 Speak summary using YOUR TTS API */
  useEffect(() => {
    if (!summary) return;

    // stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(
      `http://localhost:3000/tts?text=${encodeURIComponent(summary)}`,
    );

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

  /* 🎥 Decode DuckDuckGo redirect */
  const getVideoUrl = (url) => {
    try {
      return decodeURIComponent(url.split("uddg=")[1] || url);
    } catch {
      return url;
    }
  };

  /* 🖼️ YouTube thumbnail extractor */
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
        color: "#ffffff",
      }}
    >
      {/* SUMMARY */}
      <div style={{ marginBottom: "30px" }}>
        <h2 className="sidebar-title">Session Summary</h2>

        <div
          className="card"
          style={{
            fontSize: "15px",
            lineHeight: "1.7",
            padding: "20px",
          }}
        >
          {summary || "Summary will appear here..."}
        </div>
      </div>

      {/* ARTICLES */}
      <div>
        <h2 className="sidebar-title">Helpful Articles</h2>

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

      {/* YOUTUBE VIDEOS */}
      <div style={{ marginTop: "35px" }}>
        <h2 className="sidebar-title">Helpful Videos</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
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
                background: "#020617",
                borderRadius: "10px",
                textDecoration: "none",
                color: "white",
                alignItems: "center",
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

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "12px 10px",
  borderBottom: "1px solid #0f172a",
};
