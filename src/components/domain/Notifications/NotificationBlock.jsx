import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../../context/UserContext";
import NotificationCard from "./NotificationCard";
import { useLocation } from "react-router";
import "./NotificationBlock.css";

export default function NotificationsPage() {
  const { profile, setCounts } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!profile?.id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      // 1) Load notification list
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          type,
          created_at,
          read_at,
          post:post_id (
            id,
            media
          ),
          actor:actor_id (
            id,
            full_name,
            username,
            avatar_url
          ),
          comment:comment_id (
            id,
            content
          )
        `,
        )
        .eq("recipient_id", profile.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error("notifications list error", error);
          setItems([]);
        } else {
          setItems(data || []);
        }
        setLoading(false);
      }

      // 2) Mark all unread as read
      const nowIso = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read_at: nowIso })
        .eq("recipient_id", profile.id)
        .is("read_at", null);

      if (updateError) {
        console.error("notifications read update error", updateError);
      }

      // 3) Locally set notifications count to 0 so the topbar badge disappears
      setCounts((prev) => ({
        ...prev,
        notifications: 0,
      }));
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [profile?.id, location.key]);

  function groupNotificationsByDate(list) {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    function diffInDays(date) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const diffMs = todayStart - d;
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    const groups = {};

    for (const n of list) {
      const created = new Date(n.created_at);
      const daysAgo = diffInDays(created);

      let label;
      if (daysAgo === 0) {
        label = "Today";
      } else if (daysAgo === 1) {
        label = "Yesterday";
      } else if (daysAgo < 7) {
        label = "Last week";
      } else {
        label = "Earlier";
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    }

    return groups;
  }

  if (loading) {
    return <div className="notifications-page">Loading...</div>;
  }

  if (!items.length) {
    return (
      <div className="notifications-page notifications-empty">
        No notifications yet.
      </div>
    );
  }

  const grouped = groupNotificationsByDate(items);
  const sectionOrder = ["Today", "Yesterday", "Last week", "Earlier"];

  return (
    <div className="notifications-page">
      {sectionOrder.map((section) => {
        const group = grouped[section];
        if (!group || !group.length) return null;

        return (
          <div key={section} className="notifications-section">
            <h2 className="notifications-section-title">{section}</h2>
            {group.map((n) => (
              <NotificationCard key={n.id} notif={n} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
