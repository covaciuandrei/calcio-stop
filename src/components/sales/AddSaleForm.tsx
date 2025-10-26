import React, { useEffect, useState } from 'react';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsActions,
  useProductsList,
  useSalesActions,
  useTeamsList,
} from '../../stores';
import { Sale } from '../../types';
import { getProductDisplayText } from '../../utils/utils';

const AddSaleForm: React.FC = () => {
  // Get data and actions from stores
  const products = useProductsList();
  const { updateProduct } = useProductsActions();
  const { addSale } = useSalesActions();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [priceSold, setPriceSold] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // when product changes, default size selection to first available size
  useEffect(() => {
    const p = products.find((pp) => pp.id === productId);
    if (p) {
      if (p.sizes && p.sizes.length > 0) {
        setSize(p.sizes[0].size);
      } else {
        setSize('');
      }
      // default priceSold to product.price
      setPriceSold(p?.price || 0);
    } else {
      setSize('');
      setPriceSold(0);
    }
  }, [productId, products]);

  const handleSale = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productId) {
      newErrors.productId = 'Select product';
    }
    if (!size) {
      newErrors.size = 'Select size';
    }
    if (quantity <= 0) {
      newErrors.quantity = 'Quantity must be > 0';
    }
    if (priceSold <= 0) {
      newErrors.priceSold = 'Enter price';
    }

    const product = products.find((p) => p.id === productId);
    if (!product && productId) {
      newErrors.productId = 'Product not found';
    }

    if (product) {
      const sizeObj = product.sizes.find((sq) => sq.size === size);
      if (!sizeObj && size) {
        newErrors.size = 'Selected size not found';
      }
      if (sizeObj && sizeObj.quantity < quantity) {
        newErrors.quantity = 'Not enough stock for that size';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // decrement size quantity
    const updatedSizes = product!.sizes.map((sq) =>
      sq.size === size ? { ...sq, quantity: sq.quantity - quantity } : sq
    );

    updateProduct(productId, { sizes: updatedSizes });

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      size,
      quantity,
      priceSold,
      customerName: customerName || 'N/A',
      date: (() => {
        if (date && date.trim()) {
          // Get current time components from browser
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();

          // Create date string with current time
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          const dateTimeString = `${date}T${timeString}`;

          // Create date object and convert to ISO
          const finalDate = new Date(dateTimeString);
          return finalDate.toISOString();
        } else {
          return new Date().toISOString();
        }
      })(),
      createdAt: new Date().toISOString(),
    };

    addSale(newSale);

    // reset small fields
    setProductId('');
    setSize('');
    setQuantity(1);
    setPriceSold(0);
    setCustomerName('');
    setDate('');
  };

  return (
    <div className="form-inline">
      <div className={`form-group ${errors.productId ? 'has-error' : ''}`}>
        <label>Product</label>
        <select
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            if (errors.productId) {
              setErrors((prev) => ({ ...prev, productId: '' }));
            }
          }}
        >
          <option value="">Select product</option>
          {products.map((p) => {
            const displayText = getProductDisplayText(
              p,
              namesets,
              archivedNamesets,
              teams,
              archivedTeams,
              badges,
              archivedBadges,
              kitTypes,
              archivedKitTypes
            );
            return (
              <option key={p.id} value={p.id}>
                {displayText}
              </option>
            );
          })}
        </select>
        {errors.productId && <div className="error-message">{errors.productId}</div>}
      </div>

      <div className={`form-group ${errors.size ? 'has-error' : ''}`}>
        <label>Size</label>
        <select
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
            if (errors.size) {
              setErrors((prev) => ({ ...prev, size: '' }));
            }
          }}
        >
          <option value="">Select size</option>
          {products
            .find((p) => p.id === productId)
            ?.sizes.map((sq) => (
              <option key={sq.size} value={sq.size}>
                {sq.size} (stock: {sq.quantity})
              </option>
            ))}
        </select>
        {errors.size && <div className="error-message">{errors.size}</div>}
      </div>

      <div className={`form-group ${errors.quantity ? 'has-error' : ''}`}>
        <label>Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value || 1));
            if (errors.quantity) {
              setErrors((prev) => ({ ...prev, quantity: '' }));
            }
          }}
        />
        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
      </div>

      <div className={`form-group ${errors.priceSold ? 'has-error' : ''}`}>
        <label>Price Sold</label>
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
        {errors.priceSold && <div className="error-message">{errors.priceSold}</div>}
      </div>

      <div className="form-group">
        <label>Customer Name</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
