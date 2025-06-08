import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterPage from "./RouterPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterPage />
  </StrictMode>
);
