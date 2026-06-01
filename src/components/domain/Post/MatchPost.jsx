import { useEffect, useRef, useState } from "react";
import MatchCard from "./MatchCard";
import PostHeader from "./PostHeader";
import "./MatchPost.css";
import PostActions from "./PostActions";

export default function MatchPost({
  id,
  author,
  authorId,
  createdAt,
  author_role,
  content,
  imageUrl,
  goalsCount,
  assistsCount,
  minCount,
  date,
  league,
  yourTeam,
  opponent,
  yourScore,
  opponentScore,
  position,
  hideFollow = false,
  likesCount,
  commentsCount,
  initialLiked = null,
  yellowCards = 0,
  redCards = 0,
}) {
  const isImage = !!imageUrl;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <article className="match-post" data-id={id}>
      <PostHeader
        name={author}
        date={createdAt}
        role={author_role}
        authorId={authorId}
        position={position}
        club={yourTeam}
        hideFollow={hideFollow}
      />

      {content && (
        <div className="match-post-content-container">
          <p
            ref={textRef}
            className={`match-post-content ${isExpanded ? "expanded" : ""}`}
          >
            {content}
          </p>
          {isOverflowing && (
            <button
              className="see-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}
      <MatchCard
        imageUrl={imageUrl}
        yourTeam={yourTeam}
        yourScore={yourScore}
        opponent={opponent}
        opponentScore={opponentScore}
        league={league}
        date={date}
        goalsCount={goalsCount}
        assistsCount={assistsCount}
        minCount={minCount}
        yellowCards={yellowCards}
        redCards={redCards}
      />
      <PostActions
        postId={id}
        auraCount={likesCount}
        commentCount={commentsCount}
        postAuthorId={authorId}
        initialLiked={initialLiked}
      />
    </article>
  );
}
