import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateRandomColor } from "../utils";
import { cn } from "@/lib/utils";

type ProfileAvatarPropsType = {
  imgUrl?: string | null;
  name: string | undefined;
  className?: string;
  fallbackTextClass?: string;
  colorCode?: string | null;
  avatarClassName?: string;
};

export function ProfileAvatar({
  imgUrl,
  name,
  className,
  fallbackTextClass,
  colorCode,
  avatarClassName,
}: ProfileAvatarPropsType) {
  const fallbackText = name?.split(" ").flatMap((word) => word[0]);
  const randomColor = generateRandomColor();

  return (
    <Avatar className={avatarClassName}>
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
