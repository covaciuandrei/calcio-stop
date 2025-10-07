import React from 'react';
import { useArchivedNamesets, useNamesetsList, useProductsList } from '../../stores';
import { Sale } from '../../types';
import { getNamesetInfo } from '../../utils/utils';

interface Props {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
}

const SalesTableList: React.FC<Props> = ({ sales, onEdit, onDelete, searchTerm = '' }) => {
  // Get data from stores
  const products = useProductsList();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const getProductDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return 'Unknown product';
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    return `${product.name} - ${product.type} - ${namesetInfo.playerName} #${
      namesetInfo.number > 0 ? namesetInfo.number : '-'
    }`;
  };

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) => {
    const productDetails = getProductDetails(sale.productId);
    return (
      productDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.quantity.toString().includes(searchTerm) ||
      sale.priceSold.toString().includes(searchTerm)
    );
  });

  if (sales.length === 0) {
    return <p>No sales recorded.</p>;
  }

  if (filteredSales.length === 0 && searchTerm) {
    return <p>No sales found matching "{searchTerm}".</p>;
  }

  return (
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
        {filteredSales.map((s) => (
          <tr key={s.id}>
            <td>{getProductDetails(s.productId)}</td>
            <td>{s.size}</td>
            <td>{s.quantity}</td>
            <td className="price-display">${s.priceSold.toFixed ? s.priceSold.toFixed(2) : s.priceSold}</td>
            <td>{s.customerName || 'N/A'}</td>
            <td>{new Date(s.date).toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(s)} className="btn btn-icon btn-success" title="Edit">
                ✏️
              </button>
              <button onClick={() => onDelete(s.id)} className="btn btn-icon btn-danger" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesTableList;
