import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import First from "./First.tsx";
import Second from "./Second.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/first" element={<First />} />
        <Route path="/second" element={<Second />} />
      </Routes>
    </Router>
  </StrictMode>
);
