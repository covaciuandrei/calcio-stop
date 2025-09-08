import React from "react";
import { Product } from "../types/types";

interface ArchivedProductListProps {
  archivedProducts: Product[];
}

const ArchivedProductList: React.FC<ArchivedProductListProps> = ({
  archivedProducts,
}) => {
  return (
    <div>
      <h2>Archived Products</h2>
      {archivedProducts.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Season</th>
              <th>Player</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.type}</td>
                <td>{product.size}</td>
                <td>{product.quantity}</td>
                <td>{product.season}</td>
                <td>{product.playerName || "-"}</td>
                <td>{product.equipmentNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No archived products.</p>
      )}
    </div>
  );
};

export default ArchivedProductList;