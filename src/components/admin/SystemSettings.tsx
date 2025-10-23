import React, { useEffect } from 'react';
import { useSystemStore } from '../../stores/systemStore';
import './SystemSettings.css';

export const SystemSettings: React.FC = () => {
  const { registrationEnabled, isLoading, error, loadSettings, setRegistrationEnabled, clearError } = useSystemStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleToggleRegistration = async () => {
    await setRegistrationEnabled(!registrationEnabled);
  };

  return (
    <div className="system-settings">
      <div className="settings-card">
        <h2>System Settings</h2>
        <p className="settings-subtitle">Manage system-wide settings</p>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={clearError} className="clear-error-btn">
              ×
            </button>
          </div>
        )}

        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <h3>User Registration</h3>
              <p>Allow new users to create accounts</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={registrationEnabled}
                  onChange={handleToggleRegistration}
                  disabled={isLoading}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-status">{registrationEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        <div className="settings-info">
          <h4>How it works:</h4>
          <ul>
            <li>
              <strong>Enabled:</strong> Users can create new accounts and login
            </li>
            <li>
              <strong>Disabled:</strong> Only existing users can login, no new registrations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
