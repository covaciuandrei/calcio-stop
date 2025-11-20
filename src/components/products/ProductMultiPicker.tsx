import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsList,
  useTeamsList,
} from '../../stores';
import { getProductDisplayText } from '../../utils/utils';
import styles from '../shared/Picker.module.css';

interface Props {
  selectedProductIds: string[];
  onProductsChange: (productIds: string[]) => void;
  placeholder?: string;
}

const ProductMultiPicker: React.FC<Props> = ({
  selectedProductIds,
  onProductsChange,
  placeholder = 'Select products',
}) => {
  // Get products from store
  const products = useProductsList();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside and update position on scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (isOpen && dropdownRef.current && pickerRef.current) {
        const rect = pickerRef.current.getBoundingClientRect();
        dropdownRef.current.style.left = `${rect.left}px`;
        dropdownRef.current.style.top = `${rect.bottom}px`;
      }
    };

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const displayText = getProductDisplayText(
      product,
      namesets,
      archivedNamesets,
      teams,
      archivedTeams,
      badges,
      archivedBadges,
      kitTypes,
      archivedKitTypes
    );
    return displayText.toLowerCase().includes(search.toLowerCase());
  });

  const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));
  const displayText =
    selectedProducts.length === 0
      ? placeholder
      : selectedProducts.length === 1
        ? getProductDisplayText(
            selectedProducts[0],
            namesets,
            archivedNamesets,
            teams,
            archivedTeams,
            badges,
            archivedBadges,
            kitTypes,
            archivedKitTypes
          )
        : `${selectedProducts.length} products selected`;

  const handleToggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      // Remove product
      onProductsChange(selectedProductIds.filter((id) => id !== productId));
    } else {
      // Add product
      onProductsChange([...selectedProductIds, productId]);
    }
  };

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '100%' }}>
      <div className={styles.pickerTrigger} onClick={() => setIsOpen((prev) => !prev)}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayText}</span>
        <span style={{ marginLeft: 'auto', flexShrink: 0 }}>▼</span>
      </div>

      {/* Dropdown for selecting products */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 400,
              maxHeight: '400px',
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerSearch}>
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.pickerSearchInput}
                autoFocus
              />
            </div>
            <div className={styles.pickerList} style={{ maxHeight: '350px' }}>
              {filteredProducts.length === 0 && <div className={styles.pickerEmpty}>No products found</div>}
              {filteredProducts.map((product) => {
                const productDisplayText = getProductDisplayText(
                  product,
                  namesets,
                  archivedNamesets,
                  teams,
                  archivedTeams,
                  badges,
                  archivedBadges,
                  kitTypes,
                  archivedKitTypes
                );
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className={`${styles.pickerOption} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleToggleProduct(product.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleProduct(product.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '14px',
                        height: '14px',
                        margin: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{productDisplayText}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '2px' }}>
                        Price: {product.price.toFixed(2)} RON
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProductMultiPicker;
