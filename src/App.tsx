import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WeatherProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </WeatherProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;