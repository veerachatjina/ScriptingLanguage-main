// หน้า About แบบ Static — ไม่มี getServerSideProps/getStaticProps จึงถูก pre-render เป็นหน้านิ่งตอน build (เหมาะกับเนื้อหาที่ไม่ต้องดึง API)
export default function About() {
  return (
    <div>
      <h1>This is MyStore.</h1>
      <h2>STONE</h2>
    </div>
  );
}
