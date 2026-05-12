import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  StyleSheet, Text, View, Image, SafeAreaView, FlatList, 
  TouchableOpacity, StatusBar, ActivityIndicator, Alert, TextInput, 
  Platform 
} from 'react-native';

// 🟡 [LAB 6]: ระบบ Navigation พื้นฐาน
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 🟣 [LAB 8 - คำสั่งที่ 2]: Image Picker สำหรับเลือกรูปโปรไฟล์
import * as ImagePicker from 'expo-image-picker';

// 🟢 [LAB 7]: การตั้งค่าและนำเข้า Firebase
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, signOut 
} from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, getDocs, deleteDoc, addDoc, query, where, getDoc, updateDoc 
} from 'firebase/firestore';

// 🟣 [LAB 8 - ส่วนเสริม]: การใช้งาน Firebase Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ==========================================
// 🔥 Firebase Configuration
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD2kuJoxlfGbghj7e4ZdL9TcAsn3bxyOGE",
  authDomain: "labjavascript.firebaseapp.com",
  projectId: "labjavascript",
  storageBucket: "labjavascript.firebasestorage.app",
  messagingSenderId: "1036109698348",
  appId: "1:1036109698348:web:f39fc3323c8fada12d0889"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// 🔴 Authentication Screens 
// ==========================================

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      .then(() => {
        if (Platform.OS === 'web') window.alert("🎉 ยินดีต้อนรับ! เข้าสู่ระบบสำเร็จแล้ว");
        else Alert.alert("🎉 ยินดีต้อนรับ!", "เข้าสู่ระบบสำเร็จแล้ว ขอให้สนุกกับการช้อปปิ้งครับ");
        navigation.replace('Main');
      })
      .catch((error) => {
        if (Platform.OS === 'web') window.alert("❌ เข้าสู่ระบบล้มเหลว อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        else Alert.alert("❌ เข้าสู่ระบบล้มเหลว", "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      });
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <Text style={styles.authTitle}>SUT MOBILE STORE</Text>
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="รหัสผ่าน" secureTextEntry value={password} onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryBtnText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.linkText}>ลืมรหัสผ่านใช่หรือไม่?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>ยังไม่มีบัญชี? สมัครสมาชิกใหม่ที่นี่</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid;
        await setDoc(doc(db, "users", uid), { name: name, email: email.trim().toLowerCase(), photoURL: "" });
        if (Platform.OS === 'web') window.alert("✅ สำเร็จ สร้างบัญชีใหม่เรียบร้อยแล้ว");
        else Alert.alert("✅ สำเร็จ", "สร้างบัญชีใหม่เรียบร้อยแล้ว สามารถเข้าใช้งานได้ทันที");
        navigation.goBack();
      })
      .catch((error) => {
        if (Platform.OS === 'web') window.alert("⚠️ ข้อผิดพลาด: ไม่สามารถสมัครสมาชิกได้ " + error.message);
        else Alert.alert("⚠️ ข้อผิดพลาด", "ไม่สามารถสมัครสมาชิกได้: " + error.message);
      });
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <Text style={styles.authTitle}>REGISTER</Text>
      <TextInput style={styles.input} placeholder="ชื่อ - นามสกุล" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="รหัสผ่าน (6 ตัวขึ้นไป)" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
        <Text style={styles.primaryBtnText}>SIGN UP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const handleForgot = () => {
    sendPasswordResetEmail(auth, email.trim().toLowerCase())
      .then(() => {
        if (Platform.OS === 'web') window.alert("📧 ส่งลิงก์แล้ว กรุณาตรวจสอบอีเมลของคุณ");
        else Alert.alert("📧 ส่งลิงก์แล้ว", "กรุณาตรวจสอบอีเมลของคุณเพื่อทำการรีเซ็ตรหัสผ่านใหม่");
        navigation.goBack();
      })
      .catch((error) => {
        if (Platform.OS === 'web') window.alert("❌ ข้อผิดพลาด ไม่พบอีเมลนี้ในระบบ");
        else Alert.alert("❌ ข้อผิดพลาด", "ไม่พบอีเมลนี้ในระบบ");
      });
  };
  return (
    <SafeAreaView style={styles.authContainer}>
      <Text style={styles.authTitle}>FORGOT PASSWORD</Text>
      <TextInput style={styles.input} placeholder="กรอกอีเมลที่ใช้สมัคร" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleForgot}>
        <Text style={styles.primaryBtnText}>RESET PASSWORD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ==========================================
// 🔵 Main Screens 
// ==========================================

function HomeScreen() {
  const [rawData, setRawData] = useState([]);      
  const [filteredData, setFilteredData] = useState([]); 
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);    

  useEffect(() => {
    const fetchProductsFromFirebase = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = [];
        querySnapshot.forEach((doc) => { items.push({ id: doc.id, ...doc.data() }); });
        setRawData(items);
        
        if (activeFilter === 'ALL') { setFilteredData(items); } 
        else { setFilteredData(items.filter(item => parseInt(item.stock) > 0)); }
        
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchProductsFromFirebase();
  }, [activeFilter]); 

  const handleAddToCart = async (product) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await addDoc(collection(db, "cart"), { 
        uid: user.uid, 
        name: product.name, 
        price: product.price, 
        pic: product.pic || '', 
        timestamp: new Date() 
      });
      
      if (Platform.OS === 'web') window.alert(`🛒 สำเร็จ! เพิ่ม ${product.name} ลงในตะกร้าแล้ว`);
      else Alert.alert('🛒 สำเร็จ!', `เพิ่ม ${product.name} ลงในตะกร้าแล้ว`);
    } catch (e) { console.error(e); }
  };

  if (loading) return <View style={styles.loadingCenter}><ActivityIndicator size="large" color="#2563EB" /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SUT Mobile Store</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterBtn, activeFilter === 'ALL' && styles.filterBtnActive]} onPress={() => setActiveFilter('ALL')}><Text style={[styles.filterBtnText, activeFilter === 'ALL' && styles.filterBtnTextActive]}>ALL</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, activeFilter === 'IN_STOCK' && styles.filterBtnActive]} onPress={() => setActiveFilter('IN_STOCK')}><Text style={[styles.filterBtnText, activeFilter === 'IN_STOCK' && styles.filterBtnTextActive]}>IN STOCK</Text></TouchableOpacity>
        </View>
      </View>
      <FlatList data={filteredData} renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => handleAddToCart(item)}>
            <View style={styles.imageContainer}>{item.pic ? <Image source={{ uri: item.pic }} style={styles.productImage} resizeMode="contain" /> : null}</View>
            <View style={styles.infoContainer}><Text style={styles.categoryText}>{item.cate}</Text><Text style={styles.titleText}>{item.name}</Text><Text style={styles.priceText}>฿{item.price}</Text></View>
          </TouchableOpacity>
        )} keyExtractor={item => item.id} contentContainerStyle={{ padding: 15 }} />
    </SafeAreaView>
  );
}

function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const user = auth.currentUser;
    if(!user) return;
    try {
      const q = query(collection(db, "cart"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => { items.push({ id: doc.id, ...doc.data() }); });
      setCartItems(items);
    } catch (e) { console.error(e); }
  };
  useFocusEffect(useCallback(() => { fetchCart(); }, []));

  // 1️⃣ ฟังก์ชันลบสินค้าพร้อม Alert ถามยืนยัน (รองรับทั้ง Web และ App)
  const handleDeleteItem = async (docId) => { 
    const executeDelete = async () => {
      try { 
        await deleteDoc(doc(db, "cart", docId)); 
        if (Platform.OS === 'web') window.alert('✅ ลบสำเร็จ นำสินค้าออกจากตะกร้าเรียบร้อย');
        else Alert.alert('✅ ลบสำเร็จ', 'นำสินค้าออกจากตะกร้าเรียบร้อย');
        fetchCart(); 
      } catch (e) { console.error(e); } 
    };

    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm("🗑️ ยืนยันการลบ: ต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?");
      if (confirmDelete) await executeDelete();
    } else {
      Alert.alert(
        "🗑️ ยืนยันการลบ", 
        "ต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?", 
        [
          { text: "ยกเลิก", style: "cancel" },
          { text: "ลบรายการ", style: "destructive", onPress: executeDelete }
        ]
      );
    }
  };

  // 2️⃣ ฟังก์ชันสั่งซื้อ (Order) พร้อม Alert ถามยืนยัน (รองรับทั้ง Web และ App)
  const handleOrder = async () => {
    const executeOrder = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // คัดลอกเฉพาะข้อมูลพื้นฐานเพื่อป้องกัน Error
        const cleanItems = cartItems.map(item => ({
          name: item.name,
          price: item.price,
          pic: item.pic || ''
        }));

        // 2.1 บันทึกข้อมูลลง Collection 'order'
        await addDoc(collection(db, "order"), {
          uid: user.uid,
          items: cleanItems,
          orderDate: new Date()
        });

        // 2.2 ลบสินค้าที่สั่งแล้วออกจาก Collection 'cart'
        for (const item of cartItems) { 
          await deleteDoc(doc(db, "cart", item.id)); 
        }
        
        // 2.3 แจ้งเตือนสำเร็จและล้างข้อมูลบนหน้าจอ
        if (Platform.OS === 'web') window.alert('🎉 สั่งซื้อสำเร็จ! รายการสั่งซื้อของคุณถูกบันทึกเข้าระบบเรียบร้อยแล้ว');
        else Alert.alert('🎉 สั่งซื้อสำเร็จ!', 'รายการสั่งซื้อของคุณถูกบันทึกเข้าระบบเรียบร้อยแล้ว');
        setCartItems([]); 
      } catch (e) { 
        console.error(e); 
        if (Platform.OS === 'web') window.alert('❌ ผิดพลาด ไม่สามารถทำรายการสั่งซื้อได้');
        else Alert.alert('❌ ผิดพลาด', 'ไม่สามารถทำรายการสั่งซื้อได้');
      }
    };

    if (Platform.OS === 'web') {
      const confirmOrder = window.confirm("📦 ยืนยันการสั่งซื้อ: คุณต้องการสั่งซื้อสินค้าทั้งหมดในตะกร้าใช่หรือไม่?");
      if (confirmOrder) await executeOrder();
    } else {
      Alert.alert(
        "📦 ยืนยันการสั่งซื้อ", 
        "คุณต้องการสั่งซื้อสินค้าทั้งหมดในตะกร้าใช่หรือไม่?", 
        [
          { text: "ยกเลิก", style: "cancel" },
          { text: "สั่งซื้อเลย", onPress: executeOrder }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>ตะกร้าสินค้า ({cartItems.length})</Text></View>
      <FlatList data={cartItems} renderItem={({item}) => (
          <View style={styles.cartItem}>
             <View style={{flex: 1, marginRight: 10}}><Text style={styles.cartItemName}>{item.name}</Text><Text style={styles.priceText}>฿{item.price}</Text></View>
             <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteBtn}><Text style={styles.deleteBtnText}>ลบ</Text></TouchableOpacity>
          </View>
        )} keyExtractor={item => item.id} contentContainerStyle={{ padding: 15, paddingBottom: 100 }} />
      
      {/* 🟢 ปุ่มสีเขียว ORDER NOW */}
      {cartItems.length > 0 && (
        <View style={styles.bottomBtnContainer}>
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: '#10B981' }]} onPress={handleOrder}>
            <Text style={styles.clearBtnText}>ORDER NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ name: "", photoURL: null });
  const [uploading, setUploading] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) { setUserData(docSnap.data()); }
      }
    };
    loadProfile();
  }, []));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) { uploadImage(result.assets[0].uri); }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const user = auth.currentUser;
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_images/${user.uid}.jpg`);
      
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
      setUserData({ ...userData, photoURL: url });
      if (Platform.OS === 'web') window.alert("✨ สำเร็จ อัปเดตรูปโปรไฟล์ใหม่เรียบร้อยแล้ว!");
      else Alert.alert("✨ สำเร็จ", "อัปเดตรูปโปรไฟล์ใหม่เรียบร้อยแล้ว!");
    } catch (e) { 
      if (Platform.OS === 'web') window.alert("❌ ผิดพลาด ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
      else Alert.alert("❌ ผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่"); 
    } 
    finally { setUploading(false); }
  };

  const handleLogout = () => { 
    signOut(auth).then(() => { 
      if (Platform.OS === 'web') window.alert("👋 บ๊ายบาย ออกจากระบบสำเร็จ");
      else Alert.alert("👋 บ๊ายบาย", "ออกจากระบบสำเร็จ แล้วเจอกันใหม่นะครับ");
      navigation.replace('Login'); 
    }); 
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <View style={styles.profileImageWrapper}>
        {userData.photoURL ? <Image source={{ uri: userData.photoURL }} style={styles.profileImage} /> : <Text style={{fontSize: 50}}>👤</Text>}
      </View>
      <Text style={styles.profileName}>{userData.name || "Unknown User"}</Text>
      {uploading ? <ActivityIndicator size="large" color="#2563EB" /> : (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.changePicBtn} onPress={pickImage}><Text style={styles.changePicBtnText}>CHANGE PROFILE PICTURE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><Text style={styles.logoutBtnText}>LOGOUT</Text></TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ==========================================
// 🟡 Navigation
// ==========================================
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'สมัครสมาชิก' }} />
        <Stack.Screen name="Forgot" component={ForgotScreen} options={{ title: 'ลืมรหัสผ่าน' }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==========================================
// 🎨 Styles 
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  authTitle: { fontSize: 24, fontWeight: '900', marginBottom: 40, letterSpacing: 1.5, color: '#111827' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#F9FAFB' },
  primaryBtn: { width: '100%', backgroundColor: '#111827', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#2563EB', marginTop: 18, fontSize: 14, fontWeight: '600' },
  header: { backgroundColor: '#FFF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', color: '#111827' },
  filterRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, backgroundColor: '#F3F4F6', marginHorizontal: 6 },
  filterBtnActive: { backgroundColor: '#111827' },
  filterBtnText: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  filterBtnTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  imageContainer: { width: '100%', height: 160, padding: 15 },
  productImage: { width: '100%', height: '100%' },
  infoContainer: { padding: 18 },
  categoryText: { fontSize: 10, color: '#2563EB', fontWeight: '900', letterSpacing: 0.5 },
  titleText: { fontSize: 17, fontWeight: '800', marginVertical: 6, color: '#111827' },
  priceText: { fontSize: 19, fontWeight: '900', color: '#EF4444' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 18, marginBottom: 12, elevation: 2 },
  cartItemName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  deleteBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  deleteBtnText: { color: '#EF4444', fontWeight: '900', fontSize: 12 },
  bottomBtnContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(255,255,255,0.9)' },
  clearBtn: { paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 5 },
  clearBtnText: { color: '#FFF', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
  profileImageWrapper: { width: 160, height: 160, borderRadius: 25, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  profileImage: { width: '100%', height: '100%' },
  profileName: { fontSize: 26, fontWeight: '900', marginBottom: 35, color: '#111827' },
  changePicBtn: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 15, alignItems: 'center', marginBottom: 12 },
  changePicBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  logoutBtn: { backgroundColor: '#DDD6FE', padding: 16, borderRadius: 15, alignItems: 'center' },
  logoutBtnText: { color: '#7C3AED', fontWeight: '900', fontSize: 15 }
});