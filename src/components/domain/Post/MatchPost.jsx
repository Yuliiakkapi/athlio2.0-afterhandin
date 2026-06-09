import { useEffect, useRef, useState } from "react";
import MatchCard from "./MatchCard";
import PostHeader from "./PostHeader";
import MediaCarousel from "../../UI/MediaCarousel";
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
  yourTeamLogoUrl,
  opponentLogoUrl,
  mediaUrls,
}) {
  // Normalize: prefer mediaUrls array, fall back to single imageUrl
  const allUrls = mediaUrls?.length ? mediaUrls : (imageUrl ? [imageUrl] : []);
  // 1 photo → with-picture card; 0 or 2+ → without-picture + optional carousel
  const cardImageUrl = allUrls.length === 1 ? allUrls[0] : null;
  const carouselUrls = allUrls.length >= 2 ? allUrls : [];

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
        imageUrl={cardImageUrl}
        yourTeam={yourTeam}
        yourTeamLogoUrl={yourTeamLogoUrl}
        opponentLogoUrl={opponentLogoUrl}
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
      {carouselUrls.length > 0 && <MediaCarousel urls={carouselUrls} />}
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
