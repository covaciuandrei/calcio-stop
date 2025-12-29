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
  ShirtStockStats,
  TopSoldProduct,
  TopViewedShirt,
  statsService,
} from '../../lib/statsService';
import DateInput from '../shared/DateInput';
import './StatsDashboard.css';

const StatsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [salesStats, setSalesStats] = useState<SalesStats[]>([]);
  const [yearlySalesStats, setYearlySalesStats] = useState<SalesStats[]>([]);
  const [topViewedProducts, setTopViewedProducts] = useState<TopViewedShirt[]>([]);
  const [topSoldProducts, setTopSoldProducts] = useState<TopSoldProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [noStockProducts, setNoStockProducts] = useState<NoStockProduct[]>([]);
  const [shirtStockStats, setShirtStockStats] = useState<ShirtStockStats>({
    totalStock: 0,
    breakdownBySize: [],
  });
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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inventory'>('overview');

  const loadStats = useCallback(async (currentDateRange: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);

      const [sales, yearlySales, topProducts, topSold, lowStock, noStock, dashboard, shirtStock] = await Promise.all([
        statsService.getSalesStats(12, currentDateRange),
        statsService.getYearlySalesStats(5),
        statsService.getTopViewedProducts(10, currentDateRange),
        statsService.getTopSoldProducts(10, currentDateRange),
        statsService.getLowStockProducts(5),
        statsService.getNoStockProducts(),
        statsService.getDashboardStats(currentDateRange),
        statsService.getShirtStockStats(),
      ]);

      setSalesStats(sales);
      setYearlySalesStats(yearlySales);
      setTopViewedProducts(topProducts);
      setTopSoldProducts(topSold);
      setLowStockProducts(lowStock);
      setNoStockProducts(noStock);
      setDashboardStats(dashboard);
      setShirtStockStats(shirtStock);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(dateRange);
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

  const handleResetViews = async () => {
    if (window.confirm('Are you sure you want to delete all views from history? This action cannot be undone.')) {
      try {
        await statsService.deleteAllViews();
        // Reload stats after deletion
        loadStats(dateRange);
      } catch (error) {
        console.error('Error resetting views:', error);
        alert('Failed to reset views. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="modern-stats-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h3>Loading Analytics</h3>
          <p>Gathering your business insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-stats-dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Data</h3>
          <p>{error}</p>
          <button onClick={() => loadStats(dateRange)} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-stats-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive insights into your business performance</p>
        </div>
        <div className="header-actions">
          <div className="date-range-picker">
            <div className="date-inputs">
              <div className="date-group">
                <label>From</label>
                <DateInput
                  value={tempDateRange.startDate}
                  onChange={(value) => setTempDateRange((prev) => ({ ...prev, startDate: value }))}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div className="date-group">
                <label>To</label>
                <DateInput
                  value={tempDateRange.endDate}
                  onChange={(value) => setTempDateRange((prev) => ({ ...prev, endDate: value }))}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <button
                onClick={() => {
                  setDateRange(tempDateRange);
                  loadStats(tempDateRange);
                }}
                className="btn btn-primary"
                disabled={isLoading}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button className={`tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <span className="tab-icon">🛍️</span>
          Products
        </button>
        <button
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span className="tab-icon">📦</span>
          Inventory
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card revenue">
              <div className="metric-icon">
                <div className="icon-bg">💰</div>
              </div>
              <div className="metric-content">
                <h3>Total Revenue</h3>
                <div className="metric-value">{formatCurrency(dashboardStats.totalRevenue)}</div>
                <div className="metric-trend">
                  <span className="trend-icon">📈</span>
                  <span>Revenue generated</span>
                </div>
              </div>
            </div>

            <div className="metric-card sales">
              <div className="metric-icon">
                <div className="icon-bg">🛒</div>
              </div>
              <div className="metric-content">
                <h3>Total Sales</h3>
                <div className="metric-value">{dashboardStats.totalSales}</div>
                <div className="metric-trend">
                  <span className="trend-icon">📊</span>
                  <span>Orders completed</span>
                </div>
              </div>
            </div>

            <div className="metric-card products">
              <div className="metric-icon">
                <div className="icon-bg">📦</div>
              </div>
              <div className="metric-content">
                <h3>Products Sold</h3>
                <div className="metric-value">{dashboardStats.totalProductsSold}</div>
                <div className="metric-trend">
                  <span className="trend-icon">🎯</span>
                  <span>Items sold</span>
                </div>
              </div>
            </div>

            <div className="metric-card views">
              <div className="metric-icon">
                <div className="icon-bg">👁️</div>
              </div>
              <div className="metric-content">
                <h3>Total Views</h3>
                <div className="metric-value">{dashboardStats.totalViews}</div>
                <div className="metric-trend">
                  <span className="trend-icon">👀</span>
                  <span>Page views</span>
                </div>
              </div>
              <button className="metric-reset-btn" onClick={handleResetViews} title="Reset all views">
                🔄
              </button>
            </div>

            <div className="metric-card stock">
              <div className="metric-icon">
                <div className="icon-bg">👕</div>
              </div>
              <div className="metric-content">
                <h3>Total Shirt Stock</h3>
                <div className="metric-value">{shirtStockStats.totalStock}</div>
                <div className="metric-trend">
                  <span className="trend-icon">📦</span>
                  <span>Shirts in stock</span>
                </div>
              </div>
              {shirtStockStats.breakdownBySize.length > 0 && (
                <div className="stock-sizes-breakdown">
                  {shirtStockStats.breakdownBySize.map((item, index) => {
                    const isNumeric = !isNaN(Number(item.size));
                    const prevItem = index > 0 ? shirtStockStats.breakdownBySize[index - 1] : null;
                    const prevIsNumeric = prevItem ? !isNaN(Number(prevItem.size)) : false;
                    const showSeparator = prevItem && prevIsNumeric && !isNumeric;

                    return (
                      <React.Fragment key={item.size}>
                        {showSeparator && <div className="stock-sizes-separator" />}
                        <span className="stock-size-badge">
                          {item.size}: {item.quantity}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sales Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <h2>Sales Performance</h2>
              <div className="chart-controls">
                <button
                  className={`control-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`control-btn ${viewMode === 'yearly' ? 'active' : ''}`}
                  onClick={() => setViewMode('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  key={`${viewMode}-${dateRange.startDate}-${dateRange.endDate}`}
                  data={viewMode === 'monthly' ? salesStats : yearlySalesStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={viewMode === 'monthly' ? formatMonth : formatYear}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: any, name: string) => {
                      return [
                        name === 'Products Sold' ? value : formatCurrency(value),
                        name === 'Products Sold' ? 'Products Sold' : 'Revenue',
                      ];
                    }}
                    labelFormatter={(label) => (viewMode === 'monthly' ? formatMonth(label) : formatYear(label))}
                  />
                  <Bar yAxisId="left" dataKey="sales" fill="#0ea5e9" name="Products Sold" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#22c55e" name="Revenue" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="tab-content">
          <div className="products-grid">
            {/* Top Viewed Products */}
            <div className="top-products-card">
              <div className="top-products-header">
                <div className="top-products-title-section">
                  <div className="top-products-icon">👁️</div>
                  <div>
                    <h3 className="top-products-title">Most Viewed</h3>
                    <p className="top-products-subtitle">{topViewedProducts.length} trending products</p>
                  </div>
                </div>
              </div>
              <div className="top-products-list-modern">
                {topViewedProducts.length === 0 ? (
                  <div className="no-data-modern">
                    <div className="no-data-icon">📊</div>
                    <p>No product views yet</p>
                  </div>
                ) : (
                  topViewedProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="top-product-item-modern"
                      onClick={() => handleTopProductClick(product.productId)}
                    >
                      <div
                        className="product-rank-modern"
                        style={{ background: `linear-gradient(135deg, #0ea5e9, #0284c7)` }}
                      >
                        <span className="rank-number-modern">#{index + 1}</span>
                      </div>
                      {product.mainImageUrl ? (
                        <img src={product.mainImageUrl} alt={product.productName} className="product-image-thumbnail" />
                      ) : (
                        <div className="product-image-placeholder">📷</div>
                      )}
                      <div className="product-info-modern">
                        <h4 className="product-name-modern">
                          {product.teamName} - {product.productName}
                        </h4>
                        <div className="product-metric">
                          <span className="metric-icon">👁️</span>
                          <span className="metric-value">{product.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <div className="product-arrow">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Sold Products */}
            <div className="top-products-card">
              <div className="top-products-header">
                <div className="top-products-title-section">
                  <div className="top-products-icon">🏆</div>
                  <div>
                    <h3 className="top-products-title">Best Sellers</h3>
                    <p className="top-products-subtitle">{topSoldProducts.length} top performers</p>
                  </div>
                </div>
              </div>
              <div className="top-products-list-modern">
                {topSoldProducts.length === 0 ? (
                  <div className="no-data-modern">
                    <div className="no-data-icon">📦</div>
                    <p>No sales data yet</p>
                  </div>
                ) : (
                  topSoldProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="top-product-item-modern"
                      onClick={() => handleTopSoldProductClick(product.productId)}
                    >
                      <div
                        className="product-rank-modern"
                        style={{ background: `linear-gradient(135deg, #22c55e, #16a34a)` }}
                      >
                        <span className="rank-number-modern">#{index + 1}</span>
                      </div>
                      {product.mainImageUrl ? (
                        <img src={product.mainImageUrl} alt={product.productName} className="product-image-thumbnail" />
                      ) : (
                        <div className="product-image-placeholder">📷</div>
                      )}
                      <div className="product-info-modern">
                        <h4 className="product-name-modern">
                          {product.teamName} - {product.productName}
                        </h4>
                        <div className="product-metric">
                          <span className="metric-icon">📦</span>
                          <span className="metric-value">{product.quantitySold} sold</span>
                        </div>
                      </div>
                      <div className="product-arrow">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="tab-content">
          {/* Low Stock Products */}
          <div className="inventory-section">
            <div className="section-header">
              <h2>Low Stock Alert</h2>
              <div className="section-badge warning">{lowStockProducts.length} items</div>
            </div>
            <div className="inventory-list">
              {lowStockProducts.length === 0 ? (
                <div className="empty-state success">
                  <div className="empty-icon">✅</div>
                  <h3>All Good!</h3>
                  <p>No low stock products found. Great inventory management!</p>
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="inventory-item low-stock"
                    onClick={() => handleLowStockProductClick(product.id)}
                  >
                    <div className="item-icon">⚠️</div>
                    <div className="item-details">
                      <h4>{product.name}</h4>
                      <p className="item-type">{product.type}</p>
                      <div className="stock-breakdown">
                        {product.sizes.map((size) => (
                          <span
                            key={size.size}
                            className={`stock-badge ${size.quantity === 0 ? 'out' : size.quantity <= 2 ? 'low' : 'ok'}`}
                          >
                            {size.size}: {size.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="item-arrow">→</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* No Stock Products */}
          <div className="inventory-section">
            <div className="section-header">
              <h2>Out of Stock</h2>
              <div className="section-badge danger">{noStockProducts.length} items</div>
            </div>
            <div className="inventory-list">
              {noStockProducts.length === 0 ? (
                <div className="empty-state success">
                  <div className="empty-icon">🎉</div>
                  <h3>Perfect!</h3>
                  <p>No out of stock products. Keep up the great work!</p>
                </div>
              ) : (
                noStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="inventory-item out-of-stock"
                    onClick={() => handleNoStockProductClick(product.id)}
                  >
                    <div className="item-icon">🚫</div>
                    <div className="item-details">
                      <h4>{product.name}</h4>
                      <p className="item-type">{product.type}</p>
                      <div className="stock-breakdown">
                        {product.sizes.map((size) => (
                          <span
                            key={size.size}
                            className={`stock-badge ${size.quantity === 0 ? 'out' : size.quantity <= 2 ? 'low' : 'ok'}`}
                          >
                            {size.size}: {size.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="item-arrow">→</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
