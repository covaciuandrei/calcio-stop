import { supabase } from './supabaseClient';

// ============================================================================
// TEAMS CRUD OPERATIONS
// ============================================================================

export async function createTeam(data) {
  // Map frontend data to database schema
  const dbData = {
    name: data.name,
    created_at: data.createdAt || new Date().toISOString(),
    archived_at: null,
  };

  const { data: result, error } = await supabase.from('teams').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    name: result.name,
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

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
}

export async function getArchivedTeams() {
  const { data, error } = await supabase
    .from('teams')
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

export async function updateTeam(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  const { data, error } = await supabase.from('teams').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
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
  return data;
}

export async function restoreTeam(id) {
  const { data, error } = await supabase.from('teams').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;
  return data;
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
    createdAt: result.created_at,
  };
}

export async function getBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
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
    createdAt: item.created_at,
  }));
}

export async function getArchivedBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
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
    createdAt: item.created_at,
  }));
}

export async function updateBadge(id, updates) {
  // Map frontend updates to database schema
  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.season !== undefined) dbUpdates.season = updates.season;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

  const { data, error } = await supabase.from('badges').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response to frontend format
  return {
    id: data.id,
    name: data.name,
    season: data.season,
    quantity: data.quantity,
    price: data.price,
    createdAt: data.created_at,
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
  return data;
}

export async function restoreBadge(id) {
  const { data, error } = await supabase.from('badges').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;
  return data;
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

  if (error) throw error;

  // Map database response to frontend format
  return (data || []).map((item) => ({
    id: item.id,
    badgeId: item.badge_id,
    imageUrl: item.image_url,
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
    kit_type_id: data.kitTypeId,
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
    kitTypeId: result.kit_type_id,
    createdAt: result.created_at,
  };
}

export async function getNamesets() {
  const { data, error } = await supabase
    .from('namesets')
    .select('*')
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
    kitTypeId: item.kit_type_id,
    createdAt: item.created_at,
  }));
}

export async function getArchivedNamesets() {
  const { data, error } = await supabase
    .from('namesets')
    .select('*')
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
    kitTypeId: item.kit_type_id,
    createdAt: item.created_at,
  }));
}

export async function updateNameset(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.playerName !== undefined) {
    dbUpdates.player_name = updates.playerName;
  }
  if (updates.number !== undefined) {
    dbUpdates.number = parseInt(updates.number);
  }
  if (updates.season !== undefined) {
    dbUpdates.season = updates.season;
  }
  if (updates.quantity !== undefined) {
    dbUpdates.quantity = parseInt(updates.quantity);
  }
  if (updates.kitTypeId !== undefined) {
    dbUpdates.kit_type_id = updates.kitTypeId;
  }

  const { data, error } = await supabase.from('namesets').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: data.id,
    playerName: data.player_name,
    number: data.number,
    season: data.season,
    quantity: data.quantity,
    kitTypeId: data.kit_type_id,
    createdAt: data.created_at,
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

export async function archiveNameset(id) {
  const { data, error } = await supabase
    .from('namesets')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function restoreNameset(id) {
  const { data, error } = await supabase.from('namesets').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;
  return data;
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
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    olxLink: item.olx_link,
    createdAt: item.created_at,
    images: (item.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
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
    type: item.type,
    sizes: item.sizes,
    namesetId: item.nameset_id,
    teamId: item.team_id,
    kitTypeId: item.kit_type_id,
    badgeId: item.badge_id,
    price: item.price,
    olxLink: item.olx_link,
    createdAt: item.created_at,
    images: (item.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
  }));
}

export async function updateProduct(id, updates) {
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
    createdAt: data.created_at,
    images: (data.product_images || []).map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url,
      altText: img.alt_text,
      isPrimary: img.is_primary,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    })),
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
  return data;
}

export async function restoreProduct(id) {
  const { data, error } = await supabase.from('products').update({ archived_at: null }).eq('id', id).select().single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SALES CRUD OPERATIONS
// ============================================================================

export async function createSale(data) {
  // Map frontend data to database schema
  const dbData = {
    product_id: data.productId,
    size: data.size,
    quantity: data.quantity,
    price_sold: data.priceSold,
    customer_name: data.customerName,
    date: data.date, // This will now store the full timestamp
    created_at: data.createdAt || new Date().toISOString(),
  };

  const { data: result, error } = await supabase.from('sales').insert([dbData]).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: result.id,
    productId: result.product_id,
    size: result.size,
    quantity: result.quantity,
    priceSold: result.price_sold,
    customerName: result.customer_name,
    date: result.date,
    createdAt: result.created_at,
  };
}

export async function getSales() {
  const { data, error } = await supabase.from('sales').select('*').order('created_at', { ascending: false });

  if (error) throw error;

  // Map database fields to frontend format
  return (data || []).map((sale) => ({
    id: sale.id,
    productId: sale.product_id,
    size: sale.size,
    quantity: sale.quantity,
    priceSold: sale.price_sold,
    customerName: sale.customer_name,
    date: sale.date,
    createdAt: sale.created_at,
  }));
}

export async function updateSale(id, updates) {
  // Map frontend data to database schema
  const dbUpdates = {};

  if (updates.productId !== undefined) {
    dbUpdates.product_id = updates.productId;
  }
  if (updates.size !== undefined) {
    dbUpdates.size = updates.size;
  }
  if (updates.quantity !== undefined) {
    dbUpdates.quantity = parseInt(updates.quantity);
  }
  if (updates.priceSold !== undefined) {
    dbUpdates.price_sold = parseFloat(updates.priceSold);
  }
  if (updates.customerName !== undefined) {
    dbUpdates.customer_name = updates.customerName;
  }
  if (updates.date !== undefined) {
    dbUpdates.date = updates.date;
  }

  const { data, error } = await supabase.from('sales').update(dbUpdates).eq('id', id).select().single();

  if (error) throw error;

  // Map database response back to frontend format
  return {
    id: data.id,
    productId: data.product_id,
    size: data.size,
    quantity: data.quantity,
    priceSold: data.price_sold,
    customerName: data.customer_name,
    date: data.date,
    createdAt: data.created_at,
  };
}

export async function deleteSale(id) {
  const { error } = await supabase.from('sales').delete().eq('id', id);

  if (error) throw error;
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
  return result || ['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes'];
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
  return result;
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data;
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
