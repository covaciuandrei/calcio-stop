import React, { useState } from 'react';
import { Nameset, Product, Sale } from '../types/types';
import { getNamesetInfo } from '../utils/utils';

interface Props {
  sales: Sale[];
  products: Product[];
  archivedProducts: Product[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  namesets: Nameset[];
}

const SaleHistory: React.FC<Props> = ({ sales, products, archivedProducts, setSales, namesets }) => {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCustomer, setEditCustomer] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');

  const getProductDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId) || archivedProducts.find((p) => p.id === productId);

    if (!product) return 'Unknown product';
    const namesetInfo = getNamesetInfo(product.namesetId, namesets);
    return `${product.name} - ${product.type} - ${namesetInfo.playerName} #${
      namesetInfo.number > 0 ? namesetInfo.number : '-'
    }`;
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
    setEditQuantity(sale.quantity);
    setEditPrice(sale.priceSold);
    setEditCustomer(sale.customerName);
    setEditDate(new Date(sale.date).toISOString().slice(0, 10));
  };

  const handleSaveEdit = () => {
    if (!editingSale) return;
    setSales((prev) =>
      prev.map((s) =>
        s.id === editingSale.id
          ? {
              ...s,
              quantity: editQuantity,
              priceSold: editPrice,
              customerName: editCustomer,
              date: editDate ? new Date(editDate).toISOString() : new Date().toISOString(),
            }
          : s
      )
    );
    setEditingSale(null);
  };

  return (
    <div>
      {sales.length === 0 ? (
        <p>No sales recorded.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price Sold</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{getProductDetails(s.productId)}</td>
                <td>{s.size}</td>
                <td>{s.quantity}</td>
                <td>{s.priceSold.toFixed ? `$${s.priceSold.toFixed(2)}` : s.priceSold}</td>
                <td>{s.customerName || 'N/A'}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEditClick(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingSale && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Sale</h3>
            <label>
              Quantity:
              <input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value || 0))}
              />
            </label>
            <label>
              Price:
              <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value || 0))} />
            </label>
            <label>
              Customer:
              <input type="text" value={editCustomer} onChange={(e) => setEditCustomer(e.target.value)} />
            </label>
            <label>
              Date:
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            </label>
            <div className="modal-buttons">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingSale(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleHistory;
