import React from 'react';
import styles from './TableListCard.module.css';

interface CollapsibleHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  count?: number;
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  isExpanded,
  onToggle,
  className = '',
  count,
}) => {
  const displayTitle = count !== undefined ? `${title} (${count})` : title;

  return (
    <div
      className={`card-header mini-header mini-header-blue ${styles.expandableHeader} ${className}`}
      onClick={onToggle}
    >
      <span>{displayTitle}</span>
      <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
    </div>
  );
};

export default CollapsibleHeader;
