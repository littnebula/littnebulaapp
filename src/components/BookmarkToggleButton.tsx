"use client";
import { useOptimistic, useTransition } from "react";
import { usePathname } from "next/navigation";
import { revalidatepage, toggleWCBookmark } from "@/lib/dbActions";
import { Bookmark, BookmarkCheckFill } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

interface BookmarkButtonProps {
  userId: number;
  wordcloudId: number;
  initialIsBookmarked: boolean;
}

export function BookmarkToggleButton({
  userId,
  wordcloudId,
  initialIsBookmarked,
}: BookmarkButtonProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    initialIsBookmarked,
    (state: boolean, newState: boolean) => newState
  );

  const handleToggle = () => {
    startTransition(async () => {
      // 1. Immediately flip the icon in the UI
      addOptimisticBookmark(!optimisticBookmarked);
      // 2. Update the database on the server
      await toggleWCBookmark(userId, wordcloudId);
      await revalidatepage(pathname);
    });
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={optimisticBookmarked ? "Remove bookmark" : "Bookmark post"}
      className="p-2 rounded-full transition"
    >
      {optimisticBookmarked? <BookmarkCheckFill/> : <Bookmark/> }
    </Button>
  );
}