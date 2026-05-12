import axios from 'axios';

// ใช้ [id].js เพื่อทำ Dynamic Routing: ค่าใน URL (/product/1, /product/2, ...) จะเข้า params.id
export default function ProductDetail({ product }) {
  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <img src={product.image} alt={product.title} style={{ width: '300px', objectFit: 'contain' }} />
      <div>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p style={{ color: 'gray' }}>{product.category}</p>
        <h3 style={{ color: '#EF4444' }}>${product.price}</h3>
      </div>
    </div>
  );
}

// ดึงข้อมูลสินค้ารายการเดียวจาก API ฝั่ง Server ตาม params.id (SSR ทุกครั้งที่เข้า URL คนละ id)
export async function getServerSideProps({ params }) {
  // ดึงข้อมูลเฉพาะ ID ที่คลิกเข้ามา
  const res = await axios.get(`https://fakestoreapi.com/products/${params.id}`);
  return { props: { product: res.data } };
}
