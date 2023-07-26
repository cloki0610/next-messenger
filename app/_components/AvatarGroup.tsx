"use client";
import Image from "next/image";
import { User } from "@prisma/client";

interface AvatarGroupProps {
  users?: User[];
}

export default function AvatarGroup({ users = [] }: AvatarGroupProps) {
  const slicedUsers = users.slice(0, 3); // Get first 3 user in user list

  // Avatars style
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full 
          overflow-hidden h-[21px] w-[21px]
          ${positionMap[index as keyof typeof positionMap]}
          `}
        >
          <Image
            fill
            src={user?.image || "/images/placeholder.jpg"}
            alt="Avatar"
          />
        </div>
      ))}
    </div>
  );
}
