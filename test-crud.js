#!/usr/bin/env node

/**
 * 🧪 CRUD Testing Script - Calcio Stop
 *
 * Acest script testează automat toate operațiile CRUD din aplicația Calcio Stop
 * pentru a verifica că totul funcționează perfect cu baza de date Supabase.
 */

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://myztzothzrsmwxwwfzoc.supabase.co';
const supabaseKey =
  process.env.REACT_APP_SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15enR6b3RoenJzbXd4d3dmem9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTMzMTYsImV4cCI6MjA3NjcyOTMxNn0.AV3q_ENH_JXYo_3Cp67eyhqvEU0-zDEP1GiFNTmr1RM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data - will be populated with actual IDs during tests
const testData = {
  team: { name: `Test Team CRUD ${Date.now()}` },
  kitType: { name: `Test Kit Type CRUD ${Date.now()}` },
  badge: { name: `Test Badge CRUD ${Date.now()}`, season: '2024', quantity: 10 },
  nameset: { playerName: 'Test Player CRUD', number: 10, season: '2024', quantity: 5, kitTypeId: null },
  product: {
    name: 'Test Product CRUD',
    type: 'shirt',
    sizes: ['S', 'M', 'L'],
    price: 50.0,
    teamId: null,
    kitTypeId: null,
    badgeId: null,
    namesetId: null,
  },
  sale: {
    productId: null,
    size: 'M',
    quantity: 1,
    priceSold: 50.0,
    customerName: 'Test Customer CRUD',
    date: new Date().toISOString().split('T')[0],
  },
};

// Store created IDs for relationships
const createdIds = {
  teamId: null,
  kitTypeId: null,
  badgeId: null,
  namesetId: null,
  productId: null,
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

// Helper function to log results
function logTest(testName, success, error = null) {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);

  if (error) {
    console.log(`   Error: ${error.message}`);
  }

  results.tests.push({ name: testName, success, error });
  if (success) results.passed++;
  else results.failed++;
}

// Test functions
async function testTeams() {
  console.log('\n🏈 Testing Teams CRUD...');

  try {
    // Create team
    const { data: createdTeam, error: createError } = await supabase
      .from('teams')
      .insert([{ name: testData.team.name, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (createError) throw createError;
    createdIds.teamId = createdTeam.id; // Store for relationships
    logTest('Create Team', true);

    // Read teams
    const { data: teams, error: readError } = await supabase.from('teams').select('*').eq('name', testData.team.name);

    if (readError) throw readError;
    logTest('Read Teams', teams && teams.length > 0);

    // Update team
    const { data: updatedTeam, error: updateError } = await supabase
      .from('teams')
      .update({ name: 'Updated Test Team CRUD' })
      .eq('id', createdTeam.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Team', true);

    // Archive team (don't delete yet, needed for relationships)
    const { data: archivedTeam, error: archiveError } = await supabase
      .from('teams')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', createdTeam.id)
      .select()
      .single();

    if (archiveError) throw archiveError;
    logTest('Archive Team', true);
  } catch (error) {
    logTest('Teams CRUD', false, error);
  }
}

async function testKitTypes() {
  console.log('\n🏷️ Testing Kit Types CRUD...');

  try {
    // Create kit type
    const { data: createdKitType, error: createError } = await supabase
      .from('kit_types')
      .insert([{ name: testData.kitType.name, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (createError) throw createError;
    createdIds.kitTypeId = createdKitType.id; // Store for relationships
    logTest('Create Kit Type', true);

    // Read kit types
    const { data: kitTypes, error: readError } = await supabase
      .from('kit_types')
      .select('*')
      .eq('name', testData.kitType.name);

    if (readError) throw readError;
    logTest('Read Kit Types', kitTypes && kitTypes.length > 0);

    // Update kit type
    const { data: updatedKitType, error: updateError } = await supabase
      .from('kit_types')
      .update({ name: 'Updated Test Kit Type CRUD' })
      .eq('id', createdKitType.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Kit Type', true);

    // Archive kit type (don't delete yet, needed for relationships)
    const { data: archivedKitType, error: archiveError } = await supabase
      .from('kit_types')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', createdKitType.id)
      .select()
      .single();

    if (archiveError) throw archiveError;
    logTest('Archive Kit Type', true);
  } catch (error) {
    logTest('Kit Types CRUD', false, error);
  }
}

async function testBadges() {
  console.log('\n🏆 Testing Badges CRUD...');

  try {
    // Create badge
    const { data: createdBadge, error: createError } = await supabase
      .from('badges')
      .insert([
        {
          name: testData.badge.name,
          season: testData.badge.season,
          quantity: testData.badge.quantity,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    createdIds.badgeId = createdBadge.id; // Store for relationships
    logTest('Create Badge', true);

    // Read badges
    const { data: badges, error: readError } = await supabase
      .from('badges')
      .select('*')
      .eq('name', testData.badge.name);

    if (readError) throw readError;
    logTest('Read Badges', badges && badges.length > 0);

    // Update badge
    const { data: updatedBadge, error: updateError } = await supabase
      .from('badges')
      .update({ name: 'Updated Test Badge CRUD' })
      .eq('id', createdBadge.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Badge', true);

    // Archive badge (don't delete yet, needed for relationships)
    const { data: archivedBadge, error: archiveError } = await supabase
      .from('badges')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', createdBadge.id)
      .select()
      .single();

    if (archiveError) throw archiveError;
    logTest('Archive Badge', true);
  } catch (error) {
    logTest('Badges CRUD', false, error);
  }
}

async function testNamesets() {
  console.log('\n👕 Testing Namesets CRUD...');

  try {
    // Create nameset with valid kit_type_id
    const { data: createdNameset, error: createError } = await supabase
      .from('namesets')
      .insert([
        {
          player_name: testData.nameset.playerName,
          number: testData.nameset.number,
          season: testData.nameset.season,
          quantity: testData.nameset.quantity,
          kit_type_id: createdIds.kitTypeId, // Use created kit type ID
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    createdIds.namesetId = createdNameset.id; // Store for relationships
    logTest('Create Nameset', true);

    // Read namesets
    const { data: namesets, error: readError } = await supabase
      .from('namesets')
      .select('*')
      .eq('player_name', testData.nameset.playerName);

    if (readError) throw readError;
    logTest('Read Namesets', namesets && namesets.length > 0);

    // Update nameset
    const { data: updatedNameset, error: updateError } = await supabase
      .from('namesets')
      .update({ player_name: 'Updated Test Player CRUD' })
      .eq('id', createdNameset.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Nameset', true);

    // Archive nameset (don't delete yet, needed for relationships)
    const { data: archivedNameset, error: archiveError } = await supabase
      .from('namesets')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', createdNameset.id)
      .select()
      .single();

    if (archiveError) throw archiveError;
    logTest('Archive Nameset', true);
  } catch (error) {
    logTest('Namesets CRUD', false, error);
  }
}

async function testProducts() {
  console.log('\n📦 Testing Products CRUD...');

  try {
    // Create product with valid relationships
    const { data: createdProduct, error: createError } = await supabase
      .from('products')
      .insert([
        {
          name: testData.product.name,
          type: testData.product.type,
          sizes: testData.product.sizes,
          price: testData.product.price,
          team_id: createdIds.teamId, // Use created team ID
          kit_type_id: createdIds.kitTypeId, // Use created kit type ID
          badge_id: createdIds.badgeId, // Use created badge ID
          nameset_id: createdIds.namesetId, // Use created nameset ID
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    createdIds.productId = createdProduct.id; // Store for relationships
    logTest('Create Product', true);

    // Read products
    const { data: products, error: readError } = await supabase
      .from('products')
      .select('*')
      .eq('name', testData.product.name);

    if (readError) throw readError;
    logTest('Read Products', products && products.length > 0);

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ name: 'Updated Test Product CRUD' })
      .eq('id', createdProduct.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Product', true);

    // Archive product (don't delete yet, needed for relationships)
    const { data: archivedProduct, error: archiveError } = await supabase
      .from('products')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', createdProduct.id)
      .select()
      .single();

    if (archiveError) throw archiveError;
    logTest('Archive Product', true);
  } catch (error) {
    logTest('Products CRUD', false, error);
  }
}

async function testSales() {
  console.log('\n💰 Testing Sales CRUD...');

  try {
    // Create sale with valid product_id
    const { data: createdSale, error: createError } = await supabase
      .from('sales')
      .insert([
        {
          product_id: createdIds.productId, // Use created product ID
          size: testData.sale.size,
          quantity: testData.sale.quantity,
          price_sold: testData.sale.priceSold,
          customer_name: testData.sale.customerName,
          date: testData.sale.date,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    logTest('Create Sale', true);

    // Read sales
    const { data: sales, error: readError } = await supabase
      .from('sales')
      .select('*')
      .eq('customer_name', testData.sale.customerName);

    if (readError) throw readError;
    logTest('Read Sales', sales && sales.length > 0);

    // Update sale
    const { data: updatedSale, error: updateError } = await supabase
      .from('sales')
      .update({ customer_name: 'Updated Test Customer CRUD' })
      .eq('id', createdSale.id)
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update Sale', true);

    // Delete sale
    const { error: deleteError } = await supabase.from('sales').delete().eq('id', createdSale.id);

    if (deleteError) throw deleteError;
    logTest('Delete Sale', true);
  } catch (error) {
    logTest('Sales CRUD', false, error);
  }
}

async function testSystemSettings() {
  console.log('\n⚙️ Testing System Settings...');

  try {
    // Read settings
    const { data: settings, error: readError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'registration_enabled');

    if (readError) throw readError;
    logTest('Read System Settings', settings && settings.length > 0);

    // Update settings using upsert to avoid duplicate key errors
    const { data: updatedSettings, error: updateError } = await supabase
      .from('settings')
      .upsert({ key: 'registration_enabled', value: true }, { onConflict: 'key' })
      .select()
      .single();

    if (updateError) throw updateError;
    logTest('Update System Settings', true);
  } catch (error) {
    logTest('System Settings', false, error);
  }
}

// Clean up function
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...\n');

  try {
    // Delete all test data in reverse order
    await supabase.from('sales').delete().like('customer_name', '%CRUD%');
    await supabase.from('products').delete().like('name', '%CRUD%');
    await supabase.from('namesets').delete().like('player_name', '%CRUD%');
    await supabase.from('badges').delete().like('name', '%CRUD%');
    await supabase.from('kit_types').delete().like('name', '%CRUD%');
    await supabase.from('teams').delete().like('name', '%CRUD%');

    console.log('✅ Cleanup completed\n');
  } catch (error) {
    console.log('⚠️  Cleanup had some issues, but continuing...\n');
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Starting CRUD Tests for Calcio Stop...\n');

  // Clean up any existing test data first
  await cleanupTestData();

  // Run tests in correct order to satisfy foreign key constraints
  await testTeams();
  await testKitTypes();
  await testBadges();
  await testNamesets();
  await testProducts();
  await testSales();
  await testSystemSettings();

  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter((test) => !test.success)
      .forEach((test) => {
        console.log(`   - ${test.name}: ${test.error?.message || 'Unknown error'}`);
      });
  }

  console.log('\n🎯 Test completed!');

  if (results.failed === 0) {
    console.log('🎉 All tests passed! Your CRUD operations are working perfectly!');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run tests
runTests().catch(console.error);
