import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountTypeSelection from './pages/AccountTypeSelection';
import IndividualRegistration from './pages/IndividualRegistration';
import VerificationSelection from './pages/VerificationSelection';
import InformationReview from './pages/InformationReview';
import TermsAndConditions from './pages/TermsAndConditions';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Guides from './pages/Guides';
import Templates from './pages/Templates';
import FAQs from './pages/FAQs';
import About from './pages/About';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import { Toaster } from './components/ui/toaster';
import { useAuthStore } from './store/useAuthStore';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/signup" element={<AccountTypeSelection />} />
        <Route path="/signup/terms/:sessionId" element={<TermsAndConditions />} />
        <Route path="/signup/individual/:sessionId" element={<IndividualRegistration />} />
        <Route path="/signup/review/:userId" element={<InformationReview />} />
        <Route path="/signup/verify/:userId" element={<VerificationSelection />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/about" element={<About />} />
        
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
        <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;