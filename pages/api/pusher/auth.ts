import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/_lib/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// An API route to check user active status
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Get user data from server session
  const session = await getServerSession(request, response, authOptions);

  // If user not found return error response
  if (!session?.user?.email) return response.status(401);

  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = { user_id: session.user.email };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return response.send(authResponse);
}
