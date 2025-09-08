import React from "react";
import { Product } from "../types/types";
import { useNavigate } from "react-router-dom";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList: React.FC<Props> = ({ products, setProducts, setArchivedProducts }) => {
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const productToArchive = products.find((p) => p.id === id);
      if (productToArchive) {
        setArchivedProducts((prev) => [...prev, productToArchive]);
      }
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Season</th>
              <th>Player</th>
              <th>Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.size}</td>
                <td>{p.quantity}</td>
                <td>{p.season}</td>
                <td>{p.playerName}</td>
                <td>{p.equipmentNumber > 0 ? p.equipmentNumber : "-"}</td>
                <td>
                  <button onClick={() => handleEdit(p.id)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
