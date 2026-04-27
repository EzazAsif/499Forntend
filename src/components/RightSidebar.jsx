import { useEffect, useState } from "react";

export default function RightSidebar({ data }) {
  const [contextData, setContextData] = useState([]);

  // push new websocket messages
  useEffect(() => {
    if (!data) return;
    setTimeout(() => {
      setContextData((prev) => [
        ...prev,
        ...(data.query
          ? [
              {
                type: "client",
                text: `(${data.emotion}, ${data.sentiment}): ${data.query}`,
              },
            ]
          : []),
        ...(data.answer
          ? [
              {
                type: "therapist",
                text: data.answer,
              },
            ]
          : []),
      ]);
    }, 3000);
  }, [data]);

  return (
    <div
      className="right-sidebar"
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <h1 className="sidebar-title">Session Context</h1>

      {contextData.map((item, index) => {
        const isClient = item.type === "client";

        return (
          <div key={index} className={isClient ? "card" : "card-accent"}>
            <div className="card-title">
              {isClient ? "Client" : "Therapist"}
            </div>
            <div className="value">{item.text}</div>
          </div>
        );
      })}
    </div>
  );
}
