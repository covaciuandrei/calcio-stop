import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useProductsList, useSalesActions } from '../../stores';
import { Sale, SaleItem, SaleType } from '../../types';
import ProductPicker from '../products/ProductPicker';

interface Props {
  editingSale: Sale | null;
  setEditingSale: React.Dispatch<React.SetStateAction<Sale | null>>;
}

const EditSaleModal: React.FC<Props> = ({ editingSale, setEditingSale }) => {
  // Get store actions and data
  const { updateSale } = useSalesActions();
  const products = useProductsList();

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [saleType, setSaleType] = useState<SaleType>('IN-PERSON');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingSale changes
  React.useEffect(() => {
    if (editingSale) {
      setSaleItems(editingSale.items || []);
      setCustomerName(editingSale.customerName);
      setDate(new Date(editingSale.date).toISOString().slice(0, 10));
      setSaleType(editingSale.saleType);
      setErrors({});
    }
  }, [editingSale]);

  const handleItemProductChange = (index: number, productId: string) => {
    const updatedItems = [...saleItems];
    const product = products.find((p) => p.id === productId);

    if (product) {
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '',
        priceSold: product.price || updatedItems[index].priceSold,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: '',
      };
    }
    setSaleItems(updatedItems);
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: string | number) => {
    const updatedItems = [...saleItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setSaleItems(updatedItems);
    // Clear errors for this field
    if (errors[`item${index}_${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`item${index}_${field}`];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setSaleItems([...saleItems, { productId: '', size: '', quantity: 1, priceSold: 0 }]);
  };

  const removeItem = (index: number) => {
    if (saleItems.length > 1) {
      const updatedItems = saleItems.filter((_, i) => i !== index);
      setSaleItems(updatedItems);
      // Clear errors for removed item
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith(`item${index}_`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  const validateItems = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    saleItems.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item${index}_productId`] = 'Select product';
      }
      if (!item.size) {
        newErrors[`item${index}_size`] = 'Select size';
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}_quantity`] = 'Quantity must be > 0';
      }
      if (item.priceSold <= 0) {
        newErrors[`item${index}_priceSold`] = 'Enter price';
      }

      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const sizeObj = product.sizes.find((sq) => sq.size === item.size);
        if (!sizeObj && item.size) {
          newErrors[`item${index}_size`] = 'Selected size not found';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    if (!validateItems()) {
      return;
    }

    // Preserve the original time when updating the date
    const originalDate = new Date(editingSale.date);
    let updatedDate: Date;

    if (date && date.trim()) {
      const newDate = new Date(date);
      updatedDate = new Date(newDate);
      updatedDate.setHours(
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds(),
        originalDate.getMilliseconds()
      );
    } else {
      updatedDate = new Date();
    }

    updateSale(editingSale.id, {
      items: saleItems,
      customerName,
      date: updatedDate.toISOString(),
      saleType,
    });
    setEditingSale(null);
  };

  if (!editingSale) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingSale(null)}>
      <div
        className="modal-content"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Sale</h3>
        <form onSubmit={handleSaveEdit} style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          <h4 style={{ marginBottom: 'var(--space-2)' }}>Sale Items</h4>
          {saleItems.map((item, index) => {
            const product = products.find((p) => p.id === item.productId);
            return (
              <div
                key={index}
                style={{
                  width: '100%',
                  marginBottom: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--radius-md)',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <h5 style={{ margin: 0 }}>Item {index + 1}</h5>
                  {saleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className={`form-group ${errors[`item${index}_productId`] ? 'has-error' : ''}`}>
                  <label>Product</label>
                  <ProductPicker
                    selectedProductId={item.productId || null}
                    onProductSelect={(productId) => handleItemProductChange(index, productId || '')}
                    placeholder="Select product"
                  />
                  {errors[`item${index}_productId`] && (
                    <div className="error-message">{errors[`item${index}_productId`]}</div>
                  )}
                </div>

                <div className={`form-group ${errors[`item${index}_size`] ? 'has-error' : ''}`}>
                  <label>Size</label>
                  <select
                    value={item.size}
                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                    disabled={!item.productId}
                  >
                    <option value="">Select size</option>
                    {product?.sizes.map((sq) => (
                      <option key={sq.size} value={sq.size}>
                        {sq.size} (stock: {sq.quantity})
                      </option>
                    ))}
                  </select>
                  {errors[`item${index}_size`] && <div className="error-message">{errors[`item${index}_size`]}</div>}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-2)',
                    width: '100%',
                    boxSizing: 'border-box',
                    minWidth: 0,
                  }}
                >
                  <div
                    className={`form-group ${errors[`item${index}_quantity`] ? 'has-error' : ''}`}
                    style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}
                  >
                    <label>Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value || 1))}
                    />
                    {errors[`item${index}_quantity`] && (
                      <div className="error-message">{errors[`item${index}_quantity`]}</div>
                    )}
                  </div>

                  <div
                    className={`form-group ${errors[`item${index}_priceSold`] ? 'has-error' : ''}`}
                    style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}
                  >
                    <label>Price Sold (RON)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.priceSold}
                      onChange={(e) => handleItemChange(index, 'priceSold', Number(e.target.value || 0))}
                    />
                    {errors[`item${index}_priceSold`] && (
                      <div className="error-message">{errors[`item${index}_priceSold`]}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ width: '100%', marginBottom: 'var(--space-3)' }}>
            <button type="button" onClick={addItem} className="btn btn-secondary">
              + Add Another Item
            </button>
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sale Type</label>
            <select value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
              <option value="IN-PERSON">In-Person</option>
              <option value="OLX">OLX</option>
            </select>
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
