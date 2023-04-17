import { useState, useEffect } from "react";

const CountUp = ({ timestamp }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - timestamp;
      setCount(Math.floor(timeDiff / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <div>{count}</div>;
};

export default CountUp;
