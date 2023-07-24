import Sidebar from "../_components/sidebar/Sidebar";
import ConversationList from "./_components/ConversationList";
import getConversations from "../_actions/getConversations";
import getUsers from "../_actions/getUsers";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList
                    users={users}
                    title="Messages"
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    );
}
