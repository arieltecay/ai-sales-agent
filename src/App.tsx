import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/chat";

function App() {
  return (
    <Routes>
      <Route path="/b/:slug" element={<ChatPage />} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-neutral-50"><p className="text-neutral-500">Página no encontrada</p></div>} />
    </Routes>
  );
}

export default App;