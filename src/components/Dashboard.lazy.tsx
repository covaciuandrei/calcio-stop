
// Lazy load all dashboard page components
import BadgesPage from './badges/BadgesPage';
import KitTypesPage from './kittypes/KitTypesPage';
import LeaguesPage from './leagues/LeaguesPage';
import NamesetsPage from './namesets/NamesetsPage';
import ProductsPage from './products/ProductsPage';
import ReservationsPage from './reservations/ReservationsPage';
import ReturnsPage from './returns/ReturnsPage';
import SalesPage from './sales/SalesPage';
import TeamsPage from './teams/TeamsPage';



// Standard components (formerly lazy)
export const LazyProductsPage = () => <ProductsPage />;
export const LazySalesPage = () => <SalesPage />;
export const LazyReturnsPage = () => <ReturnsPage />;
export const LazyNamesetsPage = () => <NamesetsPage />;

export const LazyTeamsPage = () => <TeamsPage />;
export const LazyBadgesPage = () => <BadgesPage />;
export const LazyKitTypesPage = () => <KitTypesPage />;
export const LazyLeaguesPage = () => <LeaguesPage />;
export const LazyReservationsPage = () => <ReservationsPage />;
