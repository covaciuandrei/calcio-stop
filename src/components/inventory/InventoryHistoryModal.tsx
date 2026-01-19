import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getInventoryHistory } from '../../lib/inventoryLog';
import { InventoryEntityType, InventoryLog } from '../../types';

interface Props {
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
}

const InventoryHistoryModal: React.FC<Props> = ({ entityType, entityId, entityName, isOpen, onClose }) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (!entityId) return;
      
      setLoading(true);
      setError(null);
      try {
        const history = await getInventoryHistory(entityType, entityId);
        setLogs(history as unknown as InventoryLog[]);
      } catch (err) {
        setError('Failed to load inventory history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, entityId, entityType]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '90%' }}>
        <div className="modal-header">
          <h3>Inventory History: {entityName}</h3>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
              No inventory history found for this item.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
              {/* Desktop Table - Hidden on mobile by global CSS */}
              <table className="table" style={{ fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    {entityType === 'product' && <th>Size</th>}
                    <th style={{ textAlign: 'right' }}>Before</th>
                    <th style={{ textAlign: 'right' }}>Change</th>
                    <th style={{ textAlign: 'right' }}>After</th>
                    <th>Reason / Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <ActionBadge type={log.changeType} />
                      </td>
                      {entityType === 'product' && <td>{log.size || '-'}</td>}
                      <td style={{ textAlign: 'right' }}>{log.quantityBefore}</td>
                      <td style={{ 
                        textAlign: 'right', 
                        fontWeight: 'bold',
                        color: log.quantityChange > 0 ? 'var(--success-color)' : log.quantityChange < 0 ? 'var(--danger-color)' : 'inherit'
                      }}>
                        {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{log.quantityAfter}</td>
                      <td>
                        <div>{log.reason || '-'}</div>
                        {log.referenceId && (
                          <small style={{ color: 'var(--gray-500)' }}>
                            Ref: {log.referenceType} #{log.referenceId.substring(0, 8)}
                          </small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="mobile-table-cards">
                {logs.map((log) => (
                  <div key={log.id} className="mobile-table-card" style={{ padding: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                      <ActionBadge type={log.changeType} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Change</span>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: log.quantityChange > 0 ? 'var(--success-color)' : log.quantityChange < 0 ? 'var(--danger-color)' : 'inherit'
                        }}>
                          {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                        </span>
                      </div>
                      
                      {entityType === 'product' && log.size && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Size</span>
                          <span style={{ fontWeight: 'bold' }}>{log.size}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)' }}>New Qty</span>
                        <span style={{ fontWeight: 'bold' }}>{log.quantityAfter}</span>
                      </div>
                    </div>

                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--gray-100)' }}>
                      <div style={{ fontSize: '0.9rem' }}>{log.reason || '-'}</div>
                      {log.referenceId && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                          Ref: {log.referenceType} #{log.referenceId.substring(0, 8)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ActionBadge: React.FC<{ type: string }> = ({ type }) => {
  let color = 'gray';
  let label = type.replace('_', ' ').toUpperCase();

  switch (type) {
    case 'sale':
      color = 'var(--danger-color)'; // Red because it reduces stock
      break;
    case 'restock':
    case 'manual_adjustment':
    case 'sale_reversal':
    case 'return':
      color = 'var(--success-color)'; // Green because it adds stock
      label = type === 'manual_adjustment' ? 'MANUAL' : label;
      break;
    case 'initial_stock':
      color = 'var(--primary-color)';
      break;
    case 'sale_edit':
      color = 'var(--warning-color)';
      break;
  }

  return (
    <span style={{ 
      backgroundColor: color, 
      color: 'white', 
      padding: '2px 6px', 
      borderRadius: '4px', 
      fontSize: '0.75rem',
      fontWeight: 'bold'
    }}>
      {label}
    </span>
  );
};

export default InventoryHistoryModal;
