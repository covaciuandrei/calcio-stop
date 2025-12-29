import React, { useState } from 'react';
import { useProductsList, useReservationsActions } from '../../stores';
import { ReservationItem } from '../../types';
import ProductPicker from '../products/ProductPicker';
import DateInput from '../shared/DateInput';

const AddReservationForm: React.FC = () => {
  // Get data and actions from stores
  const products = useProductsList();
  const { addReservation } = useReservationsActions();

  const [reservationItems, setReservationItems] = useState<ReservationItem[]>([
    { productId: '', size: '', quantity: 1, priceSold: 0 },
  ]);
  const [customerName, setCustomerName] = useState('');
  const [expiringDate, setExpiringDate] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [saleType, setSaleType] = useState<'OLX' | 'IN-PERSON' | 'VINTED'>('IN-PERSON');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // When product changes in any item, default size selection and price
  const handleItemProductChange = (index: number, productId: string) => {
    const updatedItems = [...reservationItems];
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
    setReservationItems(updatedItems);
  };

  const handleItemChange = (index: number, field: keyof ReservationItem, value: string | number) => {
    const updatedItems = [...reservationItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setReservationItems(updatedItems);
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
    setReservationItems([...reservationItems, { productId: '', size: '', quantity: 1, priceSold: 0 }]);
  };

  const removeItem = (index: number) => {
    if (reservationItems.length > 1) {
      const updatedItems = reservationItems.filter((_, i) => i !== index);
      setReservationItems(updatedItems);
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

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    // Expiring date is now optional - if not provided, it will default to 7 days from now
    if (expiringDate) {
      const expiring = new Date(expiringDate);
      const now = new Date();
      if (expiring <= now) {
        newErrors.expiringDate = 'Expiring date must be in the future';
      }
    }

    reservationItems.forEach((item, index) => {
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

  const handleReservation = async () => {
    if (!validateItems()) {
      return;
    }

    // Convert expiring date to ISO string with time
    // If no expiring date provided, default to 7 days from now
    const finalExpiringDate = expiringDate || (() => {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return sevenDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    })();

    const expiringDateTime = new Date(finalExpiringDate);
    expiringDateTime.setHours(23, 59, 59, 999); // Set to end of day

    const newReservation = {
      items: reservationItems.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        priceSold: item.priceSold,
      })),
      customerName: customerName.trim(),
      expiringDate: expiringDateTime.toISOString(),
      location: location.trim() || undefined,
      dateTime: dateTime || undefined,
      saleType,
    };

    await addReservation(newReservation);

    // Reset form
    setReservationItems([{ productId: '', size: '', quantity: 1, priceSold: 0 }]);
    setCustomerName('');
    setExpiringDate('');
    setLocation('');
    setDateTime('');
    setSaleType('IN-PERSON');
    setErrors({});
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleReservation();
      }}
    >
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="customerName">Customer Name *</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            if (errors.customerName) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.customerName;
                return newErrors;
              });
            }
          }}
          placeholder="Enter customer name"
        />
        {errors.customerName && <span className="error-text">{errors.customerName}</span>}
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="expiringDate">Expiring Date</label>
        <DateInput
          id="expiringDate"
          value={expiringDate}
          onChange={(value) => {
            setExpiringDate(value);
            if (errors.expiringDate) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.expiringDate;
                return newErrors;
              });
            }
          }}
          min={new Date().toISOString().split('T')[0]}
          placeholder="dd/mm/yyyy (optional - defaults to 7 days)"
        />
        {errors.expiringDate && <span className="error-text">{errors.expiringDate}</span>}
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (optional)"
        />
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="dateTime">Date and Time</label>
        <input
          type="datetime-local"
          id="dateTime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="saleType">Sale Type *</label>
        <select
          id="saleType"
          value={saleType}
          onChange={(e) => setSaleType(e.target.value as 'OLX' | 'IN-PERSON' | 'VINTED')}
        >
          <option value="IN-PERSON">In-Person</option>
          <option value="OLX">OLX</option>
          <option value="VINTED">Vinted</option>
        </select>
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label>Items *</label>
        {reservationItems.map((item, index) => {
          const product = products.find((p) => p.id === item.productId);
          const availableSizes = product?.sizes || [];

          return (
            <div
              key={index}
              style={{
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-2)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label>Product</label>
                  <ProductPicker
                    selectedProductId={item.productId || null}
                    onProductSelect={(productId) => {
                      if (productId) {
                        handleItemProductChange(index, productId);
                      } else {
                        handleItemProductChange(index, '');
                      }
                    }}
                  />
                  {errors[`item${index}_productId`] && (
                    <span className="error-text">{errors[`item${index}_productId`]}</span>
                  )}
                </div>

                <div style={{ flex: '0 0 100px' }}>
                  <label>Size</label>
                  <select
                    value={item.size}
                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                    disabled={!item.productId}
                  >
                    <option value="">Select size</option>
                    {availableSizes.map((sq) => (
                      <option key={sq.size} value={sq.size}>
                        {sq.size} ({sq.quantity} available)
                      </option>
                    ))}
                  </select>
                  {errors[`item${index}_size`] && <span className="error-text">{errors[`item${index}_size`]}</span>}
                </div>

                <div style={{ flex: '0 0 100px' }}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  {errors[`item${index}_quantity`] && (
                    <span className="error-text">{errors[`item${index}_quantity`]}</span>
                  )}
                </div>

                <div style={{ flex: '0 0 120px' }}>
                  <label>Price (RON)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.priceSold}
                    onChange={(e) => handleItemChange(index, 'priceSold', parseFloat(e.target.value) || 0)}
                  />
                  {errors[`item${index}_priceSold`] && (
                    <span className="error-text">{errors[`item${index}_priceSold`]}</span>
                  )}
                </div>

                {reservationItems.length > 1 && (
                  <div
                    style={{
                      flex: '0 0 auto',
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingBottom: 'var(--space-1)',
                    }}
                  >
                    <button type="button" onClick={() => removeItem(index)} className="button-danger">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <button type="button" onClick={addItem} className="button-secondary" style={{ marginTop: 'var(--space-2)' }}>
          + Add Item
        </button>
      </div>

      <button type="submit" className="button-primary">
        Create Reservation
      </button>
    </form>
  );
};

export default AddReservationForm;
