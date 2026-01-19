import { supabase } from './supabaseClient';

// ============================================================================
// INVENTORY LOGGING UTILITY
// Tracks all inventory changes for products, namesets, and badges
// ============================================================================

/**
 * Log an inventory change to the database
 * @param {Object} data - The inventory change details
 * @returns {Promise<Object>} The created log entry
 */
export async function logInventoryChange(data) {
  const dbData = {
    entity_type: data.entityType,
    entity_id: data.entityId,
    entity_name: data.entityName,
    size: data.size || null,
    change_type: data.changeType,
    quantity_before: data.quantityBefore,
    quantity_change: data.quantityChange,
    quantity_after: data.quantityAfter,
    reason: data.reason || null,
    reference_id: data.referenceId || null,
    reference_type: data.referenceType || null,
    created_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('inventory_logs').insert([dbData]).select().single();

  if (error) {
    console.error('Error logging inventory change:', error);
    // Don't throw - logging failures shouldn't break the main operation
    return null;
  }

  return mapLogToFrontend(result);
}

/**
 * Log multiple inventory changes in a batch
 * @param {Array<Object>} changes - Array of inventory change details
 * @returns {Promise<Array<Object>>} The created log entries
 */
export async function logInventoryChanges(changes) {
  if (!changes || changes.length === 0) return [];

  const dbData = changes.map((data) => ({
    entity_type: data.entityType,
    entity_id: data.entityId,
    entity_name: data.entityName,
    size: data.size || null,
    change_type: data.changeType,
    quantity_before: data.quantityBefore,
    quantity_change: data.quantityChange,
    quantity_after: data.quantityAfter,
    reason: data.reason || null,
    reference_id: data.referenceId || null,
    reference_type: data.referenceType || null,
    created_at: new Date().toISOString(),
  }));

  const { data: result, error } = await supabase.from('inventory_logs').insert(dbData).select();

  if (error) {
    console.error('Error logging inventory changes:', error);
    return [];
  }

  return (result || []).map(mapLogToFrontend);
}

/**
 * Get inventory history for a specific entity
 * @param {string} entityType - 'product', 'nameset', or 'badge'
 * @param {string} entityId - The UUID of the entity
 * @param {number} limit - Maximum number of logs to return (default 50)
 * @returns {Promise<Array<Object>>} Array of inventory log entries
 */
export async function getInventoryHistory(entityType, entityId, limit = 50) {
  const { data, error } = await supabase
    .from('inventory_logs')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching inventory history:', error);
    throw error;
  }

  return (data || []).map(mapLogToFrontend);
}

/**
 * Get all inventory logs with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array<Object>>} Array of inventory log entries
 */
export async function getInventoryLogs(filters = {}) {
  let query = supabase.from('inventory_logs').select('*').order('created_at', { ascending: false });

  if (filters.entityType) {
    query = query.eq('entity_type', filters.entityType);
  }

  if (filters.entityId) {
    query = query.eq('entity_id', filters.entityId);
  }

  if (filters.changeType) {
    query = query.eq('change_type', filters.changeType);
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate + 'T00:00:00.000Z');
  }

  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate + 'T23:59:59.999Z');
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  } else {
    query = query.limit(100); // Default limit
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching inventory logs:', error);
    throw error;
  }

  return (data || []).map(mapLogToFrontend);
}

/**
 * Delete inventory logs older than specified months
 * This is typically called by a scheduled job, but can be run manually
 * @param {number} monthsOld - Delete logs older than this many months (default 18)
 * @returns {Promise<number>} Number of deleted records
 */
export async function cleanupOldLogs(monthsOld = 18) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);

  const { data, error } = await supabase
    .from('inventory_logs')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select('id');

  if (error) {
    console.error('Error cleaning up old logs:', error);
    throw error;
  }

  return data?.length || 0;
}

/**
 * Log initial inventory snapshot for all products, namesets, and badges
 * This should be run once when first enabling inventory logging
 * @returns {Promise<{products: number, namesets: number, badges: number}>} Count of logged items
 */
export async function logInitialInventory() {
  const counts = { products: 0, namesets: 0, badges: 0 };

  // Get all products with their sizes
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, sizes, team_id, teams(name)')
    .is('archived_at', null);

  if (productsError) {
    console.error('Error fetching products for initial inventory:', productsError);
  } else {
    const productLogs = [];
    for (const product of products || []) {
      const productName = product.teams?.name ? `${product.teams.name} - ${product.name}` : product.name;
      for (const sizeObj of product.sizes || []) {
        if (sizeObj.quantity > 0) {
          productLogs.push({
            entityType: 'product',
            entityId: product.id,
            entityName: productName,
            size: sizeObj.size,
            changeType: 'initial_stock',
            quantityBefore: 0,
            quantityChange: sizeObj.quantity,
            quantityAfter: sizeObj.quantity,
            reason: 'Initial inventory snapshot',
          });
        }
      }
    }
    if (productLogs.length > 0) {
      await logInventoryChanges(productLogs);
      counts.products = productLogs.length;
    }
  }

  // Get all namesets
  const { data: namesets, error: namesetsError } = await supabase
    .from('namesets')
    .select('id, player_name, number, quantity')
    .is('archived_at', null);

  if (namesetsError) {
    console.error('Error fetching namesets for initial inventory:', namesetsError);
  } else {
    const namesetLogs = [];
    for (const nameset of namesets || []) {
      if (nameset.quantity > 0) {
        namesetLogs.push({
          entityType: 'nameset',
          entityId: nameset.id,
          entityName: `${nameset.player_name} #${nameset.number}`,
          changeType: 'initial_stock',
          quantityBefore: 0,
          quantityChange: nameset.quantity,
          quantityAfter: nameset.quantity,
          reason: 'Initial inventory snapshot',
        });
      }
    }
    if (namesetLogs.length > 0) {
      await logInventoryChanges(namesetLogs);
      counts.namesets = namesetLogs.length;
    }
  }

  // Get all badges
  const { data: badges, error: badgesError } = await supabase
    .from('badges')
    .select('id, name, quantity')
    .is('archived_at', null);

  if (badgesError) {
    console.error('Error fetching badges for initial inventory:', badgesError);
  } else {
    const badgeLogs = [];
    for (const badge of badges || []) {
      if (badge.quantity > 0) {
        badgeLogs.push({
          entityType: 'badge',
          entityId: badge.id,
          entityName: badge.name,
          changeType: 'initial_stock',
          quantityBefore: 0,
          quantityChange: badge.quantity,
          quantityAfter: badge.quantity,
          reason: 'Initial inventory snapshot',
        });
      }
    }
    if (badgeLogs.length > 0) {
      await logInventoryChanges(badgeLogs);
      counts.badges = badgeLogs.length;
    }
  }

  return counts;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map database record to frontend format
 */
function mapLogToFrontend(item) {
  return {
    id: item.id,
    entityType: item.entity_type,
    entityId: item.entity_id,
    entityName: item.entity_name,
    size: item.size || undefined,
    changeType: item.change_type,
    quantityBefore: item.quantity_before,
    quantityChange: item.quantity_change,
    quantityAfter: item.quantity_after,
    reason: item.reason || undefined,
    referenceId: item.reference_id || undefined,
    referenceType: item.reference_type || undefined,
    createdAt: item.created_at,
  };
}
