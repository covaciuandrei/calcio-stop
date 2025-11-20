import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useKitTypesList, useProductsActions } from '../../stores';
import { AdultSize, KidSize, Product, ProductSizeQuantity, ProductType } from '../../types';
import BadgePicker from '../badges/BadgePicker';
import KitTypePicker from '../kittypes/KitTypePicker';
import NamesetPicker from '../namesets/NamesetPicker';
import styles from '../shared/Form.module.css';
import TeamPicker from '../teams/TeamPicker';

const adultSizes: AdultSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const kidSizes: KidSize[] = ['22', '24', '26', '28'];

interface Props {
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const EditProductModal: React.FC<Props> = ({ editingProduct, setEditingProduct }) => {
  // Get store actions and data
  const { updateProduct } = useProductsActions();
  const kitTypes = useKitTypesList();
  const [name, setName] = useState(editingProduct?.name || '');
  const [type, setType] = useState<ProductType>(editingProduct?.type || ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>(editingProduct?.sizes || []);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(editingProduct?.namesetId || null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(editingProduct?.teamId || null);
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>(
    editingProduct?.kitTypeId || (kitTypes.length > 0 ? kitTypes[0].id : '')
  );
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(editingProduct?.badgeId || null);
  const [price, setPrice] = useState<number>(editingProduct?.price || 0);
  const [olxLink, setOlxLink] = useState<string>(editingProduct?.olxLink || '');
  const [location, setLocation] = useState<string>(editingProduct?.location || '');
  const [isOnSale, setIsOnSale] = useState<boolean>(editingProduct?.isOnSale || false);
  const [salePrice, setSalePrice] = useState<number | ''>(editingProduct?.salePrice || '');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setType(editingProduct.type);
      setSizes(editingProduct.sizes);
      setSelectedNamesetId(editingProduct.namesetId);
      setSelectedTeamId(editingProduct.teamId);
      setSelectedKitTypeId(editingProduct.kitTypeId);
      setSelectedBadgeId(editingProduct.badgeId);
      setPrice(editingProduct.price || 0);
      setOlxLink(editingProduct.olxLink || '');
      setLocation(editingProduct.location || '');
      setIsOnSale(editingProduct.isOnSale || false);
      setSalePrice(editingProduct.salePrice || '');
      // Use setTimeout to ensure sizes are loaded before enabling type changes
      setTimeout(() => setHasLoaded(true), 0);
    }
  }, [editingProduct]);

  // Update sizes when type changes - but only after initial load
  React.useEffect(() => {
    if (hasLoaded) {
      const availableSizes = type === ProductType.KID_KIT ? kidSizes : adultSizes;

      // Preserve existing quantities when changing type
      const newSizes = availableSizes.map((s) => {
        const existingSize = sizes.find((existing) => existing.size === s);
        return { size: s, quantity: existingSize ? existingSize.quantity : 0 };
      });
      setSizes(newSizes);
    }
    // Intentional: sizes is not included to avoid infinite loop - we only want to update when type or hasLoaded changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, hasLoaded]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const newErrors: { [key: string]: string } = {};

    // Product notes are optional if a team is selected
    if (!name.trim() && !selectedTeamId) {
      newErrors.name = 'Please enter product notes or select a team';
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

    // Allow zero quantities (out of stock products)
    // Note: Badge quantity validation is not needed when editing products
    // Badge quantities are only checked when adding new products

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Prepare sale price: if on sale and has value, use it; if not on sale, clear it
    let finalSalePrice: number | undefined = undefined;
    if (isOnSale) {
      finalSalePrice = salePrice !== '' ? Number(salePrice) : undefined;
    } else {
      // If turning off sale, explicitly clear the sale price by setting to undefined
      finalSalePrice = undefined;
    }

    updateProduct(editingProduct.id, {
      name: name.trim() || '',
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
      salePrice: finalSalePrice,
    });

    // Note: Badge and nameset quantities are not updated when editing products
    // Only when adding new products do we modify badge/nameset quantities

    setEditingProduct(null);
  };

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSizes((prev) => prev.map((sq) => (sq.size === size ? { ...sq, quantity: qty } : sq)));
  };

  if (!editingProduct) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingProduct(null)}>
      <div className={`modal-content ${styles.modalContentScrollable}`} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Product</h3>
        <form onSubmit={handleSaveEdit}>
          <label>
            Select a team:
            <TeamPicker
              selectedTeamId={selectedTeamId}
              onTeamSelect={setSelectedTeamId}
              placeholder="Select a team (optional)"
            />
          </label>

          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value as ProductType)}>
              {Object.values(ProductType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              Product Notes {selectedTeamId ? '(optional)' : ''}:
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                placeholder={selectedTeamId ? 'e.g. Home, Away, Third (optional)' : 'e.g. Real Madrid Home'}
              />
            </label>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <label>
            Select kit type:
            <KitTypePicker selectedKitTypeId={selectedKitTypeId} onKitTypeSelect={setSelectedKitTypeId} />
          </label>

          <label>
            Select a nameset:
            <NamesetPicker
              selectedNamesetId={selectedNamesetId}
              onNamesetSelect={setSelectedNamesetId}
              placeholder="Select a nameset (optional)"
            />
          </label>

          <div className={`form-group ${errors.badge ? 'has-error' : ''}`}>
            <label>
              Select a badge:
              <BadgePicker
                selectedBadgeId={selectedBadgeId}
                onBadgeSelect={(id) => {
                  setSelectedBadgeId(id);
                  if (errors.badge) {
                    setErrors((prev) => ({ ...prev, badge: '' }));
                  }
                }}
                placeholder="Select a badge (optional)"
              />
            </label>
            {errors.badge && <div className="error-message">{errors.badge}</div>}
          </div>

          <div className={`form-group ${errors.sizes ? 'has-error' : ''}`}>
            <label>
              Sizes & Quantities:
              <div className={`size-quantity-grid ${styles.sizeQuantityGrid}`}>
                {sizes.map((sq) => (
                  <div key={sq.size} className="size-quantity-item">
                    <div className="size-quantity-label">{sq.size}</div>
                    <input
                      type="number"
                      min={0}
                      value={sq.quantity}
                      onChange={(e) => {
                        handleSizeQuantityChange(sq.size, Number(e.target.value || 0));
                        if (errors.sizes) {
                          setErrors((prev) => ({ ...prev, sizes: '' }));
                        }
                      }}
                      className="size-quantity-input"
                    />
                  </div>
                ))}
              </div>
            </label>
            {errors.sizes && <div className="error-message">{errors.sizes}</div>}
          </div>

          <label>
            Price (per unit in RON):
            <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
          </label>

          <label>
            OLX Link (optional):
            <input
              type="url"
              placeholder="https://www.olx.ro/..."
              value={olxLink}
              onChange={(e) => setOlxLink(e.target.value)}
            />
          </label>

          <label>
            Location (optional):
            <input
              type="text"
              placeholder="e.g. Warehouse A, Shelf 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          <label className={styles.onSaleCheckboxLabel}>
            <input
              type="checkbox"
              checked={isOnSale}
              onChange={(e) => {
                setIsOnSale(e.target.checked);
                if (!e.target.checked) {
                  setSalePrice('');
                }
              }}
              className={styles.onSaleCheckbox}
            />
            <span>On Sale</span>
          </label>

          {isOnSale && (
            <div className={`form-group ${errors.salePrice ? 'has-error' : ''}`}>
              <label>
                Sale Price (RON):
                <input
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
              </label>
              {errors.salePrice && <div className="error-message">{errors.salePrice}</div>}
            </div>
          )}

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditProductModal;
