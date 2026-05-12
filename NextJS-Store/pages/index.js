import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home({ initialProducts }) {
  const [search, setSearch] = useState('');

  // กรองข้อมูลสินค้าตามคำค้นหา (Search) — ทำงานฝั่ง Client จาก state หลังได้ props จาก Server แล้ว
  const filteredProducts = initialProducts.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button style={{ padding: '8px 15px', backgroundColor: '#2563EB', color: 'white', border: 'none' }}>Search</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
            <h4>{product.title}</h4>
            <p style={{ color: '#EF4444', fontWeight: 'bold' }}>${product.price}</p>
            {/* File-based Routing + Dynamic Segment: ลิงก์ไป pages/product/[id].js ตาม id สินค้า */}
            <Link href={`/product/${product.id}`} style={{ color: '#2563EB' }}>
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ดึงข้อมูลก่อน Render หน้าเว็บ (อ้างอิงสไลด์หน้า 34)
// ดึงข้อมูลสินค้าจาก API ฝั่ง Server เพื่อทำ SSR (Server-Side Rendering) ผ่าน getServerSideProps
export async function getServerSideProps() {
  const res = await axios.get('https://fakestoreapi.com/products');
  return { props: { initialProducts: res.data } };
}
