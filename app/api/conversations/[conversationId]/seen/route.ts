import { NextResponse } from "next/server";

import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/app/_lib/prismadb";
import { pusherServer } from "@/app/_lib/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(_: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    // Verify user
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    // Return error if no conversation found
    if (!conversation) return new NextResponse("Invalid ID", { status: 400 });

    // Find last message from conversation result
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Update all connections with new seen status
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // Update last message seen status
    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage
    );

    return new NextResponse("Seen status updated");
  } catch (error) {
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
