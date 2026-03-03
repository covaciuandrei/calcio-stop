# Calcio Stop — Manual Test Plan

## How to Use This Document

Each section covers a functional area. Tests are numbered `AREA-NNN`. For each test:
- **Preconditions** state what must be true before starting.
- **Steps** are numbered actions to perform.
- **Expected** describes the correct outcome.
- **Severity**: 🔴 Critical · 🟡 Major · 🟢 Minor

---

## 1. Authentication

### AUTH-001: Login with valid credentials 🔴
**Preconditions**: User has a registered Supabase account. Not currently logged in.
**Steps**:
1. Navigate to `/admin`.
2. Enter valid email and password.
3. Click **Login**.
**Expected**: Redirected to `/admin` dashboard. User name and role visible in the UserMenu icon. Browser tab title shows "Dashboard — Calcio Stop".

### AUTH-002: Login with invalid credentials 🔴
**Steps**:
1. Navigate to `/admin`.
2. Enter an incorrect email or password.
3. Click **Login**.
**Expected**: Error message displayed (e.g., "Invalid login credentials"). User remains on login page.

### AUTH-003: Registration when enabled 🟡
**Preconditions**: Registration is enabled in System Settings.
**Steps**:
1. Navigate to `/admin`.
2. Switch to the Register form.
3. Enter a new email, password, and name.
4. Click **Register**.
**Expected**: If email confirmation is required, a message instructs user to check email. Otherwise, user is auto-logged in and redirected to dashboard.

### AUTH-004: Registration when disabled 🟡
**Preconditions**: Registration is disabled in System Settings.
**Steps**:
1. Navigate to `/admin`.
2. Attempt to switch to Register form.
**Expected**: Registration form is not available or submission is blocked with an appropriate message.

### AUTH-005: Logout 🔴
**Steps**:
1. While logged in, click the user profile icon in the navbar.
2. Click **Logout**.
**Expected**: User is redirected to the login page. Auth state cleared from localStorage. Navigating to `/admin` shows the login form.

### AUTH-006: Session persistence across refresh 🟡
**Steps**:
1. Log in successfully.
2. Refresh the browser (F5).
**Expected**: User remains logged in. Dashboard loads without showing the login form.

### AUTH-007: Auth initialization loading state 🟢
**Steps**:
1. Clear localStorage and navigate to `/admin`.
**Expected**: A brief "Loading..." indicator appears while auth state is checked, then the login page is shown.

---

## 2. Public Site

### PUB-001: Public home page loads 🔴
**Steps**:
1. Navigate to `/`.
**Expected**: Public dashboard displays a products list and badges list (read-only, no edit/delete buttons). Navbar shows "Home", "Products", "Badges" links.

### PUB-002: Public products page 🟡
**Steps**:
1. Navigate to `/products`.
**Expected**: Full product catalog displayed. No add/edit/delete actions visible. Products show images, name, team, price.

### PUB-003: Public product detail 🟡
**Steps**:
1. Navigate to `/products`.
2. Click on a product.
**Expected**: Product detail page shows all product info (images, sizes, price, team, kit type, badge, nameset). No edit controls. View is tracked (view count incremented in DB).

### PUB-004: Public badges page 🟡
**Steps**:
1. Navigate to `/badges`.
**Expected**: Badge catalog displayed in read-only mode.

### PUB-005: Public badge detail 🟢
**Steps**:
1. Click on a badge from `/badges`.
**Expected**: Badge detail page shows name, season, quantity, price, images.

### PUB-006: Public site has no auth requirement 🔴
**Steps**:
1. Clear all cookies/localStorage.
2. Navigate to `/`, `/products`, `/badges`.
**Expected**: All pages load without any login prompt.

---

## 3. Products (Admin)

### PROD-001: View products list 🔴
**Preconditions**: Logged in as admin.
**Steps**:
1. Navigate to `/admin/products`.
**Expected**: Product table/list displayed with name, team, type, sizes, price, sale status. Add button visible.

### PROD-002: Create a new product 🔴
**Steps**:
1. Click **Add Product**.
2. Fill in: name, type (e.g. "shirt"), team, kit type, sizes with quantities, price.
3. Upload at least one image.
4. Click **Save**.
**Expected**: Product appears in the list. Sizes show correct quantities. Image displays correctly. Product also appears on the public site.

### PROD-003: Edit a product 🔴
**Steps**:
1. Click edit on an existing product.
2. Change the name and adjust a size quantity.
3. Save.
**Expected**: Product list reflects updated name and quantity.

### PROD-004: Delete a product 🟡
**Preconditions**: Product has no references in active sales/orders.
**Steps**:
1. Click delete on a product.
2. Confirm deletion.
**Expected**: Product removed from list permanently.

### PROD-005: Archive a product 🟡
**Steps**:
1. Click archive on a product.
**Expected**: Product disappears from the active list. Appears in the archived products section.

### PROD-006: Restore an archived product 🟡
**Steps**:
1. Navigate to archived products.
2. Click restore on an archived product.
**Expected**: Product reappears in the active products list.

### PROD-007: Product with sale price 🟢
**Steps**:
1. Edit a product and toggle "On Sale".
2. Set a sale price lower than the regular price.
3. Save.
**Expected**: Product shows sale indicator and sale price in the list and detail views.

### PROD-008: Product image management 🟡
**Steps**:
1. Open product detail/edit.
2. Upload multiple images.
3. Set one as primary.
4. Reorder display order.
5. Delete a non-primary image.
**Expected**: Images display in correct order. Primary image is shown as thumbnail. Deleted image is removed.

### PROD-009: Product detail page 🟢
**Steps**:
1. Click on a product name to view details.
**Expected**: Full detail page shows all fields: images (with gallery), sizes table, team, kit type, nameset, badge, OLX link, location, price/sale price.

### PROD-010: Product size types by product type 🟢
**Steps**:
1. Create a product of type "shirt" → should offer adult sizes (S, M, L, XL, XXL).
2. Create a product of type "kid kit" → should offer kid sizes (22, 24, 26, 28).
**Expected**: Size options match the product type.

---

## 4. Sales

### SALE-001: Create a sale 🔴
**Preconditions**: At least one product exists with stock > 0.
**Steps**:
1. Navigate to `/admin/sales`.
2. Click **Add Sale**.
3. Select a product, size, quantity, enter customer name, sale type (OLX/IN-PERSON/VINTED), date.
4. Save.
**Expected**: Sale appears in the list. Product inventory for the selected size is decremented by the quantity sold. Inventory log entry created.

### SALE-002: Multi-item sale 🔴
**Steps**:
1. Create a sale with 2+ different products/sizes.
2. Save.
**Expected**: Sale shows all items. Each product's inventory is decremented correctly.

### SALE-003: Edit a sale 🟡
**Steps**:
1. Edit an existing sale — change quantity from 2 to 1.
2. Save.
**Expected**: Inventory is adjusted (1 unit restored). Sale reflects updated quantity. Inventory log shows `sale_edit`.

### SALE-004: Delete a sale 🟡
**Steps**:
1. Delete a sale.
2. Confirm.
**Expected**: Sale removed from list. Product inventory restored to pre-sale quantities. Inventory log shows `sale_reversal`.

### SALE-005: Reverse a sale 🟡
**Steps**:
1. Use the reverse/undo action on a sale.
**Expected**: Product inventory restored. Sale marked or removed. Inventory log entry created.

### SALE-006: Sale with insufficient stock 🔴
**Steps**:
1. Try to create a sale for a product/size with 0 stock.
**Expected**: Error message displayed. Sale is not created. Inventory unchanged.

---

## 5. Returns

### RET-001: Create a return from a sale 🔴
**Steps**:
1. Navigate to `/admin/returns`.
2. Click **Return Sale** or create a return linked to an existing sale.
3. Select items to return.
4. Save.
**Expected**: Return appears in the list with `originalSaleId` set. Product inventory for returned items is incremented. Inventory log entry with type `return`.

### RET-002: Create a standalone return 🟡
**Steps**:
1. Create a return without linking to an existing sale.
2. Enter product, size, quantity, customer name, sale type, date.
3. Save.
**Expected**: Return created with `originalSaleId = null`. Inventory updated.

### RET-003: Delete a return 🟡
**Steps**:
1. Delete an existing return.
**Expected**: Return removed. Inventory decremented back (return reversal). Inventory log entry with type `return_reversal`.

---

## 6. Orders

### ORD-001: Create a new order 🔴
**Steps**:
1. Navigate to `/admin/orders`.
2. Click **Add Order**.
3. Add items (product, size, quantity, price), set sale type.
4. Save.
**Expected**: Order created with status "to order". No inventory changes yet.

### ORD-002: Status transition: to order → ordered 🔴
**Steps**:
1. Change order status from "to order" to "ordered".
**Expected**: Status updated. No inventory changes.

### ORD-003: Status transition: ordered → received 🔴
**Steps**:
1. Change order status from "ordered" to "received".
**Expected**: Status updated. Product inventory **increased** for each item in the order. Inventory log entries with type `order_received`.

### ORD-004: Status transition: received → message sent 🟡
**Steps**:
1. Change status from "received" to "message sent".
**Expected**: Status updated. No inventory changes.

### ORD-005: Status transition: message sent → finished 🔴
**Preconditions**: Order has customer name and phone number filled in.
**Steps**:
1. Fill in customer name and phone number if not set.
2. Change status to "finished".
**Expected**: Status set to "finished". `finished_at` timestamp set. A **sale is auto-created** with the order's items. Product inventory **decremented** for each item. Order gets `sale_id` reference.

### ORD-006: Finish order without required fields 🟡
**Steps**:
1. Try to finish an order without customer name or phone number.
**Expected**: Validation errors displayed. Status does not change.

### ORD-007: Invalid status transition 🟡
**Steps**:
1. Try to change status from "to order" directly to "received" (skipping "ordered").
**Expected**: Transition rejected. Error or no change.

### ORD-008: Archive an order 🟢
**Steps**:
1. Archive a finished or cancelled order.
**Expected**: Order moves to archived list. Can be unarchived.

### ORD-009: Delete an order 🟡
**Steps**:
1. Delete an order that was in "received" status.
**Expected**: Order deleted. If it was received, inventory is reversed (decremented back).

---

## 7. Reservations (Admin-only)

### RES-001: Create a reservation 🔴
**Preconditions**: Logged in as admin. Product with available stock exists.
**Steps**:
1. Navigate to `/admin/reservations`.
2. Click **Add Reservation**.
3. Select product, size, quantity, customer name, expiring date, sale type.
4. Save.
**Expected**: Reservation created with status "pending". Product inventory **immediately decremented** for reserved items. Inventory log created.

### RES-002: Complete a reservation 🔴
**Steps**:
1. Click complete on a pending reservation.
**Expected**: Reservation status changes to "completed". `completed_at` set. A **sale is auto-created** from the reservation items. No additional inventory change (already deducted on creation).

### RES-003: Delete/Cancel a reservation 🟡
**Steps**:
1. Delete a pending reservation.
**Expected**: Reservation removed. Product inventory **restored** (incremented back). Inventory log created.

### RES-004: Reservation visible only to admins 🟡
**Steps**:
1. Log in as a non-admin user (if role differentiation works).
2. Check if `/admin/reservations` is accessible.
**Expected**: Reservations nav item hidden. Direct URL navigation should not render the page.

---

## 8. Badges

### BDG-001: Create a badge 🔴
**Steps**:
1. Navigate to `/admin/badges`.
2. Click **Add Badge**.
3. Enter name, season, quantity, price, location.
4. Upload image.
5. Save.
**Expected**: Badge appears in list and on public badges page.

### BDG-002: Edit a badge 🟡
**Steps**:
1. Edit a badge — change quantity and price.
2. Save.
**Expected**: Updated values reflected in list.

### BDG-003: Archive/Restore a badge 🟡
**Steps**:
1. Archive a badge. Verify it moves to archived list.
2. Restore it. Verify it returns to active list.
**Expected**: Correct behavior in both directions.

### BDG-004: Badge detail page 🟢
**Steps**:
1. Click on a badge to view detail.
**Expected**: Shows name, season, quantity, price, location, images.

### BDG-005: Badge image management 🟢
**Steps**:
1. Upload multiple images to a badge.
2. Set primary, reorder, delete one.
**Expected**: Images behave as expected.

---

## 9. Namesets

### NMS-001: Create a nameset 🔴
**Steps**:
1. Navigate to `/admin/namesets`.
2. Add a nameset: player name, number, season, quantity, price, kit type.
3. Save.
**Expected**: Nameset appears in list with correct details.

### NMS-002: Edit a nameset 🟡
**Steps**:
1. Edit a nameset — change quantity.
2. Save.
**Expected**: Updated quantity reflected.

### NMS-003: Nameset detail page 🟢
**Steps**:
1. Click on a nameset to view detail.
**Expected**: Shows player name, number, season, kit type, quantity, price, images.

### NMS-004: Archive/Restore a nameset 🟡
**Steps**: Archive and restore. Verify correct list placement each time.

---

## 10. Teams

### TEAM-001: Create a team 🔴
**Steps**:
1. Navigate to `/admin/teams`.
2. Add a team with name.
3. Assign leagues to the team.
4. Save.
**Expected**: Team appears in list with assigned leagues.

### TEAM-002: Edit a team 🟡
**Steps**:
1. Edit a team — change name, add/remove leagues.
2. Save.
**Expected**: Changes reflected. League associations updated in the `teams.leagues` JSONB array.

### TEAM-003: Delete a team 🟡
**Preconditions**: Team has no products referencing it.
**Steps**:
1. Delete the team.
**Expected**: Team removed.

### TEAM-004: Delete team with products 🟡
**Steps**:
1. Try to delete a team that has products assigned.
**Expected**: Error message. Deletion blocked.

### TEAM-005: Archive/Restore a team 🟢
**Steps**: Archive and restore. Verify correct list placement.

---

## 11. Kit Types

### KIT-001: Create a kit type 🟡
**Steps**:
1. Navigate to `/admin/kittypes`.
2. Add a new kit type (e.g., "Retro Kit").
3. Save.
**Expected**: Kit type appears in list and is available in product/nameset dropdowns.

### KIT-002: Duplicate kit type name 🟡
**Steps**:
1. Try to create a kit type with a name that already exists.
**Expected**: Error message about duplicate name.

### KIT-003: Delete a kit type 🟡
**Preconditions**: Kit type not referenced by any product or nameset.
**Steps**: Delete the kit type.
**Expected**: Removed from list.

### KIT-004: Archive/Restore a kit type 🟢
**Steps**: Archive and restore. Verify correct behavior.

---

## 12. Leagues

### LGE-001: Create a league 🟡
**Steps**:
1. Navigate to `/admin` > Leagues section (via dashboard).
2. Add a league (e.g., "Champions League").
3. Save.
**Expected**: League appears in list and is available in team league pickers.

### LGE-002: Duplicate league name 🟡
**Steps**:
1. Try to create a league with an existing name.
**Expected**: Error message about uniqueness.

### LGE-003: Delete a league 🟡
**Preconditions**: League is not assigned to any team.
**Steps**: Delete the league.
**Expected**: Removed from list.

### LGE-004: Delete league assigned to teams 🟡
**Steps**:
1. Try to delete a league that is assigned to one or more teams.
**Expected**: Error message. Deletion blocked or warning shown.

### LGE-005: Archive/Restore a league 🟢
**Steps**: Archive and restore. Verify behavior.

---

## 13. Suppliers (Admin-only)

### SUP-001: Create a seller 🟡
**Steps**:
1. Navigate to `/admin/suppliers`.
2. Add a seller: name, website URL, special notes.
3. Associate products.
4. Save.
**Expected**: Seller appears in list with linked products.

### SUP-002: Edit a seller 🟡
**Steps**:
1. Edit seller — change name, add/remove product associations.
2. Save.
**Expected**: Changes reflected. `seller_products` join table updated.

### SUP-003: Create a product link 🟡
**Steps**:
1. Add a product link: select product, optionally select seller, enter URL and label.
2. Save.
**Expected**: Product link appears in the list and is accessible from product detail.

### SUP-004: Delete a seller 🟡
**Steps**:
1. Delete a seller.
**Expected**: Seller removed. Associated product links have `seller_id` set to NULL (not deleted).

### SUP-005: Suppliers visible only to admins 🟡
**Steps**:
1. Log in as non-admin user.
2. Check navbar for "Suppliers" link.
**Expected**: Link is hidden. Direct navigation to `/admin/suppliers` does not render the page.

---

## 14. Inventory Logs (Admin-only)

### INV-001: View inventory logs 🟡
**Steps**:
1. Navigate to `/admin/inventory-logs`.
**Expected**: Table/list of inventory log entries showing entity, change type, quantities, timestamps.

### INV-002: Filter inventory logs 🟢
**Steps**:
1. Filter by entity type (product/nameset/badge).
2. Filter by change type (sale, return, etc.).
3. Filter by date range.
**Expected**: List updates to show only matching entries.

### INV-003: Inventory history on product 🟢
**Steps**:
1. Open a product detail page.
2. Click the inventory history button.
**Expected**: Modal shows inventory history for that specific product, sorted newest first.

### INV-004: Log entries created after operations 🔴
**Steps**:
1. Perform a sale, then check inventory logs.
2. Perform a return, then check inventory logs.
3. Receive an order, then check inventory logs.
**Expected**: Each operation creates corresponding log entries with correct `quantityBefore`, `quantityChange`, `quantityAfter`, and `referenceId`.

---

## 15. Statistics Dashboard

### STAT-001: Dashboard stats load 🟡
**Steps**:
1. Navigate to `/admin/stats`.
**Expected**: Dashboard shows total sales, revenue, products sold, views count, low stock count, no stock count.

### STAT-002: Sales charts 🟢
**Steps**:
1. View the statistics dashboard.
**Expected**: Monthly sales/revenue breakdown displayed (chart or table).

### STAT-003: Top sold products 🟢
**Steps**:
1. View top sold products section.
**Expected**: Products ranked by quantity sold with images.

### STAT-004: Low stock / No stock alerts 🟡
**Steps**:
1. View low stock and no stock sections.
**Expected**: Products with quantity ≤ threshold shown in low stock. Products with 0 total quantity shown in no stock.

### STAT-005: Date range filtering 🟢
**Steps**:
1. Change date range on the stats dashboard.
**Expected**: All stats recalculate for the selected period.

---

## 16. Settings & Customization

### SET-001: Customize app bar order 🟢
**Steps**:
1. Click the settings gear icon in the admin navbar.
2. Drag/reorder navigation items.
3. Save.
**Expected**: Navbar items reorder according to the new configuration. Persists after page refresh.

### SET-002: Customize dashboard card order 🟢
**Steps**:
1. Open settings popup.
2. Reorder dashboard cards.
3. Save.
**Expected**: Dashboard cards display in the new order. Persists after refresh.

### SET-003: Toggle registration 🟡
**Steps**:
1. Navigate to `/admin/settings`.
2. Toggle the registration switch.
**Expected**: Setting persists in DB. Affects whether the register form is available on the auth page.

---

## 17. Admin Dashboard

### DASH-001: Dashboard loads with collapsible cards 🔴
**Steps**:
1. Navigate to `/admin`.
**Expected**: Dashboard shows cards for Products, Sales, Returns, Namesets, Teams, Badges, Kit Types, Leagues, and (for admin) Reservations. Each card shows a count and can be expanded/collapsed.

### DASH-002: Lazy loading on card expand 🟢
**Steps**:
1. Collapse a card, then expand it.
**Expected**: Data loads on first expand (loading indicator shown briefly). Subsequent collapses/expands don't re-fetch.

### DASH-003: Admin-only cards hidden for non-admins 🟡
**Steps**:
1. Log in as a non-admin user (if role differentiation is implemented).
**Expected**: Reservations card is not shown on dashboard.

---

## 18. Search & Filtering

### SRCH-001: Product search 🟡
**Steps**:
1. On the products page, type a search term.
**Expected**: Product list filters to show only matching products (client-side).

### SRCH-002: Sales search 🟢
**Steps**:
1. On the sales page, type a customer name.
**Expected**: Sales list filters accordingly.

### SRCH-003: Search persists across navigation 🟢
**Steps**:
1. Enter a search term on products page.
2. Navigate to sales page.
3. Navigate back to products page.
**Expected**: Search term is retained (stored in uiStore).

### SRCH-004: Clear search 🟢
**Steps**:
1. Enter a search term, then clear it.
**Expected**: Full list restored.

---

## 19. Cross-Cutting Concerns

### CC-001: Browser tab title updates 🟢
**Steps**:
1. Navigate to different admin pages.
**Expected**: Browser tab title changes (e.g., "Products — Calcio Stop", "Sales — Calcio Stop").

### CC-002: Netlify SPA routing 🟡
**Steps**:
1. Navigate directly to `/admin/products` via URL bar (not through app navigation).
**Expected**: Page loads correctly (not a 404). `_redirects` file handles SPA routing.

### CC-003: Error handling on network failure 🟡
**Steps**:
1. Disable network, then try to load products.
**Expected**: Error message/toast displayed. App does not crash.

### CC-004: Concurrent data operations 🟢
**Steps**:
1. Open two browser tabs logged into admin.
2. In Tab A, create a sale for a product.
3. In Tab B, refresh products.
**Expected**: Tab B shows updated inventory reflecting the sale from Tab A.

---

## 20. Data Integrity Checks

### DI-001: Sale inventory consistency 🔴
**Steps**:
1. Note product stock for size M (e.g., 5).
2. Create a sale for 2x size M.
3. Check product stock.
**Expected**: Stock is now 3. Inventory log shows: before=5, change=-2, after=3.

### DI-002: Return inventory consistency 🔴
**Steps**:
1. Return the sale from DI-001 (2x size M).
2. Check product stock.
**Expected**: Stock is back to 5. Inventory log shows: before=3, change=+2, after=5.

### DI-003: Reservation inventory flow 🔴
**Steps**:
1. Note product stock (e.g., 5).
2. Create reservation for 1x item.
3. Check stock → should be 4.
4. Complete reservation.
5. Check stock → still 4 (sale created, no double-deduction).
6. Delete/cancel a different pending reservation.
7. Check stock → incremented back.
**Expected**: Inventory correctly tracks through the entire reservation lifecycle.

### DI-004: Order received → finished inventory flow 🔴
**Steps**:
1. Create order with 3x size L.
2. Move to "received" → stock increases by 3.
3. Move to "message sent" → no change.
4. Move to "finished" → stock decreases by 3 (sale auto-created).
**Expected**: Net inventory change is 0 (received +3, sold -3). Sale record exists.

### DI-005: Backward compatibility — legacy single-item sales 🟢
**Steps**:
1. If any legacy sales exist (with `product_id`, `size`, `quantity` directly on the sale row rather than in `items` JSONB):
2. View them in the sales list.
**Expected**: Legacy sales display correctly alongside new multi-item sales.
