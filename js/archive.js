/**
 * js/archive.js
 * 디데이 및 로드맵 관련 로직
 */

let ddayInterval;
const targetDate = new Date("May 1, 2026 00:00:00").getTime();

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

/** js/archive.js **/
// 기존 dday 로직 유지...

// 홈페이지의 'Official Patch Highlights' 섹션에 들어갈 데이터 (보고서 내용 반영)
const patchHighlights = [
    {
        title: "New Monster: Nian (니안)",
        content: "3-4월 기간 한정 보스. 강력한 충돌 공격과 침수 포격을 구사합니다. '우로보로스' 장갑 착용을 강력 권장하며, 격퇴 시 '니안 강철함'을 획득할 수 있습니다."
    },
    {
        title: "Weapon Balance Y2S4",
        content: "해불(Sea Fire) 상시 가동 패치 완료. 장거리포와 컬버린의 거리 감쇄가 제거되어 1000m 이상에서도 100% 화력을 발휘합니다."
    },
    {
        title: "Ship Rank Expansion",
        content: "함선 랭크 상한선이 17로 확장되었습니다. 코르벳 등 대형 함선 업그레이드를 위해 '하프 테일'과 '뱀의 숨결' 수집이 필수적입니다."
    }
];
// (참고: index.html의 해당 섹션을 위 데이터로 동적 렌더링하도록 수정 가능합니다)

function startDDayCounter() {
    updateDDay();
    if(ddayInterval) clearInterval(ddayInterval);
    ddayInterval = setInterval(updateDDay, 1000);
}

function stopDDayCounter() {
    if(ddayInterval) clearInterval(ddayInterval);
}