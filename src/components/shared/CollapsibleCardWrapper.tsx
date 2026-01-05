import React, { useState } from 'react';
import styles from './TableListCard.module.css';

interface CollapsibleCardWrapperProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  headerColor?: 'blue' | 'green' | 'yellow' | 'red';
}

const CollapsibleCardWrapper: React.FC<CollapsibleCardWrapperProps> = ({
  title,
  children,
  defaultExpanded = true,
  headerColor = 'green',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const headerColorClass = `mini-header-${headerColor}`;

  return (
    <div className="card">
      <div
        className={`card-header mini-header ${headerColorClass} ${styles.expandableHeader}`}
        onClick={toggleExpanded}
      >
        <span>{title}</span>
        <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
      </div>
      {!isExpanded && (
        <div className={styles.collapsedContent}>Click to expand form</div>
      )}
      <div
        className={`${styles.collapsibleContent} ${!isExpanded ? styles.collapsed : ''}`}
      >
        {isExpanded && (
          <div className="card-content">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleCardWrapper;
