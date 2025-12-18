import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './widgets/Chatbot';
import GlobalBackground from './components/GlobalBackground';
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Admissions from './pages/Admissions';
import Careers from './pages/Careers';
import Apply from './pages/Apply';
// import Students from './pages/Students';
import About from './pages/About';
import ProgrammesAll from './pages/ProgrammesAll';
import Schools from './pages/Schools';
import Portals from './pages/Portals';
import Admin from './pages/Admin';
import Inbox from './pages/Inbox';

// TVET Pages
import { TVETHome, TVETPrograms, TVETAdmissions, TVETCareers, TVETAbout, TVETAdmin, TVETApply, TVETNews } from './pages/tvet';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <GlobalBackground />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:slug" element={<ProgramDetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetails />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/apply/:slug" element={<Apply />} />
              {/* <Route path="/students" element={<Students />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/programmes" element={<ProgrammesAll />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/portals" element={<Portals />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/inbox" element={<Inbox />} />

              {/* TVET Routes */}
              <Route path="/tvet" element={<TVETHome />} />
              <Route path="/tvet/programs" element={<TVETPrograms />} />
              <Route path="/tvet/admissions" element={<TVETAdmissions />} />
              <Route path="/tvet/careers" element={<TVETCareers />} />
              <Route path="/tvet/about" element={<TVETAbout />} />
              <Route path="/tvet/admin" element={<TVETAdmin />} />
              <Route path="/tvet/apply/:slug" element={<TVETApply />} />
              <Route path="/tvet/news" element={<TVETNews />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;