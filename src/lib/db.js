import { logInventoryChange, logInventoryChanges } from './inventoryLog';
import { supabase } from './supabaseClient';

// ============================================================================
// TEAMS CRUD OPERATIONS
// ============================================================================

export async function createTeam(data) {
  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    leagues: data.leagues || [],
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('teams').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    leagues: result.leagues || [],
    createdAt: result.created_at,
  };
}

export async function getTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Collect all unique league IDs from all teams
  const leagueIds = new Set();
  (data || []).forEach((team) => {
    if (team.leagues && Array.isArray(team.leagues)) {
      team.leagues.forEach((leagueId) => {
        if (leagueId) leagueIds.add(leagueId);
      });
    }
  });

  // Fetch all leagues in one query if we have any league IDs
  let leaguesMap = new Map();
  if (leagueIds.size > 0) {
    const { data: leaguesData, error: leaguesError } = await supabase
      .from('leagues')
      .select('*')
      .in('id', Array.from(leagueIds));

    if (leaguesError) throw leaguesError;

    // Map leagues by ID for quick lookup
    (leaguesData || []).forEach((league) => {
      leaguesMap.set(league.id, {
        id: league.id,
        name: league.name,
        createdAt: league.created_at,
      });
    });
  }

  // Map database response to frontend format
  return (data || []).map((item) => {
    const leagueIdsArray = item.leagues || [];
    const leagueObjects = leagueIdsArray.map((leagueId) => leaguesMap.get(leagueId)).filter(Boolean);

    return {
      id: item.id,
      name: item.name,
      leagues: leagueIdsArray,
      createdAt: item.created_at,
      leagueObjects: leagueObjects,
    };
  });
}

export async function getArchivedTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Collect all unique league IDs from all teams
  const leagueIds = new Set();
  (data || []).forEach((team) => {
    if (team.leagues && Array.isArray(team.leagues)) {
      team.leagues.forEach((leagueId) => {
        if (leagueId) leagueIds.add(leagueId);
      });
    }
  });

  // Fetch all leagues in one query if we have any league IDs
  let leaguesMap = new Map();
  if (leagueIds.size > 0) {
    const { data: leaguesData, error: leaguesError } = await supabase
      .from('leagues')
      .select('*')
      .in('id', Array.from(leagueIds));

    if (leaguesError) throw leaguesError;

    // Map leagues by ID for quick lookup
    (leaguesData || []).forEach((league) => {
      leaguesMap.set(league.id, {
        id: league.id,
        name: league.name,
        createdAt: league.created_at,
      });
    });
  }

  // Map database response to frontend format
  return (data || []).map((item) => {
    const leagueIdsArray = item.leagues || [];
    const leagueObjects = leagueIdsArray.map((leagueId) => leaguesMap.get(leagueId)).filter(Boolean);

    return {
      id: item.id,
      name: item.name,
      leagues: leagueIdsArray,
      createdAt: item.created_at,
      leagueObjects: leagueObjects,
    };
  });
}

export async function updateTeam(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.leagues !== undefined) dbUpdates.leagues = updates.leagues;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  const { data, error } = await supabase.from('teams').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    leagues: data.leagues || [],
    createdAt: data.created_at,
  };
}

export async function deleteTeam(id) {
  // First check if there are any references to this team
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('team_id', id)
    .limit(1);

  if (productsError) throw productsError;

  // If there are references, throw an error
  if (products && products.length > 0) {
    throw new Error('Cannot delete team: it is referenced by products');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('teams').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveTeam(id) {
  const { data, error } = await supabase
    .from('teams')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    leagues: data.leagues || [],
    createdAt: data.created_at,
  };
}

export async function restoreTeam(id) {
  const { data, error } = await supabase.from('teams').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    leagues: data.leagues || [],
    createdAt: data.created_at,
  };
}

// ============================================================================
// KIT TYPES CRUD OPERATIONS
// ============================================================================

export async function createKitType(data) {
  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('kit_types').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    createdAt: result.created_at,
  };
}

export async function getKitTypes() {
  const { data, error } = await supabase
    .from('kit_types')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
}

export async function getArchivedKitTypes() {
  const { data, error } = await supabase
    .from('kit_types')
    .select('*')
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
}

export async function updateKitType(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  const { data, error } = await supabase.from('kit_types').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function deleteKitType(id) {
  // First check if there are any references to this kit type
  const { data: namesets, error: namesetsError } = await supabase
    .from('namesets')
    .select('id')
    .eq('kit_type_id', id)
    .limit(1);

  if (namesetsError) throw namesetsError;

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('kit_type_id', id)
    .limit(1);

  if (productsError) throw productsError;

  // If there are references, throw an error
  if (namesets && namesets.length > 0) {
    throw new Error('Cannot delete kit type: it is referenced by namesets');
  }

  if (products && products.length > 0) {
    throw new Error('Cannot delete kit type: it is referenced by products');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('kit_types').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveKitType(id) {
  const { data, error } = await supabase
    .from('kit_types')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function restoreKitType(id) {
  const { data, error } = await supabase.from('kit_types').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

// ============================================================================
// BADGES CRUD OPERATIONS
// ============================================================================

export async function createBadge(data) {
  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    season: data.season,
    quantity: data.quantity,
    price: data.price || 0,
    location: data.location || null,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('badges').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    season: result.season,
    quantity: result.quantity,
    price: result.price,
    location: result.location || undefined,
    createdAt: result.created_at,
  };
}

export async function getBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select(
      `
      *,
      badge_images (
        id,
        badge_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      )
    `
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    season: item.season,
    quantity: item.quantity,
    price: item.price,
    location: item.location || undefined,
    createdAt: item.created_at,
    images: (item.badge_images || []).map((img) => ({
      id: img.id,
      badgeId: img.badge_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
  }));
}

export async function getArchivedBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select(
      `
      *,
      badge_images (
        id,
        badge_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      )
    `
    )
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    season: item.season,
    quantity: item.quantity,
    price: item.price,
    location: item.location || undefined,
    createdAt: item.created_at,
    images: (item.badge_images || []).map((img) => ({
      id: img.id,
      badgeId: img.badge_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
  }));
}

// ... (previous content)

export async function updateBadge(id, updates) {
  // If quantity is being updated, fetch current badge to log the change
  let oldQuantity = null;
  let badgeName = null;
  
  // Extract custom log context if provided, not part of DB update
  const logContext = updates._logContext || {};
  // Create a clean updates object without internal flags
  const dbUpdates = {};
  
  // Copy valid fields
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.season !== undefined) dbUpdates.season = updates.season;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.location !== undefined) dbUpdates.location = updates.location || null;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;
  
  if (updates.quantity !== undefined) {
    const { data: currentBadge, error: fetchError } = await supabase
      .from('badges')
      .select('quantity, name')
      .eq('id', id)
      .single();
    
    if (!fetchError && currentBadge) {
      oldQuantity = currentBadge.quantity;
      badgeName = currentBadge.name;
    }
  }

  const { data, error } = await supabase.from('badges').update(dbUpdates).eq('id', id).select(`
    *,
    badge_images (
      id,
      badge_id,
      image_url,
      thumbnail_url,
      medium_url,
      large_url,
      alt_text,
      is_primary,
      display_order,
      created_at
    )
  `).single();

  if (error) throw error;

  // Log inventory change if quantity changed
  if (oldQuantity !== null && updates.quantity !== undefined && oldQuantity !== updates.quantity) {
    const quantityChange = updates.quantity - oldQuantity;
    
    // Determine reason
    let reason = quantityChange > 0 ? 'Manual restock' : 'Manual adjustment';
    if (logContext.reason) {
      reason = logContext.reason;
    }

    logInventoryChange({
      entityType: 'badge',
      entityId: id,
      entityName: badgeName || data.name,
      changeType: 'manual_adjustment',
      quantityBefore: oldQuantity,
      quantityChange: quantityChange,
      quantityAfter: updates.quantity,
      reason: reason,
      referenceId: logContext.referenceId,
      referenceType: logContext.referenceType
    });
  }

  // Map database response back to frontend format
  return {
    id: data.id,
    name: data.name,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    location: data.location || undefined,
    createdAt: data.created_at,
    images: (data.badge_images || []).map((img) => ({
      id: img.id,
      badgeId: img.badge_id,
      imageUrl: img.image_url || img.large_url,
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
  };
}



export async function deleteBadge(id) {
  // First check if there are any references to this badge
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('badge_id', id)
    .limit(1);

  if (productsError) throw productsError;

  // If there are references, throw an error
  if (products && products.length > 0) {
    throw new Error('Cannot delete badge: it is referenced by products');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('badges').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveBadge(id) {
  const { data, error } = await supabase
    .from('badges')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    location: data.location || undefined,
    createdAt: data.created_at,
  };
}

export async function restoreBadge(id) {
  const { data, error } = await supabase.from('badges').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    location: data.location || undefined,
    createdAt: data.created_at,
  };
}

// ============================================================================
// BADGE IMAGES CRUD OPERATIONS
// ============================================================================

export async function createBadgeImage(data) {
  // Map frontend data to database schema
  const dbData = {
    badge_id: data.badgeId,
    image_url: data.imageUrl,
    alt_text: data.altText,
    is_primary: data.isPrimary || false,
    display_order: data.displayOrder || 0,
    created_at: data.createdAt || new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('badge_images').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    badgeId: result.badge_id,
    imageUrl: result.image_url,
    altText: result.alt_text,
    isPrimary: result.is_primary,
    displayOrder: result.display_order,
    createdAt: result.created_at,
  };
}

export async function getBadgeImages(badgeId) {
  const { data, error } = await supabase
    .from('badge_images')
    .select('*')
    .eq('badge_id', badgeId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching badge images:', error);
    throw error;
  }

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    badgeId: item.badge_id,
    imageUrl: item.image_url || item.large_url, // Legacy field fallback
    thumbnailUrl: item.thumbnail_url || item.image_url,
    mediumUrl: item.medium_url || item.image_url,
    largeUrl: item.large_url || item.image_url,
    altText: item.alt_text,
    isPrimary: item.is_primary,
    displayOrder: item.display_order,
    createdAt: item.created_at,
  }));
}

export async function updateBadgeImage(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.altText !== undefined) dbUpdates.alt_text = updates.altText;
  if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary;
  if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;

  const { data, error } = await supabase.from('badge_images').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    badgeId: data.badge_id,
    imageUrl: data.image_url,
    altText: data.alt_text,
    isPrimary: data.is_primary,
    displayOrder: data.display_order,
    createdAt: data.created_at,
  };
}

export async function deleteBadgeImage(id) {
  const { error } = await supabase.from('badge_images').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// NAMESETS CRUD OPERATIONS
// ============================================================================

export async function createNameset(data) {
  // Validate required fields
  if (!data.playerName) {
    throw new Error('Player name is required');
  }
  if (!data.number) {
    throw new Error('Number is required');
  }
  if (!data.season) {
    throw new Error('Season is required');
  }
  if (!data.kitTypeId) {
    throw new Error('Kit type is required');
  }

  // Map frontend data to database schema
  const dbData = {
    player_name: data.playerName,
    number: parseInt(data.number), // Ensure it's an integer
    season: data.season,
    quantity: parseInt(data.quantity) || 0, // Ensure it's an integer
    price: parseFloat(data.price) || 0.0, // Ensure it's a float
    kit_type_id: data.kitTypeId,
    location: data.location || null,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('namesets').insert([dbData]).select().single();

  if (error) {
    throw error;
  }

  // Map database response back to frontend format
  return {
    id: result.id,
    playerName: result.player_name,
    number: result.number,
    season: result.season,
    quantity: result.quantity,
    price: result.price,
    kitTypeId: result.kit_type_id,
    location: result.location || undefined,
    createdAt: result.created_at,
  };
}

export async function getNamesets() {
  const { data, error } = await supabase
    .from('namesets')
    .select(
      `
      *,
      nameset_images (
        id,
        nameset_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      )
    `
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    playerName: item.player_name,
    number: item.number,
    season: item.season,
    quantity: item.quantity,
    price: item.price,
    kitTypeId: item.kit_type_id,
    location: item.location || undefined,
    createdAt: item.created_at,
    images: (item.nameset_images || []).map((img) => ({
      id: img.id,
      namesetId: img.nameset_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
  }));
}

export async function getArchivedNamesets() {
  const { data, error } = await supabase
    .from('namesets')
    .select(
      `
      *,
      nameset_images (
        id,
        nameset_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      )
    `
    )
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    playerName: item.player_name,
    number: item.number,
    season: item.season,
    quantity: item.quantity,
    price: item.price,
    kitTypeId: item.kit_type_id,
    location: item.location || undefined,
    createdAt: item.created_at,
    images: (item.nameset_images || []).map((img) => ({
      id: img.id,
      namesetId: img.nameset_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
  }));
}

export async function updateNameset(id, updates) {
  // If quantity is being updated, fetch current nameset to log the change
  let oldQuantity = null;
  let namesetName = null;

  // Extract custom log context if provided, not part of DB update
  const logContext = updates._logContext || {};
  // Create a clean updates object without internal flags
  const dbUpdates = {};
  
  // Copy valid fields (mapping frontend camelCase to DB snake_case)
  if (updates.playerName !== undefined) dbUpdates.player_name = updates.playerName;
  if (updates.number !== undefined) dbUpdates.number = parseInt(updates.number);
  if (updates.season !== undefined) dbUpdates.season = updates.season;
  if (updates.quantity !== undefined) dbUpdates.quantity = parseInt(updates.quantity);
  if (updates.price !== undefined) dbUpdates.price = parseFloat(updates.price);
  if (updates.kitTypeId !== undefined) dbUpdates.kit_type_id = updates.kitTypeId;
  if (updates.location !== undefined) dbUpdates.location = updates.location || null;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  if (updates.quantity !== undefined) {
    const { data: currentNameset, error: fetchError } = await supabase
      .from('namesets')
      .select('quantity, player_name, number')
      .eq('id', id)
      .single();
    
    if (!fetchError && currentNameset) {
      oldQuantity = currentNameset.quantity;
      namesetName = `${currentNameset.player_name} #${currentNameset.number}`;
    }
  }

  const { data, error } = await supabase.from('namesets').update(dbUpdates).eq('id', id).select(`
    *,
    nameset_images (
      id,
      nameset_id,
      image_url,
      thumbnail_url,
      medium_url,
      large_url,
      alt_text,
      is_primary,
      display_order,
      created_at
    ),
    kit_types (
      id,
      name,
      created_at
    )
  `).single();

  if (error) throw error;

  // Log inventory change if quantity changed
  if (oldQuantity !== null && updates.quantity !== undefined && oldQuantity !== updates.quantity) {
    const quantityChange = updates.quantity - oldQuantity;
    
    // Determine reason
    let reason = quantityChange > 0 ? 'Manual restock' : 'Manual adjustment';
    if (logContext.reason) {
      reason = logContext.reason;
    }

    logInventoryChange({
      entityType: 'nameset',
      entityId: id,
      entityName: namesetName || `${data.player_name} #${data.number}`,
      changeType: 'manual_adjustment',
      quantityBefore: oldQuantity,
      quantityChange: quantityChange,
      quantityAfter: updates.quantity,
      reason: reason,
      referenceId: logContext.referenceId,
      referenceType: logContext.referenceType
    });
  }

  // Map database response back to frontend format
  return {
    id: data.id,
    playerName: data.player_name,
    number: data.number,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    kitTypeId: data.kit_type_id,
    location: data.location || undefined,
    createdAt: data.created_at,
    images: (data.nameset_images || []).map((img) => ({
      id: img.id,
      namesetId: img.nameset_id,
      imageUrl: img.image_url || img.large_url,
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    kitType: data.kit_types
      ? {
          id: data.kit_types.id,
          name: data.kit_types.name,
          createdAt: data.kit_types.created_at,
        }
      : null,
  };
}

export async function deleteNameset(id) {
  // First check if there are any references to this nameset
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('nameset_id', id)
    .limit(1);

  if (productsError) throw productsError;

  // If there are references, throw an error
  if (products && products.length > 0) {
    throw new Error('Cannot delete nameset: it is referenced by products');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('namesets').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// NAMESET IMAGES CRUD OPERATIONS
// ============================================================================

export async function createNamesetImage(data) {
  // Map frontend data to database schema
  const dbData = {
    nameset_id: data.namesetId,
    image_url: data.imageUrl,
    alt_text: data.altText,
    is_primary: data.isPrimary || false,
    display_order: data.displayOrder || 0,
    created_at: data.createdAt || new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('nameset_images').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    namesetId: result.nameset_id,
    imageUrl: result.image_url,
    altText: result.alt_text,
    isPrimary: result.is_primary,
    displayOrder: result.display_order,
    createdAt: result.created_at,
  };
}

export async function getNamesetImages(namesetId) {
  const { data, error } = await supabase
    .from('nameset_images')
    .select('*')
    .eq('nameset_id', namesetId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching nameset images:', error);
    throw error;
  }

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    namesetId: item.nameset_id,
    imageUrl: item.image_url || item.large_url, // Legacy field fallback
    thumbnailUrl: item.thumbnail_url || item.image_url,
    mediumUrl: item.medium_url || item.image_url,
    largeUrl: item.large_url || item.image_url,
    altText: item.alt_text,
    isPrimary: item.is_primary,
    displayOrder: item.display_order,
    createdAt: item.created_at,
  }));
}

export async function updateNamesetImage(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.altText !== undefined) dbUpdates.alt_text = updates.altText;
  if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary;
  if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;

  const { data, error } = await supabase.from('nameset_images').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    namesetId: data.nameset_id,
    imageUrl: data.image_url,
    altText: data.alt_text,
    isPrimary: data.is_primary,
    displayOrder: data.display_order,
    createdAt: data.created_at,
  };
}

export async function deleteNamesetImage(id) {
  const { error } = await supabase.from('nameset_images').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveNameset(id) {
  const { data, error } = await supabase
    .from('namesets')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    playerName: data.player_name,
    number: data.number,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    kitTypeId: data.kit_type_id,
    location: data.location || undefined,
    createdAt: data.created_at,
  };
}

export async function restoreNameset(id) {
  const { data, error } = await supabase.from('namesets').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    playerName: data.player_name,
    number: data.number,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    kitTypeId: data.kit_type_id,
    location: data.location || undefined,
    createdAt: data.created_at,
  };
}

// ============================================================================
// PRODUCTS CRUD OPERATIONS
// ============================================================================

export async function createProduct(data) {
  // Validate required fields
  if (!data.name && !data.teamId) {
    throw new Error('Product name or team is required');
  }
  if (!data.type) {
    throw new Error('Product type is required');
  }
  if (!data.kitTypeId) {
    throw new Error('Kit type is required');
  }

  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    type: data.type,
    sizes: data.sizes || [],
    nameset_id: data.namesetId || null,
    team_id: data.teamId,
    kit_type_id: data.kitTypeId,
    badge_id: data.badgeId || null,
    price: parseFloat(data.price) || 0.0,
    olx_link: data.olxLink || null,
    location: data.location || null,
    is_on_sale: data.isOnSale || false,
    sale_price: data.salePrice ? parseFloat(data.salePrice) : null,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('products').insert([dbData]).select().single();

  if (error) {
    throw error;
  }

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    type: result.type,
    sizes: result.sizes,
    namesetId: result.nameset_id,
    teamId: result.team_id,
    kitTypeId: result.kit_type_id,
    badgeId: result.badge_id,
    price: result.price,
    olxLink: result.olx_link,
    location: result.location || undefined,
    isOnSale: result.is_on_sale || false,
    salePrice: result.sale_price || undefined,
    createdAt: result.created_at,
  };
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images (
        id,
        product_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      ),
      namesets (
        id,
        player_name,
        number,
        season,
        quantity,
        price,
        kit_type_id,
        location,
        created_at
      ),
      teams (
        id,
        name,
        leagues,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      ),
      badges (
        id,
        name,
        season,
        quantity,
        price,
        location,
        created_at
      )
    `
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    olxLink: item.olx_link,
    location: item.location || undefined,
    isOnSale: item.is_on_sale || false,
    salePrice: item.sale_price || undefined,
    createdAt: item.created_at,
    images: (item.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    nameset: item.namesets
      ? {
          id: item.namesets.id,
          playerName: item.namesets.player_name,
          number: item.namesets.number,
          season: item.namesets.season,
          quantity: item.namesets.quantity,
          price: item.namesets.price,
          kitTypeId: item.namesets.kit_type_id,
          location: item.namesets.location || undefined,
          createdAt: item.namesets.created_at,
        }
      : null,
    team: item.teams
      ? {
          id: item.teams.id,
          name: item.teams.name,
          leagues: item.teams.leagues || [],
          createdAt: item.teams.created_at,
        }
      : null,
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
    badge: item.badges
      ? {
          id: item.badges.id,
          name: item.badges.name,
          season: item.badges.season,
          quantity: item.badges.quantity,
          price: item.badges.price,
          location: item.badges.location || undefined,
          createdAt: item.badges.created_at,
        }
      : null,
  }));
}

export async function getArchivedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images (
        id,
        product_id,
        image_url,
        thumbnail_url,
        medium_url,
        large_url,
        alt_text,
        is_primary,
        display_order,
        created_at
      ),
      namesets (
        id,
        player_name,
        number,
        season,
        quantity,
        price,
        kit_type_id,
        location,
        created_at
      ),
      teams (
        id,
        name,
        leagues,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      ),
      badges (
        id,
        name,
        season,
        quantity,
        price,
        location,
        created_at
      )
    `
    )
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    olxLink: item.olx_link,
    location: item.location || undefined,
    isOnSale: item.is_on_sale || false,
    salePrice: item.sale_price || undefined,
    createdAt: item.created_at,
    images: (item.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    nameset: item.namesets
      ? {
          id: item.namesets.id,
          playerName: item.namesets.player_name,
          number: item.namesets.number,
          season: item.namesets.season,
          quantity: item.namesets.quantity,
          price: item.namesets.price,
          kitTypeId: item.namesets.kit_type_id,
          location: item.namesets.location || undefined,
          createdAt: item.namesets.created_at,
        }
      : null,
    team: item.teams
      ? {
          id: item.teams.id,
          name: item.teams.name,
          leagues: item.teams.leagues || [],
          createdAt: item.teams.created_at,
        }
      : null,
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
    badge: item.badges
      ? {
          id: item.badges.id,
          name: item.badges.name,
          season: item.badges.season,
          quantity: item.badges.quantity,
          price: item.badges.price,
          location: item.badges.location || undefined,
          createdAt: item.badges.created_at,
        }
      : null,
  }));
}

export async function updateProduct(id, updates) {
  // If sizes are being updated, fetch current product to log quantity changes
  let oldSizes = null;
  let productName = null;
  
  // Check if we should log this change (skip if it's part of a sale creation that handles its own logging)
  const shouldLog = !updates._skipInventoryLog && updates.sizes !== undefined;

  if (shouldLog) {
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('sizes, name, team_id, teams(name)')
      .eq('id', id)
      .single();
    
    if (!fetchError && currentProduct) {
      oldSizes = currentProduct.sizes || [];
      productName = currentProduct.teams?.name 
        ? `${currentProduct.teams.name} - ${currentProduct.name}`
        : currentProduct.name;
    }
  }

  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.name !== undefined) {
    dbUpdates.name = updates.name;
  }
  if (updates.type !== undefined) {
    dbUpdates.type = updates.type;
  }
  if (updates.sizes !== undefined) {
    dbUpdates.sizes = updates.sizes;
  }
  if (updates.namesetId !== undefined) {
    dbUpdates.nameset_id = updates.namesetId;
  }
  if (updates.teamId !== undefined) {
    dbUpdates.team_id = updates.teamId;
  }
  if (updates.kitTypeId !== undefined) {
    dbUpdates.kit_type_id = updates.kitTypeId;
  }
  if (updates.badgeId !== undefined) {
    dbUpdates.badge_id = updates.badgeId;
  }
  if (updates.price !== undefined) {
    dbUpdates.price = parseFloat(updates.price);
  }
  if (updates.olxLink !== undefined) {
    dbUpdates.olx_link = updates.olxLink;
  }
  if (updates.location !== undefined) {
    dbUpdates.location = updates.location || null;
  }
  if (updates.isOnSale !== undefined) {
    dbUpdates.is_on_sale = updates.isOnSale || false;
  }
  if (updates.salePrice !== undefined) {
    dbUpdates.sale_price =
      updates.salePrice !== undefined && updates.salePrice !== null ? parseFloat(updates.salePrice) : null;
  }

  const { data, error } = await supabase
    .from('products')
    .update(dbUpdates)
    .eq('id', id)
    .select(
      `
    *,
    product_images (
      id,
      product_id,
      image_url,
      alt_text,
      is_primary,
      display_order,
      created_at
    )
  `
    )
    .single();

  if (error) throw error;

  // Log inventory changes if needed
  if (shouldLog && oldSizes && updates.sizes) {
    const changes = [];
    
    // Check for size quantity changes
    updates.sizes.forEach(newSize => {
      const oldSizeObj = oldSizes.find(s => s.size === newSize.size);
      const oldQuantity = oldSizeObj ? (oldSizeObj.quantity || 0) : 0;
      const newQuantity = newSize.quantity || 0;
      
      if (oldQuantity !== newQuantity) {
        const quantityChange = newQuantity - oldQuantity;
        changes.push({
          entityType: 'product',
          entityId: id,
          entityName: productName || data.name, // Fallback if team fetch failed
          size: newSize.size,
          changeType: 'manual_adjustment',
          quantityBefore: oldQuantity,
          quantityChange: quantityChange,
          quantityAfter: newQuantity,
          reason: quantityChange > 0 ? 'Manual restock' : 'Manual adjustment',
        });
      }
    });

    if (changes.length > 0) {
      logInventoryChanges(changes);
    }
  }

  // Map database response back to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    olxLink: data.olx_link,
    location: data.location || undefined,
    isOnSale: data.is_on_sale || false,
    salePrice: data.sale_price || undefined,
    createdAt: data.created_at,
    images: (data.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url || img.large_url, // Legacy field fallback
      thumbnailUrl: img.thumbnail_url || img.image_url,
      mediumUrl: img.medium_url || img.image_url,
      largeUrl: img.large_url || img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
    nameset: data.nameset_id // We don't fetch relations here to save perf, caller usually reloads list
      ? { id: data.nameset_id } // minimal stub
      : null,
    team: data.team_id
      ? { id: data.team_id }
      : null,
    kitType: data.kit_type_id
      ? { id: data.kit_type_id }
      : null,
    badge: data.badge_id
      ? { id: data.badge_id }
      : null,
  };
}

export async function deleteProduct(id) {
  // First check if there are any references to this product
  const { data: sales, error: salesError } = await supabase.from('sales').select('id').eq('product_id', id).limit(1);

  if (salesError) throw salesError;

  // If there are references, throw an error
  if (sales && sales.length > 0) {
    throw new Error('Cannot delete product: it is referenced by sales');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    olxLink: data.olx_link,
    location: data.location || undefined,
    isOnSale: data.is_on_sale || false,
    salePrice: data.sale_price || undefined,
    createdAt: data.created_at,
  };
}

export async function restoreProduct(id) {
  const { data, error } = await supabase.from('products').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    olxLink: data.olx_link,
    location: data.location || undefined,
    isOnSale: data.is_on_sale || false,
    salePrice: data.sale_price || undefined,
    createdAt: data.created_at,
  };
}

// ============================================================================
// SALES CRUD OPERATIONS
// ============================================================================

export async function createSale(data) {
  // Validate input
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Sale must have at least one item');
  }

  // Map frontend items to database JSONB format
  const itemsData = data.items.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    priceSold: item.priceSold,
  }));

  // Map frontend data to database schema
  const dbData = {
    items: itemsData,
    customer_name: data.customerName,
    date: data.date, // This will now store the full timestamp
    sale_type: data.saleType,
    created_at: data.createdAt || new Date().toISOString(),
  };

  // Backward compatibility: if old columns exist, also populate them from first item
  if (data.items.length > 0) {
    const firstItem = data.items[0];
    dbData.product_id = firstItem.productId;
    dbData.size = firstItem.size;
    dbData.quantity = firstItem.quantity;
    dbData.price_sold = firstItem.priceSold;
  }

  const { data: result, error } = await supabase.from('sales').insert([dbData]).select().single();

  if (error) throw error;

  // Log inventory changes
  try {
    const productIds = [...new Set(data.items.map(i => i.productId))];
    const { data: products } = await supabase
      .from('products')
      .select('id, name, sizes, teams(name)')
      .in('id', productIds);
    
    if (products) {
      const logs = [];
      data.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const productName = product.teams?.name ? `${product.teams.name} - ${product.name}` : product.name;
          // Current quantity in DB (after decrement)
          const sizeObj = product.sizes?.find(s => s.size === item.size);
          const currentQuantity = sizeObj ? (sizeObj.quantity || 0) : 0;
          
          logs.push({
            entityType: 'product',
            entityId: item.productId,
            entityName: productName,
            size: item.size,
            changeType: 'sale',
            quantityBefore: currentQuantity + item.quantity,
            quantityChange: -item.quantity,
            quantityAfter: currentQuantity,
            reason: `Sale (${data.saleType}) to ${data.customerName}`,
            referenceId: result.id,
            referenceType: 'sale'
          });
        }
      });
      
      if (logs.length > 0) {
        await logInventoryChanges(logs);
      }
    }
  } catch (logError) {
    console.error('Failed to log inventory changes for sale:', logError);
    // Don't fail the sale creation
  }

  // Map database response back to frontend format
  // Support both new (items) and old (product_id, etc.) formats for backward compatibility
  if (result.items && Array.isArray(result.items) && result.items.length > 0) {
    return {
      id: result.id,
      items: result.items.map((item) => ({
        productId: item.productId || item.product_id,
        size: item.size,
        quantity: item.quantity,
        priceSold: item.priceSold || item.price_sold,
      })),
      customerName: result.customer_name,
      date: result.date,
      saleType: result.sale_type,
      createdAt: result.created_at,
    };
  } else {
    // Fallback for old format
    return {
      id: result.id,
      items: [
        {
          productId: result.product_id,
          size: result.size,
          quantity: result.quantity,
          priceSold: result.price_sold,
        },
      ],
      customerName: result.customer_name,
      date: result.date,
      saleType: result.sale_type,
      createdAt: result.created_at,
    };
  }
}

export async function getSales(filters = {}) {
  // Default to current month if no date range is provided
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Extract filters
  const startDate = filters.startDate || startOfMonth.toISOString().split('T')[0];
  const endDate = filters.endDate || endOfMonth.toISOString().split('T')[0];
  const saleType = filters.saleType; // 'OLX', 'IN-PERSON', or undefined (all)

  // Build query
  let query = supabase
    .from('sales')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  // Add sale type filter if provided
  if (saleType) {
    query = query.eq('sale_type', saleType);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Collect all unique product IDs from all sales
  const productIds = new Set();
  (data || []).forEach((sale) => {
    if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
      sale.items.forEach((item) => {
        const productId = item.productId || item.product_id;
        if (productId) productIds.add(productId);
      });
    } else if (sale.product_id) {
      productIds.add(sale.product_id);
    }
  });

  // Fetch all products in one query if we have any product IDs
  let productsMap = new Map();
  if (productIds.size > 0) {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(
        `
        *,
        product_images (
          id,
          product_id,
          image_url,
          thumbnail_url,
          medium_url,
          large_url,
          alt_text,
          is_primary,
          display_order,
          created_at
        ),
        namesets (
          id,
          player_name,
          number,
          season,
          quantity,
          price,
          kit_type_id,
          location,
          created_at
        ),
        teams (
          id,
          name,
          leagues,
          created_at
        ),
        kit_types (
          id,
          name,
          created_at
        ),
        badges (
          id,
          name,
          season,
          quantity,
          price,
          location,
          created_at
        )
      `
      )
      .in('id', Array.from(productIds));

    if (productsError) throw productsError;

    // Map products by ID for quick lookup
    (productsData || []).forEach((item) => {
      productsMap.set(item.id, {
        id: item.id,
        name: item.name,
        type: item.type,
        sizes: item.sizes,
        namesetId: item.nameset_id,
        teamId: item.team_id,
        kitTypeId: item.kit_type_id,
        badgeId: item.badge_id,
        price: item.price,
        olxLink: item.olx_link,
        location: item.location || undefined,
        isOnSale: item.is_on_sale || false,
        salePrice: item.sale_price || undefined,
        createdAt: item.created_at,
        images: (item.product_images || []).map((img) => ({
          id: img.id,
          productId: img.product_id,
          imageUrl: img.image_url || img.large_url,
          thumbnailUrl: img.thumbnail_url || img.image_url,
          mediumUrl: img.medium_url || img.image_url,
          largeUrl: img.large_url || img.image_url,
          altText: img.alt_text,
          isPrimary: img.is_primary,
          displayOrder: img.display_order,
          createdAt: img.created_at,
        })),
        nameset: item.namesets
          ? {
              id: item.namesets.id,
              playerName: item.namesets.player_name,
              number: item.namesets.number,
              season: item.namesets.season,
              quantity: item.namesets.quantity,
              price: item.namesets.price,
              kitTypeId: item.namesets.kit_type_id,
              location: item.namesets.location || undefined,
              createdAt: item.namesets.created_at,
            }
          : null,
        team: item.teams
          ? {
              id: item.teams.id,
              name: item.teams.name,
              leagues: item.teams.leagues || [],
              createdAt: item.teams.created_at,
            }
          : null,
        kitType: item.kit_types
          ? {
              id: item.kit_types.id,
              name: item.kit_types.name,
              createdAt: item.kit_types.created_at,
            }
          : null,
        badge: item.badges
          ? {
              id: item.badges.id,
              name: item.badges.name,
              season: item.badges.season,
              quantity: item.badges.quantity,
              price: item.badges.price,
              location: item.badges.location || undefined,
              createdAt: item.badges.created_at,
            }
          : null,
      });
    });
  }

  // Map database fields to frontend format
  // Support both new (items) and old (product_id, etc.) formats for backward compatibility
  return (data || []).map((sale) => {
    if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
      return {
        id: sale.id,
        items: sale.items.map((item) => {
          const productId = item.productId || item.product_id;
          return {
            productId: productId,
            size: item.size,
            quantity: item.quantity,
            priceSold: item.priceSold || item.price_sold,
            product: productsMap.get(productId) || null,
          };
        }),
        customerName: sale.customer_name,
        date: sale.date,
        saleType: sale.sale_type,
        createdAt: sale.created_at,
      };
    } else {
      // Fallback for old format
      const productId = sale.product_id;
      return {
        id: sale.id,
        items: [
          {
            productId: productId,
            size: sale.size,
            quantity: sale.quantity,
            priceSold: sale.price_sold,
            product: productsMap.get(productId) || null,
          },
        ],
        customerName: sale.customer_name,
        date: sale.date,
        saleType: sale.sale_type,
        createdAt: sale.created_at,
      };
    }
  });
}

export async function updateSale(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.items !== undefined) {
    if (!Array.isArray(updates.items) || updates.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }
    // Map frontend items to database JSONB format
    dbUpdates.items = updates.items.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold,
    }));

    // Backward compatibility: update old columns from first item
    if (updates.items.length > 0) {
      const firstItem = updates.items[0];
      dbUpdates.product_id = firstItem.productId;
      dbUpdates.size = firstItem.size;
      dbUpdates.quantity = firstItem.quantity;
      dbUpdates.price_sold = firstItem.priceSold;
    }
  }

  // Backward compatibility: handle old format updates
  if (updates.productId !== undefined) {
    dbUpdates.product_id = updates.productId;
    // If items array exists, update first item
    if (dbUpdates.items && dbUpdates.items.length > 0) {
      dbUpdates.items[0].productId = updates.productId;
    }
  }
  if (updates.size !== undefined) {
    dbUpdates.size = updates.size;
    if (dbUpdates.items && dbUpdates.items.length > 0) {
      dbUpdates.items[0].size = updates.size;
    }
  }
  if (updates.quantity !== undefined) {
    dbUpdates.quantity = parseInt(updates.quantity);
    if (dbUpdates.items && dbUpdates.items.length > 0) {
      dbUpdates.items[0].quantity = parseInt(updates.quantity);
    }
  }
  if (updates.priceSold !== undefined) {
    dbUpdates.price_sold = parseFloat(updates.priceSold);
    if (dbUpdates.items && dbUpdates.items.length > 0) {
      dbUpdates.items[0].priceSold = parseFloat(updates.priceSold);
    }
  }

  if (updates.customerName !== undefined) {
    dbUpdates.customer_name = updates.customerName;
  }
  if (updates.date !== undefined) {
    dbUpdates.date = updates.date;
  }
  if (updates.saleType !== undefined) {
    dbUpdates.sale_type = updates.saleType;
  }

  const { data, error } = await supabase.from('sales').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  if (data.items && Array.isArray(data.items) && data.items.length > 0) {
    return {
      id: data.id,
      items: data.items.map((item) => ({
        productId: item.productId || item.product_id,
        size: item.size,
        quantity: item.quantity,
        priceSold: item.priceSold || item.price_sold,
      })),
      customerName: data.customer_name,
      date: data.date,
      saleType: data.sale_type,
      createdAt: data.created_at,
    };
  } else {
    // Fallback for old format
    return {
      id: data.id,
      items: [
        {
          productId: data.product_id,
          size: data.size,
          quantity: data.quantity,
          priceSold: data.price_sold,
        },
      ],
      customerName: data.customer_name,
      date: data.date,
      saleType: data.sale_type,
      createdAt: data.created_at,
    };
  }
}

export async function deleteSale(id) {
  const { error } = await supabase.from('sales').delete().eq('id', id);

  if (error) throw error;
}

export async function reverseSale(id) {
  // First, get the sale to access its items
  const { data: sale, error: saleError } = await supabase.from('sales').select('*').eq('id', id).single();

  if (saleError) throw saleError;
  if (!sale) throw new Error('Sale not found');

  // Parse items from the sale (support both new and old formats)
  let items = [];
  if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
    items = sale.items;
  } else {
    // Fallback for old format
    items = [
      {
        productId: sale.product_id,
        size: sale.size,
        quantity: sale.quantity,
        priceSold: sale.price_sold,
      },
    ];
  }

  // Group items by productId to handle multiple sizes of the same product
  const itemsByProduct = {};
  for (const item of items) {
    const productId = item.productId || item.product_id;
    const size = item.size;
    const quantity = item.quantity;

    if (!productId || !size || !quantity) {
      console.warn('Invalid item data:', item);
      continue;
    }

    if (!itemsByProduct[productId]) {
      itemsByProduct[productId] = [];
    }
    itemsByProduct[productId].push({ size, quantity });
  }

  // Restore product quantities - one update per product to avoid race conditions
  for (const productId in itemsByProduct) {
    const productItems = itemsByProduct[productId];

    // Get the product once
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('sizes, name, team_id, teams(name)')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error(`Error fetching product ${productId}:`, productError);
      // Continue with other products even if one fails
      continue;
    }

    if (!product) {
      console.warn(`Product ${productId} not found`);
      continue;
    }

    const productName = product.teams?.name ? `${product.teams.name} - ${product.name}` : product.name;
    const inventoryChanges = [];

    // Restore quantities for all sizes of this product in one update
    const updatedSizes = (product.sizes || []).map((sizeObj) => {
      // Find all items for this size
      const itemsForThisSize = productItems.filter((item) => item.size === sizeObj.size);
      if (itemsForThisSize.length > 0) {
        // Sum up all quantities to restore for this size
        const totalQuantityToRestore = itemsForThisSize.reduce((sum, item) => sum + item.quantity, 0);
        
        // Prepare log entry
        inventoryChanges.push({
          entityType: 'product',
          entityId: productId,
          entityName: productName,
          size: sizeObj.size,
          changeType: 'sale_reversal',
          quantityBefore: sizeObj.quantity || 0,
          quantityChange: totalQuantityToRestore,
          quantityAfter: (sizeObj.quantity || 0) + totalQuantityToRestore,
          reason: `Reversal of sale (${sale.sale_type}) for ${sale.customer_name}`,
          referenceId: id,
          referenceType: 'sale'
        });

        return {
          ...sizeObj,
          quantity: (sizeObj.quantity || 0) + totalQuantityToRestore,
        };
      }
      return sizeObj;
    });

    // Update the product with all restored quantities at once
    const { error: updateError } = await supabase.from('products').update({ sizes: updatedSizes }).eq('id', productId);

    if (updateError) {
      console.error(`Error updating product ${productId}:`, updateError);
      // Continue with other products even if one fails
      continue;
    } else if (inventoryChanges.length > 0) {
      // Log successful inventory changes
      await logInventoryChanges(inventoryChanges);
    }
  }

  // Delete the sale after restoring quantities
  const { error: deleteError } = await supabase.from('sales').delete().eq('id', id);

  if (deleteError) throw deleteError;
}

// ============================================================================
// RETURNS CRUD OPERATIONS
// ============================================================================

export async function createReturn(data) {
  // Validate input
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Return must have at least one item');
  }

  // Map frontend items to database JSONB format
  const itemsData = data.items.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    priceSold: item.priceSold,
  }));

  // Map frontend data to database schema
  const dbData = {
    items: itemsData,
    customer_name: data.customerName,
    date: data.date,
    sale_type: data.saleType,
    original_sale_id: data.originalSaleId || null,
    created_at: data.createdAt || new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('returns').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    items: result.items.map((item) => ({
      productId: item.productId || item.product_id,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold || item.price_sold,
    })),
    customerName: result.customer_name,
    date: result.date,
    saleType: result.sale_type,
    originalSaleId: result.original_sale_id,
    createdAt: result.created_at,
  };
}

export async function getReturns(filters = {}) {
  // Default to current month if no date range is provided
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Extract filters
  const startDate = filters.startDate || startOfMonth.toISOString().split('T')[0];
  const endDate = filters.endDate || endOfMonth.toISOString().split('T')[0];
  const saleType = filters.saleType; // 'OLX', 'IN-PERSON', or undefined (all)

  // Build query - filter by created_at (Returned At) instead of date (Sale Date)
  let query = supabase
    .from('returns')
    .select('*')
    .gte('created_at', startDate + 'T00:00:00.000Z')
    .lte('created_at', endDate + 'T23:59:59.999Z')
    .order('created_at', { ascending: false });

  // Add sale type filter if provided
  if (saleType) {
    query = query.eq('sale_type', saleType);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Map database fields to frontend format
  return (data || []).map((returnRecord) => ({
    id: returnRecord.id,
    items: returnRecord.items.map((item) => ({
      productId: item.productId || item.product_id,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold || item.price_sold,
    })),
    customerName: returnRecord.customer_name,
    date: returnRecord.date,
    saleType: returnRecord.sale_type,
    originalSaleId: returnRecord.original_sale_id,
    createdAt: returnRecord.created_at,
  }));
}

export async function deleteReturn(id) {
  const { error } = await supabase.from('returns').delete().eq('id', id);
  if (error) throw error;
}

export async function returnSale(saleId) {
  // First, get the sale to access its items
  const { data: sale, error: saleError } = await supabase.from('sales').select('*').eq('id', saleId).single();

  if (saleError) throw saleError;
  if (!sale) throw new Error('Sale not found');

  // Parse items from the sale (support both new and old formats)
  let items = [];
  if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
    items = sale.items;
  } else {
    // Fallback for old format
    items = [
      {
        productId: sale.product_id,
        size: sale.size,
        quantity: sale.quantity,
        priceSold: sale.price_sold,
      },
    ];
  }

  // Group items by productId to handle multiple sizes of the same product
  const itemsByProduct = {};
  for (const item of items) {
    const productId = item.productId || item.product_id;
    const size = item.size;
    const quantity = item.quantity;

    if (!productId || !size || !quantity) {
      console.warn('Invalid item data:', item);
      continue;
    }

    if (!itemsByProduct[productId]) {
      itemsByProduct[productId] = [];
    }
    itemsByProduct[productId].push({ size, quantity });
  }

  // Restore product quantities - one update per product to avoid race conditions
  for (const productId in itemsByProduct) {
    const productItems = itemsByProduct[productId];

    // Get the product once
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('sizes, name, team_id, teams(name)')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error(`Error fetching product ${productId}:`, productError);
      // Continue with other products even if one fails
      continue;
    }

    if (!product) {
      console.warn(`Product ${productId} not found`);
      continue;
    }

    const productName = product.teams?.name ? `${product.teams.name} - ${product.name}` : product.name;
    const inventoryChanges = [];

    // Restore quantities for all sizes of this product in one update
    const updatedSizes = (product.sizes || []).map((sizeObj) => {
      // Find all items for this size
      const itemsForThisSize = productItems.filter((item) => item.size === sizeObj.size);
      if (itemsForThisSize.length > 0) {
        // Sum up all quantities to restore for this size
        const totalQuantityToRestore = itemsForThisSize.reduce((sum, item) => sum + item.quantity, 0);
        
        // Prepare log entry
        inventoryChanges.push({
          entityType: 'product',
          entityId: productId,
          entityName: productName,
          size: sizeObj.size,
          changeType: 'return',
          quantityBefore: sizeObj.quantity || 0,
          quantityChange: totalQuantityToRestore,
          quantityAfter: (sizeObj.quantity || 0) + totalQuantityToRestore,
          reason: `Return of sale (${sale.sale_type}) for ${sale.customer_name}`,
          referenceId: saleId,
          referenceType: 'sale'
        });

        return {
          ...sizeObj,
          quantity: (sizeObj.quantity || 0) + totalQuantityToRestore,
        };
      }
      return sizeObj;
    });

    // Update the product with all restored quantities at once
    const { error: updateError } = await supabase.from('products').update({ sizes: updatedSizes }).eq('id', productId);

    if (updateError) {
      console.error(`Error updating product ${productId}:`, updateError);
      // Continue with other products even if one fails
      continue;
    } else if (inventoryChanges.length > 0) {
      // Log successful inventory changes
      await logInventoryChanges(inventoryChanges);
    }
  }

  // Create return record from sale data
  // Use sale.created_at to preserve the original sale timestamp (date + time)
  // If created_at is not available, fall back to sale.date
  const originalSaleDate = sale.created_at || sale.date;

  const returnData = {
    items: items.map((item) => ({
      productId: item.productId || item.product_id,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold || item.price_sold,
    })),
    customerName: sale.customer_name,
    date: originalSaleDate, // Use created_at to preserve full timestamp
    saleType: sale.sale_type,
    originalSaleId: saleId,
    createdAt: new Date().toISOString(),
  };

  // Create the return record
  const { data: returnRecord, error: returnError } = await supabase
    .from('returns')
    .insert([
      {
        items: returnData.items,
        customer_name: returnData.customerName,
        date: returnData.date,
        sale_type: returnData.saleType,
        original_sale_id: returnData.originalSaleId,
        created_at: returnData.createdAt,
      },
    ])
    .select()
    .single();

  if (returnError) throw returnError;

  // Delete the sale after creating return and restoring quantities
  const { error: deleteError } = await supabase.from('sales').delete().eq('id', saleId);

  if (deleteError) throw deleteError;

  // Map database response back to frontend format
  return {
    id: returnRecord.id,
    items: returnRecord.items.map((item) => ({
      productId: item.productId || item.product_id,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold || item.price_sold,
    })),
    customerName: returnRecord.customer_name,
    date: returnRecord.date,
    saleType: returnRecord.sale_type,
    originalSaleId: returnRecord.original_sale_id,
    createdAt: returnRecord.created_at,
  };
}

// ============================================================================
// RESERVATIONS CRUD OPERATIONS
// ============================================================================

export async function createReservation(data) {
  // Validate input
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Reservation must have at least one item');
  }

  // Map frontend items to database JSONB format
  const itemsData = data.items.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    priceSold: item.priceSold,
  }));

  // Map frontend data to database schema
  const dbData = {
    items: itemsData,
    customer_name: data.customerName,
    expiring_date: data.expiringDate,
    location: data.location || null,
    date_time: data.dateTime || null,
    sale_type: data.saleType || 'IN-PERSON',
    status: 'pending',
    created_at: data.createdAt || new Date().toISOString(),
    completed_at: null,
  };

  const { data: result, error } = await supabase.from('reservations').insert([dbData]).select().single();

  if (error) throw error;

  // Reduce product stock when reservation is created
  const itemsByProduct = {};
  for (const item of itemsData) {
    if (!itemsByProduct[item.productId]) {
      itemsByProduct[item.productId] = [];
    }
    itemsByProduct[item.productId].push({ size: item.size, quantity: item.quantity });
  }

  // Update product stock - one update per product to avoid race conditions
  for (const productId in itemsByProduct) {
    const productItems = itemsByProduct[productId];

    // Get the product once
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('sizes, name, team_id, teams(name)')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error(`Error fetching product ${productId}:`, productError);
      // Continue with other products even if one fails
      continue;
    }

    if (!product) {
      console.warn(`Product ${productId} not found`);
      continue;
    }

    const productName = product.teams?.name ? `${product.teams.name} - ${product.name}` : product.name;
    const inventoryChanges = [];

    // Reduce quantities for all sizes of this product in one update
    const updatedSizes = (product.sizes || []).map((sizeObj) => {
      // Find all items for this size
      const itemsForThisSize = productItems.filter((item) => item.size === sizeObj.size);
      if (itemsForThisSize.length > 0) {
        // Sum up all quantities to reduce for this size
        const totalQuantityToReduce = itemsForThisSize.reduce((sum, item) => sum + item.quantity, 0);
        
        // Prepare log entry
        inventoryChanges.push({
          entityType: 'product',
          entityId: productId,
          entityName: productName,
          size: sizeObj.size,
          changeType: 'reservation',
          quantityBefore: sizeObj.quantity || 0,
          quantityChange: -totalQuantityToReduce,
          quantityAfter: (sizeObj.quantity || 0) - totalQuantityToReduce,
          reason: `Reservation created for ${data.customerName}`,
          referenceId: result.id,
          referenceType: 'reservation'
        });

        return {
          ...sizeObj,
          quantity: Math.max(0, (sizeObj.quantity || 0) - totalQuantityToReduce),
        };
      }
      return sizeObj;
    });

    // Update the product with all reduced quantities at once
    const { error: updateError } = await supabase.from('products').update({ sizes: updatedSizes }).eq('id', productId);

    if (updateError) {
      console.error(`Error updating product ${productId}:`, updateError);
      // Continue with other products even if one fails
      continue;
    } else if (inventoryChanges.length > 0) {
      // Log successful inventory changes
      await logInventoryChanges(inventoryChanges);
    }
  }

  // Map database response back to frontend format
  return {
    id: result.id,
    items: result.items || [],
    customerName: result.customer_name,
    expiringDate: result.expiring_date,
    saleType: result.sale_type || 'IN-PERSON',
    status: result.status,
    createdAt: result.created_at,
    completedAt: result.completed_at || undefined,
  };
}

export async function getReservations() {
  const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((reservation) => ({
    id: reservation.id,
    items: reservation.items || [],
    customerName: reservation.customer_name,
    expiringDate: reservation.expiring_date,
    location: reservation.location || undefined,
    dateTime: reservation.date_time || undefined,
    saleType: reservation.sale_type || 'IN-PERSON',
    status: reservation.status,
    createdAt: reservation.created_at,
    completedAt: reservation.completed_at || undefined,
  }));
}

export async function updateReservation(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.items !== undefined) {
    if (!Array.isArray(updates.items) || updates.items.length === 0) {
      throw new Error('Reservation must have at least one item');
    }
    dbUpdates.items = updates.items.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      priceSold: item.priceSold,
    }));
  }

  if (updates.customerName !== undefined) {
    dbUpdates.customer_name = updates.customerName;
  }
  if (updates.expiringDate !== undefined) {
    dbUpdates.expiring_date = updates.expiringDate;
  }
  if (updates.location !== undefined) {
    dbUpdates.location = updates.location;
  }
  if (updates.dateTime !== undefined) {
    dbUpdates.date_time = updates.dateTime;
  }
  if (updates.saleType !== undefined) {
    dbUpdates.sale_type = updates.saleType;
  }
  if (updates.status !== undefined) {
    dbUpdates.status = updates.status;
  }
  if (updates.completedAt !== undefined) {
    dbUpdates.completed_at = updates.completedAt;
  }

  const { data, error } = await supabase.from('reservations').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    items: data.items || [],
    customerName: data.customer_name,
    expiringDate: data.expiring_date,
    location: data.location || undefined,
    dateTime: data.date_time || undefined,
    saleType: data.sale_type || 'IN-PERSON',
    status: data.status,
    createdAt: data.created_at,
    completedAt: data.completed_at || undefined,
  };
}

export async function deleteReservation(id) {
  // First, get the reservation to restore stock
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  if (!reservation) throw new Error('Reservation not found');

  // Only restore stock if reservation is not completed
  if (reservation.status === 'pending') {
    const items = reservation.items || [];

    // Group items by productId
    const itemsByProduct = {};
    for (const item of items) {
      const productId = item.productId;
      if (!productId) continue;

      if (!itemsByProduct[productId]) {
        itemsByProduct[productId] = [];
      }
      itemsByProduct[productId].push({ size: item.size, quantity: item.quantity });
    }

    // Restore product quantities
    for (const productId in itemsByProduct) {
      const productItems = itemsByProduct[productId];

      // Get the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('sizes')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error(`Error fetching product ${productId}:`, productError);
        continue;
      }

      if (!product) {
        console.warn(`Product ${productId} not found`);
        continue;
      }

      // Restore quantities for all sizes
      const updatedSizes = (product.sizes || []).map((sizeObj) => {
        const itemsForThisSize = productItems.filter((item) => item.size === sizeObj.size);
        if (itemsForThisSize.length > 0) {
          const totalQuantityToRestore = itemsForThisSize.reduce((sum, item) => sum + item.quantity, 0);
          return {
            ...sizeObj,
            quantity: (sizeObj.quantity || 0) + totalQuantityToRestore,
          };
        }
        return sizeObj;
      });

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update({ sizes: updatedSizes })
        .eq('id', productId);

      if (updateError) {
        console.error(`Error updating product ${productId}:`, updateError);
        continue;
      }
    }
  }

  // Delete the reservation
  const { error: deleteError } = await supabase.from('reservations').delete().eq('id', id);

  if (deleteError) throw deleteError;
}

export async function completeReservation(id, saleData) {
  // Get the reservation
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.status === 'completed') {
    throw new Error('Reservation is already completed');
  }

  // Create the sale (stock is NOT modified here because it was already reduced when reservation was created)
  const saleItems = reservation.items.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    priceSold: item.priceSold,
  }));

  // Map frontend items to database JSONB format
  const itemsData = saleItems.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    priceSold: item.priceSold,
  }));

  // Create the sale directly (stock is NOT modified - already reduced when reservation was created)
  // Use reservation's saleType if not provided in saleData
  const dbSaleData = {
    items: itemsData,
    customer_name: saleData.customerName || reservation.customer_name,
    date: saleData.date || new Date().toISOString(),
    sale_type: saleData.saleType || reservation.sale_type || 'IN-PERSON',
    created_at: new Date().toISOString(),
  };

  // Backward compatibility: populate old columns from first item
  if (itemsData.length > 0) {
    const firstItem = itemsData[0];
    dbSaleData.product_id = firstItem.productId;
    dbSaleData.size = firstItem.size;
    dbSaleData.quantity = firstItem.quantity;
    dbSaleData.price_sold = firstItem.priceSold;
  }

  const { error: saleError } = await supabase.from('sales').insert([dbSaleData]);

  if (saleError) throw saleError;

  // Update reservation status to completed
  const completedAt = new Date().toISOString();
  const { data: updatedReservation, error: updateError } = await supabase
    .from('reservations')
    .update({ status: 'completed', completed_at: completedAt })
    .eq('id', id)
    .select()
    .single();

  if (updateError) throw updateError;

  // Map database response to frontend format
  return {
    id: updatedReservation.id,
    items: updatedReservation.items || [],
    customerName: updatedReservation.customer_name,
    expiringDate: updatedReservation.expiring_date,
    saleType: updatedReservation.sale_type || 'IN-PERSON',
    status: updatedReservation.status,
    createdAt: updatedReservation.created_at,
    completedAt: updatedReservation.completed_at || undefined,
  };
}

// ============================================================================
// SETTINGS CRUD OPERATIONS
// ============================================================================

export async function getSetting(key) {
  const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data?.value || null;
}

export async function setSetting(key, value) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAppBarOrder() {
  const result = await getSetting('app_bar_order');
  return result || ['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes'];
}

export async function setAppBarOrder(order) {
  return await setSetting('app_bar_order', order);
}

export async function getDashboardOrder() {
  const result = await getSetting('dashboard_order');
  return result || ['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes', 'reservations'];
}

export async function setDashboardOrder(order) {
  return await setSetting('dashboard_order', order);
}

// ============================================================================
// USERS CRUD OPERATIONS (for authentication)
// ============================================================================

export async function createUser(data) {
  const { data: result, error } = await supabase.from('users').insert([data]).select().single();

  if (error) throw error;
  
  // Map database response to frontend format
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
    createdAt: result.created_at,
  };
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  
  if (!data) return null;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
  };
}

export async function updateUser(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.name !== undefined) {
    dbUpdates.name = updates.name;
  }
  if (updates.email !== undefined) {
    dbUpdates.email = updates.email;
  }
  if (updates.role !== undefined) {
    dbUpdates.role = updates.role;
  }
  if (updates.createdAt !== undefined) {
    dbUpdates.created_at = updates.createdAt;
  }

  const { data, error } = await supabase.from('users').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
  };
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// SYSTEM SETTINGS OPERATIONS
// ============================================================================

export async function getSystemSetting(key) {
  const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();

  if (error) throw error;
  return data?.value;
}

export async function setSystemSetting(key, value) {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function isRegistrationEnabled() {
  const value = await getSystemSetting('registration_enabled');
  return value === true || value === 'true';
}

export async function setRegistrationEnabled(enabled) {
  return await setSystemSetting('registration_enabled', enabled);
}

// ============================================================================
// ORDERS CRUD OPERATIONS
// ============================================================================

export async function addOrder(data) {
  // Validate required fields
  if (!data.name && !data.teamId) {
    throw new Error('Order name or team is required');
  }
  if (!data.type) {
    throw new Error('Order type is required');
  }
  if (!data.kitTypeId) {
    throw new Error('Kit type is required');
  }
  if (!data.status) {
    throw new Error('Order status is required');
  }

  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    type: data.type,
    sizes: data.sizes || [],
    nameset_id: data.namesetId || null,
    team_id: data.teamId,
    kit_type_id: data.kitTypeId,
    badge_id: data.badgeId || null,
    price: parseFloat(data.price) || 0.0,
    status: data.status,
    customer_name: data.customerName || null,
    phone_number: data.phoneNumber || null,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('orders').insert([dbData]).select().single();

  if (error) {
    throw error;
  }

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    type: result.type,
    sizes: result.sizes,
    namesetId: result.nameset_id,
    teamId: result.team_id,
    kitTypeId: result.kit_type_id,
    badgeId: result.badge_id,
    price: result.price,
    status: result.status,
    customerName: result.customer_name,
    phoneNumber: result.phone_number,
    createdAt: result.created_at,
  };
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      namesets (
        id,
        player_name,
        number,
        season,
        quantity,
        price,
        kit_type_id,
        location,
        created_at
      ),
      teams (
        id,
        name,
        leagues,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      ),
      badges (
        id,
        name,
        season,
        quantity,
        price,
        location,
        created_at
      )
    `
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    status: item.status,
    customerName: item.customer_name,
    phoneNumber: item.phone_number,
    createdAt: item.created_at,
    nameset: item.namesets
      ? {
          id: item.namesets.id,
          playerName: item.namesets.player_name,
          number: item.namesets.number,
          season: item.namesets.season,
          quantity: item.namesets.quantity,
          price: item.namesets.price,
          kitTypeId: item.namesets.kit_type_id,
          location: item.namesets.location || undefined,
          createdAt: item.namesets.created_at,
        }
      : null,
    team: item.teams
      ? {
          id: item.teams.id,
          name: item.teams.name,
          leagues: item.teams.leagues || [],
          createdAt: item.teams.created_at,
        }
      : null,
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
    badge: item.badges
      ? {
          id: item.badges.id,
          name: item.badges.name,
          season: item.badges.season,
          quantity: item.badges.quantity,
          price: item.badges.price,
          location: item.badges.location || undefined,
          createdAt: item.badges.created_at,
        }
      : null,
  }));
}

export async function getArchivedOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      namesets (
        id,
        player_name,
        number,
        season,
        quantity,
        price,
        kit_type_id,
        location,
        created_at
      ),
      teams (
        id,
        name,
        leagues,
        created_at
      ),
      kit_types (
        id,
        name,
        created_at
      ),
      badges (
        id,
        name,
        season,
        quantity,
        price,
        location,
        created_at
      )
    `
    )
    .not('archived_at', 'is', null)
    .order('archived_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    status: item.status,
    customerName: item.customer_name,
    phoneNumber: item.phone_number,
    createdAt: item.created_at,
    nameset: item.namesets
      ? {
          id: item.namesets.id,
          playerName: item.namesets.player_name,
          number: item.namesets.number,
          season: item.namesets.season,
          quantity: item.namesets.quantity,
          price: item.namesets.price,
          kitTypeId: item.namesets.kit_type_id,
          location: item.namesets.location || undefined,
          createdAt: item.namesets.created_at,
        }
      : null,
    team: item.teams
      ? {
          id: item.teams.id,
          name: item.teams.name,
          leagues: item.teams.leagues || [],
          createdAt: item.teams.created_at,
        }
      : null,
    kitType: item.kit_types
      ? {
          id: item.kit_types.id,
          name: item.kit_types.name,
          createdAt: item.kit_types.created_at,
        }
      : null,
    badge: item.badges
      ? {
          id: item.badges.id,
          name: item.badges.name,
          season: item.badges.season,
          quantity: item.badges.quantity,
          price: item.badges.price,
          location: item.badges.location || undefined,
          createdAt: item.badges.created_at,
        }
      : null,
  }));
}

export async function updateOrder(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.name !== undefined) {
    dbUpdates.name = updates.name;
  }
  if (updates.type !== undefined) {
    dbUpdates.type = updates.type;
  }
  if (updates.sizes !== undefined) {
    dbUpdates.sizes = updates.sizes;
  }
  if (updates.namesetId !== undefined) {
    dbUpdates.nameset_id = updates.namesetId;
  }
  if (updates.teamId !== undefined) {
    dbUpdates.team_id = updates.teamId;
  }
  if (updates.kitTypeId !== undefined) {
    dbUpdates.kit_type_id = updates.kitTypeId;
  }
  if (updates.badgeId !== undefined) {
    dbUpdates.badge_id = updates.badgeId;
  }
  if (updates.price !== undefined) {
    dbUpdates.price = parseFloat(updates.price);
  }
  if (updates.status !== undefined) {
    dbUpdates.status = updates.status;
  }
  if (updates.customerName !== undefined) {
    dbUpdates.customer_name = updates.customerName;
  }
  if (updates.phoneNumber !== undefined) {
    dbUpdates.phone_number = updates.phoneNumber;
  }

  const { data, error } = await supabase.from('orders').update(dbUpdates).eq('id', id).select('*').single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    status: data.status,
    customerName: data.customer_name,
    phoneNumber: data.phone_number,
    createdAt: data.created_at,
  };
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    status: data.status,
    customerName: data.customer_name,
    phoneNumber: data.phone_number,
    createdAt: data.created_at,
    archivedAt: data.archived_at,
  };
}

export async function unarchiveOrder(id) {
  const { data, error } = await supabase.from('orders').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    sizes: data.sizes,
    namesetId: data.nameset_id,
    teamId: data.team_id,
    kitTypeId: data.kit_type_id,
    badgeId: data.badge_id,
    price: data.price,
    status: data.status,
    customerName: data.customer_name,
    phoneNumber: data.phone_number,
    createdAt: data.created_at,
  };
}

// ============================================================================
// LEAGUES CRUD OPERATIONS
// ============================================================================

export async function createLeague(data) {
  // Validate required fields
  if (!data.name || !data.name.trim()) {
    throw new Error('League name is required');
  }

  // Map frontend data to database schema
  const dbData = {
    name: data.name.trim(),
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('leagues').insert([dbData]).select().single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('A league with this name already exists');
    }
    throw error;
  }

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
    createdAt: result.created_at,
  };
}

export async function getLeagues() {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leagues:', error);
    throw new Error('Failed to fetch leagues: ' + (error.message || 'Unknown error'));
  }

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
}

export async function getArchivedLeagues() {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching archived leagues:', error);
    throw new Error('Failed to fetch archived leagues: ' + (error.message || 'Unknown error'));
  }

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
}

export async function updateLeague(id, updates) {
  // Validate input
  if (!id) {
    throw new Error('League ID is required');
  }

  if (updates.name !== undefined && (!updates.name || !updates.name.trim())) {
    throw new Error('League name cannot be empty');
  }

  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name.trim();
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  // Check if there are any updates
  if (Object.keys(dbUpdates).length === 0) {
    throw new Error('No updates provided');
  }

  const { data, error } = await supabase.from('leagues').update(dbUpdates).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('League not found');
    }
    if (error.code === '23505') {
      throw new Error('A league with this name already exists');
    }
    console.error('Error updating league:', error);
    throw new Error('Failed to update league: ' + (error.message || 'Unknown error'));
  }

  if (!data) {
    throw new Error('League not found');
  }

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function deleteLeague(id) {
  // Validate input
  if (!id) {
    throw new Error('League ID is required');
  }

  // Check if there are any references to this league in teams.leagues array
  // Fetch only id and leagues columns (not full records) and check efficiently
  // Note: After running ADD_LEAGUES_FEATURE.sql, you can uncomment the RPC call below
  // for better performance using the GIN index
  const { data: teams, error: teamsError } = await supabase.from('teams').select('id, leagues').limit(1000); // Reasonable limit - adjust if you have more than 1000 teams

  if (teamsError) {
    console.error('Error checking league references:', teamsError);
    throw new Error('Failed to check league references: ' + (teamsError.message || 'Unknown error'));
  }

  // Check if any team references this league
  const hasReferences = (teams || []).some((team) => {
    const leagues = team.leagues || [];
    return Array.isArray(leagues) && leagues.includes(id);
  });

  // If there are references, throw an error
  if (hasReferences) {
    throw new Error('Cannot delete league: it is referenced by teams. Please remove the league from all teams first.');
  }

  // If no references, proceed with deletion
  const { error } = await supabase.from('leagues').delete().eq('id', id);

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('League not found');
    }
    console.error('Error deleting league:', error);
    throw new Error('Failed to delete league: ' + (error.message || 'Unknown error'));
  }

  // OPTIMIZED VERSION (uncomment after running ADD_LEAGUES_FEATURE.sql):
  // // Check if there are any references using the RPC function (much faster, uses GIN index)
  // const { data: hasReferences, error: checkError } = await supabase.rpc('check_league_references', {
  //   league_uuid: id,
  // });
  // if (checkError) {
  //   throw new Error('Failed to check league references: ' + (checkError.message || 'Unknown error'));
  // }
  // if (hasReferences) {
  //   throw new Error('Cannot delete league: it is referenced by teams. Please remove the league from all teams first.');
  // }
}

export async function archiveLeague(id) {
  // Validate input
  if (!id) {
    throw new Error('League ID is required');
  }

  const { data, error } = await supabase
    .from('leagues')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('League not found');
    }
    console.error('Error archiving league:', error);
    throw new Error('Failed to archive league: ' + (error.message || 'Unknown error'));
  }

  if (!data) {
    throw new Error('League not found');
  }

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function restoreLeague(id) {
  // Validate input
  if (!id) {
    throw new Error('League ID is required');
  }

  const { data, error } = await supabase.from('leagues').update({ archived_at: null }).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('League not found');
    }
    console.error('Error restoring league:', error);
    throw new Error('Failed to restore league: ' + (error.message || 'Unknown error'));
  }

  if (!data) {
    throw new Error('League not found');
  }

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  };
}

// ============================================================================
// TEAM-LEAGUES RELATIONSHIP OPERATIONS (using JSONB array)
// ============================================================================

export async function getTeamLeagues(teamId) {
  // Validate input
  if (!teamId) {
    throw new Error('Team ID is required');
  }

  const { data, error } = await supabase.from('teams').select('leagues').eq('id', teamId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Team not found');
    }
    console.error('Error fetching team leagues:', error);
    throw new Error('Failed to fetch team leagues: ' + (error.message || 'Unknown error'));
  }

  if (!data) {
    throw new Error('Team not found');
  }

  return data?.leagues || [];
}

export async function getLeagueTeams(leagueId) {
  // Validate input
  if (!leagueId) {
    throw new Error('League ID is required');
  }

  // Fetch teams and filter in JavaScript
  // Note: After running ADD_LEAGUES_FEATURE.sql, you can uncomment the RPC call below
  // for better performance using the GIN index
  const { data: allTeams, error } = await supabase.from('teams').select('id, leagues').limit(1000);

  if (error) {
    console.error('Error fetching teams for league:', error);
    throw new Error('Failed to fetch teams for league: ' + (error.message || 'Unknown error'));
  }

  // Filter teams that have this league in their leagues array
  const teamsWithLeague = (allTeams || []).filter((team) => {
    const leagues = team.leagues || [];
    return Array.isArray(leagues) && leagues.includes(leagueId);
  });

  return teamsWithLeague.map((team) => team.id);

  // OPTIMIZED VERSION (uncomment after running ADD_LEAGUES_FEATURE.sql):
  // // Try using RPC function (much faster, uses GIN index)
  // const { data: teamIds, error: rpcError } = await supabase.rpc('get_teams_for_league', {
  //   league_uuid: leagueId,
  // });
  // if (rpcError) {
  //   throw new Error('Failed to fetch teams for league: ' + (rpcError.message || 'Unknown error'));
  // }
  // return (teamIds || []).map((row) => row.team_id || row.teamId || row.id);
}

export async function setTeamLeagues(teamId, leagueIds) {
  const { data, error } = await supabase
    .from('teams')
    .update({ leagues: leagueIds || [] })
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw error;

  return data.leagues || [];
}

export async function addTeamToLeague(teamId, leagueId) {
  // Validate input
  if (!teamId) {
    throw new Error('Team ID is required');
  }
  if (!leagueId) {
    throw new Error('League ID is required');
  }

  // Get current leagues
  const { data: team, error: fetchError } = await supabase.from('teams').select('leagues').eq('id', teamId).single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Team not found');
    }
    console.error('Error fetching team:', fetchError);
    throw new Error('Failed to fetch team: ' + (fetchError.message || 'Unknown error'));
  }

  if (!team) {
    throw new Error('Team not found');
  }

  const currentLeagues = team?.leagues || [];

  // Add league if not already present
  if (!currentLeagues.includes(leagueId)) {
    const updatedLeagues = [...currentLeagues, leagueId];

    const { data, error } = await supabase
      .from('teams')
      .update({ leagues: updatedLeagues })
      .eq('id', teamId)
      .select('leagues')
      .single();

    if (error) {
      console.error('Error updating team leagues:', error);
      throw new Error('Failed to add league to team: ' + (error.message || 'Unknown error'));
    }
    return data?.leagues || [];
  }

  return currentLeagues;
}

export async function removeTeamFromLeague(teamId, leagueId) {
  // Validate input
  if (!teamId) {
    throw new Error('Team ID is required');
  }
  if (!leagueId) {
    throw new Error('League ID is required');
  }

  // Get current leagues
  const { data: team, error: fetchError } = await supabase.from('teams').select('leagues').eq('id', teamId).single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Team not found');
    }
    console.error('Error fetching team:', fetchError);
    throw new Error('Failed to fetch team: ' + (fetchError.message || 'Unknown error'));
  }

  if (!team) {
    throw new Error('Team not found');
  }

  const currentLeagues = team?.leagues || [];
  const updatedLeagues = currentLeagues.filter((id) => id !== leagueId);

  const { error } = await supabase.from('teams').update({ leagues: updatedLeagues }).eq('id', teamId);

  if (error) {
    console.error('Error removing league from team:', error);
    throw new Error('Failed to remove league from team: ' + (error.message || 'Unknown error'));
  }
}

// ============================================================================
// SELLERS CRUD OPERATIONS
// ============================================================================

export async function createSeller(data) {
  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    website_url: data.websiteUrl || null,
    special_notes: data.specialNotes || null,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('sellers').insert([dbData]).select().single();

  if (error) throw error;

  // Create seller-product relationships if productIds are provided
  if (data.productIds && data.productIds.length > 0) {
    const sellerProducts = data.productIds.map((productId) => ({
      seller_id: result.id,
      product_id: productId,
    }));

    const { error: relError } = await supabase.from('seller_products').insert(sellerProducts);

    if (relError) {
      // Rollback seller creation if relationships fail
      await supabase.from('sellers').delete().eq('id', result.id);
      throw relError;
    }
  }

  // Fetch the created seller with product relationships
  const seller = await getSellerById(result.id);

  // Map database response back to frontend format
  return seller;
}

export async function getSellers() {
  const { data, error } = await supabase
    .from('sellers')
    .select(
      `
      *,
      seller_products (
        product_id,
        products (
          *,
          product_images (
            id,
            product_id,
            image_url,
            thumbnail_url,
            medium_url,
            large_url,
            alt_text,
            is_primary,
            display_order,
            created_at
          ),
          namesets (
            id,
            player_name,
            number,
            season,
            quantity,
            price,
            kit_type_id,
            location,
            created_at
          ),
          teams (
            id,
            name,
            leagues,
            created_at
          ),
          kit_types (
            id,
            name,
            created_at
          ),
          badges (
            id,
            name,
            season,
            quantity,
            price,
            location,
            created_at
          )
        )
      )
    `
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => {
    const sellerProducts = item.seller_products || [];
    const productIds = sellerProducts.map((sp) => sp.product_id);
    const products = sellerProducts
      .map((sp) => sp.products)
      .filter(Boolean)
      .map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
        sizes: product.sizes,
        namesetId: product.nameset_id,
        teamId: product.team_id,
        kitTypeId: product.kit_type_id,
        badgeId: product.badge_id,
        price: product.price,
        olxLink: product.olx_link,
        location: product.location || undefined,
        isOnSale: product.is_on_sale || false,
        salePrice: product.sale_price || undefined,
        createdAt: product.created_at,
        images: (product.product_images || []).map((img) => ({
          id: img.id,
          productId: img.product_id,
          imageUrl: img.image_url || img.large_url,
          thumbnailUrl: img.thumbnail_url || img.image_url,
          mediumUrl: img.medium_url || img.image_url,
          largeUrl: img.large_url || img.image_url,
          altText: img.alt_text,
          isPrimary: img.is_primary,
          displayOrder: img.display_order,
          createdAt: img.created_at,
        })),
        nameset: product.namesets
          ? {
              id: product.namesets.id,
              playerName: product.namesets.player_name,
              number: product.namesets.number,
              season: product.namesets.season,
              quantity: product.namesets.quantity,
              price: product.namesets.price,
              kitTypeId: product.namesets.kit_type_id,
              location: product.namesets.location || undefined,
              createdAt: product.namesets.created_at,
            }
          : null,
        team: product.teams
          ? {
              id: product.teams.id,
              name: product.teams.name,
              leagues: product.teams.leagues || [],
              createdAt: product.teams.created_at,
            }
          : null,
        kitType: product.kit_types
          ? {
              id: product.kit_types.id,
              name: product.kit_types.name,
              createdAt: product.kit_types.created_at,
            }
          : null,
        badge: product.badges
          ? {
              id: product.badges.id,
              name: product.badges.name,
              season: product.badges.season,
              quantity: product.badges.quantity,
              price: product.badges.price,
              location: product.badges.location || undefined,
              createdAt: product.badges.created_at,
            }
          : null,
      }));

    return {
      id: item.id,
      name: item.name,
      websiteUrl: item.website_url || undefined,
      specialNotes: item.special_notes || undefined,
      productIds: productIds,
      createdAt: item.created_at,
      products: products,
    };
  });
}

export async function getSellerById(id) {
  const { data, error } = await supabase.from('sellers').select('*').eq('id', id).single();

  if (error) throw error;

  // Fetch product relationships
  const { data: sellerProducts } = await supabase.from('seller_products').select('product_id').eq('seller_id', id);

  const productIds = (sellerProducts || []).map((sp) => sp.product_id);

  return {
    id: data.id,
    name: data.name,
    websiteUrl: data.website_url || undefined,
    specialNotes: data.special_notes || undefined,
    productIds: productIds,
    createdAt: data.created_at,
  };
}

export async function getArchivedSellers() {
  const { data, error } = await supabase
    .from('sellers')
    .select(
      `
      *,
      seller_products (
        product_id,
        products (
          *,
          product_images (
            id,
            product_id,
            image_url,
            thumbnail_url,
            medium_url,
            large_url,
            alt_text,
            is_primary,
            display_order,
            created_at
          ),
          namesets (
            id,
            player_name,
            number,
            season,
            quantity,
            price,
            kit_type_id,
            location,
            created_at
          ),
          teams (
            id,
            name,
            leagues,
            created_at
          ),
          kit_types (
            id,
            name,
            created_at
          ),
          badges (
            id,
            name,
            season,
            quantity,
            price,
            location,
            created_at
          )
        )
      )
    `
    )
    .not('archived_at', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => {
    const sellerProducts = item.seller_products || [];
    const productIds = sellerProducts.map((sp) => sp.product_id);
    const products = sellerProducts
      .map((sp) => sp.products)
      .filter(Boolean)
      .map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
        sizes: product.sizes,
        namesetId: product.nameset_id,
        teamId: product.team_id,
        kitTypeId: product.kit_type_id,
        badgeId: product.badge_id,
        price: product.price,
        olxLink: product.olx_link,
        location: product.location || undefined,
        isOnSale: product.is_on_sale || false,
        salePrice: product.sale_price || undefined,
        createdAt: product.created_at,
        images: (product.product_images || []).map((img) => ({
          id: img.id,
          productId: img.product_id,
          imageUrl: img.image_url || img.large_url,
          thumbnailUrl: img.thumbnail_url || img.image_url,
          mediumUrl: img.medium_url || img.image_url,
          largeUrl: img.large_url || img.image_url,
          altText: img.alt_text,
          isPrimary: img.is_primary,
          displayOrder: img.display_order,
          createdAt: img.created_at,
        })),
        nameset: product.namesets
          ? {
              id: product.namesets.id,
              playerName: product.namesets.player_name,
              number: product.namesets.number,
              season: product.namesets.season,
              quantity: product.namesets.quantity,
              price: product.namesets.price,
              kitTypeId: product.namesets.kit_type_id,
              location: product.namesets.location || undefined,
              createdAt: product.namesets.created_at,
            }
          : null,
        team: product.teams
          ? {
              id: product.teams.id,
              name: product.teams.name,
              leagues: product.teams.leagues || [],
              createdAt: product.teams.created_at,
            }
          : null,
        kitType: product.kit_types
          ? {
              id: product.kit_types.id,
              name: product.kit_types.name,
              createdAt: product.kit_types.created_at,
            }
          : null,
        badge: product.badges
          ? {
              id: product.badges.id,
              name: product.badges.name,
              season: product.badges.season,
              quantity: product.badges.quantity,
              price: product.badges.price,
              location: product.badges.location || undefined,
              createdAt: product.badges.created_at,
            }
          : null,
      }));

    return {
      id: item.id,
      name: item.name,
      websiteUrl: item.website_url || undefined,
      specialNotes: item.special_notes || undefined,
      productIds: productIds,
      createdAt: item.created_at,
      products: products,
    };
  });
}

export async function updateSeller(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.websiteUrl !== undefined) dbUpdates.website_url = updates.websiteUrl || null;
  if (updates.specialNotes !== undefined) dbUpdates.special_notes = updates.specialNotes || null;

  const { error } = await supabase.from('sellers').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Update product relationships if productIds are provided
  if (updates.productIds !== undefined) {
    // Delete existing relationships
    await supabase.from('seller_products').delete().eq('seller_id', id);

    // Create new relationships
    if (updates.productIds.length > 0) {
      const sellerProducts = updates.productIds.map((productId) => ({
        seller_id: id,
        product_id: productId,
      }));

      const { error: relError } = await supabase.from('seller_products').insert(sellerProducts);

      if (relError) throw relError;
    }
  }

  // Fetch the updated seller with product relationships
  return await getSellerById(id);
}

export async function deleteSeller(id) {
  // Check if there are product links referencing this seller
  const { data: productLinks, error: linksError } = await supabase
    .from('product_links')
    .select('id')
    .eq('seller_id', id)
    .limit(1);

  if (linksError) throw linksError;

  // If there are references, throw an error
  if (productLinks && productLinks.length > 0) {
    throw new Error('Cannot delete seller: it is referenced by product links');
  }

  // Delete seller-product relationships first
  await supabase.from('seller_products').delete().eq('seller_id', id);

  // Delete the seller
  const { error } = await supabase.from('sellers').delete().eq('id', id);

  if (error) throw error;
}

export async function archiveSeller(id) {
  const { error } = await supabase
    .from('sellers')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return await getSellerById(id);
}

export async function restoreSeller(id) {
  const { error } = await supabase.from('sellers').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;

  return await getSellerById(id);
}

// ============================================================================
// PRODUCT LINKS CRUD OPERATIONS
// ============================================================================

export async function createProductLink(data) {
  // Map frontend data to database schema
  const dbData = {
    product_id: data.productId,
    seller_id: data.sellerId || null,
    url: data.url,
    label: data.label || null,
    created_at: data.createdAt || new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('product_links').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    productId: result.product_id,
    sellerId: result.seller_id || undefined,
    url: result.url,
    label: result.label || undefined,
    createdAt: result.created_at,
  };
}

export async function getProductLinks() {
  const { data, error } = await supabase
    .from('product_links')
    .select(
      `
      *,
      products (
        *,
        product_images (
          id,
          product_id,
          image_url,
          thumbnail_url,
          medium_url,
          large_url,
          alt_text,
          is_primary,
          display_order,
          created_at
        ),
        namesets (
          id,
          player_name,
          number,
          season,
          quantity,
          price,
          kit_type_id,
          location,
          created_at
        ),
        teams (
          id,
          name,
          leagues,
          created_at
        ),
        kit_types (
          id,
          name,
          created_at
        ),
        badges (
          id,
          name,
          season,
          quantity,
          price,
          location,
          created_at
        )
      ),
      sellers (
        id,
        name,
        website_url,
        special_notes,
        created_at
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => {
    const product = item.products
      ? {
          id: item.products.id,
          name: item.products.name,
          type: item.products.type,
          sizes: item.products.sizes,
          namesetId: item.products.nameset_id,
          teamId: item.products.team_id,
          kitTypeId: item.products.kit_type_id,
          badgeId: item.products.badge_id,
          price: item.products.price,
          olxLink: item.products.olx_link,
          location: item.products.location || undefined,
          isOnSale: item.products.is_on_sale || false,
          salePrice: item.products.sale_price || undefined,
          createdAt: item.products.created_at,
          images: (item.products.product_images || []).map((img) => ({
            id: img.id,
            productId: img.product_id,
            imageUrl: img.image_url || img.large_url,
            thumbnailUrl: img.thumbnail_url || img.image_url,
            mediumUrl: img.medium_url || img.image_url,
            largeUrl: img.large_url || img.image_url,
            altText: img.alt_text,
            isPrimary: img.is_primary,
            displayOrder: img.display_order,
            createdAt: img.created_at,
          })),
          nameset: item.products.namesets
            ? {
                id: item.products.namesets.id,
                playerName: item.products.namesets.player_name,
                number: item.products.namesets.number,
                season: item.products.namesets.season,
                quantity: item.products.namesets.quantity,
                price: item.products.namesets.price,
                kitTypeId: item.products.namesets.kit_type_id,
                location: item.products.namesets.location || undefined,
                createdAt: item.products.namesets.created_at,
              }
            : null,
          team: item.products.teams
            ? {
                id: item.products.teams.id,
                name: item.products.teams.name,
                leagues: item.products.teams.leagues || [],
                createdAt: item.products.teams.created_at,
              }
            : null,
          kitType: item.products.kit_types
            ? {
                id: item.products.kit_types.id,
                name: item.products.kit_types.name,
                createdAt: item.products.kit_types.created_at,
              }
            : null,
          badge: item.products.badges
            ? {
                id: item.products.badges.id,
                name: item.products.badges.name,
                season: item.products.badges.season,
                quantity: item.products.badges.quantity,
                price: item.products.badges.price,
                location: item.products.badges.location || undefined,
                createdAt: item.products.badges.created_at,
              }
            : null,
        }
      : null;

    const seller = item.sellers
      ? {
          id: item.sellers.id,
          name: item.sellers.name,
          websiteUrl: item.sellers.website_url || undefined,
          specialNotes: item.sellers.special_notes || undefined,
          createdAt: item.sellers.created_at,
          productIds: [], // Will be populated separately if needed
        }
      : null;

    return {
      id: item.id,
      productId: item.product_id,
      sellerId: item.seller_id || undefined,
      url: item.url,
      label: item.label || undefined,
      createdAt: item.created_at,
      product: product,
      seller: seller,
    };
  });
}

export async function getProductLinksByProductId(productId) {
  const { data, error } = await supabase
    .from('product_links')
    .select(
      `
      *,
      products (
        *,
        product_images (
          id,
          product_id,
          image_url,
          thumbnail_url,
          medium_url,
          large_url,
          alt_text,
          is_primary,
          display_order,
          created_at
        ),
        namesets (
          id,
          player_name,
          number,
          season,
          quantity,
          price,
          kit_type_id,
          location,
          created_at
        ),
        teams (
          id,
          name,
          leagues,
          created_at
        ),
        kit_types (
          id,
          name,
          created_at
        ),
        badges (
          id,
          name,
          season,
          quantity,
          price,
          location,
          created_at
        )
      ),
      sellers (
        id,
        name,
        website_url,
        special_notes,
        created_at
      )
    `
    )
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format (same mapping as getProductLinks)
  return (data || []).map((item) => {
    const product = item.products
      ? {
          id: item.products.id,
          name: item.products.name,
          type: item.products.type,
          sizes: item.products.sizes,
          namesetId: item.products.nameset_id,
          teamId: item.products.team_id,
          kitTypeId: item.products.kit_type_id,
          badgeId: item.products.badge_id,
          price: item.products.price,
          olxLink: item.products.olx_link,
          location: item.products.location || undefined,
          isOnSale: item.products.is_on_sale || false,
          salePrice: item.products.sale_price || undefined,
          createdAt: item.products.created_at,
          images: (item.products.product_images || []).map((img) => ({
            id: img.id,
            productId: img.product_id,
            imageUrl: img.image_url || img.large_url,
            thumbnailUrl: img.thumbnail_url || img.image_url,
            mediumUrl: img.medium_url || img.image_url,
            largeUrl: img.large_url || img.image_url,
            altText: img.alt_text,
            isPrimary: img.is_primary,
            displayOrder: img.display_order,
            createdAt: img.created_at,
          })),
          nameset: item.products.namesets
            ? {
                id: item.products.namesets.id,
                playerName: item.products.namesets.player_name,
                number: item.products.namesets.number,
                season: item.products.namesets.season,
                quantity: item.products.namesets.quantity,
                price: item.products.namesets.price,
                kitTypeId: item.products.namesets.kit_type_id,
                location: item.products.namesets.location || undefined,
                createdAt: item.products.namesets.created_at,
              }
            : null,
          team: item.products.teams
            ? {
                id: item.products.teams.id,
                name: item.products.teams.name,
                leagues: item.products.teams.leagues || [],
                createdAt: item.products.teams.created_at,
              }
            : null,
          kitType: item.products.kit_types
            ? {
                id: item.products.kit_types.id,
                name: item.products.kit_types.name,
                createdAt: item.products.kit_types.created_at,
              }
            : null,
          badge: item.products.badges
            ? {
                id: item.products.badges.id,
                name: item.products.badges.name,
                season: item.products.badges.season,
                quantity: item.products.badges.quantity,
                price: item.products.badges.price,
                location: item.products.badges.location || undefined,
                createdAt: item.products.badges.created_at,
              }
            : null,
        }
      : null;

    const seller = item.sellers
      ? {
          id: item.sellers.id,
          name: item.sellers.name,
          websiteUrl: item.sellers.website_url || undefined,
          specialNotes: item.sellers.special_notes || undefined,
          createdAt: item.sellers.created_at,
          productIds: [],
        }
      : null;

    return {
      id: item.id,
      productId: item.product_id,
      sellerId: item.seller_id || undefined,
      url: item.url,
      label: item.label || undefined,
      createdAt: item.created_at,
      product: product,
      seller: seller,
    };
  });
}

export async function getProductLinksBySellerId(sellerId) {
  const { data, error } = await supabase
    .from('product_links')
    .select(
      `
      *,
      products (
        *,
        product_images (
          id,
          product_id,
          image_url,
          thumbnail_url,
          medium_url,
          large_url,
          alt_text,
          is_primary,
          display_order,
          created_at
        ),
        namesets (
          id,
          player_name,
          number,
          season,
          quantity,
          price,
          kit_type_id,
          location,
          created_at
        ),
        teams (
          id,
          name,
          leagues,
          created_at
        ),
        kit_types (
          id,
          name,
          created_at
        ),
        badges (
          id,
          name,
          season,
          quantity,
          price,
          location,
          created_at
        )
      ),
      sellers (
        id,
        name,
        website_url,
        special_notes,
        created_at
      )
    `
    )
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map database response to frontend format (same mapping as getProductLinks)
  return (data || []).map((item) => {
    const product = item.products
      ? {
          id: item.products.id,
          name: item.products.name,
          type: item.products.type,
          sizes: item.products.sizes,
          namesetId: item.products.nameset_id,
          teamId: item.products.team_id,
          kitTypeId: item.products.kit_type_id,
          badgeId: item.products.badge_id,
          price: item.products.price,
          olxLink: item.products.olx_link,
          location: item.products.location || undefined,
          isOnSale: item.products.is_on_sale || false,
          salePrice: item.products.sale_price || undefined,
          createdAt: item.products.created_at,
          images: (item.products.product_images || []).map((img) => ({
            id: img.id,
            productId: img.product_id,
            imageUrl: img.image_url || img.large_url,
            thumbnailUrl: img.thumbnail_url || img.image_url,
            mediumUrl: img.medium_url || img.image_url,
            largeUrl: img.large_url || img.image_url,
            altText: img.alt_text,
            isPrimary: img.is_primary,
            displayOrder: img.display_order,
            createdAt: img.created_at,
          })),
          nameset: item.products.namesets
            ? {
                id: item.products.namesets.id,
                playerName: item.products.namesets.player_name,
                number: item.products.namesets.number,
                season: item.products.namesets.season,
                quantity: item.products.namesets.quantity,
                price: item.products.namesets.price,
                kitTypeId: item.products.namesets.kit_type_id,
                location: item.products.namesets.location || undefined,
                createdAt: item.products.namesets.created_at,
              }
            : null,
          team: item.products.teams
            ? {
                id: item.products.teams.id,
                name: item.products.teams.name,
                leagues: item.products.teams.leagues || [],
                createdAt: item.products.teams.created_at,
              }
            : null,
          kitType: item.products.kit_types
            ? {
                id: item.products.kit_types.id,
                name: item.products.kit_types.name,
                createdAt: item.products.kit_types.created_at,
              }
            : null,
          badge: item.products.badges
            ? {
                id: item.products.badges.id,
                name: item.products.badges.name,
                season: item.products.badges.season,
                quantity: item.products.badges.quantity,
                price: item.products.badges.price,
                location: item.products.badges.location || undefined,
                createdAt: item.products.badges.created_at,
              }
            : null,
        }
      : null;

    const seller = item.sellers
      ? {
          id: item.sellers.id,
          name: item.sellers.name,
          websiteUrl: item.sellers.website_url || undefined,
          specialNotes: item.sellers.special_notes || undefined,
          createdAt: item.sellers.created_at,
          productIds: [],
        }
      : null;

    return {
      id: item.id,
      productId: item.product_id,
      sellerId: item.seller_id || undefined,
      url: item.url,
      label: item.label || undefined,
      createdAt: item.created_at,
      product: product,
      seller: seller,
    };
  });
}

export async function updateProductLink(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.productId !== undefined) dbUpdates.product_id = updates.productId;
  if (updates.sellerId !== undefined) dbUpdates.seller_id = updates.sellerId || null;
  if (updates.url !== undefined) dbUpdates.url = updates.url;
  if (updates.label !== undefined) dbUpdates.label = updates.label || null;

  const { data, error } = await supabase.from('product_links').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    productId: data.product_id,
    sellerId: data.seller_id || undefined,
    url: data.url,
    label: data.label || undefined,
    createdAt: data.created_at,
  };
}

export async function deleteProductLink(id) {
  const { error } = await supabase.from('product_links').delete().eq('id', id);

  if (error) throw error;
}
