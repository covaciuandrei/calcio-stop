import React, { useEffect, useState } from 'react';
import { useBadgesList, useKitTypesList, useNamesetsList, useOrdersActions } from '../../stores';
import { AdultSize, KidSize, OrderStatus, ProductSizeQuantity, ProductType } from '../../types';
import BadgePicker from '../badges/BadgePicker';
import KitTypePicker from '../kittypes/KitTypePicker';
import NamesetPicker from '../namesets/NamesetPicker';
import styles from '../shared/Form.module.css';
import TeamPicker from '../teams/TeamPicker';

const adultSizes: AdultSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const kidSizes: KidSize[] = ['22', '24', '26', '28'];

interface AddOrderFormProps {
  onClose?: () => void;
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({ onClose }) => {
  // Get store data and actions
  const { addOrder } = useOrdersActions();
  const namesets = useNamesetsList();
  const badges = useBadgesList();
  const kitTypes = useKitTypesList();

  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.TO_ORDER);
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // initialize sizes depending on type
    const initial = (type === ProductType.KID_KIT ? kidSizes : adultSizes).map((s) => ({ size: s, quantity: 0 }));
    setSizes(initial);
  }, [type]);

  // Set default kit type when kit types are loaded
  useEffect(() => {
    if (kitTypes.length > 0 && !selectedKitTypeId) {
      setSelectedKitTypeId(kitTypes[0].id);
    }
  }, [kitTypes, selectedKitTypeId]);

  const handleQuantityChange = (size: string, value: number) => {
    setSizes((prev) => prev.map((p) => (p.size === size ? { ...p, quantity: value } : p)));
  };

  const handleAddOrder = async () => {
    const newErrors: { [key: string]: string } = {};

    // Either order name OR team must be provided (not both required)
    if (!name.trim() && !selectedTeamId) {
      newErrors.name = 'Please enter order name or select a team';
    }

    // Validate that a kit type is selected
    if (!selectedKitTypeId) {
      newErrors.kitType = 'Please select a kit type';
    }

    // Calculate total quantity of all sizes in the order
    const totalOrderQuantity = sizes.reduce((total, sizeQty) => total + sizeQty.quantity, 0);

    if (totalOrderQuantity <= 0) {
      newErrors.sizes = 'Please add at least one item to the order';
    }

    // Check if nameset has available quantity
    if (selectedNamesetId) {
      const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);
      if (selectedNameset && selectedNameset.quantity < totalOrderQuantity) {
        newErrors.nameset = `Selected nameset only has ${selectedNameset.quantity} available, but you're trying to add ${totalOrderQuantity} items`;
      }
    }

    // Check if badge has available quantity
    if (selectedBadgeId) {
      const selectedBadge = badges.find((b) => b.id === selectedBadgeId);
      if (selectedBadge && selectedBadge.quantity < totalOrderQuantity) {
        newErrors.badge = `Selected badge only has ${selectedBadge.quantity} available, but you're trying to add ${totalOrderQuantity} items`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newOrder = {
      name: name.trim() || '', // Allow empty name if team is selected
      type,
      sizes,
      namesetId: selectedNamesetId,
      teamId: selectedTeamId,
      kitTypeId: selectedKitTypeId,
      badgeId: selectedBadgeId,
      price: Number(price) || 0,
      status,
      customerName: customerName.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    };

    console.log('Adding order:', newOrder);

    try {
      await addOrder(newOrder);
      console.log('Order added successfully');
    } catch (error) {
      console.error('Error adding order:', error);
      setErrors({ submit: 'Failed to add order. Please try again.' });
      return;
    }

    // Reset form after successful addition
    setName('');
    setType(ProductType.SHIRT);
    // Explicitly reset sizes to default adult sizes with 0 quantities
    setSizes(adultSizes.map((s) => ({ size: s, quantity: 0 })));
    setSelectedNamesetId(null);
    setSelectedTeamId(null);
    setSelectedKitTypeId(''); // Reset to empty first
    setSelectedBadgeId(null);
    setPrice(0);
    setStatus(OrderStatus.TO_ORDER);
    setCustomerName('');
    setPhoneNumber('');
    setErrors({}); // Clear any errors

    // Set default kit type after a brief delay to ensure state is reset
    setTimeout(() => {
      if (kitTypes.length > 0) {
        setSelectedKitTypeId(kitTypes[0].id);
      }
    }, 0);

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="form-inline">
      <div className="form-group">
        <label>Select a team</label>
        <TeamPicker selectedTeamId={selectedTeamId} onTeamSelect={setSelectedTeamId} placeholder="Ex: Real Madrid" />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as ProductType)}>
          {Object.values(ProductType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
        <label>Order Name {selectedTeamId ? '(optional)' : '(required if no team selected)'}</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
          placeholder={
            selectedTeamId
              ? 'e.g. Home, Away, Third (optional)'
              : 'e.g. Real Madrid Home (required if no team selected)'
          }
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>

      <div className={`form-group ${styles.fullWidthGroup} ${errors.sizes ? 'has-error' : ''}`}>
        <label>Sizes & Quantities</label>
        <div className="size-quantity-grid">
          {sizes.map((sq) => (
            <div key={sq.size} className="size-quantity-item">
              <div className="size-quantity-label">{sq.size}</div>
              <input
                type="number"
                min={0}
                value={sq.quantity}
                onChange={(e) => {
                  handleQuantityChange(sq.size, Number(e.target.value || 0));
                  if (errors.sizes) {
                    setErrors((prev) => ({ ...prev, sizes: '' }));
                  }
                }}
                className="size-quantity-input"
              />
            </div>
          ))}
        </div>
        {errors.sizes && <div className="error-message">{errors.sizes}</div>}
      </div>

      <div className={`form-group ${errors.kitType ? 'has-error' : ''}`}>
        <label>Select kit type</label>
        <KitTypePicker
          selectedKitTypeId={selectedKitTypeId}
          onKitTypeSelect={(id) => {
            setSelectedKitTypeId(id);
            if (errors.kitType) {
              setErrors((prev) => ({ ...prev, kitType: '' }));
            }
          }}
        />
        {errors.kitType && <div className="error-message">{errors.kitType}</div>}
      </div>

      <div className={`form-group ${errors.nameset ? 'has-error' : ''}`}>
        <label>Select a nameset</label>
        <NamesetPicker
          selectedNamesetId={selectedNamesetId}
          onNamesetSelect={(id) => {
            setSelectedNamesetId(id);
            if (errors.nameset) {
              setErrors((prev) => ({ ...prev, nameset: '' }));
            }
          }}
          placeholder="Ex: Messi 10"
        />{' '}
        {errors.nameset && <div className="error-message">{errors.nameset}</div>}
      </div>

      <div className={`form-group ${errors.badge ? 'has-error' : ''}`}>
        <label>Select a badge</label>
        <BadgePicker
          selectedBadgeId={selectedBadgeId}
          onBadgeSelect={(id) => {
            setSelectedBadgeId(id);
            if (errors.badge) {
              setErrors((prev) => ({ ...prev, badge: '' }));
            }
          }}
          placeholder="Ex: UCL"
        />{' '}
        {errors.badge && <div className="error-message">{errors.badge}</div>}
      </div>

      <div className="form-group">
        <label>Price (per unit in RON)</label>
        <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Customer Name (optional)</label>
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex: John Doe" />
      </div>

      <div className="form-group">
        <label>Phone Number (optional)</label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Ex: +40 123 456 789" />
      </div>

      <div className="form-button-container">
        <button onClick={handleAddOrder} className="btn btn-success">
          Add Order
        </button>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </div>
    </div>
  );
};

export default AddOrderForm;
