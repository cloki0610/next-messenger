"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import useConversation from "@/app/_hooks/useConversation";
import type { FullMessageType } from "@/app/_types";
import MessageBox from "./MessageBox";

interface BodyProps {
    initialMessages: FullMessageType[];
}

export default function Body({ initialMessages = [] }: BodyProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
}
