import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { bersihkanHpLama, sapuKedaluwarsa } from "./lib/perangkat";

// Tonggak 2a B.1, C.7: buang nomor HP lama dan data perangkat kedaluwarsa sebelum aplikasi berjalan.
bersihkanHpLama();
sapuKedaluwarsa();

createRoot(document.getElementById("root")!).render(<App />);
