/** * js/map.js 
 * 무역로 분석 및 경제 데이터 로직
 */

const routeData = {
    'harufu': {
        title: "Harufu (하루푸) - Africa Coast",
        detail: "현 메타 최강의 거점입니다. 11개 무역로와 연결되어 있으며, 10레벨 달성 시 시간당 522 Po8을 생산합니다. 공급 강화(Supply Run) 시 시간당 최대 20,000 Po8까지 폭증하는 핵심 데이터 포인트입니다."
    },
    'red-isle': {
        title: "East Red Isle Route",
        detail: "세인트 안느 기점 15분 내외로 수거 가능한 고효율 루트입니다. 초보 단계에서 안정적인 실버 수급과 Po8 확보를 위한 최적의 경로로 분석됩니다."
    }
};

const economyTip = {
    silver: "골드 스컬 럼/실버 스너프 가공 후 매각 시 15분당 24만 실버 순수익 발생.",
    funding: "제조소 10레벨 달성 시 48시간 가동 가능(Po8 4,500개 충전 필요)."
};

// 버튼 클릭 시 호출되는 함수
function showRoute(key) {
    const data = routeData[key];
    const titleEl = document.getElementById('route-title');
    const detailEl = document.getElementById('route-detail');

    if (data && titleEl && detailEl) {
        titleEl.innerText = data.title;
        detailEl.innerText = data.detail;
        console.log("Route Updated:", key);
    } else {
        console.error("ID를 찾을 수 없거나 데이터가 없습니다.");
    }
}

// 탭 전환 시 호출되는 초기화 함수
function initMapData() {
    const silverEl = document.getElementById('tip-silver');
    const fundingEl = document.getElementById('tip-funding');
    
    if(silverEl) silverEl.innerText = economyTip.silver;
    if(fundingEl) fundingEl.innerText = economyTip.funding;
    
    // 기본으로 하루푸 정보를 띄워줌
    showRoute('harufu');
}