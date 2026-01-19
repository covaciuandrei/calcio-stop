import React, { useEffect, useState } from 'react';
import { getInventoryLogs } from '../../lib/inventoryLog';
import { useAuth } from '../../stores/authStore';
import { InventoryChangeType, InventoryEntityType, InventoryLog } from '../../types';

const InventoryLogsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    entityType: '' as InventoryEntityType | '',
    changeType: '' as InventoryChangeType | '',
    limit: 50,
  });

  const loadLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const { entityType, changeType, limit } = filters;
      // Pass filters to the API function
      // Note: getInventoryLogs expects object with optional keys
      const fetchedLogs = await getInventoryLogs({
        entityType: entityType || undefined,
        changeType: changeType || undefined,
        limit
      });
      setLogs(fetchedLogs as unknown as InventoryLog[]);
    } catch (error) {
      console.error('Failed to load inventory logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadLogs();
    }
  }, [isAuthenticated, user?.role, loadLogs]); // Reload when filters change (via loadLogs dependency)

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="container">Access Denied</div>;
  }

  return (
    <div className="container admin-page">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Inventory Audit Logs</h2>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Entity Type</label>
              <select 
                value={filters.entityType} 
                onChange={(e) => handleFilterChange('entityType', e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
              >
                <option value="">All Entities</option>
                <option value="product">Products</option>
                <option value="nameset">Namesets</option>
                <option value="badge">Badges</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Change Type</label>
              <select 
                value={filters.changeType} 
                onChange={(e) => handleFilterChange('changeType', e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
              >
                <option value="">All Actions</option>
                <option value="sale">Sale</option>
                <option value="sale_reversal">Sale Reversal</option>
                <option value="return">Return</option>
                <option value="restock">Restock</option>
                <option value="manual_adjustment">Manual Adjustment</option>
                <option value="initial_stock">Initial Stock</option>
                <option value="reservation">Reservation</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Limit</label>
              <select 
                value={filters.limit} 
                onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
            </div>
            
            <button 
              onClick={loadLogs} 
              className="btn btn-primary"
              disabled={loading}
              style={{ height: '38px' }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>No logs found matching criteria.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Entity</th>
                  <th>Name</th>
                  <th>Action</th>
                  <th style={{ textAlign: 'right' }}>Change</th>
                  <th style={{ textAlign: 'right' }}>After</th>
                  <th>Reason/Reference</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.9em' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{log.entityType}</td>
                    <td>
                      <span style={{ fontWeight: '500' }}>{log.entityName}</span>
                      {log.size && <span style={{ marginLeft: '6px', color: 'var(--gray-600)', fontSize: '0.9em' }}>({log.size})</span>}
                    </td>
                    <td><ActionBadge type={log.changeType} /></td>
                    <td style={{ 
                      textAlign: 'right', 
                      color: log.quantityChange > 0 ? 'var(--success-color)' : log.quantityChange < 0 ? 'var(--danger-color)' : 'inherit',
                      fontWeight: 'bold'
                    }}>
                      {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                    </td>
                    <td style={{ textAlign: 'right' }}>{log.quantityAfter}</td>
                    <td style={{ fontSize: '0.9em' }}>
                      {log.reason && <div>{log.reason}</div>}
                      {log.referenceId && (
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.85em' }}>
                          Ref: {log.referenceType} #{log.referenceId.substring(0, 8)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionBadge: React.FC<{ type: string }> = ({ type }) => {
  let color = 'var(--gray-500)';
  let bg = 'var(--gray-100)';
  
  if (type === 'sale' || type === 'reservation') {
    color = 'var(--danger-color)';
    bg = '#fee2e2';
  } else if (['restock', 'sale_reversal', 'return'].includes(type)) {
    color = 'var(--success-color)';
    bg = '#dcfce7';
  } else if (type === 'initial_stock') {
    color = 'var(--primary-color)';
    bg = '#dbeafe';
  } else if (type === 'manual_adjustment') {
    color = 'var(--warning-color-dark)';
    bg = '#fef3c7';
  }

  return (
    <span style={{ 
      color, 
      backgroundColor: bg,
      padding: '2px 8px', 
      borderRadius: '12px', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }}>
      {type.replace(/_/g, ' ')}
    </span>
  );
};

export default InventoryLogsPage;
