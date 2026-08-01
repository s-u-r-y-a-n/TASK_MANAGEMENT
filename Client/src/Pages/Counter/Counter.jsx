import { useEffect, useRef } from "react";

const Timer = () => {
  const timerRef = useRef(null);

  useEffect(() => {
    let time = 300;

    const interval = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = String(time % 60).padStart(2, "0");

      timerRef.current.textContent = `${minutes}:${seconds}`;

      time--;

      if (time < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log("REF", timerRef.current.innerText);

  return <span ref={timerRef}>5:00</span>;
};

export default Timer;
