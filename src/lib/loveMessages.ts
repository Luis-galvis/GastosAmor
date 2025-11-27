export const LOVE_MESSAGES = [
  "Te amo mi amor ❤️",
  "Eres lo que más quiero en mi vida 💕",
  "Eres el amor de mi vida, siempre contigo 💖",
  "Eres todo lo que quiero en mi vida 🌸",
  "Te adoro mi princesa, cuida tu corazón 💝",
  "Siempre pensando en ti, mi amorcito 🌷",
  "Gracias por ser tú, te amo muchísimo ✨",
  "Contigo todo es mejor, te quiero 💞",
  "Eres mi alegría y mi calma, te amo 😽",
  "Mi corazón es tuyo, hasta el infinito 💫",
];

export const getRandomLoveMessage = () => {
  return LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
};
