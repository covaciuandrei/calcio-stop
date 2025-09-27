import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sale } from '../types/types';

interface Props {
  editingSale: Sale | null;
  setEditingSale: React.Dispatch<React.SetStateAction<Sale | null>>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const EditSaleModal: React.FC<Props> = ({ editingSale, setEditingSale, setSales }) => {
  const [quantity, setQuantity] = useState<number>(editingSale?.quantity || 0);
  const [priceSold, setPriceSold] = useState<number>(editingSale?.priceSold || 0);
  const [customerName, setCustomerName] = useState<string>(editingSale?.customerName || '');
  const [date, setDate] = useState<string>('');

  // Update state when editingSale changes
  React.useEffect(() => {
    if (editingSale) {
      setQuantity(editingSale.quantity);
      setPriceSold(editingSale.priceSold);
      setCustomerName(editingSale.customerName);
      setDate(new Date(editingSale.date).toISOString().slice(0, 10));
    }
  }, [editingSale]);

  const handleSaveEdit = () => {
    if (!editingSale) return;

    setSales((prev) =>
      prev.map((s) =>
        s.id === editingSale.id
          ? {
              ...s,
              quantity,
              priceSold,
              customerName,
              date: date ? new Date(date).toISOString() : new Date().toISOString(),
            }
          : s
      )
    );
    setEditingSale(null);
  };

  if (!editingSale) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Sale</h3>
        <label>
          Quantity:
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value || 0))} />
        </label>
        <label>
          Price Sold:
          <input type="number" min={0} value={priceSold} onChange={(e) => setPriceSold(Number(e.target.value || 0))} />
        </label>
        <label>
          Customer Name:
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div className="modal-buttons">
          <button onClick={handleSaveEdit} className="btn btn-success">
            Save
          </button>
          <button onClick={() => setEditingSale(null)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditSaleModal;
