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
  selectedProductId: string | null;
  onProductSelect: (productId: string | null) => void;
  placeholder?: string;
}

const ProductPicker: React.FC<Props> = ({ selectedProductId, onProductSelect, placeholder = 'Select product' }) => {
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

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const displayText = selectedProduct
    ? getProductDisplayText(
        selectedProduct,
        namesets,
        archivedNamesets,
        teams,
        archivedTeams,
        badges,
        archivedBadges,
        kitTypes,
        archivedKitTypes
      )
    : placeholder;

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
              {filteredProducts.length === 0 && (
                <div className={styles.pickerEmpty}>No products found</div>
              )}
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
                const isSelected = selectedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    className={`${styles.pickerOption} ${isSelected ? styles.selected : ''}`}
                    onClick={() => {
                      onProductSelect(product.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{productDisplayText}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '2px' }}>
                      Price: {product.price.toFixed(2)} RON
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

export default ProductPicker;

