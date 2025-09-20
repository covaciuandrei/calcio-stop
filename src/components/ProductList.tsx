import React from 'react';
import { Link } from 'react-router-dom';
import { Nameset, Product } from '../types/types';
import { getNamesetInfo } from '../utils/utils';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
}

const ProductList: React.FC<Props> = ({ products, setProducts, archivedProducts, setArchivedProducts, namesets }) => {
  const deleteProduct = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const productToArchive = products.find((p) => p.id === id);
    if (productToArchive) {
      setArchivedProducts((prev) => [...prev, productToArchive]);
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
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
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>
                  <div className="size-quantity-display">
                    {p.sizes.map((sq) => (
                      <div key={sq.size} className="size-quantity-item">
                        {sq.size}: {sq.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.season;
                  })()}
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.playerName;
                  })()}
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.number > 0 ? namesetInfo.number : '-';
                  })()}
                </td>
                <td className="price-display">${p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
                <td>
                  <Link to={`/edit/${p.id}`}>
                    <button className="btn btn-warning">Edit</button>
                  </Link>
                  <button onClick={() => deleteProduct(p.id)} className="btn btn-danger">
                    Delete
                  </button>
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
