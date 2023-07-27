"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { find, uniq } from "lodash";
import { MdOutlineGroupAdd } from "react-icons/md";
import { User } from "@prisma/client";

import ConversationBox from "./ConversationBox";
import GroupChatModal from "@/app/_components/modals/GroupChatModal";
import useConversation from "@/app/_hooks/useConversation";
import { pusherClient } from "@/app/_lib/pusher";
import type { FullConversationType } from "@/app/_types";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

export default function ConversationList({
  initialItems,
  users,
}: ConversationListProps) {
  const router = useRouter();
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pusherKey = useMemo(() => {
    // Get the user email from session
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    // A useEffect hook to handle the conversations staus live update
    if (!pusherKey) return;
    // Subscribe the channel by pusherKey
    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      // Find the conversation and add update conversation seen status
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      // Find the conversation and add new conversation to the list
      setItems((current) => {
        if (find(current, { id: conversation.id })) return current;
        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      // Find the conversation and remove existing conversation from the list
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      // Redirect to main page if current page is removed conversation
      if (conversationId === conversation.id) router.push("/conversation");
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    // Then clear all subscription and events when component unmount
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, router, conversationId]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block
                    overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 
                            cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
