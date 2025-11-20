import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../stores/authStore';
import styles from './UserMenu.module.css';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();

      // Small delay to ensure logout completes before closing
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // No need for click-outside handler since we're handling it in the overlay

  if (!user) return null;

  return (
    <div className={styles['user-menu']} ref={menuRef}>
      <button className="settings-button" onClick={() => setIsOpen(!isOpen)} title={`Profile - ${user.name}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            className={styles['profile-popup-overlay']}
            onClick={(e) => {
              // Only close if clicking on the overlay itself, not on the popup
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div
              className={styles['profile-popup']}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={styles['profile-popup-header']}>
                <h2>Profile</h2>
                <button className={styles['close-button']} onClick={() => setIsOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15.5 4.5l-11 11m0-11l11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className={styles['profile-popup-content']}>
                <div className={styles['profile-section']}>
                  <div className={styles['profile-header']}>
                    <div className={styles['profile-avatar']}>{user.name.charAt(0).toUpperCase()}</div>
                    <div className={styles['profile-info']}>
                      <div className={styles['profile-name']}>{user.name}</div>
                      <div className={styles['profile-email']}>{user.email}</div>
                    </div>
                  </div>

                  <div className={styles['profile-role']}>
                    <span className={styles['role-badge']}>{user.role}</span>
                  </div>
                </div>

                <div className={styles['profile-actions']}>
                  <button
                    className={styles['logout-button']}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
