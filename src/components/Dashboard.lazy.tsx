import React, { Suspense } from 'react';

// Lazy load all dashboard page components
const ProductsPage = React.lazy(() => import('./products/ProductsPage'));
const SalesPage = React.lazy(() => import('./sales/SalesPage'));
const ReturnsPage = React.lazy(() => import('./returns/ReturnsPage'));
const NamesetsPage = React.lazy(() => import('./namesets/NamesetsPage'));
const TeamsPage = React.lazy(() => import('./teams/TeamsPage'));
const BadgesPage = React.lazy(() => import('./badges/BadgesPage'));
const KitTypesPage = React.lazy(() => import('./kittypes/KitTypesPage'));
const LeaguesPage = React.lazy(() => import('./leagues/LeaguesPage'));
const ReservationsPage = React.lazy(() => import('./reservations/ReservationsPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-spinner" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#666'
  }}>
    <div>Loading...</div>
  </div>
);

// Lazy-loaded components with Suspense
export const LazyProductsPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <ProductsPage />
  </Suspense>
);

export const LazySalesPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <SalesPage />
  </Suspense>
);

export const LazyReturnsPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <ReturnsPage />
  </Suspense>
);

export const LazyNamesetsPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <NamesetsPage />
  </Suspense>
);

export const LazyTeamsPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <TeamsPage />
  </Suspense>
);

export const LazyBadgesPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <BadgesPage />
  </Suspense>
);

export const LazyKitTypesPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <KitTypesPage />
  </Suspense>
);

export const LazyLeaguesPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <LeaguesPage />
  </Suspense>
);

export const LazyReservationsPage = () => (
  <Suspense fallback={<LoadingFallback />}>
    <ReservationsPage />
  </Suspense>
);
