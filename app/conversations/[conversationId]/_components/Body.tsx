"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { find } from "lodash";

import MessageBox from "./MessageBox";
import useConversation from "@/app/_hooks/useConversation";
import { pusherClient } from "@/app/_lib/pusher";
import type { FullMessageType } from "@/app/_types";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default function Body({ initialMessages = [] }: BodyProps) {
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    // Send request to update the seen status
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    // A useEffect hook to handle the message live update
    // Subscribe the channel by conversationId
    pusherClient.subscribe(conversationId);
    // Scroll to the last message
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      // The event will trigger this function to add new message to state
      // Send request to update the seen status
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        // If new message is already in state, then just return the current state
        if (find(current, { id: message.id })) return current;
        // else add the new message to the state
        return [...current, message];
      });
      // Scroll to the last message after update
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      // The event will trigger this function to update the seen status
      setMessages((current) =>
        // Map all messages to update the target message to update the seen status
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) return newMessage;
          return currentMessage;
        })
      );
    };

    // Bind the pusher client to the target events,
    // when new message notification comes up, they will trigger these functions
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // Then clear all subscription and events when component unmount
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
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
