import Link from 'next/link';

// เมนูนำทาง — ใช้ next/link สำหรับ Client-side Navigation ตามเส้นทางไฟล์ใน pages/ (File-based Routing)
export default function Navbar() {
  return (
    <nav style={{ padding: '15px', backgroundColor: '#F3F4F6', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <h2 style={{ color: '#8B5CF6', margin: 0 }}>B MyStore</h2>
      <Link href="/">Home</Link>
      <Link href="/product/cart">Cart</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
