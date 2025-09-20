import React from "react";
import { Product } from "../types/types";

interface Props {
  archivedProducts: Product[];
}

const ArchivedProducts: React.FC<Props> = ({ archivedProducts }) => {
  return (
    <div>
      <h2>Archived Products</h2>
      {archivedProducts.length === 0 ? <p>No archived products.</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Sizes & Quantities</th>
              <th>Season</th>
              <th>Player</th>
              <th>Number</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>
                  {p.sizes.map(sq => <div key={sq.size}>{sq.size}: {sq.quantity}</div>)}
                </td>
                <td>{p.season}</td>
                <td>{p.playerName || "-"}</td>
                <td>{p.equipmentNumber > 0 ? p.equipmentNumber : "-"}</td>
                <td>{p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArchivedProducts;
