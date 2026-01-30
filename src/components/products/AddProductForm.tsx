import React, { useEffect, useState } from 'react';
import { useBadgesList, useKitTypesList, useNamesetsList, useProductsActions } from '../../stores';
import { AdultSize, KidSize, Product, ProductSizeQuantity, ProductType } from '../../types';
import BadgePicker from '../badges/BadgePicker';
import KitTypePicker from '../kittypes/KitTypePicker';
import NamesetPicker from '../namesets/NamesetPicker';
import styles from '../shared/Form.module.css';
import TeamPicker from '../teams/TeamPicker';

const adultSizes: AdultSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const kidSizes: KidSize[] = ['22', '24', '26', '28'];

const AddProductForm: React.FC = () => {
  // Get store data and actions
  const { addProduct } = useProductsActions();
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
  const [olxLink, setOlxLink] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isOnSale, setIsOnSale] = useState<boolean>(false);
  const [isNewModel, setIsNewModel] = useState<boolean>(false);
  const [salePrice, setSalePrice] = useState<number | ''>('');
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

  const handleAddProduct = async () => {
    const newErrors: { [key: string]: string } = {};

    // Either product notes OR team must be provided (not both required)
    if (!name.trim() && !selectedTeamId) {
      newErrors.name = 'Please enter product notes or select a team';
    }

    // Validate that a kit type is selected
    if (!selectedKitTypeId) {
      newErrors.kitType = 'Please select a kit type';
    }

    // Calculate total quantity of all sizes in the product
    const totalProductQuantity = sizes.reduce((total, sizeQty) => total + sizeQty.quantity, 0);

    if (totalProductQuantity <= 0) {
      newErrors.sizes = 'Please add at least one item to the product';
    }

    // Check if nameset has available quantity
    if (selectedNamesetId) {
      const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);
      if (selectedNameset && selectedNameset.quantity < totalProductQuantity) {
        newErrors.nameset = `Selected nameset only has ${selectedNameset.quantity} available, but you're trying to add ${totalProductQuantity} items`;
      }
    }

    // Check if badge has available quantity
    if (selectedBadgeId) {
      const selectedBadge = badges.find((b) => b.id === selectedBadgeId);
      if (selectedBadge && selectedBadge.quantity < totalProductQuantity) {
        newErrors.badge = `Selected badge only has ${selectedBadge.quantity} available, but you're trying to add ${totalProductQuantity} items`;
      }
    }

    // Validate sale price
    if (isOnSale) {
      if (salePrice === '' || salePrice === null || salePrice === undefined) {
        newErrors.salePrice = 'Sale price is required when product is on sale';
      } else {
        const salePriceNum = Number(salePrice);
        const originalPrice = Number(price);
        if (isNaN(salePriceNum) || salePriceNum <= 0) {
          newErrors.salePrice = 'Sale price must be a positive number';
        } else if (salePriceNum >= originalPrice) {
          newErrors.salePrice = 'Sale price must be smaller than the original price';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim() || '', // Allow empty notes if team is selected
      type,
      sizes,
      namesetId: selectedNamesetId,
      teamId: selectedTeamId,
      kitTypeId: selectedKitTypeId,
      badgeId: selectedBadgeId,
      price: Number(price) || 0,
      olxLink: olxLink.trim() || undefined,
      location: location.trim() || undefined,
      isOnSale: isOnSale,
      salePrice: isOnSale && salePrice !== '' ? Number(salePrice) : undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await addProduct(newProduct, { skipInventoryDeduction: isNewModel });
    } catch (error) {
      console.error('Error adding product:', error);
      setErrors({ submit: 'Failed to add product. Please try again.' });
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
    setOlxLink('');
    setLocation('');
    setIsOnSale(false);
    setIsNewModel(false);
    setSalePrice('');
    setErrors({}); // Clear any errors

    // Set default kit type after a brief delay to ensure state is reset
    setTimeout(() => {
      if (kitTypes.length > 0) {
        setSelectedKitTypeId(kitTypes[0].id);
      }
    }, 0);
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
        <label>Product Notes {selectedTeamId ? '(optional)' : '(required if no team selected)'}</label>
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
        <label>OLX Link (optional)</label>
        <input
          type="url"
          placeholder="https://www.olx.ro/..."
          value={olxLink}
          onChange={(e) => setOlxLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Location (optional)</label>
        <input
          type="text"
          placeholder="e.g. Warehouse A, Shelf 3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="sale-options-row">
        <div className="sale-option-item">
          <input
            id="new-model-checkbox"
            type="checkbox"
            checked={isNewModel}
            onChange={(e) => setIsNewModel(e.target.checked)}
          />
          <label htmlFor="new-model-checkbox" style={{ margin: 0, fontWeight: 'bold' }}>New Model</label>
        </div>

        <div className="sale-option-item">
          <input
            id="on-sale-checkbox"
            type="checkbox"
            checked={isOnSale}
            onChange={(e) => {
              setIsOnSale(e.target.checked);
              if (!e.target.checked) {
                setSalePrice('');
              }
            }}
          />
          <label htmlFor="on-sale-checkbox" style={{ margin: 0 }}>On Sale</label>
        </div>

        {isOnSale && (
          <div className={`sale-option-item sale-price-input ${errors.salePrice ? 'has-error' : ''}`}>
            <label htmlFor="sale-price-input">Sale Price (RON)</label>
            <input
              id="sale-price-input"
              type="number"
              min={0}
              max={price > 0 ? price - 0.01 : undefined}
              step={0.01}
              placeholder="Enter sale price"
              value={salePrice}
              onChange={(e) => {
                const val = e.target.value;
                setSalePrice(val === '' ? '' : parseFloat(val));
                // Clear error when user starts typing
                if (errors.salePrice) {
                  setErrors((prev) => ({ ...prev, salePrice: '' }));
                }
              }}
            />
            {errors.salePrice && <div className="error-message">{errors.salePrice}</div>}
          </div>
        )}
      </div>

      <div className="form-button-container">
        <button onClick={handleAddProduct} className="btn btn-success">
          Add Product
        </button>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </div>
    </div>
  );
};

export default AddProductForm;
