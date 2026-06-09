import "./MediaCarousel.css";

export default function MediaCarousel({ urls = [] }) {
  if (!urls.length) return null;

  if (urls.length === 1) {
    return (
      <div className="media-carousel">
        <img src={urls[0]} alt="" className="media-carousel-single" />
      </div>
    );
  }

  return (
    <div className="media-carousel media-carousel--multi">
      {urls.map((url, i) => (
        <div key={i} className="media-carousel-item">
          <img src={url} alt="" className="media-carousel-img" />
        </div>
      ))}
    </div>
  );
}
