import React, { useState, useEffect } from "react";
import "./TypingAnim.css";

const TypingAnim = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div className="typing-indicator">Typing{dots}</div>;
};

export default TypingAnim;
