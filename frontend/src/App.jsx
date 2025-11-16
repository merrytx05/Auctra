import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AuctionDetails from './pages/AuctionDetails';
import Dashboard from './pages/Dashboard';
import CreateAuction from './pages/CreateAuction';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-8">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auctions" element={<Home />} />
                <Route path="/auction/:id" element={<AuctionDetails />} />
                <Route path="/profile/:userId" element={<Profile />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/create-auction"
                  element={
                    <ProtectedRoute role="seller">
                      <CreateAuction />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Toast />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
