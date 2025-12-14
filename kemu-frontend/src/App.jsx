import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Admissions from './pages/Admissions';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SchoolsPage from './pages/Admin/SchoolsPage';
import ProgramsPage from './pages/Admin/ProgramsPage';
import NewsPage from './pages/Admin/NewsPage';
import EventsPage from './pages/Admin/EventsPage';
import InquiriesPage from './pages/Admin/InquiriesPage';
import Chatbot from './widgets/Chatbot';

const ScrollToTop = () => {
  const { pathname } = window.location;
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetails />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetails />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/schools" element={<SchoolsPage />} />
            <Route path="/admin/programs" element={<ProgramsPage />} />
            <Route path="/admin/news" element={<NewsPage />} />
            <Route path="/admin/events" element={<EventsPage />} />
            <Route path="/admin/inquiries" element={<InquiriesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;


