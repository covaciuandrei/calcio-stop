# Calcio Stop — Application Code Map

## 1. Overview

**Calcio Stop** is a React + TypeScript inventory management application for a football (soccer) shirt retail business. It uses **Supabase** as the backend (database, auth, storage) and **Zustand** for client-side state management. The app has two areas:

- **Public site** (`/`, `/products`, `/badges`) — read-only product catalog viewable without authentication.
- **Admin panel** (`/admin/*`) — full CRUD management behind Supabase authentication.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (CRA) |
| Language | TypeScript + JavaScript (lib layer is `.js`) |
| Routing | React Router v6 |
| State | Zustand (with devtools & persist middleware) |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Styling | CSS Modules + plain CSS |

---

## 3. Directory Structure

```
src/
├── App.tsx                    # Root component, all route definitions
├── components/
│   ├── admin/                 # StatsDashboard, SystemSettings
│   ├── auth/                  # AuthGuard, AuthPage, LoginForm, RegisterForm, UserMenu
│   ├── badges/                # Badge CRUD components (12 files)
│   ├── inventory/             # InventoryHistoryButton, InventoryHistoryModal, InventoryLogsPage
│   ├── kittypes/              # Kit type CRUD components (8 files)
│   ├── leagues/               # League CRUD components (8 files)
│   ├── namesets/              # Nameset CRUD components
│   ├── orders/                # OrdersPage
│   ├── products/              # Product CRUD + detail page
│   ├── public/                # PublicLayout, PublicDashboard, PublicProductsPage, PublicBadgesPage
│   ├── reservations/          # ReservationsPage
│   ├── returns/               # ReturnsPage
│   ├── sales/                 # SalesPage
│   ├── shared/                # CollapsibleHeader, SettingsPopup, TableListCard
│   ├── suppliers/             # SuppliersPage
│   ├── teams/                 # TeamsPage
│   ├── Dashboard.tsx          # Main admin dashboard (lazy-loaded cards)
│   └── Dashboard.lazy.tsx     # React.lazy wrappers for dashboard sub-pages
├── hooks/
│   ├── useBadgeImages.ts
│   ├── useErrorToast.ts
│   ├── useLazyDashboardData.ts
│   ├── useRouteData.ts        # Route-based data loading with global cache
│   ├── useScrollPosition.ts
│   └── useToast.ts
├── lib/
│   ├── supabaseClient.js      # Supabase client init (env vars)
│   ├── db.js                  # ALL database CRUD operations (~4900 lines)
│   ├── inventoryLog.js        # Inventory audit logging utilities
│   └── statsService.ts        # Statistics & analytics queries
├── stores/
│   ├── index.ts               # Barrel export for all stores
│   ├── authStore.ts           # Auth state (login, register, logout, persist)
│   ├── productsStore.ts       # Products state & actions
│   ├── salesStore.ts          # Sales state & actions
│   ├── returnsStore.ts        # Returns state & actions
│   ├── ordersStore.ts         # Orders state & actions
│   ├── reservationsStore.ts   # Reservations state & actions
│   ├── badgesStore.ts         # Badges state & actions
│   ├── namesetsStore.ts       # Namesets state & actions
│   ├── teamsStore.ts          # Teams state & actions
│   ├── kitTypesStore.ts       # Kit types state & actions
│   ├── leaguesStore.ts        # Leagues state & actions
│   ├── suppliersStore.ts      # Sellers & product links state
│   ├── settingsStore.ts       # App bar / dashboard order settings
│   ├── systemStore.ts         # System settings (registration toggle)
│   └── uiStore.ts             # Theme, modals, notifications, search terms
├── types/
│   ├── index.ts               # Barrel export
│   ├── products/product.ts    # Product, ProductImage, ProductSizeQuantity, ProductType
│   ├── sales/sale.ts          # Sale, SaleItem, SaleType
│   ├── returns/return.ts      # Return, ReturnItem
│   ├── orders/order.ts        # Order, OrderItem, OrderStatus, ORDER_STATUS_TRANSITIONS
│   ├── reservations/reservation.ts # Reservation, ReservationItem
│   ├── badges/badge.ts        # Badge, BadgeImage
│   ├── namesets/nameset.ts    # Nameset, NamesetImage
│   ├── teams/team.ts          # Team (leagues as JSONB array of IDs)
│   ├── leagues/league.ts      # League
│   ├── kittypes/kittype.ts    # KitType
│   ├── suppliers/seller.ts    # Seller
│   ├── suppliers/productLink.ts # ProductLink
│   └── inventory/inventoryLog.ts # InventoryLog, CreateInventoryLogInput, InventoryLogFilters
├── constants/
│   └── kitTypes.ts
└── images/
    └── background.jpg
supabase/
├── schema.sql                 # Full database DDL (tables, indexes, RLS, seed data)
└── rls_policies.sql           # Additional RLS policies
```

---

## 4. Routing Map

### 4.1 Public Routes (no auth)

| Path | Component | Description |
|---|---|---|
| `/` | `PublicLayout` → `PublicDashboard` | Home page — products + badges overview (read-only) |
| `/products` | `PublicLayout` → `PublicProductsPage` | Full product catalog |
| `/products/:id` | `PublicLayout` → `ProductDetailPage` | Single product detail |
| `/badges` | `PublicLayout` → `PublicBadgesPage` | Badge catalog |
| `/badges/:id` | `PublicLayout` → `BadgeDetailPage` | Single badge detail |
| `/namesets/:id` | `PublicLayout` → `NamesetDetailPage` | Single nameset detail |

### 4.2 Admin Routes (behind `AuthGuard`)

| Path | Component | Admin-only? | Description |
|---|---|---|---|
| `/admin` | `Dashboard` | No | Main dashboard with collapsible cards |
| `/admin/products` | `ProductsPage` | No | Product CRUD |
| `/admin/products/:id` | `ProductDetailPage` | No | Product detail/edit |
| `/admin/sales` | `SalesPage` | No | Sales CRUD |
| `/admin/returns` | `ReturnsPage` | No | Returns CRUD |
| `/admin/orders` | `OrdersPage` | No | Order management with status workflow |
| `/admin/namesets` | `NamesetsPage` | No | Nameset CRUD |
| `/admin/namesets/:id` | `NamesetDetailPage` | No | Nameset detail |
| `/admin/teams` | `TeamsPage` | No | Team CRUD |
| `/admin/badges` | `BadgesPage` | No | Badge CRUD |
| `/admin/badges/:id` | `BadgeDetailPage` | No | Badge detail |
| `/admin/kittypes` | `KitTypesPage` | No | Kit type CRUD |
| `/admin/suppliers` | `SuppliersPage` | **Yes** | Seller & product link management |
| `/admin/reservations` | `ReservationsPage` | **Yes** | Reservation management |
| `/admin/inventory-logs` | `InventoryLogsPage` | **Yes** | Inventory audit log viewer |
| `/admin/stats` | `StatsDashboard` | No | Sales & inventory statistics |
| `/admin/settings` | `SystemSettings` | No | System settings (registration toggle) |

---

## 5. Database Schema (Supabase / PostgreSQL)

### 5.1 Tables

| Table | Key Columns | Notes |
|---|---|---|
| `teams` | `id`, `name`, `leagues` (JSONB), `archived_at` | Leagues stored as JSONB array of IDs |
| `kit_types` | `id`, `name` (UNIQUE), `archived_at` | Default: 1st Kit, 2nd Kit, 3rd Kit, None |
| `badges` | `id`, `name`, `season`, `quantity`, `price`, `location`, `archived_at` | Standalone inventory item |
| `namesets` | `id`, `player_name`, `number`, `season`, `quantity`, `price`, `kit_type_id` (FK), `location`, `archived_at` | Player name/number sets |
| `products` | `id`, `name`, `type`, `sizes` (JSONB), `nameset_id`, `team_id`, `kit_type_id`, `badge_id`, `price`, `olx_link`, `location`, `is_on_sale`, `sale_price`, `archived_at` | Core entity; `sizes` = `[{size, quantity}]` |
| `product_images` | `id`, `product_id` (FK CASCADE), `image_url`, `thumbnail_url`, `medium_url`, `large_url`, `is_primary`, `display_order` | Multi-resolution images |
| `badge_images` | Same pattern as `product_images` | For badges |
| `nameset_images` | Same pattern as `product_images` | For namesets |
| `sales` | `id`, `product_id` (FK), `size`, `quantity`, `price_sold`, `customer_name`, `date`, `sale_type`, `items` (JSONB, added later) | Legacy single-item + new multi-item format |
| `returns` | `id`, `items` (JSONB), `customer_name`, `date`, `sale_type`, `original_sale_id` | Links back to original sale |
| `orders` | `id`, `items` (JSONB), `status`, `sale_type`, `customer_name`, `phone_number`, `archived_at`, `finished_at`, `sale_id` (FK) | Status workflow: to order → ordered → received → message sent → finished |
| `reservations` | `id`, `items` (JSONB), `customer_name`, `expiring_date`, `location`, `date_time`, `sale_type`, `status`, `completed_at` | Status: pending / completed |
| `settings` | `id`, `key` (UNIQUE), `value` (JSONB) | Key-value config store |
| `views` | `id`, `product_id` (FK CASCADE), `timestamp` | Product page view tracking |
| `leagues` | `id`, `name`, `archived_at` | Championships/competitions |
| `users` | `id`, `email` (UNIQUE), `name`, `role` | Roles: admin, user, manager |
| `sellers` | `id`, `name`, `website_url`, `special_notes`, `archived_at` | Supplier entities |
| `seller_products` | `seller_id`, `product_id` (composite PK) | M:N join table |
| `product_links` | `id`, `product_id` (FK CASCADE), `seller_id` (FK SET NULL), `url`, `label` | External URLs for products |
| `inventory_logs` | `id`, `entity_type`, `entity_id`, `entity_name`, `size`, `change_type`, `quantity_before`, `quantity_change`, `quantity_after`, `reason`, `reference_id`, `reference_type` | Full audit trail |

### 5.2 Key Relationships

```
teams.leagues[] ──(JSONB IDs)──► leagues
products.team_id ──► teams
products.kit_type_id ──► kit_types
products.nameset_id ──► namesets
products.badge_id ──► badges
namesets.kit_type_id ──► kit_types
product_images.product_id ──► products (CASCADE)
badge_images.badge_id ──► badges (CASCADE)
nameset_images.nameset_id ──► namesets (CASCADE)
sales.product_id ──► products (legacy single-item)
sales.items[] ──(JSONB)──► products (new multi-item)
returns.original_sale_id ──► sales
orders.sale_id ──► sales (auto-created on finish)
orders.items[] ──(JSONB)──► products
reservations.items[] ──(JSONB)──► products
seller_products ──► sellers, products (M:N)
product_links ──► products (CASCADE), sellers (SET NULL)
inventory_logs.entity_id ──► products | namesets | badges (polymorphic)
views.product_id ──► products (CASCADE)
```

---

## 6. State Management (Zustand Stores)

All stores follow the same pattern: state + actions + selectors, wrapped in `devtools()`.

| Store | File | Key State | Key Actions |
|---|---|---|---|
| `authStore` | `authStore.ts` | `user`, `isAuthenticated`, `isLoading` | `login`, `register`, `logout`, `initializeAuth` |
| `productsStore` | `productsStore.ts` | `products[]`, `archivedProducts[]` | `loadProducts`, `addProduct`, `updateProduct`, `deleteProduct`, `archiveProduct`, `restoreProduct` |
| `salesStore` | `salesStore.ts` | `sales[]`, filters | `loadSales`, `addSale`, `updateSale`, `deleteSale`, `reverseSale` |
| `returnsStore` | `returnsStore.ts` | `returns[]`, filters | `loadReturns`, `addReturn`, `deleteReturn`, `returnSale` |
| `ordersStore` | `ordersStore.ts` | `orders[]`, `archivedOrders[]` | `loadOrders`, `addOrder`, `updateOrder`, `deleteOrder`, `archiveOrder` |
| `reservationsStore` | `reservationsStore.ts` | `reservations[]` | `loadReservations`, `addReservation`, `updateReservation`, `deleteReservation`, `completeReservation` |
| `badgesStore` | `badgesStore.ts` | `badges[]`, `archivedBadges[]` | `loadBadges`, `addBadge`, `updateBadge`, `deleteBadge`, `archiveBadge`, `restoreBadge` |
| `namesetsStore` | `namesetsStore.ts` | `namesets[]`, `archivedNamesets[]` | `loadNamesets`, `addNameset`, `updateNameset`, `deleteNameset` |
| `teamsStore` | `teamsStore.ts` | `teams[]`, `archivedTeams[]` | `loadTeams`, `addTeam`, `updateTeam`, `deleteTeam`, `archiveTeam`, `restoreTeam` |
| `kitTypesStore` | `kitTypesStore.ts` | `kitTypes[]`, `archivedKitTypes[]` | `loadKitTypes`, `addKitType`, `updateKitType`, `deleteKitType` |
| `leaguesStore` | `leaguesStore.ts` | `leagues[]`, `archivedLeagues[]` | `loadLeagues`, `addLeague`, `updateLeague`, `deleteLeague`, `archiveLeague`, `restoreLeague` |
| `suppliersStore` | `suppliersStore.ts` | `sellers[]`, `productLinks[]` | `loadSellers`, `addSeller`, `updateSeller`, `deleteSeller`, `loadProductLinks` |
| `settingsStore` | `settingsStore.ts` | `appBarOrder[]`, `dashboardOrder[]` | `loadSettings`, `setAppBarOrder`, `setDashboardOrder` |
| `systemStore` | `systemStore.ts` | `registrationEnabled` | `loadSettings`, `setRegistrationEnabled` |
| `uiStore` | `uiStore.ts` | `theme`, `modal`, `notifications[]`, `searchTerms` | `setTheme`, `openModal`, `addNotification`, `setSearchTerm` |

**Auth persistence**: `authStore` uses Zustand's `persist` middleware, saving `user` and `isAuthenticated` to `localStorage` under key `auth-persist`.

---

## 7. Data Access Layer (`src/lib/db.js`)

Central ~4900-line file containing **all** Supabase queries. Key patterns:

- **snake_case ↔ camelCase mapping**: Every function maps DB columns to frontend format and vice versa.
- **Inventory adjustments**: Sales, returns, reservations, and orders all update `products.sizes[].quantity` and call `logInventoryChanges()`.
- **Backward compatibility**: Sales/returns handle both legacy single-item (`product_id`, `size`, `quantity`, `price_sold`) and new multi-item (`items` JSONB array) formats.
- **Soft deletion**: Products, badges, namesets, teams, kit types, leagues, sellers, and orders use `archived_at` timestamps.
- **Order status machine**: `ORDER_STATUS_TRANSITIONS` enforces: `to order → ordered → received → message sent → finished`. Finishing an order auto-creates a sale.

### Key function groups:

| Entity | Functions |
|---|---|
| Products | `createProduct`, `getProducts`, `getArchivedProducts`, `updateProduct`, `deleteProduct`, `archiveProduct`, `restoreProduct` |
| Sales | `createSale`, `getSales`, `updateSale`, `deleteSale`, `reverseSale` |
| Returns | `createReturn`, `getReturns`, `deleteReturn`, `returnSale` |
| Reservations | `createReservation`, `getReservations`, `updateReservation`, `deleteReservation`, `completeReservation` |
| Orders | `addOrder`, `getOrders`, `getArchivedOrders`, `updateOrder`, `deleteOrder`, `archiveOrder`, `unarchiveOrder` |
| Badges | `createBadge`, `getBadges`, `getArchivedBadges`, `updateBadge`, `deleteBadge`, `archiveBadge`, `restoreBadge` |
| Namesets | `createNameset`, `getNamesets`, `getArchivedNamesets`, `updateNameset`, `deleteNameset`, `archiveNameset`, `restoreNameset` |
| Teams | `createTeam`, `getTeams`, `getArchivedTeams`, `updateTeam`, `deleteTeam`, `archiveTeam`, `restoreTeam` |
| Kit Types | `createKitType`, `getKitTypes`, `getArchivedKitTypes`, `updateKitType`, `deleteKitType`, `archiveKitType`, `restoreKitType` |
| Leagues | `createLeague`, `getLeagues`, `getArchivedLeagues`, `updateLeague`, `deleteLeague`, `archiveLeague`, `restoreLeague` |
| Sellers | `createSeller`, `getSellers`, `getSellerById`, `getArchivedSellers`, `updateSeller`, `deleteSeller`, `archiveSeller`, `restoreSeller` |
| Product Links | `createProductLink`, `getProductLinks`, `getProductLinksByProductId`, `getProductLinksBySellerId`, `updateProductLink`, `deleteProductLink` |
| Settings | `getSetting`, `setSetting`, `getAppBarOrder`, `setAppBarOrder`, `getDashboardOrder`, `setDashboardOrder` |
| System | `getSystemSetting`, `setSystemSetting`, `isRegistrationEnabled`, `setRegistrationEnabled` |
| Users | `createUser`, `getUserByEmail`, `updateUser`, `deleteUser` |
| Team↔League | `getTeamLeagues`, `getLeagueTeams`, `setTeamLeagues`, `addTeamToLeague`, `removeTeamFromLeague` |

---

## 8. Inventory Logging (`src/lib/inventoryLog.js`)

Provides audit trail for all quantity changes:

| Function | Purpose |
|---|---|
| `logInventoryChange(data)` | Log a single change (non-throwing on failure) |
| `logInventoryChanges(changes)` | Batch log multiple changes |
| `getInventoryHistory(entityType, entityId, limit)` | Get history for a specific product/nameset/badge |
| `getInventoryLogs(filters)` | Query logs with filters (entityType, changeType, date range) |
| `cleanupOldLogs(monthsOld)` | Delete logs older than N months (default 18) |
| `logInitialInventory()` | One-time snapshot of all current inventory |

**Change types**: `sale`, `sale_edit`, `sale_reversal`, `return`, `return_reversal`, `manual_adjustment`, `initial_stock`, `restock`, `order_received`, `order_reversed`

---

## 9. Statistics Service (`src/lib/statsService.ts`)

`StatsService` class providing dashboard analytics:

- `trackProductView(productId)` — inserts into `views` table
- `getDashboardStats(dateRange?)` — total sales, revenue, products sold, views, low/no stock counts
- `getSalesStats(dateRange?)` — monthly sales/revenue breakdown
- `getTopSoldProducts(limit, dateRange?)` — best sellers
- `getTopViewedShirts(limit, dateRange?)` — most viewed
- `getLowStockProducts(threshold)` — products with stock ≤ threshold
- `getNoStockProducts()` — completely out of stock
- `getShirtStockStats()` — total stock breakdown by size
- `getShirtStockByTeam()` — stock grouped by team

---

## 10. Authentication Flow

1. `App.tsx` wraps admin routes in `<AuthGuard>`.
2. `AuthGuard` calls `initializeAuth()` on mount → checks `supabase.auth.getUser()`.
3. If no session → renders `<AuthPage>` (login/register forms).
4. On login → `supabase.auth.signInWithPassword()` → stores user in Zustand + localStorage.
5. Registration can be toggled via `SystemSettings` → `system_settings.registration_enabled`.
6. All users are assigned `role: 'admin'` on login (hardcoded in `authStore.ts`).
7. **Roles**: `admin`, `user`, `manager` — only `admin` sees Suppliers, Reservations, Inventory Logs nav items and routes.

---

## 11. Key Architectural Patterns

- **Component pattern**: Each entity has `*Page`, `*TableList`, `*TableListCard`, `Add*Form`, `Edit*Modal`, `Archived*`, `*DetailPage` components.
- **Lazy dashboard**: `Dashboard.tsx` uses `useLazyDashboardData` hook to load data only when a card is expanded.
- **Route-based data loading**: `useRouteData` hook loads only the stores relevant to the current route, with global dedup to prevent duplicate requests.
- **Customizable layout**: App bar order and dashboard card order are stored in `settings` table and editable via `SettingsPopup`.
- **Search**: Per-entity search terms stored in `uiStore.searchTerms`, used for client-side filtering.
- **Archiving**: Soft-delete pattern used across products, badges, namesets, teams, kit types, leagues, sellers, and orders.
- **Product types**: `shirt`, `shorts`, `kid kit`, `adult kit` — each with different size options (adult: S/M/L/XL/XXL, kid: 22/24/26/28).
- **Sale types**: `OLX`, `IN-PERSON`, `VINTED` — used across sales, returns, orders, and reservations.

---

## 12. Environment Configuration

Required `.env` variables:
```
REACT_APP_SUPABASE_URL=<your-supabase-project-url>
REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## 13. Build & Deploy

- **Build**: Standard CRA build (`react-scripts build`)
- **Deploy**: Netlify (evidenced by `public/_redirects` file)
- **Redirects**: `_redirects` handles SPA routing for Netlify
