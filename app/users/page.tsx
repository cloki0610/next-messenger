"use client";
import { signOut } from "next-auth/react";

export default function Users() {
    return (
        <div>
            <h1>Users Page</h1>
            <button onClick={() => signOut()}>Logout</button>
        </div>
    );
}
