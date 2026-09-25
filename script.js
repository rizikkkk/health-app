// ПОДКЛЮЧЕНИЕ TELEGRAM WEBAPP
const tg = window?.Telegram?.WebApp; 
if (tg) { tg.ready(); tg.expand(); }

// ==========================================================================
// 📦 БАЗА ДАННЫХ ТРЕНИРОВОК С ПОДКУРСАМИ И УРОВНЯМИ ВРЕМЕНИ
// ==========================================================================
const courseDatabase = {
    power: {
        name: "Домашняя сила (Мышцы)",
        easy: { label: "Легко (20 мин)", rounds: 2 },
        medium: { label: "Средне (40 мин)", rounds: 3 },
        hard: { label: "Жестко (60 мин)", rounds: 4 },
        subCourses: {
            arms_chest: {
                name: "Тяни-Толкай (Руки и Грудь) 🔴",
                desc: "Прокачка грудных мышц, трицепса и дельт",
                exercises: [
                    { name: "Классические отжимания", type: "reps", target: 15, desc: "Руки чуть шире плеч, опускайся до параллели с полом." },
                    { name: "Обратные отжимания от стула", type: "reps", target: 15, desc: "Опора руками на край стула сзади." },
                    { name: "Алмазные отжимания", type: "reps", target: 10, desc: "Поставь ладони близко плечом к плечу." }
                ]
            },
            legs_core: {
                name: "Стальной фундамент (Ноги и Пресс) 🟢",
                desc: "Мощная проработка квадрицепсов, ягодиц и мышц кора",
                exercises: [
                    { name: "Приседания Бро", type: "reps", target: 20, desc: "Опускай таз до параллели с полом." },
                    { name: "Выпады назад попеременно", type: "reps", target: 16, desc: "Делай широкий шаг назад." },
                    { name: "Скручивания на пресс", type: "reps", target: 20, desc: "Лежа на спине, плавно поднимай лопатки." }
                ]
            }
        }
    },
    fatburn: {
        name: "Жиросжигание и Рельеф",
        easy: { label: "Легко (20 мин)", rounds: 2 },
        medium: { label: "Средне (40 мин)", rounds: 3 },
        hard: { label: "Жестко (60 мин)", rounds: 4 },
        subCourses: {
            full_body: {
                name: "Фулл Бади Пот ⚡",
                desc: "Взрывной комплекс на все тело для жиросжигания",
                exercises: [
                    { name: "Прыжки Джеки", type: "time", target: 45, desc: "Прыжком расставляй ноги и руки." },
                    { name: "Приседания с выпрыгиванием", type: "reps", target: 12, desc: "Опускайся и взрывайся вверх." },
                    { name: "Взрывные берпи", type: "reps", target: 10, desc: "Упор лежа, отжимание, прыжок вверх." }
                ]
            },
            abs_core: {
                name: "Пресс и Кор 🎯",
                desc: "Создание стальных кубиков",
                exercises: [
                    { name: "Упражнение 'Скалолаз'", type: "time", target: 45, desc: "В упоре лежа быстро беги ногами." },
                    { name: "Велосипед на прессе", type: "reps", target: 20, desc: "Лежа тянись локтем к колену." },
                    { name: "Статическая планка", type: "time", target: 45, desc: "Держи тело ровно в одну линию." }
                ]
            }
        }
    },
    posture: {
        name: "Здоровая спина и Осанка",
        easy: { label: "Легко (20 мин)", rounds: 2 },
        medium: { label: "Средне (40 мин)", rounds: 3 },
        hard: { label: "Жестко (60 мин)", rounds: 3 },
        subCourses: {
            back_straight: {
                name: "Ровная спина Бро 🧘‍♂️",
                desc: "Раскрытие грудной клетки и лопаток",
                exercises: [
                    { name: "Y-T-W подъемы", type: "reps", target: 12, desc: "Лежа на животе, поднимай руки." },
                    { name: "Вращение плечами у стены", type: "reps", target: 20, desc: "Прижмись спиной и локтями к стене." },
                    { name: "Лодочка со сведением лопаток", type: "reps", target: 15, desc: "Лежа на животе, оторви грудь." }
                ]
            },
            neck_computer: {
                name: "Шея и Компьютерный синдром 📱",
                desc: "Снятие зажимов трапеции после работы",
                exercises: [
                    { name: "Упражнение 'Кобра'", type: "time", target: 30, desc: "Лежа на животе, мягко вытягивай грудь." },
                    { name: "Разгибание бедра на четвереньках", type: "reps", target: 16, desc: "Стоя на четвереньках, поднимай ногу." },
                    { name: "Растяжка 'Кошка-Корова'", type: "reps", target: 12, desc: "На четвереньках плавно выгибай спину." }
                ]
            }
        }
    }
};
// ==========================================================================
// 🔧 СОСТОЯНИЕ И НЕЗАВИСИМАЯ ПАМЯТЬ КУРСОВ (STORAGE)
// ==========================================================================
let water = parseInt(localStorage.getItem('water_today') || '0', 10);
let waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);
let caloriesCurrent = parseInt(localStorage.getItem('calories_current') || '0', 10); 
let caloriesTarget = parseInt(localStorage.getItem('calories_target') || '2000', 10);

let broPrograms = JSON.parse(localStorage.getItem('bro_programs_data') || JSON.stringify({
    activeCourse: 'none', activeSubCourse: 'none', activeLevel: 'medium',      
    power_arms_chest_step: 0, power_legs_core_step: 0, fatburn_full_body_step: 0, fatburn_abs_core_step: 0, posture_back_straight_step: 0, posture_neck_computer_step: 0,
    power_arms_chest_date: '', power_legs_core_date: '', fatburn_full_body_date: '', fatburn_abs_core_date: '', posture_back_straight_date: '', posture_neck_computer_date: ''
}));

function saveProgramsState() { localStorage.setItem('bro_programs_data', JSON.stringify(broPrograms)); }
function getFormattedDate(offset = 0) {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function switchScreen(id, btn) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active')); 
    const el = document.getElementById(id); if (el) el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); 
    if (btn) {
        btn.classList.add('active');
    } else {
        const mainBtn = document.querySelector(".nav-item[onclick*='screen-main']");
        if (mainBtn) mainBtn.classList.add('active');
    }
    if (id === 'screen-calendar') renderHeatmapCalendar();
    if (id === 'screen-workout') renderWorkoutDashboard();
    if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
}
// ==========================================================================
// 💧 ЛОГИКА ТРЕКЕРА ВОДЫ И ЕДЫ
// ==========================================================================
function checkWaterColor() {
    const display = document.getElementById('water-count'); if (!display) return;
    display.style.setProperty('color', water >= waterTarget ? '#00b0ff' : '#5288c1', 'important');
}
function addWaterManual() {
    const input = document.getElementById('input-add-water'); const val = parseInt(input?.value || '0', 10); if (val <= 0) return;
    water += val; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    if (input) input.value = ""; checkWaterColor(); syncTodayDataToCalendar();
}
function quickAddWater(amount) {
    water += amount; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    checkWaterColor(); syncTodayDataToCalendar();
}
function resetWater() {
    water = 0; document.getElementById('water-count').innerText = "0"; localStorage.setItem('water_today', "0");
    checkWaterColor(); syncTodayDataToCalendar();
}
function checkCaloriesColor() {
    const d = document.getElementById('calories-current'); if (!d) return;
    d.style.setProperty('color', caloriesCurrent > caloriesTarget ? '#f44336' : '#4caf50', 'important');
}
function addCalories() {
    const i = document.getElementById('input-add-calories'); const v = parseInt(i?.value || '0', 10); if (v <= 0) return;
    caloriesCurrent += v; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    if (i) i.value = ""; checkCaloriesColor(); syncTodayDataToCalendar();
}
function quickAddCalories(amount) {
    caloriesCurrent += amount; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    checkCaloriesColor(); syncTodayDataToCalendar();
}
function resetCalories() {
    caloriesCurrent = 0; document.getElementById('calories-current').innerText = "0"; localStorage.setItem('calories_current', "0");
    checkCaloriesColor(); syncTodayDataToCalendar();
}

// ==========================================================================
// 🎯 ЛОГИКА ИМТ РАСЧЕТА
// ==========================================================================
function calculateBMI() {
    const h = parseFloat(document.getElementById('bmi-height')?.value || '0'); 
    const w = parseFloat(document.getElementById('bmi-weight')?.value || '0'); 
    const t = parseFloat(document.getElementById('weight-target')?.value || '0');
    const res = document.getElementById('bmi-result'); if (!h || !w) return;
    
    localStorage.setItem('user_height', h.toString()); localStorage.setItem('user_weight', w.toString()); if (t) localStorage.setItem('user_target_weight', t.toString());
    const bmi = (w / ((h/100) * (h/100))).toFixed(1); 
    let targetCal = Math.round(((10 * w) + (6.25 * h) - 120) * 1.375);

    caloriesTarget = targetCal; localStorage.setItem('calories_target', caloriesTarget.toString()); 
    if(document.getElementById('calories-target')) document.getElementById('calories-target').innerText = caloriesTarget;
    waterTarget = 2000; localStorage.setItem('water_target', '2000');
    if(document.getElementById('water-target')) document.getElementById('water-target').innerText = '2000';

    if(res) {
        res.style.display = 'block'; res.innerHTML = `<div>ИМТ: ${bmi}</div><div style="font-size:12px; margin-top:4px;">🎯 Цель: ${caloriesTarget} ккал</div>`;
    }
    checkCaloriesColor(); checkWaterColor();
}
// ==========================================================================
// 🕹️ НАВИГАЦИЯ И УПРАВЛЕНИЕ КУРСАМИ
// ==========================================================================
let currentExercises = [], exIndex = 0, totalRounds = 3, currentRound = 1, timerInterval, isTimerRunning = false, currentWorkoutTypeFlag = 'none';

function selectMainCategory(courseKey) {
    broPrograms.activeCourse = courseKey; saveProgramsState();
    const container = document.getElementById('subcategories-list-container'); if (!container) return;
    container.innerHTML = ""; 

    Object.keys(courseDatabase[courseKey].subCourses).forEach(subKey => {
        const sub = courseDatabase[courseKey].subCourses[subKey];
        const subCard = document.createElement('div');
        subCard.className = 'program-card-btn';
        subCard.style.cssText = 'background:#2c3b47; padding:15px; border-radius:12px; cursor:pointer; border:1px solid rgba(255,255,255,0.05); margin-bottom:10px;';
        subCard.innerHTML = `<div style="font-weight:bold; color:#5288c1;">${sub.name}</div><div style="font-size:12px; opacity:0.6;">${sub.desc}</div>`;
        subCard.onclick = () => selectSubCategory(subKey);
        container.appendChild(subCard);
    });
    document.getElementById('workout-categories-view').style.display = 'none';
    document.getElementById('workout-subcategories-view').style.display = 'block';
}
function selectSubCategory(subKey) {
    broPrograms.activeSubCourse = subKey; saveProgramsState();
    document.getElementById('workout-subcategories-view').style.display = 'none';
    document.getElementById('workout-levels-view').style.display = 'block';
}
function selectWorkoutLevel(levelKey) {
    broPrograms.activeLevel = levelKey; saveProgramsState();
    document.getElementById('workout-levels-view').style.display = 'none';
    renderWorkoutDashboard();
}
function backToCategories() { broPrograms.activeCourse = 'none'; saveProgramsState(); renderWorkoutDashboard(); }
function backToSubCategories() { document.getElementById('workout-levels-view').style.display = 'none'; document.getElementById('workout-subcategories-view').style.display = 'block'; }
function backToLevels() { document.getElementById('workout-dashboard-view').style.display = 'none'; document.getElementById('workout-levels-view').style.display = 'block'; }

function renderWorkoutDashboard() {
    const catsView = document.getElementById('workout-categories-view');
    const dashView = document.getElementById('workout-dashboard-view');
    if (!catsView || !dashView) return;

    if (broPrograms.activeCourse === 'none') {
        catsView.style.display = 'block'; dashView.style.display = 'none';
        document.getElementById('workout-subcategories-view').style.display = 'none';
        document.getElementById('workout-levels-view').style.display = 'none';
    } else if (broPrograms.activeSubCourse === 'none') {
        catsView.style.display = 'none'; dashView.style.display = 'none'; selectMainCategory(broPrograms.activeCourse);
    } else if (broPrograms.activeLevel === 'none') {
        catsView.style.display = 'none'; dashView.style.display = 'none'; selectSubCategory(broPrograms.activeSubCourse);
    } else {
        catsView.style.display = 'none'; dashView.style.display = 'block';
        const courseKey = broPrograms.activeCourse; const subKey = broPrograms.activeSubCourse; const levelKey = broPrograms.activeLevel;
        
        const courseData = courseDatabase[courseKey];
        if (!courseData || !courseData.subCourses[subKey] || !courseData[levelKey]) return;

        const subConfig = courseData.subCourses[subKey];
        const levelConfig = courseData[levelKey];

        document.getElementById('active-course-title').innerText = `${subConfig.name}`;
        document.getElementById('active-course-status').innerText = `Режим: ${levelConfig.label}`;

        const subKeyFull = `${courseKey}_${subKey}`;
        const currentStep = broPrograms[`${subKeyFull}_step`] || 0;
        let progressPercent = Math.round((currentStep / 15) * 100);
        if (progressPercent > 100) progressPercent = 100;
        
        document.getElementById('course-progress-percent').innerText = progressPercent + '%';
        document.getElementById('course-progress-bar').style.width = progressPercent + '%';
        document.getElementById('course-steps-text').innerText = `Выполнено: ${currentStep} из 15 шагов`;

        const todayStr = getFormattedDate(0);
        const lastWorkoutDate = broPrograms[`${subKeyFull}_date`] || '';
        const btnPlan = document.getElementById('btn-start-plan');
        const btnBonus = document.getElementById('btn-start-bonus');

        if (lastWorkoutDate === todayStr) {
            document.getElementById('day-action-title').innerText = "🛌 План на сегодня выполнен!";
            document.getElementById('day-action-desc').innerText = "Отдыхай Бро! Завтра откроется день восстановления.";
            if(btnPlan) btnPlan.style.display = 'none'; if(btnBonus) btnBonus.style.display = 'none';
        } else {
            const isRestDay = (lastWorkoutDate === getFormattedDate(-1));
            document.getElementById('day-action-title').innerText = isRestDay ? "🛌 ДЕНЬ ВОССТАНОВЛЕНИЯ" : "💪 РАБОЧИЙ ДЕНЬ";
            document.getElementById('day-action-desc').innerText = isRestDay ? "Мышцы растут! Отдыхай или бахни доп:" : "Приготовиться к тренировке!";
            if(btnPlan) btnPlan.style.display = isRestDay ? 'none' : 'block';
            if(btnBonus) btnBonus.style.display = isRestDay ? 'block' : 'none';
        }
    }
}
function resetActiveCourse() {
    if (confirm("Бро, ты уверен, что хочешь полностью обнулить этот подкурс и начать 30-дневный план сначала?")) {
        const courseKey = broPrograms.activeCourse; const subKey = broPrograms.activeSubCourse; const subKeyFull = `${courseKey}_${subKey}`;
        broPrograms[`${subKeyFull}_step`] = 0; broPrograms[`${subKeyFull}_date`] = '';
        saveProgramsState(); renderWorkoutDashboard(); syncTodayDataToCalendar();
    }
}

function generateWorkoutExercises(courseKey, subKey, isBonus = false) {
    const pool = courseDatabase[courseKey].subCourses[subKey].exercises;
    let shuffled = [...pool].sort(() => 0.5 - Math.random());
    return isBonus ? shuffled.slice(0, 2) : shuffled.slice(0, 3);
}

function startPlannedWorkout() {
    const courseKey = broPrograms.activeCourse; const subKey = broPrograms.activeSubCourse; const levelKey = broPrograms.activeLevel;
    currentExercises = generateWorkoutExercises(courseKey, subKey, false);
    totalRounds = courseDatabase[courseKey][levelKey].rounds; currentWorkoutTypeFlag = 'planned'; launchPlayer();
}

function startBonusWorkout() {
    const courseKey = broPrograms.activeCourse; const subKey = broPrograms.activeSubCourse;
    currentExercises = generateWorkoutExercises(courseKey, subKey, true);
    totalRounds = 2; currentWorkoutTypeFlag = 'bonus'; launchPlayer();
}

function launchPlayer() {
    exIndex = 0; currentRound = 1; isTimerRunning = false; clearInterval(timerInterval);
    document.getElementById('workout-dashboard-view').style.display = 'none';
    document.getElementById('workout-player-container').style.display = 'block'; showCurrentStep();
}

function showCurrentStep() {
    const ex = currentExercises[exIndex]; const btnAction = document.getElementById('btn-action'); clearInterval(timerInterval); isTimerRunning = false;
    document.getElementById('player-round-info').innerText = `КРУГ ${currentRound} ИЗ ${totalRounds}`; document.getElementById('player-ex-name').innerText = ex.name; document.getElementById('player-ex-desc').innerText = ex.desc;
    document.getElementById('player-ex-target').innerText = ex.type === "reps" ? `${ex.target} РАЗ` : `ДЕРЖИМ ВРЕМЯ`;
    if(btnAction) btnAction.innerText = ex.type === "reps" ? "Выполнено! Далее" : "🟢 Запустить таймер";
}

function handleActionClick() { const ex = currentExercises[exIndex]; if (ex.type === "reps") { goToNextExercise(); } else { if (!isTimerRunning) { startExerciseTimer(ex.target); } else { goToNextExercise(); } } }

function startExerciseTimer(seconds) {
    isTimerRunning = true; let timeLeft = seconds; const btn = document.getElementById('btn-action'); if(btn) btn.innerText = "Пропустить";
    timerInterval = setInterval(() => { timeLeft--; if (timeLeft <= 0) { clearInterval(timerInterval); goToNextExercise(); } }, 1000);
}

function goToNextExercise() {
    if (exIndex < currentExercises.length - 1) { exIndex++; showCurrentStep(); } 
    else {
        if (currentRound < totalRounds) { currentRound++; exIndex = 0; alert(`Круг №${currentRound}!`); showCurrentStep(); } 
        else {
            const courseKey = broPrograms.activeCourse; const subKey = broPrograms.activeSubCourse; const subKeyFull = `${courseKey}_${subKey}`;
            if (currentWorkoutTypeFlag === 'planned') {
                broPrograms[`${subKeyFull}_step`] += 1; broPrograms[`${subKeyFull}_date`] = getFormattedDate(0); saveProgramsState();
            }
            let dayData = JSON.parse(localStorage.getItem(`calendar_day_${getFormattedDate(0)}`) || '{}');
            dayData.workoutStatus = (currentWorkoutTypeFlag === 'planned') ? 'planned' : 'bonus';
            localStorage.setItem(`calendar_day_${getFormattedDate(0)}`, JSON.stringify(dayData));
            syncTodayDataToCalendar(); exitWorkoutSession(); alert("Тренировка пройдена! 🦾");
        }
    }
}

function exitWorkoutSession() { clearInterval(timerInterval); document.getElementById('workout-player-container').style.display = 'none'; renderWorkoutDashboard(); }

// ==========================================================================
// 👑 КАЛЕНДАРЬ И АВТОСБРОС СЧЕТЧИКОВ
// ==========================================================================
function syncTodayDataToCalendar() {
    const todayKey = getFormattedDate(0); let dayData = JSON.parse(localStorage.getItem(`calendar_day_${todayKey}`) || '{}');
    dayData.water = water; dayData.calories = caloriesCurrent; dayData.weight = parseFloat(localStorage.getItem('user_weight') || '0');
    if (!dayData.workoutStatus) {
        const y = getFormattedDate(-1);
        dayData.workoutStatus = (broPrograms.power_arms_chest_date === y || broPrograms.power_legs_core_date === y || broPrograms.fatburn_full_body_date === y || broPrograms.fatburn_abs_core_date === y || broPrograms.posture_back_straight_date === y || broPrograms.posture_neck_computer_date === y) ? 'rest' : 'none';
    }
    localStorage.setItem(`calendar_day_${todayKey}`, JSON.stringify(dayData));
}

function renderHeatmapCalendar() {
    const grid = document.getElementById('calendar-heatmap'); if (!grid) return; grid.innerHTML = "";
    const todayObj = new Date(); const daysInMonth = new Date(todayObj.getFullYear(), todayObj.getMonth() + 1, 0).getDate();
    const targetW = parseInt(localStorage.getItem('water_target') || '2000', 10);
    const targetC = parseInt(localStorage.getItem('calories_target') || '2000', 10);
    let crowns = 0, cups = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = JSON.parse(localStorage.getItem(`calendar_day_${dateKey}`) || '{}');
        const dWater = dayData.water || 0; const dCalories = dayData.calories || 0; const dStatus = dayData.workoutStatus || 'none';

        let baseScore = 0;
        if (dWater >= targetW) baseScore++; if (dCalories > 0 && dCalories <= targetC) baseScore++; if (dayData.weight > 0) baseScore++;
        let isKing = (baseScore === 3 && (dStatus === 'planned' || dStatus === 'bonus'));
        let isCup = (baseScore === 3 && dStatus === 'rest');
        if (isKing) crowns++; if (isCup) cups++;

        const dayBox = document.createElement('div'); dayBox.className = 'heatmap-day'; dayBox.innerText = day;
        if (isKing) { dayBox.classList.add('level-king'); dayBox.innerText = "👑"; } 
        else if (isCup) { dayBox.classList.add('level-cup'); dayBox.innerText = "🏆"; } 
        else { dayBox.classList.add(`level-${baseScore}`); }
        if (day === todayObj.getDate()) dayBox.classList.add('today');

        dayBox.onclick = () => {
            selectedCalendarDate = dateKey;
            document.getElementById('modal-date-title').innerText = `День Бро: ${day}`;
            document.getElementById('modal-water').value = dayData.water || "";
            document.getElementById('modal-calories').value = dayData.calories || "";
            document.getElementById('modal-workout-status').value = dStatus;
            document.getElementById('modal-weight').value = dayData.weight || "";
            document.getElementById('calendar-modal').style.display = 'flex';
        };
        grid.appendChild(dayBox);
    }
    if (document.getElementById('stats-crown-count')) document.getElementById('stats-crown-count').innerText = crowns;
    if (document.getElementById('stats-cup-count')) document.getElementById('stats-cup-count').innerText = cups;
}

function checkDailyReset() {
    const today = getFormattedDate(0); if (localStorage.getItem('last_saved_date') !== today) {
        water = 0; caloriesCurrent = 0; localStorage.setItem('water_today', '0'); localStorage.setItem('calories_current', '0');
        localStorage.setItem('last_saved_date', today); syncTodayDataToCalendar();
    }
}

// СТАРТ ЗАГРУЗКИ С ЗАЩИТОЙ
window.addEventListener('DOMContentLoaded', () => {
    checkDailyReset();
    const modal = document.getElementById('calendar-modal');
    if (document.getElementById('btn-modal-close')) document.getElementById('btn-modal-close').onclick = () => modal.style.display = 'none';
    if (document.getElementById('btn-modal-save')) {
        document.getElementById('btn-modal-save').onclick = () => {
            const wVal = parseInt(document.getElementById('modal-water')?.value || '0', 10);
            const cVal = parseInt(document.getElementById('modal-calories')?.value || '0', 10);
            const sVal = document.getElementById('modal-workout-status').value;
            const weVal = parseFloat(document.getElementById('modal-weight')?.value || '0');
            localStorage.setItem(`calendar_day_${selectedCalendarDate}`, JSON.stringify({ water: wVal, calories: cVal, workoutStatus: sVal, weight: weVal }));
            modal.style.display = 'none'; calculateBMI(); renderHeatmapCalendar(); renderWorkoutDashboard();
        };
    }
    try {
        calculateBMI(); syncTodayDataToCalendar(); renderWorkoutDashboard(); renderHeatmapCalendar();
    } catch (e) {
        console.log("Загрузка интерфейса:", e);
    }
});
