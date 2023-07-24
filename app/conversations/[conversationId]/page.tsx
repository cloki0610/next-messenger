import Header from "./_components/Header";
import Body from "./_components/Body";
import Form from "./_components/Form";
import EmptyState from "@/app/_components/EmptyState";

import getConversationById from "@/app/_actions/getConversationById";
import getMessages from "@/app/_actions/getMessages";

interface IParams {
    conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {
    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    );
}
