import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { api } from './services/api';

type PageRoute = 'home' | 'admin_login' | 'admin_dashboard';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');

  useEffect(() => {
    // Check initial pathname
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin/login') {
        setCurrentRoute('admin_login');
      } else if (path === '/admin/dashboard') {
        // Verify if admin is authenticated
        api
          .getMe()
          .then(() => setCurrentRoute('admin_dashboard'))
          .catch(() => {
            window.history.replaceState(null, '', '/admin/login');
            setCurrentRoute('admin_login');
          });
      } else {
        setCurrentRoute('home');
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    if (route === 'admin_login') {
      window.history.pushState(null, '', '/admin/login');
    } else if (route === 'admin_dashboard') {
      window.history.pushState(null, '', '/admin/dashboard');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {currentRoute === 'home' && (
          <HomePage onOpenAdminLogin={() => navigateTo('admin_login')} />
        )}
        {currentRoute === 'admin_login' && (
          <AdminLoginPage
            onLoginSuccess={() => navigateTo('admin_dashboard')}
            onBackToHome={() => navigateTo('home')}
          />
        )}
        {currentRoute === 'admin_dashboard' && (
          <AdminDashboardPage
            onLogout={() => navigateTo('admin_login')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
