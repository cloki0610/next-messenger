"use client";
import { User } from "@prisma/client";

import UserBox from "./UserBox";

interface UserListProps {
    users: User[];
}

export default function UserList({ users }: UserListProps) {
    return (
        <aside
            className="block w-full fixed left-0 inset-y-0 pb-20 border-r border-gray-200
            lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto"
        >
            <div className="px-5">
                <div className="flex-col">
                    <div className="text-2xl font-bold text-neutral-800 py-4">
                        User
                    </div>
                </div>
                {users.map((item) => (
                    <UserBox key={item.id} data={item} />
                ))}
            </div>
        </aside>
    );
}
