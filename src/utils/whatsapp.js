import { property } from "../data/property";

// Builds a WhatsApp link that opens a chat with a message already typed in
export function whatsappLink(message) {
  return `https://wa.me/${property.whatsapp}?text=${encodeURIComponent(message)}`;
}