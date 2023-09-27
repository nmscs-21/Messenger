import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import AIChatPage from "./components/AIChatPage";

// import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/chats" element={<ChatPage />} />
        <Route exact path="/chats/ai" element={<AIChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
