import React, { useState } from 'react';
import { useProductsActions, useProductsList, useOrdersActions } from '../../stores';
import { Order, OrderItem, SaleType } from '../../types';
import ProductPicker from '../products/ProductPicker';

interface AddOrderFormProps {
  onClose: () => void;
  initialOrder?: Order;
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({ onClose, initialOrder }) => {
  const products = useProductsList();
  const { loadProducts } = useProductsActions();
  const { addOrder, updateOrder } = useOrdersActions();

  // Initialize state from initialOrder if provided, otherwise default
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    initialOrder?.items && initialOrder.items.length > 0
      ? initialOrder.items.map(item => ({ ...item })) // Deep copy to avoid mutating prop
      : [{ productId: '', size: '', quantity: 1, price: 0 }]
  );
  const [customerName, setCustomerName] = useState(initialOrder?.customerName || '');
  const [phoneNumber, setPhoneNumber] = useState(initialOrder?.phoneNumber || '');
  const [saleType, setSaleType] = useState<SaleType>(initialOrder?.saleType || 'OLX');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialOrder;

  // Handle product change for an item
  const handleItemProductChange = (index: number, productId: string) => {
    const updatedItems = [...orderItems];
    const product = products.find((p) => p.id === productId);

    if (product) {
      // Get first available size
      const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '';
      // Use sale price if on sale, otherwise regular price
      const price = product.isOnSale && product.salePrice ? product.salePrice : product.price || 0;

      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: firstSize,
        price,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        size: '',
        price: 0,
      };
    }
    setOrderItems(updatedItems);
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setOrderItems(updatedItems);

    // Clear error for this field
    const errorKey = `item${index}_${String(field)}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setOrderItems([...orderItems, { productId: '', size: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
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

    orderItems.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item${index}_productId`] = 'Select product';
      }
      if (!item.size) {
        newErrors[`item${index}_size`] = 'Select size';
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}_quantity`] = 'Quantity > 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItems()) return;

    setLoading(true);
    try {
      const orderData = {
        items: orderItems,
        saleType,
        customerName: customerName || undefined,
        phoneNumber: phoneNumber || undefined,
      };

      if (isEditing && initialOrder) {
        await updateOrder(initialOrder.id, orderData);
      } else {
        await addOrder(orderData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save order:', error);
      setErrors({ form: error instanceof Error ? error.message : 'Failed to save order' });
    } finally {
      setLoading(false);
    }
  };

  // Get available sizes for a product
  const getProductSizes = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.sizes || [];
  };

  // Get product name for display
  const getProductDisplayName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return '';
    const teamName = product.team?.name || '';
    const kitTypeName = product.kitType?.name || '';
    const parts = [teamName, product.name, kitTypeName].filter(Boolean);
    return parts.join(' - ');
  };

  // Calculate total price
  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <form onSubmit={handleSubmit} className="add-order-form">
      {errors.form && <div className="form-error">{errors.form}</div>}

      <div className="form-section">
        <h4 style={{ marginBottom: 'var(--space-3)' }}>Order Items</h4>

        {/* Column Headers */}
        {/* Column Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(250px, 3fr) minmax(100px, 1fr) 80px 120px 40px',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-2)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--gray-600)',
            padding: '0 var(--space-3)'
          }}
        >
          <div>Product</div>
          <div>Size</div>
          <div>Qty</div>
          <div>Price (RON)</div>
          <div></div>
        </div>

        {orderItems.map((item, index) => {
          const productSizes = getProductSizes(item.productId);

          return (
            <div
              key={index}
              className="order-item-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(250px, 3fr) minmax(100px, 1fr) 80px 120px 40px',
                gap: 'var(--space-3)',
                alignItems: 'start',
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)'
              }}
            >
              {/* Product Picker */}
              <div>
                <ProductPicker
                  selectedProductId={item.productId}
                  onProductSelect={(id) => handleItemChange(index, 'productId', id || '')}
                  placeholder="Search product..."
                />
                {errors[`item${index}_productId`] && <div className="error-message" style={{ fontSize: '0.7rem', marginTop: '2px' }}>{errors[`item${index}_productId`]}</div>}
              </div>

              {/* Size Select */}
              <div>
                <select
                  value={item.size}
                  onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                  className="form-select"
                  style={{
                    width: '100%',
                    borderColor: errors[`item${index}_size`] ? 'var(--error)' : undefined,
                    boxShadow: errors[`item${index}_size`] ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                  }}
                >
                  <option value="">Select Size</option>
                  {productSizes.map((sizeObj) => (
                    <option key={sizeObj.size} value={sizeObj.size}>
                      {sizeObj.size} ({sizeObj.quantity})
                    </option>
                  ))}
                </select>
                {errors[`item${index}_size`] && <div className="error-message" style={{ fontSize: '0.7rem', marginTop: '2px' }}>{errors[`item${index}_size`]}</div>}
              </div>

              {/* Quantity */}
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="form-input"
                  style={{
                    width: '100%',
                    borderColor: errors[`item${index}_quantity`] ? 'var(--error)' : undefined,
                    boxShadow: errors[`item${index}_quantity`] ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
                  }}
                  placeholder="Qty"
                />
                {errors[`item${index}_quantity`] && <div className="error-message" style={{ fontSize: '0.7rem', marginTop: '2px' }}>{errors[`item${index}_quantity`]}</div>}
              </div>

              {/* Price */}
              <div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="Price"
                />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn btn-danger btn-sm"
                disabled={orderItems.length === 1}
                style={{ padding: '0.5rem' }}
              >
                ✕
              </button>
            </div>
          );
        })}

        <button type="button" onClick={addItem} className="btn btn-secondary" style={{ marginTop: 'var(--space-2)' }}>
          + Add Another Item
        </button>

        <div style={{ marginTop: 'var(--space-3)', fontWeight: 'bold' }}>
          Total: {totalPrice.toFixed(2)} RON
        </div>
      </div>

      <div className="form-section" style={{ marginTop: 'var(--space-4)' }}>
        <h4 style={{ marginBottom: 'var(--space-3)' }}>Order Details</h4>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label>Sale Type</label>
            <select
              value={saleType}
              onChange={(e) => setSaleType(e.target.value as SaleType)}
              className="form-select"
            >
              <option value="OLX">OLX</option>
              <option value="IN-PERSON">In-Person</option>
              <option value="VINTED">Vinted</option>
            </select>
          </div>

          <div className="form-group">
            <label>Customer Name (optional)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input"
              placeholder="Customer name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number (optional)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input"
              placeholder="+40..."
            />
          </div>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Order'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddOrderForm;
