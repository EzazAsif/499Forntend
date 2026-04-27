export default function Header({ onPause, onResume, isPaused, onSummarize }) {
  const handleClearContext = async () => {
    try {
      const res = await fetch("http://localhost:3000/clear_context"); // <-- your GET endpoint
      const data = await res.json();
      console.log("Clear Context Response:", data);
    } catch (err) {
      console.error("Error clearing context:", err);
    }
  };

  return (
    <div
      className="header"
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr 420px",
        alignItems: "center",
      }}
    >
      {/* LEFT */}
      <div style={{ paddingLeft: "20px" }}>
        <button className="header-btn" onClick={handleClearContext}>
          Clear Context
        </button>
      </div>

      {/* CENTER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span className="header-title">মনোসেবা</span>

        <button
          className="header-btn"
          style={{
            padding: "4px 16px",
            fontSize: "12px",
          }}
          onClick={onSummarize}
        >
          Summarize Session
        </button>
      </div>

      {/* RIGHT CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          paddingRight: "20px",
        }}
      >
        <div className="status">● Live</div>

        <button className="header-btn" onClick={onResume}>
          Start
        </button>

        <button className="header-btn" onClick={onPause}>
          Pause
        </button>
      </div>
    </div>
  );
}
