import React from "react";
import { Nameset } from "../types/types";

interface Props {
  namesets: Nameset[];
  onEdit: (n: Nameset) => void;
  onDelete: (id: string) => void;
}

const NamesetTableList: React.FC<Props> = ({ namesets, onEdit, onDelete }) => {
  if (namesets.length === 0) {
    return <p>No namesets available.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Number</th>
          <th>Season</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {namesets.map((n) => (
          <tr key={n.id}>
            <td>{n.playerName}</td>
            <td>{n.number}</td>
            <td>{n.season}</td>
            <td>
              <button onClick={() => onEdit(n)}>Edit</button>
              <button onClick={() => onDelete(n.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NamesetTableList;
