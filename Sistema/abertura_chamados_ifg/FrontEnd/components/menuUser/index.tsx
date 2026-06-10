import Component from "./styleUser.styles";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { IoList } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

export default function MenuUser() {
  return (
    <Component>
      <div className="options">
        <div className="icon-text">
          <i>
            <IoList />
          </i>
          <p>Chamados</p>
        </div>

        <div className="icon-text">
          <i>
            <MdOutlineChatBubbleOutline />
          </i>
          <p>Chat</p>
        </div>
      </div>

      <div className="user">
        <h2>Usuário</h2>
        <p>20221030112345</p>
      </div>
      <i className="logout">
        <MdLogout />
      </i>
    </Component>
  );
}
