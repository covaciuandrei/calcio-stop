# Calcio Stop - Football Jersey Inventory & Sales Management System

A modern, full-featured inventory and sales management system built for small businesses specializing in football jerseys and related products. Calcio Stop streamlines your entire business operation from stock management to customer sales, featuring an intuitive dashboard, advanced analytics, and complete customization options.

## 🎯 Overview

Calcio Stop started as a simple jersey stock tracker and evolved into a comprehensive business management platform. Whether you're running a local sports shop, an online jersey retailer, or managing team merchandise, Calcio Stop provides all the tools you need to scale efficiently.

### Why Calcio Stop?

- **Intuitive & Fast**: Clean, modern interface designed for quick data entry and management
- **Fully Customizable**: Drag-and-drop interface customization to match your workflow
- **Real-time Analytics**: Track sales trends, inventory levels, and customer insights
- **Public Storefront**: Built-in public pages to showcase products and badges to customers
- **Secure & Scalable**: User authentication, role-based access, and cloud-based data storage
- **Professional Design**: Modern, responsive UI that works seamlessly on desktop and mobile

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Interactive Dashboard**: Quick overview with customizable cards showing real-time metrics
- **Advanced Statistics**: Comprehensive sales analytics including:
  - Monthly and yearly sales trends with visual charts
  - Top-performing products and badges
  - Low stock and out-of-stock alerts
  - Total revenue and sales volume tracking
  - Product view tracking and engagement metrics
- **Date Range Filtering**: Analyze data for specific periods

### 📦 Inventory Management
- **Product Management**: Create and manage your product catalog with detailed information
- **Stock Tracking**: Real-time inventory levels with low-stock alerts
- **Product Images**: Upload and manage product photos with automatic compression
- **Price Management**: Set and track product pricing
- **Product Filtering**: Advanced filtering by team, badge, nameset, and kit type
- **Product Details Pages**: Detailed product views for both admin and public access

### 👕 Custom Jersey Features
- **Team Management**: Organize teams and manage team rosters
- **Nameset Management**: Create custom player name collections for jersey printing
- **Kit Types**: Define different kit types (Home, Away, Third Kit, etc.)
- **Badge Management**: Manage team badges and logos with image uploads
- **Team-Kit Combinations**: Link teams with specific kit types for accurate inventory

### 💼 Sales Management
- **Sales Tracking**: Record and monitor all sales transactions
- **Order Management**: Create, track, and manage customer orders
- **Sale Details**: Track quantities, prices, and customer information
- **Sales History**: Complete audit trail of all sales
- **Edit & Archive**: Modify or archive past sales as needed

### 🔐 Authentication & Security
- **User Registration**: Secure sign-up for new users
- **User Login**: Protected authentication system
- **Admin Controls**: Enable/disable user registration via system settings
- **Session Management**: Automatic session handling with secure logout
- **Role-Based Access**: Different access levels for different users

### 🛍️ Public Storefront
- **Public Product Catalog**: Display products to customers without login
- **Public Badge Gallery**: Showcase team badges
- **Responsive Design**: Mobile-friendly public pages
- **SEO Ready**: Accessible URLs for products and badges
- **Product Details**: Customer-facing product detail pages

### ⚙️ System Administration
- **System Settings**: Configure registration policies and system-wide settings
- **Statistics Dashboard**: Comprehensive admin view of all business metrics
- **User Management**: Control user access and permissions
- **Data Management**: Archive and manage historical data

### 🎨 Customization & UX
- **Drag-and-Drop Interface**: Rearrange dashboard cards in any order you prefer
- **Customizable Navigation**: Organize app bar buttons to match your workflow
- **Settings Popup**: Easy-to-access layout customization
- **Persistent Preferences**: Your customizations are saved and restored
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices

### 📱 Collapsible Sections
- **Dashboard Cards**: Collapse/expand dashboard sections to focus on what matters
- **Quick Toggles**: Instantly show or hide data sections

## 🏗️ Technical Architecture

### Built With
- **Frontend**: React 19.1.1 + TypeScript for type-safe, maintainable code
- **State Management**: Zustand for lightweight, efficient state management
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Drag & Drop**: dnd-kit for smooth, accessible drag-and-drop functionality
- **Charts**: Recharts for beautiful, responsive data visualizations
- **Routing**: React Router 7 for seamless client-side navigation
- **Styling**: CSS3 with modern design patterns
- **Date Handling**: date-fns for robust date manipulation
- **Image Processing**: Custom image compression for optimized uploads

### Architecture Highlights
- **Component-Based**: Modular, reusable components for maintainability
- **Type-Safe**: Full TypeScript coverage for reliability
- **Performance**: Optimized data loading with parallel requests
- **Scalable**: Store-based architecture for easy feature additions
- **API Integration**: Clean abstraction layer for database operations

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ (recommended: LTS version)
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd calcio-stop
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new project on [supabase.com](https://supabase.com)
   - Create a `.env.local` file in the project root:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
     ```
   - Go to your Supabase project's SQL Editor and run the schema from `supabase/schema.sql`
   - Apply RLS policies by running `supabase/rls_policies.sql` in the same SQL Editor

4. **Set Up Database**
   - Your database is now ready with all tables and security policies configured

### Development

Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Production Build

Create an optimized production build:
```bash
npm run build
```

The build folder is ready to be deployed. Deploy to services like:
- Netlify (includes `_redirects` file for SPA routing)
- Vercel
- Firebase Hosting
- Any static hosting provider

## 📱 Features Walkthrough

### For Business Owners
1. **Dashboard**: Get an instant overview of your business metrics
2. **Manage Products**: Add/edit products with images and pricing
3. **Track Sales**: Record every transaction and monitor trends
4. **Monitor Stock**: Get alerts when inventory is running low
5. **View Analytics**: Understand your best-selling items and customer trends
6. **Customize**: Arrange your workspace exactly how you like it

### For Customers
1. **Browse Products**: View your product catalog on the public storefront
2. **See Details**: Check images, pricing, and availability
3. **Explore Teams**: Browse available team badges and collections

## 🎯 Core Pages & Routes

### Protected Routes (Authentication Required)
- `/` - **Dashboard**: Overview with customizable cards
- `/products` - **Products**: Full product management
- `/products/:id` - **Product Details**: Detailed product view
- `/sales` - **Sales**: Sales tracking and management
- `/orders` - **Orders**: Order management
- `/namesets` - **Namesets**: Player name management
- `/teams` - **Teams**: Team organization
- `/badges` - **Badges**: Badge and logo management
- `/badges/:id` - **Badge Details**: Detailed badge view
- `/kittypes` - **Kit Types**: Kit type definitions
- `/stats` - **Statistics**: Advanced analytics dashboard
- `/settings` - **System Settings**: Admin settings

### Public Routes (No Authentication)
- `/public` - **Public Dashboard**: Showcase landing page
- `/public/products` - **Product Catalog**: Customer-facing products
- `/public/products/:id` - **Product Detail**: Customer view of product
- `/public/badges` - **Badge Gallery**: Team badges showcase
- `/public/badges/:id` - **Badge Detail**: Detailed badge view

## 💾 Data Models

The system manages the following entities:
- **Users**: Authenticated users with profiles
- **Products**: Inventory items with images and pricing
- **Sales**: Transaction records
- **Orders**: Customer orders and requests
- **Teams**: Team information and organization
- **Namesets**: Collections of player names
- **Badges**: Team logos and badge images
- **Kit Types**: Jersey kit classifications

## 🔒 Security Features

- **Authentication**: Secure user registration and login
- **Authorization**: Protected routes and role-based access
- **Data Isolation**: Row-level security (RLS) policies
- **Image Security**: Secure file uploads with validation
- **Session Management**: Automatic session handling

## 📊 Analytics & Reporting

The built-in analytics provide:
- **Sales Trends**: Monthly and yearly revenue analysis
- **Product Performance**: Top sellers and view counts
- **Inventory Alerts**: Low stock and out-of-stock reports
- **Customer Insights**: Popular products and engagement metrics
- **Time Range Analysis**: Custom date range filtering

## 🎨 UI/UX Philosophy

Calcio Stop is designed with these principles:
- **Simplicity**: Clean interface, no clutter
- **Efficiency**: Quick access to frequently used features
- **Customization**: Let users organize their workspace
- **Feedback**: Clear actions and response states
- **Accessibility**: Keyboard navigation, semantic HTML
- **Responsiveness**: Works perfectly on all screen sizes

## 📦 Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── admin/          # Admin dashboard and system settings
│   ├── auth/           # Authentication components
│   ├── badges/         # Badge management
│   ├── kittypes/       # Kit type management
│   ├── namesets/       # Nameset management
│   ├── orders/         # Order management
│   ├── products/       # Product management
│   ├── public/         # Public-facing pages
│   ├── sales/          # Sales management
│   ├── shared/         # Shared components
│   └── teams/          # Team management
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── lib/                # Utilities and services
├── utils/              # Helper functions
└── styles/             # Global styles

supabase/
├── schema.sql          # Database schema
└── rls_policies.sql    # Row-level security policies
```

## 🚀 Deployment Guide

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Deploy with one click

## 🔄 Workflow Examples

### Adding a New Product
1. Navigate to Dashboard → Products or direct to `/products`
2. Click "Add New Product"
3. Fill in product details (name, price, team, etc.)
4. Upload product images
5. Set initial stock levels
6. Save and start selling

### Recording a Sale
1. Go to Sales section
2. Click "Add New Sale"
3. Select product and quantity
4. Enter sale details (price, customer info)
5. Save transaction
6. Inventory automatically updates

### Customizing Dashboard
1. Click the settings icon (⚙️) in the navbar
2. Drag dashboard cards to reorder
3. Drag navigation items to customize the app bar
4. Click Save
5. Your layout is instantly updated

## 🎓 Learning & Development

This project showcases modern React architecture, TypeScript best practices, and full-stack web development patterns. It demonstrates state management, database design, authentication, and responsive UI implementation.

## 📄 License

This project is private. All rights reserved.

---

**Ready to manage your jersey business like a pro? Get started with Calcio Stop today!**
