export const LOVE_MESSAGES = [
  "Te amooo mi amor ❤️",
  "Eres lo que más amooo en mi vida 💕",
  "Eres el amor de mi vida, siempre contigo 💖",
  "Eres todo lo que amooo en mi vida 🌸",
  "Te adoro mi princesa, cuida tu corazón 💝",
  "Siempre pensando en ti, mi amorcito 🌷",
  "Gracias por ser tú, te amooo muchísimo ✨",
  "Contigo todo es mejor, te amooo 💞",
  "Eres mi alegría y mi calma, te amooo 😽",
  "Mi corazón es tuyo, hasta el infinito 💫",
];

export const getRandomLoveMessage = () => {
  return LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
};
