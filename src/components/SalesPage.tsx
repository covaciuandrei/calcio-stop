import React, { useState } from 'react';
import { Nameset, Product, Sale, Team } from '../types/types';
import { getNamesetInfo } from '../utils/utils';
import EditSaleModal from './EditSaleModal';
import SaleForm from './SaleForm';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  teams: Team[];
  archivedTeams: Team[];
}

const SalesPage: React.FC<Props> = ({
  products,
  setProducts,
  sales,
  setSales,
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isSalesExpanded, setIsSalesExpanded] = useState(true);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  const getProductDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return 'Unknown product';
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
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
  };

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) => {
    const productDetails = getProductDetails(sale.productId);
    return (
      productDetails.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.size.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.quantity.toString().includes(salesSearchTerm) ||
      sale.priceSold.toString().includes(salesSearchTerm)
    );
  });

  return (
    <div>
      {/* Add New Sale Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-green">
          <span>Record New Sale</span>
        </div>
        <div className="card-content">
          <SaleForm
            products={products}
            setProducts={setProducts}
            sales={sales}
            setSales={setSales}
            namesets={namesets}
            archivedNamesets={archivedNamesets}
            teams={teams}
            archivedTeams={archivedTeams}
          />
        </div>
      </div>

      {/* Sales History Card */}
      <div className="card">
        {sales.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsSalesExpanded(!isSalesExpanded)}
            >
              <span>Sales History ({sales.length})</span>
              <span style={{ fontSize: '12px' }}>{isSalesExpanded ? '▼' : '▶'}</span>
            </div>
            {!isSalesExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {sales.length} sales recorded.
              </div>
            )}
            {isSalesExpanded && (
              <>
                <h3 className="card-section-header">Sales History</h3>
                {sales.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={salesSearchTerm}
                      onChange={(e) => setSalesSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                )}
                <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                  {filteredSales.length === 0 && salesSearchTerm ? (
                    <p>No sales found matching "{salesSearchTerm}".</p>
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
                        {filteredSales.map((s) => (
                          <tr key={s.id}>
                            <td>{getProductDetails(s.productId)}</td>
                            <td>{s.size}</td>
                            <td>{s.quantity}</td>
                            <td className="price-display">
                              ${s.priceSold.toFixed ? s.priceSold.toFixed(2) : s.priceSold}
                            </td>
                            <td>{s.customerName || 'N/A'}</td>
                            <td>{new Date(s.date).toLocaleString()}</td>
                            <td>
                              <button onClick={() => handleEditClick(s)} className="btn btn-warning">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(s.id)} className="btn btn-danger">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Sales History (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No sales recorded.
            </div>
          </>
        )}
      </div>

      <EditSaleModal editingSale={editingSale} setEditingSale={setEditingSale} setSales={setSales} />
    </div>
  );
};

export default SalesPage;
