/**
 * js/community.js
 * Firebase 게시판 연동 및 렌더링 (로그인 연동 포함)
 */

let allPosts = []; // 전체 게시글 저장용 배열

// [추가] 로그인 상태에 따라 UI를 업데이트하는 함수
window.updateAuthUI = function(user) {
    const nameInput = document.getElementById('p-name');
    const msgInput = document.getElementById('p-msg');
    const authBtn = document.getElementById('auth-btn');

    if (user) {
        // 로그인 성공 시
        if (nameInput) {
            nameInput.value = user.displayName || "PILOT";
            nameInput.classList.remove('bg-gray-100');
            nameInput.classList.add('bg-white', 'text-blue-600');
        }
        if (msgInput) {
            msgInput.placeholder = "공유할 전술이나 YOLO 데이터를 입력하세요...";
            msgInput.readOnly = false;
        }
        if (authBtn) authBtn.innerText = "Logout";
    } else {
        // 로그아웃 상태
        if (nameInput) {
            nameInput.value = "";
            nameInput.placeholder = "LOGIN REQUIRED";
            nameInput.classList.add('bg-gray-100');
        }
        if (msgInput) {
            msgInput.placeholder = "로그인이 필요합니다.";
            msgInput.readOnly = true;
            msgInput.value = "";
        }
        if (authBtn) authBtn.innerText = "Login";
    }
}

// 1. Firebase에서 데이터 실시간 감시 및 로드
window.loadPosts = function() {
    const { db, appId, firebaseUtils } = window;
    if (!db || !firebaseUtils) return;
    
    const q = firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts');
    
    firebaseUtils.onSnapshot(q, (snap) => {
        allPosts = [];
        snap.forEach(d => allPosts.push({ id: d.id, ...d.data() }));
        allPosts.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        filterPosts(); 
    });
}

// 2. 화면에 게시글 리스트 그리기
function renderPosts(postsToRender) {
    const list = document.getElementById('post-list');
    if(!list) return;
    
    list.innerHTML = ""; 
    
    if(postsToRender.length === 0) {
        list.innerHTML = `
            <div class="py-20 text-center border border-dashed border-gray-200 research-highlight">
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Archive is empty.</p>
                <p class="text-[9px] text-gray-400 mt-2 uppercase">YOLO Training Data / Tactical Reports Pending...</p>
            </div>
        `;
        return;
    }

    postsToRender.forEach(p => {
        const currentUser = window.auth && window.auth.currentUser;
        const isMyPost = currentUser && currentUser.uid === p.uid;
        
        const row = document.createElement('div');
        row.className = "flex gap-6 border-b border-gray-100 pb-4 items-center hover:bg-gray-50 transition p-3 group text-[11px] font-bold";
        
        row.innerHTML = `
            <div class="min-w-[80px] uppercase truncate ${isMyPost ? 'text-blue-600' : 'opacity-40'}">${p.author || 'Anonymous'}</div>
            <div class="text-gray-600 flex-grow">${p.content}</div>
            <div class="text-[9px] opacity-20 font-black uppercase whitespace-nowrap">${formatDate(p.createdAt)}</div>
            ${isMyPost ? `<button onclick="deleteMsg('${p.id}', '${p.uid}')" class="opacity-0 group-hover:opacity-100 text-[9px] font-black text-red-400 hover:text-red-600 transition uppercase tracking-tighter">Delete</button>` : ''}
        `;
        list.appendChild(row);
    });
}

// 3. 검색 필터 기능
function filterPosts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || "";
    const filtered = allPosts.filter(p => 
        (p.author || "").toLowerCase().includes(searchTerm) || 
        (p.content || "").toLowerCase().includes(searchTerm)
    );
    renderPosts(filtered);
}

// 4. 메시지 전송 함수
async function sendMsg() {
    const user = window.auth && window.auth.currentUser;
    if(!user) return alert("LOGIN REQUIRED");

    const content = document.getElementById('p-msg').value;
    if(!content.trim()) return;

    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.addDoc(firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts'), {
            author: user.displayName || "Anonymous",
            uid: user.uid,
            content: content,
            createdAt: firebaseUtils.serverTimestamp()
        });
        document.getElementById('p-msg').value = ""; // 전송 후 입력창 비우기
    } catch(e) {
        console.error(e);
        alert("전송 실패");
    }
}

// 5. 메시지 삭제 함수
async function deleteMsg(postId, writerUid) {
    const user = window.auth && window.auth.currentUser;
    if(!user || user.uid !== writerUid) return alert("삭제 권한이 없습니다.");

    if(!confirm("이 기록을 아카이브에서 제거하시겠습니까?")) return;
    
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.deleteDoc(firebaseUtils.doc(db, 'artifacts', appId, 'public', 'data', 'posts', postId));
    } catch (e) {
        alert("삭제 중 오류가 발생했습니다.");
    }
}

// 날짜 포맷팅 보조 함수
function formatDate(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getMonth()+1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}