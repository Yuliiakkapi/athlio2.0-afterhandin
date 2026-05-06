import ProfilePicture from "../../UI/ProfilePicture";
import "./NotificationCard.css";
import { Link } from "react-router";

export default function NotificationCard({ notif }) {
  const actorName =
    notif.actor?.full_name || notif.actor?.username || "Someone";

  const time = new Date(notif.created_at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUnread = !notif.read_at;
  const postImage = notif?.post?.media;

  return (
    <Link
      to={notif.post?.id ? `/post/${notif.post.id}` : "#"}
      className={`notif-row ${isUnread ? "notif-unread" : ""}`}
    >
      <ProfilePicture size="small" imgUrl={notif.actor?.avatar_url} />
      <div className="notif-main">
        <p className="notif-text">
          <span className="notif-actor">{actorName}</span>
          {notif.type === "like" && " just boosted your aura."}
          {notif.type === "comment" && " commented on your post:"}
          {notif.type === "comment" && (
            <span className="notif-comment-preview">
              {" "}
              "{notif.comment?.content}"
            </span>
          )}
          {notif.type !== "like" &&
            notif.type !== "comment" &&
            " did something"}
        </p>
      </div>
      {postImage && (
        <div className="notif-post-preview">
          <img src={postImage} alt="Post preview" />
        </div>
      )}
    </Link>
  );
}
