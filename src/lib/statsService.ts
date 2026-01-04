import { supabase } from './supabaseClient';

export interface SalesStats {
  month: string;
  sales: number;
  revenue: number;
}

export interface ProductViewStats {
  productId: string;
  productName: string;
  views: number;
}

export interface TopViewedShirt {
  productId: string;
  productName: string;
  teamName: string;
  views: number;
  mainImageUrl?: string;
}

export interface TopSoldProduct {
  productId: string;
  productName: string;
  teamName: string;
  quantitySold: number;
  mainImageUrl?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  sizes: Array<{ size: string; quantity: number }>;
  mainImageUrl?: string;
  teamName?: string;
}

export interface NoStockProduct {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  sizes: Array<{ size: string; quantity: number }>;
  mainImageUrl?: string;
  teamName?: string;
}

export interface DateRange {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

export interface DashboardStats {
  totalSales: number;
  totalProductsSold: number;
  totalRevenue: number;
  totalViews: number;
  lowStockCount: number;
  noStockCount: number;
}

export interface ShirtStockStats {
  totalStock: number;
  breakdownBySize: Array<{ size: string; quantity: number }>;
}

export interface ShirtStockByTeam {
  teamId: string;
  teamName: string;
  totalStock: number;
}

class StatsService {
  // Track a product view
  async trackProductView(productId: string): Promise<void> {
    try {
      const { error } = await supabase.from('views').insert({
        product_id: productId,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error('Error tracking product view:', error);
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }

  // Delete all product views
  async deleteAllViews(): Promise<void> {
    try {
      const { error } = await supabase.from('views').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) {
        console.error('Error deleting all views:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting all views:', error);
      throw error;
    }
  }

  // Get sales statistics by month
  async getSalesStats(months: number = 12, dateRange?: DateRange): Promise<SalesStats[]> {
    try {
      let query = supabase
        .from('sales')
        .select('date, items, quantity, price_sold, product_id, size')
        .order('date', { ascending: true });

      // Apply date range filter if provided
      if (dateRange) {
        query = query.gte('date', dateRange.startDate).lte('date', dateRange.endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sales data:', error);
        throw error;
      }

      // Group by month and calculate totals
      const monthlyStats = new Map<string, { sales: number; revenue: number }>();

      data?.forEach((sale) => {
        // Handle different date formats
        let date: Date;
        if (typeof sale.date === 'string') {
          // If it's a date string, parse it
          // Handle both DATE format (YYYY-MM-DD) and ISO format (YYYY-MM-DDTHH:mm:ss)
          const dateStr = sale.date.split('T')[0]; // Get just the date part

          // Try different parsing approaches
          try {
            // First try: direct parsing
            date = new Date(dateStr);

            // If that fails, try with explicit timezone
            if (isNaN(date.getTime())) {
              date = new Date(dateStr + 'T00:00:00Z');
            }

            // If still fails, try with local timezone
            if (isNaN(date.getTime())) {
              date = new Date(dateStr + 'T00:00:00');
            }
          } catch (e) {
            console.error('Date parsing error:', e, 'for date:', sale.date);
            return; // Skip this sale
          }
        } else if (sale.date instanceof Date) {
          date = sale.date;
        } else {
          console.error('Invalid date format:', sale.date);
          return; // Skip this sale
        }

        // Validate date
        if (isNaN(date.getTime())) {
          console.error('Invalid date parsed:', { original: sale.date, parsed: date });
          return; // Skip this sale
        }

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Calculate totals from items array (support both new and old format)
        const items = sale.items || [
          {
            productId: sale.product_id,
            size: sale.size,
            quantity: sale.quantity,
            priceSold: sale.price_sold,
          },
        ];
        const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        const totalRevenue = items.reduce((sum: number, item: any) => sum + item.priceSold * item.quantity, 0);

        if (!monthlyStats.has(monthKey)) {
          monthlyStats.set(monthKey, { sales: 0, revenue: 0 });
        }

        const stats = monthlyStats.get(monthKey)!;
        stats.sales += totalQuantity;
        stats.revenue += totalRevenue;
      });

      // Convert to array and format
      const result: SalesStats[] = Array.from(monthlyStats.entries())
        .map(([month, stats]) => ({
          month,
          sales: stats.sales,
          revenue: stats.revenue,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-months); // Get last N months

      return result;
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      return [];
    }
  }

  // Get sales statistics by year
  async getYearlySalesStats(years: number = 5): Promise<SalesStats[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('date, items, quantity, price_sold, product_id, size')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      // Group by year and calculate totals
      const yearlyStats = new Map<string, { sales: number; revenue: number }>();

      data?.forEach((sale) => {
        const date = new Date(sale.date);
        const yearKey = `${date.getFullYear()}`;

        if (!yearlyStats.has(yearKey)) {
          yearlyStats.set(yearKey, { sales: 0, revenue: 0 });
        }

        // Calculate totals from items array (support both new and old format)
        const items = sale.items || [
          {
            productId: sale.product_id,
            size: sale.size,
            quantity: sale.quantity,
            priceSold: sale.price_sold,
          },
        ];
        const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        const totalRevenue = items.reduce((sum: number, item: any) => sum + item.priceSold * item.quantity, 0);

        const stats = yearlyStats.get(yearKey)!;
        stats.sales += totalQuantity;
        stats.revenue += totalRevenue;
      });

      // Convert to array and format
      const result: SalesStats[] = Array.from(yearlyStats.entries())
        .map(([year, stats]) => ({
          month: year,
          sales: stats.sales,
          revenue: stats.revenue,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-years); // Get last N years

      return result;
    } catch (error) {
      console.error('Error fetching yearly sales stats:', error);
      return [];
    }
  }

  // Get most viewed products
  async getMostViewedProducts(limit: number = 10): Promise<ProductViewStats[]> {
    try {
      const { data, error } = await supabase
        .from('views')
        .select(
          `
          product_id,
          products!inner(name)
        `
        )
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      // Group by product and count views
      const productViews = new Map<string, { name: string; views: number }>();

      data?.forEach((view) => {
        const productId = view.product_id;
        const productName = (view.products as any)?.name || 'Unknown Product';

        if (!productViews.has(productId)) {
          productViews.set(productId, { name: productName, views: 0 });
        }

        productViews.get(productId)!.views += 1;
      });

      // Convert to array and sort by views
      const result: ProductViewStats[] = Array.from(productViews.entries())
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          views: data.views,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);

      return result;
    } catch (error) {
      console.error('Error fetching most viewed products:', error);
      return [];
    }
  }

  // Get top viewed products (all types) - Optimized to reduce N+1 queries
  async getTopViewedProducts(limit: number = 10, dateRange?: DateRange): Promise<TopViewedShirt[]> {
    try {
      // Single query to get all views with product and team info
      // This eliminates the need to fetch ALL products first
      let viewsQuery = supabase
        .from('views')
        .select(
          `
          product_id,
          timestamp,
          products!inner(
            id,
            name,
            type,
            archived_at,
            teams(id, name)
          )
        `
        )
        .is('products.archived_at', null)
        .order('timestamp', { ascending: false });

      // Apply date range filter if provided
      if (dateRange) {
        viewsQuery = viewsQuery
          .gte('timestamp', dateRange.startDate)
          .lte('timestamp', dateRange.endDate + 'T23:59:59.999Z');
      }

      const { data: viewsData, error: viewsError } = await viewsQuery;

      if (viewsError) {
        console.error('Error fetching views data:', viewsError);
        throw viewsError;
      }

      // Aggregate views by product in memory (much more efficient than the original approach)
      const productViews = new Map<string, { name: string; teamName: string; views: number }>();

      viewsData?.forEach((view) => {
        const product = view.products;
        if (!product) return;

        const actualProduct = Array.isArray(product) ? product[0] : product;
        if (!actualProduct) return;

        const team = actualProduct.teams;
        const teamName = (Array.isArray(team) ? (team[0] as any)?.name : (team as any)?.name) || 'No Team';

        const productId = view.product_id;

        if (!productViews.has(productId)) {
          productViews.set(productId, {
            name: actualProduct.name,
            teamName: teamName,
            views: 0,
          });
        }

        productViews.get(productId)!.views += 1;
      });

      // Get top products by view count
      const topProducts = Array.from(productViews.entries())
        .sort(([, a], [, b]) => b.views - a.views)
        .slice(0, limit);

      // Single query to fetch images for only the top products
      const productIds = topProducts.map(([productId]) => productId);

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('product_id, medium_url, is_primary, display_order')
        .in('product_id', productIds)
        .order('is_primary', { ascending: false })
        .order('display_order', { ascending: true });

      // Create image map for efficient lookup
      const productImageMap = new Map<string, string>();
      imagesData?.forEach((img) => {
        if (!productImageMap.has(img.product_id)) {
          productImageMap.set(img.product_id, img.medium_url);
        }
      });

      // Build final result
      const result: TopViewedShirt[] = topProducts.map(([productId, data]) => ({
        productId,
        productName: data.name,
        teamName: data.teamName,
        views: data.views,
        mainImageUrl: productImageMap.get(productId),
      }));

      return result;
    } catch (error) {
      console.error('Error fetching top viewed products:', error);
      return [];
    }
  }

  // Get top sold products (all types) - Optimized to reduce N+1 queries
  async getTopSoldProducts(limit: number = 10, dateRange?: DateRange): Promise<TopSoldProduct[]> {
    try {
      // Single query to get all sales with product and team info
      // This eliminates the need to fetch ALL products first
      let salesQuery = supabase
        .from('sales')
        .select(
          `
          items,
          product_id,
          quantity,
          size,
          price_sold,
          date,
          products!inner(
            id,
            name,
            type,
            archived_at,
            teams(id, name)
          )
        `
        )
        .is('products.archived_at', null)
        .order('date', { ascending: false });

      // Apply date range filter if provided
      if (dateRange) {
        salesQuery = salesQuery.gte('date', dateRange.startDate).lte('date', dateRange.endDate + 'T23:59:59.999Z');
      }

      const { data: salesData, error: salesError } = await salesQuery;

      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        throw salesError;
      }

      // Aggregate sales by product in memory (much more efficient than the original approach)
      const productSales = new Map<string, { name: string; teamName: string; quantitySold: number }>();

      salesData?.forEach((sale) => {
        // Support both new (items) and old (product_id, quantity) formats
        const items = sale.items || [
          {
            productId: sale.product_id,
            size: sale.size || '',
            quantity: sale.quantity || 0,
            priceSold: sale.price_sold || 0,
          },
        ];

        items.forEach((item: any) => {
          const productId = item.productId || sale.product_id;
          const quantity = item.quantity || sale.quantity || 0;

          if (productId) {
            // Get product info from the joined data
            const product = sale.products;
            if (!product) return;

            const actualProduct = Array.isArray(product) ? product[0] : product;
            if (!actualProduct) return;

            const team = actualProduct.teams;
            const teamName = (Array.isArray(team) ? (team[0] as any)?.name : (team as any)?.name) || 'No Team';

            if (!productSales.has(productId)) {
              productSales.set(productId, {
                name: actualProduct.name,
                teamName: teamName,
                quantitySold: 0,
              });
            }

            productSales.get(productId)!.quantitySold += quantity;
          }
        });
      });

      // Get top products by sales count
      const topProducts = Array.from(productSales.entries())
        .filter(([, data]) => data.quantitySold > 0)
        .sort(([, a], [, b]) => b.quantitySold - a.quantitySold)
        .slice(0, limit);

      // Single query to fetch images for only the top products
      const productIds = topProducts.map(([productId]) => productId);

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('product_id, medium_url, is_primary, display_order')
        .in('product_id', productIds)
        .order('is_primary', { ascending: false })
        .order('display_order', { ascending: true });

      // Create image map for efficient lookup
      const productImageMap = new Map<string, string>();
      imagesData?.forEach((img) => {
        if (!productImageMap.has(img.product_id)) {
          productImageMap.set(img.product_id, img.medium_url);
        }
      });

      // Build final result
      const result: TopSoldProduct[] = topProducts.map(([productId, data]) => ({
        productId,
        productName: data.name,
        teamName: data.teamName,
        quantitySold: data.quantitySold,
        mainImageUrl: productImageMap.get(productId),
      }));

      return result;
    } catch (error) {
      console.error('Error fetching top sold products:', error);
      return [];
    }
  }

  // Get low stock products
  async getLowStockProducts(threshold: number = 5): Promise<LowStockProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, type, sizes, teams(id, name)')
        .is('archived_at', null);

      if (error) {
        throw error;
      }

      const lowStockProducts: LowStockProduct[] = [];

      data?.forEach((product) => {
        const totalQuantity = product.sizes.reduce((sum: number, size: any) => sum + size.quantity, 0);

        if (totalQuantity < threshold) {
          // Extract team name from joined data
          const team = product.teams;
          const teamName = team ? (Array.isArray(team) ? (team[0] as any)?.name : (team as any).name) : undefined;

          lowStockProducts.push({
            id: product.id,
            name: product.name,
            type: product.type,
            totalQuantity,
            sizes: product.sizes,
            teamName,
          });
        }
      });

      // Sort by total quantity (ascending - most urgent first)
      const sortedLowStockProducts = lowStockProducts.sort((a, b) => a.totalQuantity - b.totalQuantity);

      // Get product images for all low stock products
      if (sortedLowStockProducts.length > 0) {
        const productIds = sortedLowStockProducts.map((product) => product.id);

        const { data: imagesData } = await supabase
          .from('product_images')
          .select('product_id, medium_url, is_primary, display_order')
          .in('product_id', productIds)
          .order('is_primary', { ascending: false })
          .order('display_order', { ascending: true });

        // Create image map for efficient lookup
        const productImageMap = new Map<string, string>();
        imagesData?.forEach((img) => {
          if (!productImageMap.has(img.product_id)) {
            productImageMap.set(img.product_id, img.medium_url);
          }
        });

        // Add images to products
        sortedLowStockProducts.forEach((product) => {
          product.mainImageUrl = productImageMap.get(product.id);
        });
      }

      return sortedLowStockProducts;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

  // Get no stock products
  async getNoStockProducts(): Promise<NoStockProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, type, sizes, teams(id, name)')
        .is('archived_at', null);

      if (error) {
        throw error;
      }

      const noStockProducts: NoStockProduct[] = [];

      data?.forEach((product) => {
        const totalQuantity = product.sizes.reduce((sum: number, size: any) => sum + size.quantity, 0);

        if (totalQuantity === 0) {
          // Extract team name from joined data
          const team = product.teams;
          const teamName = team ? (Array.isArray(team) ? (team[0] as any)?.name : (team as any).name) : undefined;

          noStockProducts.push({
            id: product.id,
            name: product.name,
            type: product.type,
            totalQuantity,
            sizes: product.sizes,
            teamName,
          });
        }
      });

      // Sort alphabetically by name
      const sortedNoStockProducts = noStockProducts.sort((a, b) => a.name.localeCompare(b.name));

      // Get product images for all out of stock products
      if (sortedNoStockProducts.length > 0) {
        const productIds = sortedNoStockProducts.map((product) => product.id);

        const { data: imagesData } = await supabase
          .from('product_images')
          .select('product_id, medium_url, is_primary, display_order')
          .in('product_id', productIds)
          .order('is_primary', { ascending: false })
          .order('display_order', { ascending: true });

        // Create image map for efficient lookup
        const productImageMap = new Map<string, string>();
        imagesData?.forEach((img) => {
          if (!productImageMap.has(img.product_id)) {
            productImageMap.set(img.product_id, img.medium_url);
          }
        });

        // Add images to products
        sortedNoStockProducts.forEach((product) => {
          product.mainImageUrl = productImageMap.get(product.id);
        });
      }

      return sortedNoStockProducts;
    } catch (error) {
      console.error('Error fetching no stock products:', error);
      return [];
    }
  }

  // Get sales count for a specific date range
  async getSalesCount(dateRange?: DateRange) {
    let query = supabase.from('sales').select('id');

    if (dateRange) {
      query = query.gte('date', dateRange.startDate).lte('date', dateRange.endDate);
    }

    return query;
  }

  // Get views count for a specific date range
  async getViewsCount(dateRange?: DateRange) {
    let query = supabase.from('views').select('id');

    if (dateRange) {
      query = query.gte('timestamp', dateRange.startDate).lte('timestamp', dateRange.endDate + 'T23:59:59.999Z'); // Include the entire end date
    }

    return query;
  }

  // Get total stock of shirts and breakdown by sizes
  async getShirtStockStats(): Promise<ShirtStockStats> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('sizes')
        .in('type', ['shirt', 'kid kit'])
        .is('archived_at', null);

      if (error) {
        throw error;
      }

      // Aggregate stock by size across all shirts
      const sizeMap = new Map<string, number>();

      data?.forEach((product) => {
        if (product.sizes && Array.isArray(product.sizes)) {
          product.sizes.forEach((sizeItem: any) => {
            const size = sizeItem.size;
            const quantity = sizeItem.quantity || 0;
            if (size) {
              const currentQuantity = sizeMap.get(size) || 0;
              sizeMap.set(size, currentQuantity + quantity);
            }
          });
        }
      });

      // Convert to array and sort by size
      const breakdownBySize = Array.from(sizeMap.entries())
        .map(([size, quantity]) => ({ size, quantity }))
        .sort((a, b) => {
          // Sort sizes: numeric first (ascending), then letters (S, M, L, XL, XXL)
          const aIsNumeric = !isNaN(Number(a.size));
          const bIsNumeric = !isNaN(Number(b.size));

          if (aIsNumeric && bIsNumeric) {
            return Number(a.size) - Number(b.size);
          }
          if (aIsNumeric) return -1;
          if (bIsNumeric) return 1;

          // Sort letters: S, M, L, XL, XXL
          const sizeOrder: { [key: string]: number } = { S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
          return (sizeOrder[a.size] || 99) - (sizeOrder[b.size] || 99);
        });

      const totalStock = breakdownBySize.reduce((sum, item) => sum + item.quantity, 0);

      return {
        totalStock,
        breakdownBySize,
      };
    } catch (error) {
      console.error('Error fetching shirt stock stats:', error);
      return {
        totalStock: 0,
        breakdownBySize: [],
      };
    }
  }

  // Get overall dashboard statistics - Optimized to reduce query count
  async getDashboardStats(dateRange?: DateRange): Promise<DashboardStats> {
    try {
      // Run optimized queries in parallel
      const [salesAggregates, viewsCount, stockCounts] = await Promise.all([
        this.getSalesAggregates(dateRange), // Combined sales stats and count
        this.getViewsAggregates(dateRange), // Optimized views count
        this.getStockCounts(), // Combined low and no stock counts
      ]);

      return {
        totalSales: salesAggregates.totalTransactions,
        totalProductsSold: salesAggregates.totalQuantity,
        totalRevenue: salesAggregates.totalRevenue,
        totalViews: viewsCount,
        lowStockCount: stockCounts.lowStockCount,
        noStockCount: stockCounts.noStockCount,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalSales: 0,
        totalProductsSold: 0,
        totalRevenue: 0,
        totalViews: 0,
        lowStockCount: 0,
        noStockCount: 0,
      };
    }
  }

  // Optimized helper method for sales aggregates
  private async getSalesAggregates(dateRange?: DateRange) {
    try {
      let query = supabase.from('sales').select('items, quantity, price_sold, date');

      if (dateRange) {
        query = query.gte('date', dateRange.startDate).lte('date', dateRange.endDate);
      }

      const { data: salesData, error } = await query;

      if (error) throw error;

      let totalTransactions = 0;
      let totalQuantity = 0;
      let totalRevenue = 0;

      salesData?.forEach((sale) => {
        totalTransactions += 1;

        // Support both new (items) and old formats
        const items = sale.items || [
          {
            quantity: sale.quantity || 0,
            priceSold: sale.price_sold || 0,
          },
        ];

        items.forEach((item: any) => {
          const quantity = item.quantity || sale.quantity || 0;
          const priceSold = item.priceSold || sale.price_sold || 0;

          totalQuantity += quantity;
          totalRevenue += quantity * priceSold;
        });
      });

      return { totalTransactions, totalQuantity, totalRevenue };
    } catch (error) {
      console.error('Error in getSalesAggregates:', error);
      return { totalTransactions: 0, totalQuantity: 0, totalRevenue: 0 };
    }
  }

  // Optimized helper method for views count
  private async getViewsAggregates(dateRange?: DateRange) {
    try {
      let query = supabase.from('views').select('id', { count: 'exact', head: true });

      if (dateRange) {
        query = query.gte('timestamp', dateRange.startDate).lte('timestamp', dateRange.endDate + 'T23:59:59.999Z');
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error in getViewsAggregates:', error);
      return 0;
    }
  }

  // Optimized helper method for stock counts
  private async getStockCounts(threshold: number = 5) {
    try {
      const { data: products, error } = await supabase.from('products').select('sizes').is('archived_at', null);

      if (error) throw error;

      let lowStockCount = 0;
      let noStockCount = 0;

      products?.forEach((product) => {
        const totalQuantity = product.sizes?.reduce((sum: number, size: any) => sum + (size.quantity || 0), 0) || 0;

        if (totalQuantity === 0) {
          noStockCount += 1;
        } else if (totalQuantity < threshold) {
          lowStockCount += 1;
        }
      });

      return { lowStockCount, noStockCount };
    } catch (error) {
      console.error('Error in getStockCounts:', error);
      return { lowStockCount: 0, noStockCount: 0 };
    }
  }

  // Get total stock of shirts broken down by team
  async getShirtStockByTeam(): Promise<ShirtStockByTeam[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('sizes, team_id, teams(id, name)')
        .in('type', ['shirt', 'kid kit'])
        .is('archived_at', null);

      if (error) {
        throw error;
      }

      // Aggregate stock by team
      const teamMap = new Map<string, { teamName: string; totalStock: number }>();

      data?.forEach((product) => {
        // Calculate total stock for this product
        const productStock =
          product.sizes && Array.isArray(product.sizes)
            ? product.sizes.reduce((sum: number, sizeItem: any) => sum + (sizeItem.quantity || 0), 0)
            : 0;

        // Get team info
        const teamId = product.team_id || 'no-team';
        const team: any = product.teams;
        let teamName = 'No Team';

        if (team) {
          if (Array.isArray(team)) {
            if (team.length > 0 && team[0]?.name) {
              teamName = team[0].name;
            }
          } else if (team && typeof team === 'object' && 'name' in team) {
            teamName = team.name || 'No Team';
          }
        }

        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, { teamName, totalStock: 0 });
        }

        const teamData = teamMap.get(teamId)!;
        teamData.totalStock += productStock;
      });

      // Convert to array and sort by total stock (descending)
      const result = Array.from(teamMap.entries())
        .map(([teamId, data]) => ({
          teamId,
          teamName: data.teamName,
          totalStock: data.totalStock,
        }))
        .sort((a, b) => b.totalStock - a.totalStock);

      return result;
    } catch (error) {
      console.error('Error fetching shirt stock by team:', error);
      return [];
    }
  }
}

export const statsService = new StatsService();
