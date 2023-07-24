/*
    Get User List from server and session then return a user list except current user
*/
import prisma from "@/app/_lib/prismadb";
import getSession from "./getSession";

const getUsers = async () => {
    const session = await getSession();

    if (!session?.user?.email) return [];

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });

        return users;
    } catch (error: any) {
        return [];
    }
};

export default getUsers;
