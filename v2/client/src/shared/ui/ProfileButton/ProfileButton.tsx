import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar/Avatar.tsx";
import { cn } from "../../lib/clsx.ts";
import s from "./ProfileButton.module.css";

interface ProfileButtonProps {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarFallback?: React.ReactNode;
  className?: string;
}

function ProfileButton({
  name,
  role,
  avatarSrc,
  avatarFallback = "У",
  className,
}: ProfileButtonProps) {
  return (
    <div className={cn(s.profileButton, className)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarSrc} alt={name} />
        <AvatarFallback>
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
      <div className={s.info}>
        <span className={s.name}>{name}</span>
        <span className={s.role}>{role}</span>
      </div>
    </div>
  );
}

export { ProfileButton };
