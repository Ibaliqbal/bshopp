import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = "12/31/2024";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Countdown = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = () => {
    const end = new Date(COUNTDOWN_FROM);

    const now = new Date();

    const distance = +end - +now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    setRemaining({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  return (
    <div
      className="w-full h-dvh flex flex-col gap-5 items-center justify-center"
      style={{
        backgroundImage: "url(/promotion.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-layout py-2 px-10 flex items-center justify-center bg-transparent ">
        <CountdownItem
          num={remaining.days}
          text="days"
          className="text-white"
        />
        <CountdownItem
          num={remaining.hours}
          text="hours"
          className="text-white"
        />
        <CountdownItem
          num={remaining.minutes}
          text="minutes"
          className="text-white"
        />
        <CountdownItem
          num={remaining.seconds}
          text="seconds"
          className="text-white"
        />
      </div>
      <h1 className="text-white text-2xl md:text-3xl">
        Please wait for flash sale 🎉🎉
      </h1>
    </div>
  );
};

const CountdownItem = ({
  num,
  text,
  className,
}: {
  num: number;
  text: string;
  className?: string;
}) => {
  return (
    <div className="font-mono md:p-10 p-6 flex flex-col gap-1 md:gap-2 items-center justify-center border-r-[1px] border-slate-200">
      <div className="w-full text-center relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={num}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ ease: "backIn", duration: 0.75 }}
            className={`block text-xl md:text-4xl lg:text-6xl xl:text-7xl ${className} font-medium`}
          >
            {num}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className={`text-xs md:text-sm lg:text-base font-light ${className}`}
      >
        {text}
      </span>
    </div>
  );
};

export default Countdown;
