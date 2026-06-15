import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Public Layout & Pages
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Schedule from './pages/Schedule';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import Results from './pages/Results';
import ResultPosters from './pages/ResultPosters';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Downloads from './pages/Downloads';
import Contact from './pages/Contact';
import Search from './pages/Search';

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import AdminCategories from './admin/pages/Categories';
import AdminPrograms from './admin/pages/Programs';
import AdminSchedules from './admin/pages/Schedules';
import AdminSessions from './admin/pages/Sessions';
import AdminResults from './admin/pages/Results';
import AdminPosters from './admin/pages/Posters';
import AdminGalleryImages from './admin/pages/GalleryImages';
import AdminGalleryVideos from './admin/pages/GalleryVideos';
import AdminNews from './admin/pages/NewsAdmin';
import AdminUsers from './admin/pages/Users';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1E1E2E', color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#F4B400', secondary: '#0A0A0F' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />
            <Route path="/results" element={<Results />} />
            <Route path="/posters" element={<ResultPosters />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="posters" element={<AdminPosters />} />
            <Route path="gallery/images" element={<AdminGalleryImages />} />
            <Route path="gallery/videos" element={<AdminGalleryVideos />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
