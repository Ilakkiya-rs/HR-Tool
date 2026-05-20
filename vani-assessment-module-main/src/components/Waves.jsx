"use client";
import { useEffect, useState } from "react";

export default function VoiceWave({ isRecording=false , isPlaying=false }) {
  const totalBars = 20;
  const [bars, setBars] = useState(Array(totalBars).fill(40)); // full height initially

  useEffect(() => {
    let interval;
    if (isRecording) {
      // Animate random heights while recording
      interval = setInterval(() => {
        setBars(bars.map(() => Math.floor(Math.random() * 40) + 5));
      }, 150);
    } else {
      // Full height when idle
      setBars(Array(totalBars).fill(40));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      // Animate random heights while recording
      interval = setInterval(() => {
        setBars(bars.map(() => Math.floor(Math.random() * 40) + 5));
      }, 150);
    } else {
      // Full height when idle
      setBars(Array(totalBars).fill(40));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex justify-center items-end gap-[2px] h-20 w-full max-w-lg mx-auto bg-[#FAFAFA] p-4 overflow-hidden mt-25">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-[4px] ${
            isPlaying ? "bg-green-500" : "bg-purple-500"
            } rounded-full transition-all duration-150 ease-in-out`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

