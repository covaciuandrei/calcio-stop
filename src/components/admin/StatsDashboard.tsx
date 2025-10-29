import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  DashboardStats,
  DateRange,
  LowStockProduct,
  NoStockProduct,
  SalesStats,
  TopSoldProduct,
  TopViewedShirt,
  statsService,
} from '../../lib/statsService';
import './StatsDashboard.css';

const StatsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [salesStats, setSalesStats] = useState<SalesStats[]>([]);
  const [yearlySalesStats, setYearlySalesStats] = useState<SalesStats[]>([]);
  const [topViewedProducts, setTopViewedProducts] = useState<TopViewedShirt[]>([]);
  const [topSoldProducts, setTopSoldProducts] = useState<TopSoldProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [noStockProducts, setNoStockProducts] = useState<NoStockProduct[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
    totalViews: 0,
    lowStockCount: 0,
    noStockCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const currentYear = new Date().getFullYear();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      startDate: `${currentYear}-01-01`,
      endDate: format(tomorrow, 'yyyy-MM-dd'),
    };
  });
  const [tempDateRange, setTempDateRange] = useState<DateRange>(() => {
    const currentYear = new Date().getFullYear();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      startDate: `${currentYear}-01-01`,
      endDate: format(tomorrow, 'yyyy-MM-dd'),
    };
  });

  const loadStats = useCallback(async (currentDateRange: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);

      const [sales, yearlySales, topProducts, topSold, lowStock, noStock, dashboard] = await Promise.all([
        statsService.getSalesStats(12, currentDateRange),
        statsService.getYearlySalesStats(5),
        statsService.getTopViewedProducts(10, currentDateRange),
        statsService.getTopSoldProducts(10, currentDateRange),
        statsService.getLowStockProducts(5),
        statsService.getNoStockProducts(),
        statsService.getDashboardStats(currentDateRange),
      ]);

      setSalesStats(sales);
      setYearlySalesStats(yearlySales);
      setTopViewedProducts(topProducts);
      setTopSoldProducts(topSold);
      setLowStockProducts(lowStock);
      setNoStockProducts(noStock);
      setDashboardStats(dashboard);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(dateRange);

    // Auto-refresh every 10 minutes
    const interval = setInterval(() => loadStats(dateRange), 600000);

    return () => clearInterval(interval);
  }, [loadStats, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return format(date, 'MMM yyyy');
  };

  const formatYear = (yearStr: string) => {
    return yearStr;
  };

  const handleLowStockProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleNoStockProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleTopProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleTopSoldProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="stats-dashboard" style={{ position: 'relative' }}>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-dashboard">
        <div className="card">
          <div className="card-content">
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={() => loadStats(dateRange)} className="btn btn-primary">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard">
      {/* Overview Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(dashboardStats.totalRevenue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">{dashboardStats.totalSales}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>Total Products Sold</h3>
            <p className="stat-value">{dashboardStats.totalProductsSold}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>Total Views</h3>
            <p className="stat-value">{dashboardStats.totalViews}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{dashboardStats.lowStockCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <h3>No Stock Items</h3>
            <p className="stat-value">{dashboardStats.noStockCount}</p>
          </div>
        </div>
        {/* Date Range Picker - Takes width of 2 stat cards */}
        <div className="date-range-picker-compact">
          <div className="date-range-container">
            <div className="date-inputs-row">
              <div className="date-input-group">
                <label htmlFor="start-date">From:</label>
                <input
                  id="start-date"
                  type="date"
                  value={tempDateRange.startDate}
                  onChange={(e) => setTempDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">To:</label>
                <input
                  id="end-date"
                  type="date"
                  value={tempDateRange.endDate}
                  onChange={(e) => setTempDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="date-input"
                />
              </div>
            </div>
            <div className="date-filter-button">
              <button
                onClick={() => {
                  setDateRange(tempDateRange);
                  loadStats(tempDateRange);
                }}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Statistics Chart - Full Width */}
      <div className="stats-chart-full">
        <div className="chart-container">
          <div className="card">
            <div className="card-header">
              <h3>Sales Statistics</h3>
              <div className="chart-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'yearly' ? 'active' : ''}`}
                  onClick={() => setViewMode('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="card-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  key={`${viewMode}-${dateRange.startDate}-${dateRange.endDate}`}
                  data={viewMode === 'monthly' ? salesStats : yearlySalesStats}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={viewMode === 'monthly' ? formatMonth : formatYear}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      return [
                        name === 'Products Sold' ? value : formatCurrency(value),
                        name === 'Products Sold' ? 'Products Sold' : 'Revenue',
                      ];
                    }}
                    labelFormatter={(label) => (viewMode === 'monthly' ? formatMonth(label) : formatYear(label))}
                  />
                  <Bar dataKey="sales" fill="#0088FE" name="Products Sold" />
                  <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section - Side by Side */}
      <div className="stats-charts">
        {/* Top Viewed Products List */}
        <div className="chart-container">
          <div className="card">
            <div className="card-header">
              <h3>Top 10 Viewed Products</h3>
              <span className="badge info">{topViewedProducts.length} products</span>
            </div>
            <div className="card-content">
              {topViewedProducts.length === 0 ? (
                <p className="no-data">No product views found yet.</p>
              ) : (
                <div className="top-products-list">
                  {topViewedProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="top-product-item clickable"
                      onClick={() => handleTopProductClick(product.productId)}
                    >
                      <div className="product-rank">
                        <span className="rank-number">#{index + 1}</span>
                      </div>
                      <div className="product-info">
                        <h4>
                          {product.teamName} - {product.productName}
                        </h4>
                        <span className="product-views">{product.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Sold Products List */}
        <div className="chart-container">
          <div className="card">
            <div className="card-header">
              <h3>Top 10 Sold Products</h3>
              <span className="badge success">{topSoldProducts.length} products</span>
            </div>
            <div className="card-content">
              {topSoldProducts.length === 0 ? (
                <p className="no-data">No product sales found yet.</p>
              ) : (
                <div className="top-products-list">
                  {topSoldProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="top-product-item clickable"
                      onClick={() => handleTopSoldProductClick(product.productId)}
                    >
                      <div className="product-rank">
                        <span className="rank-number">#{index + 1}</span>
                      </div>
                      <div className="product-info">
                        <h4>
                          {product.teamName} - {product.productName}
                        </h4>
                        <span className="product-views">{product.quantitySold} sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="low-stock-section">
        <div className="card">
          <div className="card-header">
            <h3>Low Stock Products</h3>
            <span className="badge warning">{lowStockProducts.length} items</span>
          </div>
          <div className="card-content">
            {lowStockProducts.length === 0 ? (
              <p className="no-data">No low stock products found. Great job! 🎉</p>
            ) : (
              <div className="low-stock-list">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="low-stock-item clickable"
                    onClick={() => handleLowStockProductClick(product.id)}
                  >
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <span className="product-type">{product.type}</span>
                    </div>
                    <div className="stock-info">
                      <span className="total-quantity">{product.totalQuantity} total</span>
                      <div className="size-breakdown">
                        {product.sizes.map((size) => (
                          <span
                            key={size.size}
                            className={`size-item ${size.quantity === 0 ? 'out-of-stock' : size.quantity <= 2 ? 'low-stock' : 'in-stock'}`}
                          >
                            {size.size}: {size.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No Stock Products */}
      <div className="no-stock-section">
        <div className="card">
          <div className="card-header">
            <h3>No Stock Products</h3>
            <span className="badge danger">{noStockProducts.length} items</span>
          </div>
          <div className="card-content">
            {noStockProducts.length === 0 ? (
              <p className="no-data">No out of stock products found. Great job! 🎉</p>
            ) : (
              <div className="no-stock-list">
                {noStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="no-stock-item clickable"
                    onClick={() => handleNoStockProductClick(product.id)}
                  >
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <span className="product-type">{product.type}</span>
                    </div>
                    <div className="stock-info">
                      <span className="total-quantity">{product.totalQuantity} total</span>
                      <div className="size-breakdown">
                        {product.sizes.map((size) => (
                          <span
                            key={size.size}
                            className={`size-item ${size.quantity === 0 ? 'out-of-stock' : size.quantity <= 2 ? 'low-stock' : 'in-stock'}`}
                          >
                            {size.size}: {size.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Info */}
      <div className="refresh-info">
        <p>📊 Data refreshes automatically every 10 minutes</p>
      </div>
    </div>
  );
};

export default StatsDashboard;
