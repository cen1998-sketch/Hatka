import * as React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { store } from './app/store.ts';
import { Header } from './widgets/Header/Header.tsx';
import { Home } from './pages/Home/Home.tsx';
import { Login } from './pages/Login/Login.tsx';
import { Profile } from './pages/Profile/Profile.tsx';
import { PropertyDetail } from './pages/PropertyDetail/PropertyDetail.tsx';
import { Dashboard } from './pages/Dashboard/Dashboard.tsx';
import { Favorites } from './pages/Favorites/Favorites.tsx';
import { CreateListing } from './pages/CreateListing/CreateListing.tsx';
import { HotelCreation } from './pages/HotelCreation/HotelCreationV2.tsx';
import { PropertyCreationPage } from './pages/PropertyCreationPage/ui/PropertyCreationPage.tsx';
import { Checkout } from './pages/Checkout/Checkout.tsx';
import { Search } from './pages/Search/Search.tsx';
import { AuthCallback } from './pages/Login/AuthCallback.tsx';
import { RoomCreation } from './pages/RoomCreation/RoomCreation.tsx';
import { ModerationLogin } from './pages/Moderation/ModerationLogin.tsx';
import { ModerationDashboard } from './pages/Moderation/ModerationDashboard.tsx';
import { ListingCreateWizard as ListingCreate } from './features/listing-create/ui/ListingCreateWizard';
import './index.css';

import { selectCurrentUser, selectCurrentToken, setInitialized } from './entities/user/model/auth-slice.ts';
import { useGetProfileQuery } from './entities/user/api/userApi.ts';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isInitialized = useSelector((state: any) => state.auth.isInitialized);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const RootLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/auth-callback');
  const isModerationPage = location.pathname.startsWith('/moderation');
  const isHostAddPage = location.pathname.startsWith('/host/add');
  
  if (isAuthPage || isModerationPage || isHostAddPage) {
    return <Outlet />;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { isLoading } = useGetProfileQuery();
  
  React.useEffect(() => {
    if (!isLoading) {
      dispatch(setInitialized());
      console.log('[App] Auth initialization complete');
    }
  }, [isLoading, dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/host/add" element={<ProtectedRoute><PropertyCreationPage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/property/:id/checkout" element={<Checkout />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/dashboard/create/hotel/:id?" element={<ProtectedRoute><ListingCreate /></ProtectedRoute>} />
          <Route path="/dashboard/create/rooms/:propertyId" element={<ProtectedRoute><RoomCreation /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/moderation/login" element={<ModerationLogin />} />
          <Route path="/moderation/dashboard" element={<ModerationDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
