import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ToastProvider, useToast } from './context/ToastContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { DashboardSidebar } from './components/DashboardSidebar.js';
import { LandingPage } from './components/LandingPage.js';
import { AboutPage } from './components/AboutPage.js';
import { EcosystemPage } from './components/EcosystemPage.js';
import { ProductsPage } from './components/ProductsPage.js';
import { ProductDetailPage } from './components/ProductDetailPage.js';
import { LearningPage } from './components/LearningPage.js';
import { CourseDetailPage } from './components/CourseDetailPage.js';
import { ContactPage } from './components/ContactPage.js';
import { SupportPage } from './components/SupportPage.js';
import {
  PrivacyPage,
  TermsPage,
  RefundPolicyPage,
  TaskPolicyPage
} from './components/LegalPages.js';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './components/AuthPages.js';
import { UserDashboard } from './components/UserDashboard.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import type { Product, Course } from './types/index.js';
import { apiRequest } from './lib/api.js';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Selected state for details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sync with browser navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve dynamic product by slug if page refreshed on /products/:slug
  useEffect(() => {
    if (currentPath.startsWith('/products/') && !selectedProduct) {
      const slug = currentPath.replace('/products/', '');
      apiRequest<{ product: Product }>(`/api/products/${slug}`)
        .then((res) => setSelectedProduct(res.product))
        .catch(() => navigate('/products'));
    }
  }, [currentPath]);

  // Resolve dynamic course by id if refreshed on /learning/:courseId
  useEffect(() => {
    if (currentPath.startsWith('/learning/') && !selectedCourse) {
      const id = currentPath.replace('/learning/', '');
      apiRequest<{ course: Course }>(`/api/courses/${id}`)
        .then((res) => setSelectedCourse(res.course))
        .catch(() => navigate('/learning'));
    }
  }, [currentPath]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#176B3A] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#17231C]">Initializing WealthFarm Platform...</span>
        </div>
      </div>
    );
  }

  // --- Route Handlers ---
  const isDashboardRoute = currentPath.startsWith('/dashboard');
  const isAdminRoute = currentPath.startsWith('/admin');

  // Authorization Guards
  if (isDashboardRoute && !user) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9]">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <LoginPage navigate={navigate} />
        <Footer navigate={navigate} />
      </div>
    );
  }

  if (isAdminRoute) {
    if (!user) {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <LoginPage navigate={navigate} />
          <Footer navigate={navigate} />
        </div>
      );
    }
    if (user.role !== 'ADMIN') {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#17231C]">Directorate Access Denied</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Your account ({user.email}) has USER role privileges. Directorate administration requires ADMIN authorization.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#176B3A] rounded-lg"
            >
              Return to Member Dashboard
            </button>
          </div>
          <Footer navigate={navigate} />
        </div>
      );
    }
  }

  // Render Dashboard Views
  if (isDashboardRoute) {
    let subroute = currentPath;
    let params: any = {};

    if (currentPath.startsWith('/dashboard/tasks/') && currentPath.endsWith('/submit')) {
      subroute = '/dashboard/tasks/submit';
      params.taskId = currentPath.replace('/dashboard/tasks/', '').replace('/submit', '');
    } else if (currentPath.startsWith('/dashboard/support/') && currentPath !== '/dashboard/support/new') {
      subroute = '/dashboard/support/ticket';
      params.ticketId = currentPath.replace('/dashboard/support/', '');
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <div className="flex-1 flex flex-col md:flex-row">
          <DashboardSidebar currentPath={currentPath} navigate={navigate} isAdmin={false} />
          <main className="flex-1 overflow-x-hidden">
            <UserDashboard currentSubroute={subroute} navigate={navigate} subrouteParams={params} />
          </main>
        </div>
      </div>
    );
  }

  // Render Admin Views
  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <div className="flex-1 flex flex-col md:flex-row">
          <DashboardSidebar currentPath={currentPath} navigate={navigate} isAdmin={true} />
          <main className="flex-1 overflow-x-hidden">
            <AdminDashboard currentSubroute={currentPath} navigate={navigate} />
          </main>
        </div>
      </div>
    );
  }

  // Public Views
  let pageContent = null;
  if (currentPath === '/') {
    pageContent = (
      <LandingPage
        navigate={navigate}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    );
  } else if (currentPath === '/about') {
    pageContent = <AboutPage navigate={navigate} />;
  } else if (currentPath === '/ecosystem') {
    pageContent = <EcosystemPage navigate={navigate} />;
  } else if (currentPath === '/products') {
    pageContent = (
      <ProductsPage
        navigate={navigate}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    );
  } else if (currentPath.startsWith('/products/') && selectedProduct) {
    pageContent = <ProductDetailPage product={selectedProduct} navigate={navigate} />;
  } else if (currentPath === '/learning') {
    pageContent = (
      <LearningPage
        navigate={navigate}
        onSelectCourse={(c) => setSelectedCourse(c)}
      />
    );
  } else if (currentPath.startsWith('/learning/') && selectedCourse) {
    pageContent = <CourseDetailPage course={selectedCourse} navigate={navigate} />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage navigate={navigate} />;
  } else if (currentPath === '/support') {
    pageContent = <SupportPage navigate={navigate} />;
  } else if (currentPath === '/privacy') {
    pageContent = <PrivacyPage navigate={navigate} />;
  } else if (currentPath === '/terms') {
    pageContent = <TermsPage navigate={navigate} />;
  } else if (currentPath === '/refund-policy') {
    pageContent = <RefundPolicyPage navigate={navigate} />;
  } else if (currentPath === '/task-policy') {
    pageContent = <TaskPolicyPage navigate={navigate} />;
  } else if (currentPath === '/login') {
    pageContent = <LoginPage navigate={navigate} />;
  } else if (currentPath === '/register') {
    pageContent = <RegisterPage navigate={navigate} />;
  } else if (currentPath === '/forgot-password') {
    pageContent = <ForgotPasswordPage navigate={navigate} />;
  } else {
    pageContent = (
      <LandingPage
        navigate={navigate}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9]">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{pageContent}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
