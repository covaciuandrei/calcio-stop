import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSalesActions } from '../../stores';
import { Sale, SaleType } from '../../types';

interface Props {
  editingSale: Sale | null;
  setEditingSale: React.Dispatch<React.SetStateAction<Sale | null>>;
}

const EditSaleModal: React.FC<Props> = ({ editingSale, setEditingSale }) => {
  // Get store actions
  const { updateSale } = useSalesActions();
  const [quantity, setQuantity] = useState<number>(editingSale?.quantity || 0);
  const [priceSold, setPriceSold] = useState<number>(editingSale?.priceSold || 0);
  const [customerName, setCustomerName] = useState<string>(editingSale?.customerName || '');
  const [date, setDate] = useState<string>('');
  const [saleType, setSaleType] = useState<SaleType>(editingSale?.saleType || 'IN-PERSON');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingSale changes
  React.useEffect(() => {
    if (editingSale) {
      setQuantity(editingSale.quantity);
      setPriceSold(editingSale.priceSold);
      setCustomerName(editingSale.customerName);
      setDate(new Date(editingSale.date).toISOString().slice(0, 10));
      setSaleType(editingSale.saleType);
      setErrors({});
    }
  }, [editingSale]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    const newErrors: { [key: string]: string } = {};

    if (quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (priceSold <= 0) {
      newErrors.priceSold = 'Price must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    updateSale(editingSale.id, {
      quantity,
      priceSold,
      customerName,
      date: date && date.trim() ? new Date(date).toISOString() : new Date().toISOString(),
      saleType,
    });
    setEditingSale(null);
  };

  if (!editingSale) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Sale</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.quantity ? 'has-error' : ''}`}>
            <label>
              Quantity:
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value || 0));
                  if (errors.quantity) {
                    setErrors((prev) => ({ ...prev, quantity: '' }));
                  }
                }}
              />
            </label>
            {errors.quantity && <div className="error-message">{errors.quantity}</div>}
          </div>
          <div className={`form-group ${errors.priceSold ? 'has-error' : ''}`}>
            <label>
              Price Sold (RON):
              <input
                type="number"
                min={0}
                value={priceSold}
                onChange={(e) => {
                  setPriceSold(Number(e.target.value || 0));
                  if (errors.priceSold) {
                    setErrors((prev) => ({ ...prev, priceSold: '' }));
                  }
                }}
              />
            </label>
            {errors.priceSold && <div className="error-message">{errors.priceSold}</div>}
          </div>
          <div className="form-group">
            <label>
              Customer Name:
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </label>
          </div>
          <div className="form-group">
            <label>
              Date:
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          <div className="form-group">
            <label>
              Sale Type:
              <select value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
                <option value="IN-PERSON">In-Person</option>
                <option value="OLX">OLX</option>
              </select>
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingSale(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditSaleModal;
