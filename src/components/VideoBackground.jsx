export default function VideoBackground({ src, poster, className = "", children }) {
  return (
    <div className={`video-bg ${className}`}>
      <video className="video-bg-media" autoPlay muted loop playsInline preload="metadata" poster={poster}>
        <source src={src} type="video/mp4" />
      </video>
      <div className="video-bg-overlay" />
      <div className="video-bg-content">{children}</div>
    </div>
  );
}