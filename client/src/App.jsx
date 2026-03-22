import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Weather from './pages/Weather.jsx';
import CloudSecurityPolicy from './pages/CloudSecurityPolicy.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="weather" element={<Weather />} />
        <Route path="cloud-security-policy" element={<CloudSecurityPolicy />} />
      </Route>
    </Routes>
  );
}
