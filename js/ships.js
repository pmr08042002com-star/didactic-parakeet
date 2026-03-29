/**
 * js/ships.js
 * 모든 함선 데이터 및 상세 가이드 (2026 분석 보고서 기반)
 */

const shipData = {
    'barque': {
        name: "Barque (바크)",
        stats: [65, 90, 75, 100, 85], 
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
    }, // <-- 이 쉼표가 중요합니다!
    'brigantine': {
        name: "Brigantine (브리건틴)",
        stats: [75, 65, 100, 40, 70],
        description: "가장 빠른 속도와 강력한 충돌 대미지를 자랑하는 돌격함입니다.",
        guide: [
            { title: "RAMMING MASTER", content: "최고 속도로 적 배를 들이받으세요. 충돌 대미지만으로 소형선은 즉사시킬 수 있습니다. 추격전에서 가장 유리합니다." },
            { title: "HIT AND RUN", content: "빠른 속도로 치고 빠지며 적의 진형을 무너뜨리는 데 최적화되어 있습니다." }
        ]
    },
    'snow': {
        name: "Snow (스노우)",
        stats: [55, 100, 50, 65, 95],
        description: "엄청난 맷집과 적재량을 가진 해상 요새입니다. 초보자에게 가장 안전한 선택입니다.",
        guide: [
            { title: "IRON HULL", content: "모든 배 중 가장 높은 방어력(Brace) 효율을 가집니다. 적의 포격을 몸으로 때우며 버티는 정통 탱커 전술에 적합합니다." },
            { title: "STORAGE KING", content: "적재량이 매우 커서 한 번의 출항으로 많은 자원을 가져올 수 있습니다." }
        ]
    }
};

function selectShip(key) {
    const ship = shipData[key];
    if(!ship) return;

    // 1. 차트 업데이트
    updateRadarChart(ship.stats);

    // 2. 상태 카드 업데이트
    const statusCard = document.getElementById('ship-status-card');
    if(statusCard) {
        statusCard.innerHTML = `
            <h3 class="text-[10px] font-black tracking-widest uppercase mb-4 text-blue-400">${ship.name}</h3>
            <p class="text-[11px] leading-relaxed opacity-70 mb-4">${ship.description}</p>
            <div class="text-[9px] font-bold border-t border-white/10 pt-4 opacity-50 uppercase tracking-widest italic">Data Source: S&B Official Analysis</div>
        `;
    }

    // 3. 가이드 영역 업데이트 (함선별로 다른 글이 뜹니다)
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
            scales: { r: { ticks: { display: false }, grid: { color: '#f5f5f5' }, pointLabels: { font: { weight: '800', size: 10 } } } }, 
            plugins: { legend: { display: false } } 
        }
    });
}

function initRadar() {
    selectShip('barque');
}