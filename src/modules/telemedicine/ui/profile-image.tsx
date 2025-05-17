import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateRandomColor } from "../utils";
import { cn } from "@/lib/utils";

type ProfileAvatarPropsType = {
  imgUrl: string | null;
  name: string;
  className?: string;
  fallbackTextClass?: string;
  size?: string;
  colorCode?: string | null;
};

export function ProfileAvatar({
  imgUrl,
  name,
  className,
  fallbackTextClass,
  size,
  colorCode,
}: ProfileAvatarPropsType) {
  const fallbackText = name.split(" ").flatMap((word) => word[0]);
  const randomColor = generateRandomColor();

  return (
    <Avatar className={`size-${size}`}>
      <AvatarImage src={imgUrl || ""} alt="name" className={className} />
      <AvatarFallback
        className={cn("text-white", fallbackTextClass || "")}
        style={{ backgroundColor: colorCode || randomColor }}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
