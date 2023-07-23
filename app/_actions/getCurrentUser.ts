/*
    Get current user data from session and db using prisma
    (Optional: replace it by any ORM)
*/

import prisma from "@/app/_lib/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();

        if (!session?.user?.email) return null;

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });

        if (!currentUser) return null;

        return currentUser;
    } catch (error) {
        return null;
    }
};

export default getCurrentUser;
