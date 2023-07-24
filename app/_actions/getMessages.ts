/*
    Get All Messages in conversation base on id and return data
*/
import prisma from "@/app/_lib/prismadb";

const getMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    } catch (error: any) {
        return [];
    }
};

export default getMessages;
