/**
 * js/main.js
 * 공통 내비게이션 및 실행 담당
 */

function switchTab(id) {
    // 1. 모든 링크와 섹션에서 active 클래스 제거
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // 2. 클릭한 버튼 활성화
    const activeBtn = Array.from(document.querySelectorAll('.nav-link')).find(btn => 
        btn.getAttribute('onclick').includes(`'${id}'`)
    );
    if(activeBtn) activeBtn.classList.add('active');
    
    // 3. 대상 섹션 표시
    const targetSection = document.getElementById(id);
    if(targetSection) targetSection.classList.add('active');
    
    // --- 페이지별 로직 연결 ---
    
    // FLEET 탭 클릭 시 함선 데이터 초기화 및 차트 로드
    if(id === 'ships') {
        if (typeof initRadar === 'function') {
            initRadar(); 
        } else {
            console.error("ships.js가 로드되지 않았거나 initRadar 함수가 없습니다.");
        }
    }
    
    // ARCHIVE 탭일 때만 디데이 카운터 작동
    if(id === 'archive') {
        if (typeof startDDayCounter === 'function') startDDayCounter();
    } else {
        if (typeof stopDDayCounter === 'function') stopDDayCounter();
    }

    // js/main.js 내 switchTab 함수에 추가
    if(id === 'map') {
        if (typeof initMapData === 'function') initMapData();
    }
}

// 초기 로드 설정
window.onload = () => { 
    // 1. 현재 활성화된 섹션 찾기
    const activeSection = document.querySelector('.content-section.active');
    
    if (activeSection) {
        const id = activeSection.id;
        
        // 2. 초기 활성 탭이 Archive라면 디데이 시작
        if (id === 'archive' && typeof startDDayCounter === 'function') {
            startDDayCounter();
        }
        
        // 3. 초기 활성 탭이 Fleet(ships)라면 차트 시작
        if (id === 'ships' && typeof initRadar === 'function') {
            initRadar();
        }
    }
    
    // 4. Firebase 게시글 로드
    if (typeof window.loadPosts === 'function') {
        window.loadPosts(); 
    }

    // window.onload 내부 3번 항목 뒤에 추가하면 좋습니다.
    if (id === 'map' && typeof initMapData === 'function') {
        initMapData();
    }
};