"use client";
import { signOut } from "next-auth/react";
import EmptyState from "../_components/EmptyState";

export default function Users() {
    return (
        <div className="hidden lg:block lg:pl-80 h-full">
            <EmptyState />
        </div>
    );
}
