import Sidebar from "../_components/sidebar/Sidebar";
import UserList from "./_components/UserList";
import getUsers from "../_actions/getUsers";

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const users = await getUsers();
    return (
        <Sidebar>
            <UserList users={users} />
            <div className="h-full">{children}</div>
        </Sidebar>
    );
}
