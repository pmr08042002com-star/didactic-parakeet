/**
 * js/community.js
 * Firebase 게시판 및 인증
 */

let allPosts = []; 

function handleAuth() {
    if (window.auth && window.auth.currentUser) window.logout();
    else window.login();
}

window.loadPosts = function() {
    const { db, appId, firebaseUtils } = window;
    if (!db) return;
    const q = firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts');
    firebaseUtils.onSnapshot(q, (snap) => {
        allPosts = [];
        snap.forEach(d => allPosts.push({ id: d.id, ...d.data() }));
        allPosts.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        filterPosts(); 
    });
}

function renderPosts(postsToRender) {
    const list = document.getElementById('post-list');
    if(!list) return;
    list.innerHTML = "";
    if(postsToRender.length === 0) {
        list.innerHTML = "<p class='text-center text-[10px] text-gray-300 py-10 uppercase tracking-widest'>Archive is empty.</p>";
        return;
    }
    postsToRender.forEach(p => {
        const isMyPost = window.auth.currentUser && window.auth.currentUser.uid === p.uid;
        const row = document.createElement('div');
        row.className = "flex gap-6 border-b border-gray-50 pb-3 items-center hover:bg-gray-50 transition p-2 group text-[11px]";
        row.innerHTML = `
            <div class="font-black min-w-[80px] uppercase truncate ${isMyPost ? 'text-blue-600' : 'opacity-40'}">${p.author}</div>
            <div class="text-gray-500 font-medium flex-grow">${p.content}</div>
            ${isMyPost ? `<button onclick="deleteMsg('${p.id}', '${p.uid}')" class="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-red-400 hover:text-red-600 transition uppercase tracking-tighter">Delete</button>` : ''}
        `;
        list.appendChild(row);
    });
}

function filterPosts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || "";
    const filtered = allPosts.filter(p => (p.author || "").toLowerCase().includes(searchTerm) || (p.content || "").toLowerCase().includes(searchTerm));
    renderPosts(filtered);
}

async function sendMsg() {
    const user = window.auth.currentUser;
    if(!user) return alert("LOGIN REQUIRED");
    const content = document.getElementById('p-msg').value;
    if(!content) return;
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.addDoc(firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts'), {
            author: user.displayName, uid: user.uid, content: content, createdAt: firebaseUtils.serverTimestamp()
        });
        document.getElementById('p-msg').value = "";
    } catch(e) { alert("FAIL"); }
}

async function deleteMsg(postId, writerUid) {
    const user = window.auth.currentUser;
    if(!user || user.uid !== writerUid) {
        alert("본인이 작성한 글만 삭제할 수 있습니다.");
        return;
    }
    if(!confirm("이 기록을 삭제하시겠습니까?")) return;
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.deleteDoc(firebaseUtils.doc(db, 'artifacts', appId, 'public', 'data', 'posts', postId));
    } catch (e) { alert("삭제 권한이 없습니다."); }
}

/** js/community.js **/
// 초기 공지글이나 연구 데이터 가이드로 활용
function showResearchGuide() {
    console.log("YOLO Labeling Guide: Class 1(Bow), Class 2(Port/Starboard), Class 3(Stern), Class 4(Aux), Class 5(Furniture)");
    // 이 데이터를 커뮤니티 섹션 상단에 '연구 가이드'로 렌더링하는 코드 추가 가능
}