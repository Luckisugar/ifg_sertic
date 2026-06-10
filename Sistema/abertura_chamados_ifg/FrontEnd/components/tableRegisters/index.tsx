import { FaRegTrashAlt, FaSortDown, FaSortUp } from "react-icons/fa";
import Table from "./tableRegister.styles";
import { Tooltip } from "@mui/material";
import { useMemo } from "react";
type Field = {
  key: string;
  label: string;
};
type TableListProps = {
  visible: Field[];
  order: number;
  fieldName: string;
  equipaments: any[];
  deleteEquipament: (id: number) => void;
  handleOrder: (key: string, order: string) => void;
  titleTable: string;
};

export default function TableRegisters({
  visible,
  order,
  fieldName,
  equipaments,
  deleteEquipament,
  handleOrder,
  titleTable,
}: TableListProps) {
  return (
    <Table>
      <h3>{titleTable}</h3>
      <table>
        <thead>
          <tr>
            {visible.map((field, index) => (
              <td
                onClick={() =>
                  handleOrder(
                    field.key.toLowerCase(),
                    order !== 1 ? "desc" : "asc"
                  )
                }
                key={index}
                className="table-title"
              >
                {field.label}{" "}
                {fieldName === field.key ? (
                  order === 1 ? (
                    <FaSortDown color="#d9d9d9" />
                  ) : (
                    <FaSortUp color="#d9d9d9" />
                  )
                ) : null}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {equipaments.map((equip, index) => (
            <tr key={index}>
              <td>{equip.id}</td>
              <td>{equip.nome}</td>
              <td
                onClick={() => deleteEquipament(equip.id)}
                className="button-delete"
              >
                <i>
                  <FaRegTrashAlt size={18} />
                </i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  );
}
