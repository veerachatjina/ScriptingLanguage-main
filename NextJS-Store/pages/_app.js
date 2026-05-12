import Layout from '../components/Layout';
import '../styles/global.css';

// Custom App: ห่อทุกหน้าด้วย Layout — Component คือหน้าที่กำลังเปิด, pageProps มาจาก getServerSideProps/getStaticProps ของแต่ละหน้า
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
