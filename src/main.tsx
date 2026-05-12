import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
console.log("URL:", import.meta.env.VITE_SUPABASE_URL)
console.log("ANON:", import.meta.env.VITE_SUPABASE_ANON_KEY)

createRoot(document.getElementById("root")!).render(<App />);
