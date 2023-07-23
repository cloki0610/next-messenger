/*
    Get Session from server for different usage
*/
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function getSession() {
    return await getServerSession(authOptions);
}
