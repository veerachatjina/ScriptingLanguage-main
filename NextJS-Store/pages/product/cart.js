import axios from 'axios';

// หมายเหตุโครงสร้างโปรเจกต์: ไฟล์นี้อยู่ที่ pages/product/cart.js → เส้นทาง URL คือ /product/cart (โจทย์อาจอ้างถึงหน้า cart ใน Lab 10)
export default function Cart({ cartData }) {
  return (
    <div>
      <h2>ตะกร้าสินค้า (User 2)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#F3F4F6', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Product</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Price</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Qty</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Sum</th>
          </tr>
        </thead>
        <tbody>
          {cartData.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>${item.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.quantity}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ดึงตะกร้า user/2 + รายการสินค้าทั้งหมด ฝั่ง Server แล้ว map จับคู่ productId กับชื่อ/ราคาจาก /products (SSR)
export async function getServerSideProps() {
  // 1. ดึงข้อมูลตะกร้าของ User 2
  const cartRes = await axios.get('https://fakestoreapi.com/carts/user/2');
  const userCart = cartRes.data[0]; // สมมติว่าเอาตะกร้าแรกที่เจอ

  // 2. ดึงข้อมูลสินค้าทั้งหมดเพื่อเอาชื่อและราคามาโชว์
  const productRes = await axios.get('https://fakestoreapi.com/products');
  const allProducts = productRes.data;

  // 3. เอาข้อมูลตะกร้ามาจับคู่กับชื่อและราคาสินค้า
  const cartData = userCart.products.map(cartItem => {
    const productDetail = allProducts.find(p => p.id === cartItem.productId);
    return {
      title: productDetail.title,
      price: productDetail.price,
      quantity: cartItem.quantity
    };
  });

  return { props: { cartData } };
}
