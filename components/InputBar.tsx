"use client";
import { useState, useEffect } from "react";

export default function InputBar() {
  const messages = [
    "Design a custom bot that matches your community's unique vibe",
    "Create an AI-powered study buddy bot to help with learning and note-taking",
    "Build a community event organizer bot to coordinate meetups and activities",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const animationDuration = 4000; // 4 seconds for typing animation

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, animationDuration);

    return () => clearInterval(interval);
  });

  return (
    <div className="rounded-4xl shadow-2xl border-2 border-primary w-[700px] p-2">
      <div className="w-max">
        <h1
          key={currentMessageIndex}
          className="animate-typing overflow-hidden whitespace-nowrap border-r-2 text-primary border-r-primary pr-2 font-bold"
        >
          {messages[currentMessageIndex]}
        </h1>
      </div>
    </div>
  );
}
