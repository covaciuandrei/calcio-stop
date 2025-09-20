import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/types";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList: React.FC<Props> = ({ products, setProducts, archivedProducts, setArchivedProducts }) => {
  const deleteProduct = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const productToArchive = products.find(p => p.id === id);
    if (productToArchive) {
      setArchivedProducts(prev => [...prev, productToArchive]);
    }
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? <p>No products available.</p> : (
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>
                  {p.sizes.map(sq => (
                    <div key={sq.size}>{sq.size}: {sq.quantity}</div>
                  ))}
                </td>
                <td>{p.season}</td>
                <td>{p.playerName || "-"}</td>
                <td>{p.equipmentNumber > 0 ? p.equipmentNumber : "-"}</td>
                <td>{p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
                <td>
                  <Link to={`/edit/${p.id}`}><button>Edit</button></Link>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
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
