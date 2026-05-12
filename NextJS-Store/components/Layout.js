import Navbar from './Navbar';
import Footer from './Footer';

// Global Layout: ห่อ Navbar + เนื้อหาหน้า (children) + Footer — ใช้ร่วมทุกหน้าผ่าน _app.js
export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px' }}>{children}</main>
      <Footer />
    </div>
  );
}
