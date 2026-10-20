import { property } from "../data/property";

export default function MapEmbed() {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(property.mapQuery)}&output=embed`;
  return <iframe className="map-embed" title="Map" src={src} loading="lazy" />;
}