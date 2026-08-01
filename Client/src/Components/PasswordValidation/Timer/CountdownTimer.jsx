import { useEffect, useState } from "react";

const CountdownTimer = ({ initialTime = 300, resetKey, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [resetKey, initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <span>
      {minutes}:{seconds}
    </span>
  );
};

export default CountdownTimer;
