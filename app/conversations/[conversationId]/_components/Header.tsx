"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";

import Avatar from "@/app/_components/Avatar";
import useOtherUser from "@/app/_hooks/useOtherUser";
import useActiveList from "@/app/_hooks/useActiveList";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

export default function Header({ conversation }: HeaderProps) {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;
    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return isActive ? "Active" : "Offline";
    }, [conversation, isActive]);

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div
                className="bg-white w-full flex justify-between border-b-[1px] 
                sm:px-4 py-3 px-4 lg:px-6 items-center shadow-sm"
            >
                <div className="flex gap-3 items-center">
                    <Link
                        href="/conversations"
                        className="block lg:hidden text-gray-500 hover:text-gray-600 
                        transition cursor-pointer"
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    <Avatar user={otherUser} />
                    <div className="flex flex-col">
                        <div>{conversation.name || otherUser.name}</div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="text-gray-500 cursor-pointer hover:text-gray-800 transition"
                />
            </div>
        </>
    );
}
