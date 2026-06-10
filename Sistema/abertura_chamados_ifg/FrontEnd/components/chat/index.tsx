import Component from "./styleChat.styles";
import chatData from "../../chat.json";
interface Chat {
  id: number;
  status: string;
  title: string;
  user: string;
}
const chats: Chat[] = chatData;
interface ChatListProps {
  title: string;
  chats: Chat[];
  status: string;
  user: "admin" | "user";
}

const filterChatsByStatus = (
  chats: Chat[],
  status: string,
  user: "admin" | "user"
) => {
  return chats.filter((chat) => {
    if (user === "user" && status === "aberto") return false;
    return chat.status === status;
  });
};

const ChatList = ({ title, chats, status, user }: ChatListProps) => {
  const filteredChats = filterChatsByStatus(chats, status, user);

  return (
    <div className="chats">
      <div className={`box chat-${status}`}>
        <h3>{title}</h3>
      </div>
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div className="component" key={chat.id}>
            <div className="divider">
              <div className="text-wrapper">
                <span className={`circle-${status}`}></span>
                <h4 className="title">{chat.title}</h4>
              </div>
              <p>{chat.user}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum chat {status}</p>
      )}
    </div>
  );
};
interface ChatProps {
  user: "admin" | "user";
}

export default function Chat({ user }: ChatProps) {
  return (
    <Component>
      <div>
        {user == "admin" && (
          <ChatList
            title="Chats abertos"
            chats={chats}
            status="aberto"
            user={user}
          />
        )}

        <ChatList
          title="Chats em andamento"
          chats={chats}
          status="andamento"
          user={user}
        />
        <ChatList
          title="Chats finalizados"
          chats={chats}
          status="finalizado"
          user={user}
        />
      </div>
    </Component>
  );
}
