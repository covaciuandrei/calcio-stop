import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppBarOrder, useAuth, useDashboardOrder, useSettingsActions } from '../../stores';
import styles from './SettingsPopup.module.css';

// Types
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// AppBar and Dashboard item definitions
const APP_BAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'products', label: 'Products', path: '/products' },
  { id: 'sales', label: 'Sales', path: '/sales' },
  { id: 'namesets', label: 'Namesets', path: '/namesets' },
  { id: 'teams', label: 'Teams', path: '/teams' },
  { id: 'badges', label: 'Badges', path: '/badges' },
  { id: 'kittypes', label: 'Kit Types', path: '/kittypes' },
  { id: 'suppliers', label: 'Suppliers', path: '/suppliers' },
];

const DASHBOARD_ITEMS = [
  { id: 'products', title: 'Manage Products', description: 'Stock, prices, and inventory management' },
  { id: 'sales', title: 'Manage Sales', description: 'Track and record your sales transactions' },
  { id: 'namesets', title: 'Manage Namesets', description: 'Customize team and player name collections' },
  { id: 'teams', title: 'Manage Teams', description: 'Organize your teams and player rosters' },
  { id: 'badges', title: 'Manage Badges', description: 'Create and manage badges for shirts' },
  { id: 'kitTypes', title: 'Manage Kit Types', description: 'Define kit types like 1st Kit, 2nd Kit, etc.' },
  { id: 'reservations', title: 'Manage Reservations', description: 'Track and manage product reservations' },
];

// Sortable Item Component
const SortableItem: React.FC<SortableItemProps> = React.memo(({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.sortableItem}
      data-dragging={isDragging}
    >
      {children}
    </div>
  );
});

// Drag Handle Component
const DragHandle: React.FC = () => (
  <div className={styles.dragHandle}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="2" cy="2" r="1" />
      <circle cx="6" cy="2" r="1" />
      <circle cx="10" cy="2" r="1" />
      <circle cx="2" cy="6" r="1" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="10" cy="6" r="1" />
      <circle cx="2" cy="10" r="1" />
      <circle cx="6" cy="10" r="1" />
      <circle cx="10" cy="10" r="1" />
    </svg>
  </div>
);

// Settings Popup Component
const SettingsPopup: React.FC<SettingsPopupProps> = ({ isOpen, onClose }) => {
  const [localAppBarOrder, setLocalAppBarOrder] = useState<string[]>([]);
  const [localDashboardOrder, setLocalDashboardOrder] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<'appbar' | 'dashboard' | null>(null);

  const appBarOrder = useAppBarOrder();
  const dashboardOrder = useDashboardOrder();
  const { setAppBarOrder, setDashboardOrder, resetAllSettings } = useSettingsActions();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize local state when popup opens
  React.useEffect(() => {
    if (isOpen) {
      // Filter out suppliers for non-admin users
      const filteredAppBarOrder = isAdmin ? [...appBarOrder] : appBarOrder.filter((id) => id !== 'suppliers');
      setLocalAppBarOrder(filteredAppBarOrder);
      setLocalDashboardOrder([...dashboardOrder]);
    }
  }, [isOpen, appBarOrder, dashboardOrder, isAdmin]);

  const handleAppBarDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = localAppBarOrder.indexOf(active.id as string);
        const newIndex = localAppBarOrder.indexOf(over.id as string);
        setLocalAppBarOrder(arrayMove(localAppBarOrder, oldIndex, newIndex));
      }
    },
    [localAppBarOrder]
  );

  const handleDashboardDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = localDashboardOrder.indexOf(active.id as string);
        const newIndex = localDashboardOrder.indexOf(over.id as string);
        setLocalDashboardOrder(arrayMove(localDashboardOrder, oldIndex, newIndex));
      }
    },
    [localDashboardOrder]
  );

  const handleSave = useCallback(() => {
    // Filter out suppliers for non-admin users before saving
    const orderToSave = isAdmin ? localAppBarOrder : localAppBarOrder.filter((id) => id !== 'suppliers');
    setAppBarOrder(orderToSave);
    setDashboardOrder(localDashboardOrder);
    onClose();
  }, [localAppBarOrder, localDashboardOrder, setAppBarOrder, setDashboardOrder, onClose, isAdmin]);

  const handleResetAppBar = useCallback(() => {
    const defaultOrder = [
      'dashboard',
      'products',
      'sales',
      'returns',
      'namesets',
      'teams',
      'badges',
      'kittypes',
      'suppliers',
    ];
    // Filter out suppliers for non-admin users
    const filteredOrder = isAdmin ? defaultOrder : defaultOrder.filter((id) => id !== 'suppliers');
    setLocalAppBarOrder(filteredOrder);
  }, [isAdmin]);

  const handleResetDashboard = useCallback(() => {
    setLocalDashboardOrder(['products', 'sales', 'returns', 'namesets', 'teams', 'badges', 'kitTypes']);
  }, []);

  const handleResetAll = useCallback(() => {
    resetAllSettings();
    const defaultOrder = [
      'dashboard',
      'products',
      'sales',
      'returns',
      'namesets',
      'teams',
      'badges',
      'kittypes',
      'suppliers',
    ];
    // Filter out suppliers for non-admin users
    const filteredOrder = isAdmin ? defaultOrder : defaultOrder.filter((id) => id !== 'suppliers');
    setLocalAppBarOrder(filteredOrder);
    setLocalDashboardOrder(['products', 'sales', 'returns', 'namesets', 'teams', 'badges', 'kitTypes']);
  }, [resetAllSettings, isAdmin]);

  const toggleSection = useCallback(
    (section: 'appbar' | 'dashboard') => {
      setExpandedSection(expandedSection === section ? null : section);
    },
    [expandedSection]
  );

  // Memoize the item lists to prevent unnecessary re-renders
  const appBarItems = useMemo(() => {
    return localAppBarOrder
      .filter((itemId) => {
        // Hide suppliers for non-admin users
        if (itemId === 'suppliers' && !isAdmin) return false;
        return true;
      })
      .map((itemId) => {
        const item = APP_BAR_ITEMS.find((i) => i.id === itemId);
        if (!item) return null;

        return (
          <SortableItem key={itemId} id={itemId}>
            <div className={styles.sortableItemContent}>
              <DragHandle />
              <span className={styles.itemLabel}>{item.label}</span>
            </div>
          </SortableItem>
        );
      });
  }, [localAppBarOrder, isAdmin]);

  const dashboardItems = useMemo(() => {
    return localDashboardOrder.map((itemId) => {
      const item = DASHBOARD_ITEMS.find((i) => i.id === itemId);
      if (!item) return null;

      return (
        <SortableItem key={itemId} id={itemId}>
          <div className={styles.sortableItemContent}>
            <DragHandle />
            <div className={styles.itemDetails}>
              <span className={styles.itemLabel}>{item.title}</span>
              <span className={styles.itemDescription}>{item.description}</span>
            </div>
          </div>
        </SortableItem>
      );
    });
  }, [localDashboardOrder]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.settingsPopupOverlay} onClick={onClose}>
      <div className={styles.settingsPopup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.settingsPopupHeader}>
          <h2>Customize Layout</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15.5 4.5l-11 11m0-11l11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.settingsPopupContent}>
          {/* AppBar Section */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggleSection('appbar')}>
              <div className={styles.sectionTitle}>
                <h3>AppBar Buttons Order</h3>
                <p className={styles.sectionDescription}>Reorder navigation buttons</p>
              </div>
              <div className={styles.sectionToggle}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`${styles.chevron} ${expandedSection === 'appbar' ? styles.chevronOpen : ''}`}
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {expandedSection === 'appbar' && (
              <div className={styles.sectionContent}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAppBarDragEnd}>
                  <SortableContext
                    items={localAppBarOrder.filter((id) => isAdmin || id !== 'suppliers')}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className={styles.sortableList}>{appBarItems}</div>
                  </SortableContext>
                </DndContext>
                <button className={styles.resetAppBarButton} onClick={handleResetAppBar}>
                  Reset AppBar Order
                </button>
              </div>
            )}
          </div>

          {/* Dashboard Section */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggleSection('dashboard')}>
              <div className={styles.sectionTitle}>
                <h3>Dashboard Cards Order</h3>
                <p className={styles.sectionDescription}>Reorder dashboard cards</p>
              </div>
              <div className={styles.sectionToggle}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`${styles.chevron} ${expandedSection === 'dashboard' ? styles.chevronOpen : ''}`}
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {expandedSection === 'dashboard' && (
              <div className={styles.sectionContent}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDashboardDragEnd}>
                  <SortableContext items={localDashboardOrder} strategy={verticalListSortingStrategy}>
                    <div className={styles.sortableList}>{dashboardItems}</div>
                  </SortableContext>
                </DndContext>
                <button className={styles.resetButton} onClick={handleResetDashboard}>
                  Reset Dashboard Order
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.settingsPopupFooter}>
          <button className={styles.resetAllButton} onClick={handleResetAll}>
            Reset All to Default
          </button>
          <div className={styles.actionButtons}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
