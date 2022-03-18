import AnimatedLottieView, {
  AnimatedLottieViewProps,
} from 'lottie-react-native';
import { useEffect, useRef } from 'react';

export default function AutoplayLottieView(props: AnimatedLottieViewProps) {
  const ref = useRef<AnimatedLottieView | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (ref.current && !played.current) {
      ref.current?.play();
      played.current = true;
    }
  }, [ref.current, played.current]);

  return <AnimatedLottieView ref={ref} {...props} />;
}
