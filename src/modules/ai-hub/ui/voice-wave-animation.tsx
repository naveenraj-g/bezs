import Lottie from "lottie-react";
import audioWaveAnimation from "./audio-wave-micro-interaction.json";

export const VoiceWaveAnimation = ({
  isListening,
}: {
  isListening: boolean;
}) => {
  if (!isListening) return null;

  return (
    <div className="w-8 mx-auto">
      <Lottie
        animationData={audioWaveAnimation}
        loop
        autoplay
        className="dark:invert-100"
      />
    </div>
  );
};
