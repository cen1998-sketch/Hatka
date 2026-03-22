import { Provider } from 'react-redux';
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
import { HotelCreation } from './pages/HotelCreation/HotelCreation.tsx';
import { Checkout } from './pages/Checkout/Checkout.tsx';
import { Search } from './pages/Search/Search.tsx';
import { AuthCallback } from './pages/Login/AuthCallback.tsx';
import { ModerationLogin } from './pages/Moderation/ModerationLogin.tsx';
import { ModerationDashboard } from './pages/Moderation/ModerationDashboard.tsx';
import './index.css';

const RootLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login');
  const isModerationPage = location.pathname.startsWith('/moderation');
  
  if (isAuthPage || isModerationPage) {
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
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/property/:id/checkout" element={<Checkout />} />
            <Route path="/search" element={<Search />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create" element={<CreateListing />} />
            <Route path="/dashboard/create/hotel" element={<HotelCreation />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/moderation/login" element={<ModerationLogin />} />
            <Route path="/moderation/dashboard" element={<ModerationDashboard />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
