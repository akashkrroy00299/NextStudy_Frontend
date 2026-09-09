import React, { useState } from "react";
import AllNotifications from "./components/AllNotifications";
import { useNotifications } from "./hook/useNotification.js";
import "./Notification.css";

const options = ["all", "unseen", "seen"];

const Notification = () => {
  const [page, setPage] = useState("all");
  const { grouped, loading, error, markAllASRead } = useNotifications();

  const currentNotifications = grouped[page];

  if (loading) return <div className="notification_page_layout_wrapper state_msg">Loading…</div>;
  if (error) return <div className="notification_page_layout_wrapper state_msg">Something went wrong.</div>;

  return (
    <div className="notification_page_layout_wrapper">
      <div className="header_part">
        <div>
          <p>Notifications</p>
          <button onClick={markAllASRead}>Mark all read</button>
        </div>

        <div className="notification_tabs">
          {options.map((op) => (
            <button
              key={op}
              onClick={() => setPage(op)}
              className={page === op ? "active" : ""}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="notification_container">
        <AllNotifications groupedNotifications={currentNotifications} />
      </div>
    </div>
  );
};

export default Notification;