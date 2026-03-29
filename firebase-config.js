import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAFwAW39PfZ5K73zKNImq1wOQw4oXj0pbo",
    authDomain: "jp08041.firebaseapp.com",
    projectId: "jp08041",
    storageBucket: "jp08041.firebasestorage.app",
    messagingSenderId: "870601458638",
    appId: "1:870601458638:web:2a954a2ce5731065b3219f",
    measurementId: "G-F1FQ043HWE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const appId = "test1";

// 전역 변수 설정
window.db = db;
window.auth = auth;
window.appId = appId;
window.firebaseUtils = { collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc };

// 구글 로그인/로그아웃 함수
window.login = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error("로그인 실패:", e);
        alert("로그인 중 오류가 발생했습니다.");
    }
};
window.logout = () => signOut(auth);

// 인증 상태 감시 및 UI 동기화
onAuthStateChanged(auth, (user) => {
    // 전역 auth 객체 업데이트
    window.auth.currentUser = user;

    // 상단 상태 라이트 제어
    const light = document.getElementById('status-light');
    if (light) {
        if (user) {
            light.classList.remove('bg-gray-500');
            light.classList.add('bg-green-500');
        } else {
            light.classList.remove('bg-green-500');
            light.classList.add('bg-gray-500');
        }
    }

    // [중요] community.js에 있는 UI 업데이트 함수 호출
    if (typeof window.updateAuthUI === "function") {
        window.updateAuthUI(user);
    }

    // 게시글 로드 시작
    if (typeof window.loadPosts === "function") {
        window.loadPosts();
    }
});