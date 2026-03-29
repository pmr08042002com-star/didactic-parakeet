/**
 * TEST ARCHIVE - 2026 Season Tactical Data System
 * 통합 관리 스크립트
 */

let allPosts = []; 
let ddayInterval;
const targetDate = new Date("May 1, 2026 00:00:00").getTime();

// [1. 함선 정밀 데이터 - 2026 보고서 기반]
const shipData = {
    'barque': {
        name: "Barque (바크)",
        stats: [65, 90, 75, 100, 85], // 화력, 생존, 속도, 복구, 적재
        description: "패시브 'Rejuvenate'를 통한 자가 수리 특화. 솔로 파밍 및 지속 교전의 지배자입니다.",
        guide: [
            { title: "SUSTAINABILITY", content: "별도 가구 없이도 심각한 피해(Severe Damage) 복구가 가능합니다. 수리 키트 절약에 최적화되어 있습니다." },
            { title: "LOADOUT", content: "돛을 묶는 '장거리포'와 상시 가동되는 '해불' 조합으로 안정적인 파밍 루트를 확보하십시오." }
        ]
    },
    'corvette': {
        name: "Corvette (코르벳) [Rank 17]",
        stats: [98, 75, 85, 65, 55],
        description: "Y2S4 신규 대형 함선. 체력 102,720(Lv.7)의 압도적 스펙과 함대 버프 능력을 보유합니다.",
        guide: [
            { title: "FLAGBEARER (표준 기수)", content: "적 타격 시 피해량 최대 20% 증가, 아군 수리 시 효율 최대 50% 증가. 연사력이 높은 컬버린이나 로켓으로 빠르게 스택을 쌓으십시오." },
            { title: "UPGRADED MARK", content: "6단계 업그레이드 시 적 약점 피해 10% 증폭 및 아군 심각한 피해 복구 능력이 추가됩니다." }
        ]
    },
    'sambuk': {
        name: "Sambuk (삼부크)",
        stats: [100, 50, 80, 40, 60],
        description: "화염 특화 DPS 1티어. '인퍼널 모' 보조 무기와 최상의 시너지를 냅니다.",
        guide: [
            { title: "SCORCHED EARTH", content: "불타는 적에게 피해 30% 증가. 150m 반경 상태 이상 전이를 활용해 다수의 적을 섬멸하십시오." }
        ]
    },
    'brigantine': {
        name: "Brigantine (브리건틴)",
        stats: [75, 65, 100, 40, 70],
        description: "가장 빠른 속도와 강력한 충돌 대미지를 자랑하는 돌격함입니다.",
        guide: [
            { title: "RAMMING MASTER", content: "최고 속도로 적 배를 들이받으세요. 충돌 대미지만으로 소형선은 즉사시킬 수 있습니다." }
        ]
    },
    'snow': {
        name: "Snow (스노우)",
        stats: [55, 100, 50, 65, 95],
        description: "엄청난 맷집과 적재량을 가진 해상 요새입니다. 초보자에게 가장 안전한 선택입니다.",
        guide: [
            { title: "IRON HULL", content: "모든 배 중 가장 높은 방어력(Brace) 효율을 가집니다. 정통 탱커 전술에 적합합니다." }
        ]
    }
};

// [2. 무역로 및 경제 데이터 - 2026 보고서 기반]
const routeData = {
    'harufu': {
        title: "Harufu (하루푸) - Africa Coast",
        detail: "현 메타 최강의 거점. 11개 무역로 연결, 10레벨 시 시간당 522 Po8 생산. 오버클럭 시 시간당 최대 20,000 Po8 가능."
    },
    'red-isle': {
        title: "East Red Isle Protocol",
        detail: "세인트 안느 주변 고효율 루트. 담배와 사탕수수 수급이 용이하며 소형선 파밍에 최적화되어 있습니다."
    }
};

const economyTip = {
    silver: "골드 스컬 럼/실버 스너프 가공 후 매각 시 15분당 24만 실버 순수익 발생.",
    funding: "제조소 10레벨 달성 시 48시간 가동 가능(Po8 4,500개 충전 필요)."
};

/**
 * 탭 전환 로직
 */
function switchTab(id) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-link')).find(btn => 
        btn.getAttribute('onclick').includes(`'${id}'`)
    );
    if(activeBtn) activeBtn.classList.add('active');
    
    const targetSection = document.getElementById(id);
    if(targetSection) targetSection.classList.add('active');
    
    // 섹션별 초기화 호출
    if(id === 'ships') initRadar();
    if(id === 'map') initMapData();
    if(id === 'archive') startDDayCounter();
    else stopDDayCounter();
}

/**
 * 디데이 카운트다운
 */
function updateDDay() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
        timerElement.innerText = "SEASON PROTOCOL INITIATED";
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    timerElement.innerText = `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

function startDDayCounter() {
    updateDDay();
    if(ddayInterval) clearInterval(ddayInterval);
    ddayInterval = setInterval(updateDDay, 1000);
}

function stopDDayCounter() {
    if(ddayInterval) clearInterval(ddayInterval);
}

/**
 * 무역로 및 경제 초기화
 */
function showRoute(key) {
    const data = routeData[key];
    if(!data) return;
    document.getElementById('route-title').innerText = data.title;
    document.getElementById('route-detail').innerText = data.detail;
}

function initMapData() {
    const silverEl = document.getElementById('tip-silver');
    const fundingEl = document.getElementById('tip-funding');
    if(silverEl) silverEl.innerText = economyTip.silver;
    if(fundingEl) fundingEl.innerText = economyTip.funding;
    showRoute('harufu'); // 초기값 설정
}

/**
 * 함선 선택 및 차트 업데이트
 */
function selectShip(key) {
    const ship = shipData[key];
    if(!ship) return;

    // 차트 업데이트
    updateRadarChart(ship.stats);

    // 상태 카드 업데이트
    const statusCard = document.getElementById('ship-status-card');
    if(statusCard) {
        statusCard.innerHTML = `
            <h3 class="text-[10px] font-black tracking-widest uppercase mb-4 text-blue-400">${ship.name}</h3>
            <p class="text-[11px] leading-relaxed opacity-70 mb-4 font-bold">${ship.description}</p>
            <div class="text-[9px] font-bold border-t border-white/10 pt-4 opacity-50 uppercase tracking-widest italic">Data Source: 2026 Research Report</div>
        `;
    }

    // 가이드 영역 업데이트
    const guideArea = document.getElementById('ship-guide');
    if(guideArea) {
        guideArea.innerHTML = ship.guide.map(item => `
            <div class="p-6 border border-black bg-gray-50 transition-all hover:bg-white hover:shadow-lg">
                <h4 class="text-[10px] font-black uppercase mb-3 underline decoration-2 underline-offset-4">${item.title}</h4>
                <p class="text-[11px] font-bold text-gray-700 leading-relaxed">${item.content}</p>
            </div>
        `).join('');
    }
}

function updateRadarChart(data) {
    const canvas = document.getElementById('radarChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(window.rChart) window.rChart.destroy();
    window.rChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['화력', '생존', '속도', '복구', '적재'],
            datasets: [{
                data: data,
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderWidth: 1,
                pointRadius: 2
            }]
        },
        options: { 
            maintainAspectRatio: false, 
            scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: '#f5f5f5' }, pointLabels: { font: { weight: '800', size: 10 } } } }, 
            plugins: { legend: { display: false } } 
        }
    });
}

function initRadar() {
    // 드롭다운 메뉴의 현재 값 또는 기본값(barque)으로 초기화
    const selector = document.getElementById('ship-selector');
    const initialShip = selector ? selector.value : 'barque';
    selectShip(initialShip);
}

/**
 * 인증 및 게시판 로직
 */
window.updateAuthUI = function(user) {
    const nameInput = document.getElementById('p-name');
    const msgInput = document.getElementById('p-msg');
    const authBtn = document.getElementById('auth-btn');

    if (user) {
        if(nameInput) { nameInput.value = user.displayName; nameInput.readOnly = true; }
        if(msgInput) { msgInput.placeholder = "메시지를 입력하세요..."; msgInput.readOnly = false; }
        if(authBtn) authBtn.innerText = "LOGOUT";
    } else {
        if(nameInput) { nameInput.value = ""; nameInput.placeholder = "LOGIN REQUIRED"; }
        if(msgInput) { msgInput.placeholder = "로그인이 필요합니다."; msgInput.readOnly = true; }
        if(authBtn) authBtn.innerText = "LOGIN WITH GOOGLE";
    }
}

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

function renderPosts(postsToRender) {
    const list = document.getElementById('post-list');
    if(!list) return;
    list.innerHTML = "";
    
    if(postsToRender.length === 0) {
        list.innerHTML = "<p class='text-center text-[10px] text-gray-300 py-10 uppercase tracking-widest'>Archive is empty.</p>";
        return;
    }

    postsToRender.forEach(p => {
        const currentUser = window.auth && window.auth.currentUser;
        const isMyPost = currentUser && currentUser.uid === p.uid;
        const row = document.createElement('div');
        row.className = "flex gap-6 border-b border-gray-50 pb-3 items-center hover:bg-gray-50 transition p-2 group text-[11px] font-bold";
        
        row.innerHTML = `
            <div class="min-w-[80px] uppercase truncate ${isMyPost ? 'text-blue-600' : 'opacity-40'}">${p.author || 'Anonymous'}</div>
            <div class="text-gray-500 flex-grow">${p.content}</div>
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
    const user = window.auth && window.auth.currentUser;
    if(!user) return alert("LOGIN REQUIRED");
    const content = document.getElementById('p-msg').value;
    if(!content.trim()) return;
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.addDoc(firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts'), {
            author: user.displayName, uid: user.uid, content: content, createdAt: firebaseUtils.serverTimestamp()
        });
        document.getElementById('p-msg').value = "";
    } catch(e) { alert("FAIL"); }
}

async function deleteMsg(postId, writerUid) {
    const user = window.auth && window.auth.currentUser;
    if(!user || user.uid !== writerUid) return;
    if(!confirm("삭제하시겠습니까?")) return;
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.deleteDoc(firebaseUtils.doc(db, 'artifacts', appId, 'public', 'data', 'posts', postId));
    } catch (e) { alert("FAIL"); }
}

window.onload = () => { 
    // 초기 로드 시 활성화된 섹션에 따른 초기화 실행
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        const id = activeSection.id;
        if (id === 'ships') initRadar();
        if (id === 'map') initMapData();
        if (id === 'archive') startDDayCounter();
    }
    if (window.loadPosts) window.loadPosts(); 
};