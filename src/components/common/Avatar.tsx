import { useCallback, useEffect, useMemo, useState } from "react";
import { avatarList } from "../../utils/avatarList.ts";

export interface AvatarProps {
  className?: string;
  alt?: string;
  list?: string[];
  onChange?: (src: string) => void;
}

export default function Avatar({ className, alt = "头像", list = avatarList, onChange }: AvatarProps) {
  const safeList = useMemo(() => list.filter(Boolean), [list]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [safeList]);

  const handleClick = useCallback(() => {
    if (safeList.length === 0) {
      return;
    }
    const nextIndex = (index + 1) % safeList.length;
    setIndex(nextIndex);
    onChange?.(safeList[nextIndex]);
  }, [safeList, index, onChange]);

  const fallback = "/avatar.png";
  const displaySrc = safeList[index] || fallback;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onClick={handleClick}
    />
  );
}
