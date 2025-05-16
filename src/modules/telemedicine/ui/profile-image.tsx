import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileAvatarPropsType = {
  imgUrl: string | null;
  name: string;
  className?: string;
  fallbackTextClass?: string;
  size?: string;
};

export function ProfileAvatar({
  imgUrl,
  name,
  className,
  fallbackTextClass,
  size,
}: ProfileAvatarPropsType) {
  const fallbackText = name.split(" ").flatMap((word) => word[0]);

  return (
    <Avatar className={`size-${size}`}>
      <AvatarImage src={imgUrl || ""} alt="name" className={className} />
      <AvatarFallback
        className={`bg-violet-600 text-white ${fallbackTextClass}`}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
