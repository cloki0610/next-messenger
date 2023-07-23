"use client";

import MobileItem from "./MobileItem";
import useConversation from "@/app/_hooks/useConversation";
import useRoutes from "@/app/_hooks/useRoutes";

export default function MobileFooter() {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) return null;

    return (
        <div
            className="fixed flex justify-between items-center 
            w-full bottom-0 z-40 bg-white border-t-[1px] lg:hidden"
        >
            {routes.map((route) => (
                <MobileItem
                    key={route.href}
                    href={route.href}
                    active={route.active}
                    icon={route.icon}
                    onClick={route.onClick}
                />
            ))}
        </div>
    );
}
