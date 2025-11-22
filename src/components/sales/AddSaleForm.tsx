import React, { useState } from 'react';
import { useProductsActions, useProductsList, useSalesActions } from '../../stores';
import { Sale, SaleItem, SaleType } from '../../types';
import ProductPicker from '../products/ProductPicker';
import DateInput from '../shared/DateInput';

const AddSaleForm: React.FC = () => {
  // Get data and actions from stores
  const products = useProductsList();
  const { updateProduct } = useProductsActions();
  const { addSale } = useSalesActions();

  const [saleItems, setSaleItems] = useState<SaleItem[]>([{ productId: '', size: '', quantity: 1, priceSold: 0 }]);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [saleType, setSaleType] = useState<SaleType>('IN-PERSON');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // When product changes in any item, default size selection and price
  const handleItemProductChange = (index: number, productId: string) => {
    const updatedItems = [...saleItems];
    const product = products.find((p) => p.id === productId);

    if (product) {
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '',
        priceSold: product.price || 0,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: '',
        priceSold: 0,
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
        if (sizeObj && sizeObj.quantity < item.quantity) {
          newErrors[`item${index}_quantity`] = 'Not enough stock for that size';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSale = async () => {
    if (!validateItems()) {
      return;
    }

    // Group items by productId to handle multiple sizes of the same product
    const itemsByProduct: { [productId: string]: Array<{ size: string; quantity: number }> } = {};
    saleItems.forEach((item) => {
      if (!itemsByProduct[item.productId]) {
        itemsByProduct[item.productId] = [];
      }
      itemsByProduct[item.productId].push({ size: item.size, quantity: item.quantity });
    });

    // Update product stock - one update per product to avoid race conditions
    for (const productId in itemsByProduct) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const productItems = itemsByProduct[productId];
        // Update all sizes for this product in one operation
        const updatedSizes = product.sizes.map((sq) => {
          // Find all items for this size
          const itemsForThisSize = productItems.filter((item) => item.size === sq.size);
          if (itemsForThisSize.length > 0) {
            // Sum up all quantities to subtract for this size
            const totalQuantityToSubtract = itemsForThisSize.reduce((sum, item) => sum + item.quantity, 0);
            return {
              ...sq,
              quantity: sq.quantity - totalQuantityToSubtract,
            };
          }
          return sq;
        });
        await updateProduct(productId, { sizes: updatedSizes });
      }
    }

    const newSale: Omit<Sale, 'id' | 'createdAt'> = {
      items: saleItems.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        priceSold: item.priceSold,
      })),
      customerName: customerName || 'N/A',
      date: (() => {
        if (date && date.trim()) {
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          const dateTimeString = `${date}T${timeString}`;
          const finalDate = new Date(dateTimeString);
          return finalDate.toISOString();
        } else {
          return new Date().toISOString();
        }
      })(),
      saleType,
    };

    addSale(newSale);

    // Reset form
    setSaleItems([{ productId: '', size: '', quantity: 1, priceSold: 0 }]);
    setCustomerName('');
    setDate('');
    setSaleType('IN-PERSON');
    setErrors({});
  };

  return (
    <div className="form-inline">
      <h4 style={{ width: '100%', marginBottom: 'var(--space-3)' }}>Sale Items</h4>
      {saleItems.map((item, index) => {
        const product = products.find((p) => p.id === item.productId);
        return (
          <div
            key={index}
            style={{
              width: '100%',
              marginBottom: 'var(--space-4)',
              padding: 'var(--space-3)',
              border: '1px solid var(--gray-300)',
              borderRadius: 'var(--radius-md)',
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              <div className={`form-group ${errors[`item${index}_quantity`] ? 'has-error' : ''}`}>
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

              <div className={`form-group ${errors[`item${index}_priceSold`] ? 'has-error' : ''}`}>
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
        <DateInput value={date} onChange={(value) => setDate(value)} placeholder="dd/mm/yyyy" />
      </div>

      <div className="form-group">
        <label>Sale Type</label>
        <select value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
          <option value="IN-PERSON">In-Person</option>
          <option value="OLX">OLX</option>
          <option value="VINTED">Vinted</option>
        </select>
      </div>

      <div className="form-button-container">
        <button onClick={handleSale} className="btn btn-success">
          Record Sale
        </button>
      </div>
    </div>
  );
};

export default AddSaleForm;
