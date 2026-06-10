import Component from "./styleAdmin.styles";
import { MdLogout, MdOutlineAddLocationAlt } from "react-icons/md";
import {  LuUserPlus } from "react-icons/lu";
import {  RiToolsFill } from "react-icons/ri";
import Link from "next/link";
import { TbTagPlus } from "react-icons/tb";
import { PiList } from "react-icons/pi";
import { useRouter } from "next/router";
import { logoff } from "../../services/auth/logoff";

export default function MenuAdmin(props: any) {
const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoff();
      router.push("/login");
    } catch (err:unknown) {
      console.log("cat")
      if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
        console.log("deu erro   ",(err as { error: string }).error)
      }
    } 
  };

  return (
    <Component>
      <div className="options">
        <Link href="/home">
          <div className="icon-text">
            <i>
          <PiList />
          <PiList />

            </i>
            <p>Chamados</p>
          </div>
        </Link>

        <Link href="/createuser">
          <div className="icon-text">
            <i>
              <LuUserPlus />
            </i>
            <p>Cadastro de usuário</p>
          </div>
        </Link>
        <Link href={"/createroom"}>
          <div className="icon-text">
            <i>
            < MdOutlineAddLocationAlt/>
            < MdOutlineAddLocationAlt/>

            </i>
            <p>Cadastro de locais</p>
          </div>
        </Link>

        <Link href="/createEquipament">
          <div className="icon-text">
            <i>
              <RiToolsFill />
            </i>
            <p>Cadastro de equipamentos</p>
          </div>
        </Link>

        <Link href={"/createRequest"}>
          <div className="icon-text">
            <i>
            <TbTagPlus />

            </i>
            <p>Cadastro de tipo de solicitação</p>
          </div>
        </Link>
      </div>

      <div className="user">
        <h2>{props.user}</h2>
        <p>{props.matricula}</p>
      </div>
        <button className="logout" onClick={handleLogout}>
          <i>
            <MdLogout />
          </i>
        </button>
    </Component>
  );
}
