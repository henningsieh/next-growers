import { animated, useSpring } from "@react-spring/web";

import React from "react";

interface AnimatedValueProps {
  value: number;
  duration: number;
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  duration,
}) => {
  const props = useSpring<{ number: number }>({
    from: { number: 0 },
    to: { number: value },
    config: { duration: duration },
  });

  return (
    <animated.span>
      {props.number.to((n: number) => n.toFixed(0))}
    </animated.span>
  );
};

export default AnimatedValue;
