import {
  animated,
  type Interpolation,
  useSpring,
} from "@react-spring/web";

import { type HTMLAttributes, type ReactNode } from "react";

type AnimatedSpanProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  children?: Interpolation<number, string> | ReactNode;
};

const AnimatedSpan = animated.span as React.FC<AnimatedSpanProps>;

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
    <AnimatedSpan>
      {props.number.to((n: number) => n.toFixed(0))}
    </AnimatedSpan>
  );
};

export default AnimatedValue;
