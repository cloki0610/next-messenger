import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
    href: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
}

export default function MobileItem({
    href,
    icon: Icon,
    active,
    onClick,
}: MobileItemProps) {
    const handleClick = () => {
        if (onClick) return onClick();
    };

    return (
        <Link
            onClick={handleClick}
            href={href}
            className={clsx(
                `group flex justify-center gap-x-3 leading-6 text-sm font-semibold 
                w-full p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
                active && "bg-gray-100 text-black"
            )}
        >
            <Icon className="h-6 w-6" />
        </Link>
    );
}
