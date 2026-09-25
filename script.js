// ПОДКЛЮЧЕНИЕ TELEGRAM WEBAPP
const tg = window?.Telegram?.WebApp; 
if (tg) { 
    tg.ready(); 
    tg.expand(); 
}

// ==========================================================================
// 📦 БАЗА ДАННЫХ ТРЕНИРОВОК НА 30 ДНЕЙ С УРОВНЯМИ (20 / 40 / 60 МИНУТ)
// ==========================================================================
const courseDatabase = {
    power: {
        name: "Домашняя сила (Мышцы)",
        easy: { label: "Легко (20 мин)", rounds: 2, exInterval: 30 },
        medium: { label: "Средне (40 мин)", rounds: 3, exInterval: 30 },
        hard: { label: "Жестко (60 мин)", rounds: 4, exInterval: 20 },
        exercisesPool: [
            { name: "Классические отжимания", type: "reps", target: 15, desc: "Руки чуть шире плеч, опускайся до параллели с полом." },
            { name: "Обратные отжимания от стула", type: "reps", target: 15, desc: "Опора руками на край стула сзади, плавно сгибай локти." },
            { name: "Приседания Бро", type: "reps", target: 20, desc: "Опускай таз до параллели с полом, держи спину ровно." },
            { name: "Статическая планка", type: "time", target: 45, desc: "Держи тело ровно в одну линию, пресс и ягодицы напряжены." },
            { name: "Скалолаз в упоре лежа", type: "time", target: 30, desc: "Быстро подтягивай колени к груди поочередно." }
        ]
    },
    fatburn: {
        name: "Жиросжигание и Рельеф",
        easy: { label: "Легко (20 мин)", rounds: 2, exInterval: 25 },
        medium: { label: "Средне (40 мин)", rounds: 3, exInterval: 25 },
        hard: { label: "Жестко (60 мин)", rounds: 4, exInterval: 15 },
        exercisesPool: [
            { name: "Прыжки Джеки (Jumping Jacks)", type: "time", target: 45, desc: "Прыжком расставляй ноги и соединяй руки над головой." },
            { name: "Приседания с выпрыгиванием", type: "reps", target: 12, desc: "Опускайся до параллели и взрывайся вверх in прыжке." },
            { name: "Упражнение 'Скалолаз'", type: "time", target: 45, desc: "В упоре лежа быстро беги ногами к груди." },
            { name: "Взрывные берпи", type: "reps", target: 10, desc: "Упор лежа, отжимание, прыжок вверх с хлопком." }
        ]
    },
    posture: {
        name: "Здоровая спина и Осанка",
        easy: { label: "Легко (20 мин)", rounds: 2, exInterval: 30 },
        medium: { label: "Средне (40 мин)", rounds: 3, exInterval: 30 },
        hard: { label: "Жестко (60 мин)", rounds: 3, exInterval: 20 },
        exercisesPool: [
            { name: "Y-T-W подъемы на животе", type: "reps", target: 12, desc: "Лежа на животе, поднимай руки, изображая буквы Y, T, W." },
            { name: "Вращение плечами у стены", type: "reps", target: 20, desc: "Прижмись спиной и локтями к стене, вращай плечи назад." },
            { name: "Лодочка со сведением лопаток", type: "reps", target: 15, desc: "Лежа на животе, оторви грудь от пола и своди лопатки." },
            { name: "Упражнение 'Кобра'", type: "time", target: 30, desc: "Лежа на животе, мягко вытягивай грудной отдел вверх." }
        ]
    }
};

// ==========================================================================
// 🔧 СОСТОЯНИЕ И ДВИЖОК НЕЗАВИСИМОГО ХРАНЕНИЯ (STORAGE)
// ==========================================================================
let water = parseInt(localStorage.getItem('water_today') || '0', 10);
let waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);
let caloriesCurrent = parseInt(localStorage.getItem('calories_current') || '0', 10); 
let caloriesTarget = parseInt(localStorage.getItem('calories_target') || '2000', 10);

// ИСПРАВЛЕНИЕ: Теперь у каждого курса СВОЯ личная дата последней тренировки!
let broPrograms = JSON.parse(localStorage.getItem('bro_programs_data') || JSON.stringify({
    activeCourse: 'none',    
    selectedLevel: 'medium', // По умолчанию средний уровень (medium)
    power_step: 0,           
    fatburn_step: 0,
    posture_step: 0,
    power_date: '',       // Дата последней тренировки для Силы
    fatburn_date: '',     // Дата для Жиросжигания
    posture_date: ''      // Дата для Осанки
}));

function saveProgramsState() {
    localStorage.setItem('bro_programs_data', JSON.stringify(broPrograms));
}

function getFormattedDate(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function switchScreen(id, btn) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active')); 
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active');
    
    if (id === 'screen-calendar') renderHeatmapCalendar();
    if (id === 'screen-workout') renderWorkoutDashboard();
    if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
}
// ==========================================================================
// 💧 ЛОГИКА ТРЕКЕРА ВОДЫ
// ==========================================================================
function checkWaterColor() {
    const display = document.getElementById('water-count'); if (!display) return;
    if (water >= waterTarget) display.style.setProperty('color', '#00b0ff', 'important');
    else display.style.setProperty('color', '#5288c1', 'important');
}

function addWaterManual() {
    const input = document.getElementById('input-add-water'); const val = parseInt(input.value, 10); if (!val || val <= 0) return;
    water += val; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    input.value = ""; checkWaterColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddWater(amount) {
    water += amount; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    checkWaterColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetWater() {
    water = 0; document.getElementById('water-count').innerText = "0"; localStorage.setItem('water_today', "0");
    checkWaterColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}

// ==========================================================================
// 🍎 ЛОГИКА ДНЕВНИКА ПИТАНИЯ
// ==========================================================================
function checkCaloriesColor() {
    const d = document.getElementById('calories-current'); if (!d) return;
    if (caloriesCurrent > caloriesTarget) d.style.setProperty('color', '#f44336', 'important');
    else d.style.setProperty('color', '#4caf50', 'important');
}

function addCalories() {
    const i = document.getElementById('input-add-calories'); const v = parseInt(i.value, 10); if (!v || v <= 0) return;
    caloriesCurrent += v; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    i.value = ""; checkCaloriesColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddCalories(amount) {
    caloriesCurrent += amount; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    checkCaloriesColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetCalories() {
    caloriesCurrent = 0; document.getElementById('calories-current').innerText = "0"; localStorage.setItem('calories_current', "0");
    checkCaloriesColor(); syncTodayDataToCalendar(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}

// ==========================================================================
// 🎯 ЛОГИКА ИМТ И НАУЧНОГО РАСЧЕТА
// ==========================================================================
function calculateBMI() {
    const h = parseFloat(document.getElementById('bmi-height').value); 
    const w = parseFloat(document.getElementById('bmi-weight').value); 
    const t = parseFloat(document.getElementById('weight-target').value);
    const res = document.getElementById('bmi-result'); 
    if (!h || !w) { if(res) res.style.display = 'none'; return; }
    
    localStorage.setItem('user_height', h); localStorage.setItem('user_weight', w); 
    if (t) localStorage.setItem('user_target_weight', t);

    const bmi = (w / ((h/100) * (h/100))).toFixed(1); 
    let txt = "", col = "#5288c1";
    let bmr = Math.round((10 * w) + (6.25 * h) - (5 * 25) + 5); 
    let normCalories = Math.round(bmr * 1.375); 
    let targetCal = normCalories; let targetWater = 2000; 

    if (bmi < 18.5) { 
        txt = "Дефицит массы"; col = "#e5a93b"; targetCal = Math.round(normCalories + 400); targetWater = Math.round((w * 35) + 500); 
    } else if (bmi >= 18.5 && bmi < 25) { 
        txt = "Нормальный вес"; col = "#4caf50"; targetCal = normCalories; targetWater = Math.round((w * 35) + 500); 
    } else { 
        txt = "Избыточный вес"; col = "#f44336"; targetCal = Math.round(normCalories - 450); targetWater = Math.round((w * 40) + 500); 
    }

    caloriesTarget = targetCal; localStorage.setItem('calories_target', caloriesTarget.toString()); 
    if(document.getElementById('calories-target')) document.getElementById('calories-target').innerText = caloriesTarget;
    waterTarget = targetWater; localStorage.setItem('water_target', waterTarget.toString());
    if(document.getElementById('water-target')) document.getElementById('water-target').innerText = waterTarget;

    if(res) {
        res.style.display = 'block'; res.style.color = col;
        res.innerHTML = `<div>ИМТ: ${bmi} (${txt})</div><div style="font-size:14px; color:#fff; margin-top:6px;">🎯 Цель: <strong>${caloriesTarget} ккал</strong> | 💧 Вода: <strong>${waterTarget} мл</strong></div>`;
    }

    // ИНТЕРАКТИВНАЯ ШКАЛА ВЕСА
    const progressContainer = document.getElementById('weight-progress-container');
    if (progressContainer && t) {
        progressContainer.style.display = 'block';
        let percent = 0; const range = 20;
        if (w > t) {
            percent = w >= t + range ? 0 : Math.round(((t + range - w) / range) * 100);
            document.getElementById('weight-motivation-text').innerText = `Бро, осталось скинуть всего ${(w - t).toFixed(1)} кг! 🔥`;
        } else if (w < t) {
            percent = w <= t - range ? 0 : Math.round(((w - (t - range)) / range) * 100);
            document.getElementById('weight-motivation-text').innerText = `Бро, осталось набрать еще ${(t - w).toFixed(1)} кг! 🔥`;
        } else {
            percent = 100; document.getElementById('weight-motivation-text').innerText = `Красава, Бро! Цель достигнута! Ты машина! 👑🏆`;
        }
        if (percent < 0) percent = 0; if (percent > 100) percent = 100;
        document.getElementById('weight-progress-bar').style.width = percent + '%';
        document.getElementById('weight-progress-text').innerText = percent + '%';
    }
    checkCaloriesColor(); checkWaterColor();
}

// ==========================================================================
// 🏋️‍♂️ УМНЫЙ ДИСПЕТЧЕР КУРСОВ И ТРЕНИРОВОК
// ==========================================================================
let currentExercises = [], exIndex = 0, totalRounds = 3, currentRound = 1, timerInterval, isTimerRunning = false;
let currentWorkoutTypeFlag = 'none';

function selectMainCategory(courseKey) {
    broPrograms.activeCourse = courseKey;
    saveProgramsState();
    renderWorkoutDashboard();
}

function backToCategories() {
    broPrograms.activeCourse = 'none';
    saveProgramsState();
    renderWorkoutDashboard();
}
function renderWorkoutDashboard() {
    const catsView = document.getElementById('workout-categories-view');
    const dashView = document.getElementById('workout-dashboard-view');
    if (!catsView || !dashView) return;

    if (broPrograms.activeCourse === 'none') {
        catsView.style.display = 'block';
        dashView.style.display = 'none';
    } else {
        catsView.style.display = 'none';
        dashView.style.display = 'block';

        const courseKey = broPrograms.activeCourse;
        const config = courseDatabase[courseKey];
        document.getElementById('active-course-title').innerText = config.name;

        // Расчёт прогресса конкретного курса (15 шагов на месяц)
        const currentStep = broPrograms[`${courseKey}_step`] || 0;
        let progressPercent = Math.round((currentStep / 15) * 100);
        if (progressPercent > 100) progressPercent = 100;

        document.getElementById('course-progress-percent').innerText = progressPercent + '%';
        document.getElementById('course-progress-bar').style.width = progressPercent + '%';
        document.getElementById('course-steps-text').innerText = `Выполнено: ${currentStep} из 15 фитнес-шагов`;

        // УМНАЯ НЕЗАВИСИМАЯ ПРОВЕРКА ДНЯ ДЛЯ КАЖДОГО КУРСА
        const todayStr = getFormattedDate(0);
        const lastCourseDate = broPrograms[`${courseKey}_date`] || '';

        const btnPlan = document.getElementById('btn-start-plan');
        const btnBonus = document.getElementById('btn-start-bonus');

        if (lastCourseDate === todayStr) {
            // 1. ЕСЛИ ТРЕНИРОВКА СДЕЛАНА СЕГОДНЯ ЖЕ
            document.getElementById('day-action-title').innerText = "🛌 План на сегодня выполнен!";
            document.getElementById('day-action-desc').innerText = "Красава, Бро! На сегодня этот курс закрыт. Отдыхай и восстанавливай силы. Завтра откроется день отдыха с доп-тренировками!";
            btnPlan.style.display = 'none';
            btnBonus.style.display = 'none';
        } else {
            // Выясняем, был ли этот курс пройден вчера (день отдыха)
            const yesterdayStr = getFormattedDate(-1);
            const isRestDay = (lastCourseDate === yesterdayStr);

            if (!isRestDay) {
                // 2. РАБОЧИЙ ДЕНЬ ПО ПЛАНУ
                document.getElementById('day-action-title').innerText = "💪 Сегодня по плану: РАБОЧИЙ ДЕНЬ";
                document.getElementById('day-action-desc').innerText = `Приготовиться к фитнес-шагу №${currentStep + 1}. Тебя ждет уникальный микс упражнений!`;
                btnPlan.style.display = 'block';
                btnBonus.style.display = 'none';
            } else {
                // 3. ДЕНЬ ВОССТАНОВЛЕНИЯ НА СЛЕДУЮЩИЙ ДЕНЬ
                document.getElementById('day-action-title').innerText = "🛌 Сегодня по плану: ДЕНЬ ВОССТАНОВЛЕНИЯ";
                document.getElementById('day-action-desc').innerText = "Мышцы сегодня активно растут, Бро! Отдыхай, пей воду и держи калории. Либо бахни внеплановый доп-комплекс:";
                btnPlan.style.display = 'none';
                btnBonus.style.display = 'block';
            }
        }
    }
}

function resetActiveCourse() {
    if (confirm("Бро, ты уверен, что хочешь полностью обнулить этот курс и начать 30-дневный план сначала?")) {
        const courseKey = broPrograms.activeCourse;
        broPrograms[`${courseKey}_step`] = 0;
        broPrograms[`${courseKey}_date`] = '';
        saveProgramsState();
        renderWorkoutDashboard();
        syncTodayDataToCalendar();
    }
}

// УМНЫЙ МИКСЕР КОНСТРУКТОРА УПРАЖНЕНИЙ
function generateWorkoutExercises(courseKey, isBonus = false) {
    const pool = courseDatabase[courseKey].exercisesPool;
    let shuffled = [...pool].sort(() => 0.5 - Math.random());
    return isBonus ? shuffled.slice(0, 2) : shuffled.slice(0, 3);
}

function startPlannedWorkout() {
    const courseKey = broPrograms.activeCourse;
    currentExercises = generateWorkoutExercises(courseKey, false);
    totalRounds = courseDatabase[courseKey].medium.rounds; 
    currentWorkoutTypeFlag = 'planned';
    launchPlayer();
}

function startBonusWorkout() {
    const courseKey = broPrograms.activeCourse;
    currentExercises = generateWorkoutExercises(courseKey, true);
    totalRounds = 2; 
    currentWorkoutTypeFlag = 'bonus';
    launchPlayer();
}
function launchPlayer() {
    exIndex = 0; currentRound = 1; isTimerRunning = false; clearInterval(timerInterval);
    document.getElementById('workout-dashboard-view').style.display = 'none';
    document.getElementById('workout-player-container').style.display = 'block';
    showCurrentStep();
}

function showCurrentStep() {
    const ex = currentExercises[exIndex]; const btnAction = document.getElementById('btn-action'); clearInterval(timerInterval); isTimerRunning = false;
    document.getElementById('player-round-info').innerText = `КРУГ ${currentRound} ИЗ ${totalRounds}`; document.getElementById('player-ex-name').innerText = ex.name; document.getElementById('player-ex-desc').innerText = ex.desc;
    if (ex.type === "reps") { 
        document.getElementById('player-ex-target').innerText = `${ex.target} РАЗ`; document.getElementById('player-timer-digits').style.display = 'none'; btnAction.innerText = "Выполнено! Далее"; btnAction.className = "btn-success"; 
    } else { 
        document.getElementById('player-ex-target').innerText = `ДЕРЖИМ ВРЕМЯ`; document.getElementById('player-timer-digits').style.display = 'block'; document.getElementById('player-timer-digits').innerText = `00:${ex.target}`; btnAction.innerText = "🟢 Запустить таймер"; btnAction.className = "btn-success"; 
    }
}

function handleActionClick() { const ex = currentExercises[exIndex]; if (ex.type === "reps") { goToNextExercise(); } else { if (!isTimerRunning) { startExerciseTimer(ex.target); } else { goToNextExercise(); } } }

function startExerciseTimer(seconds) {
    isTimerRunning = true; let timeLeft = seconds; const btnAction = document.getElementById('btn-action'); btnAction.innerText = "Пропустить время"; btnAction.className = "btn-stop"; if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    timerInterval = setInterval(() => { timeLeft--; document.getElementById('player-timer-digits').innerText = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`; if (timeLeft <= 0) { clearInterval(timerInterval); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy'); goToNextExercise(); } }, 1000);
}

function goToNextExercise() {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    if (exIndex < currentExercises.length - 1) { exIndex++; showCurrentStep(); } 
    else {
        if (currentRound < totalRounds) { currentRound++; exIndex = 0; alert(`👊 Круг выполнен Бро! Приготовиться к КРУГУ №${currentRound}!`); showCurrentStep(); } 
        else {
            const courseKey = broPrograms.activeCourse;
            const todayStr = getFormattedDate(0);

            // Сохраняем дату тренировки ЛИЧНО для этого активного курса!
            if (currentWorkoutTypeFlag === 'planned') {
                broPrograms[`${courseKey}_step`] += 1;
                broPrograms[`${courseKey}_date`] = todayStr;
                saveProgramsState();
                
                let dayData = JSON.parse(localStorage.getItem(`calendar_day_${todayStr}`) || '{}');
                dayData.workoutStatus = 'planned';
                localStorage.setItem(`calendar_day_${todayStr}`, JSON.stringify(dayData));
            } else {
                let dayData = JSON.parse(localStorage.getItem(`calendar_day_${todayStr}`) || '{}');
                dayData.workoutStatus = 'bonus';
                localStorage.setItem(`calendar_day_${todayStr}`, JSON.stringify(dayData));
            }

            syncTodayDataToCalendar();
            exitWorkoutSession();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            alert("Бро, поздравляю! Тренировка пройдена на 100%! Ты машина! 🔥🦾");
        }
    }
}

function exitWorkoutSession() { 
    clearInterval(timerInterval); 
    document.getElementById('workout-player-container').style.display = 'none'; 
    renderWorkoutDashboard();
}

// ==========================================================================
// 👑 КАЛЕНДАРЬ ВСЕВЛАСТИЯ С СИСТЕМОЙ КОРОН И КУБКОВ ВОССТАНОВЛЕНИЯ
// ==========================================================================
let selectedCalendarDate = null;

function syncTodayDataToCalendar() {
    const todayKey = getFormattedDate(0);
    let dayData = JSON.parse(localStorage.getItem(`calendar_day_${todayKey}`) || '{}');
    
    dayData.water = water;
    dayData.calories = caloriesCurrent;
    dayData.weight = parseFloat(localStorage.getItem('user_weight') || '0');
    
    if (!dayData.workoutStatus) {
        const yesterdayStr = getFormattedDate(-1);
        const isRest = (broPrograms.power_date === yesterdayStr || broPrograms.fatburn_date === yesterdayStr || broPrograms.posture_date === yesterdayStr);
        dayData.workoutStatus = isRest ? 'rest' : 'none';
    }
    
    localStorage.setItem(`calendar_day_${todayKey}`, JSON.stringify(dayData));
}

function renderHeatmapCalendar() {
    const grid = document.getElementById('calendar-heatmap');
    if (!grid) return;
    grid.innerHTML = "";

    const todayObj = new Date();
    const currentYear = todayObj.getFullYear();
    const currentMonth = todayObj.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const targetW = parseInt(localStorage.getItem('water_target') || '2000', 10);
    const targetC = parseInt(localStorage.getItem('calories_target') || '2000', 10);

    let crownsCount = 0;
    let cupsCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
        const dd = String(day).padStart(2, '0');
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dateKey = `${currentYear}-${mm}-${dd}`;
        
        const dayData = JSON.parse(localStorage.getItem(`calendar_day_${dateKey}`) || '{}');
        
        const dWater = dayData.water || 0;
        const dCalories = dayData.calories || 0;
        const dWeight = dayData.weight || 0;
        const dStatus = dayData.workoutStatus || 'none';

        let baseScore = 0;
        if (dWater >= targetW) baseScore++;
        if (dCalories > 0 && dCalories <= targetC) baseScore++;
        if (dWeight > 0) baseScore++;

        let isKing = false;
        let isCup = false;
        let scoreLevel = baseScore;

        // МГНОВЕННЫЙ РАСЧЕТ НАГРАД (ДЛЯ ТЕСТА РАЗРАБОТЧИКА)
        if (baseScore === 3) {
            if (dStatus === 'planned' || dStatus === 'bonus') {
                isKing = true;
                crownsCount++;
            } else if (dStatus === 'rest') {
                isCup = true;
                cupsCount++;
            } else {
                scoreLevel = 3; 
            }
        } else {
            if (dStatus === 'planned' || dStatus === 'bonus' || dStatus === 'rest') {
                scoreLevel++;
            }
        }

        const dayBox = document.createElement('div');
        dayBox.className = 'heatmap-day';
        dayBox.innerText = day;

        if (isKing) {
            dayBox.classList.add('level-king');
            dayBox.innerText = "👑";
        } else if (isCup) {
            dayBox.classList.add('level-cup');
            dayBox.innerText = "🏆";
        } else {
            if (scoreLevel > 4) scoreLevel = 4;
            dayBox.classList.add(`level-${scoreLevel}`);
        }

        if (day === todayObj.getDate() && currentMonth === todayObj.getMonth() && currentYear === todayObj.getFullYear()) {
            dayBox.classList.add('today');
        }

        dayBox.onclick = () => {
            selectedCalendarDate = dateKey;
            document.getElementById('modal-date-title').innerText = `День Бро: ${dd}.${mm}.${currentYear}`;
            document.getElementById('modal-water').value = dayData.water || "";
            document.getElementById('modal-calories').value = dayData.calories || "";
            document.getElementById('modal-workout-status').value = dStatus;
            document.getElementById('modal-weight').value = dayData.weight || "";
            document.getElementById('calendar-modal').style.display = 'flex';
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        };

        grid.appendChild(dayBox);
    }

    if (document.getElementById('stats-crown-count')) document.getElementById('stats-crown-count').innerText = crownsCount;
    if (document.getElementById('stats-cup-count')) document.getElementById('stats-cup-count').innerText = cupsCount;
}

// ==========================================================================
// ⏰ СЕРВИС АВТОМАТИЧЕСКОГО СБРОСА СЧЕТЧИКОВ КАЖДОЕ УТРО
// ==========================================================================
function checkDailyReset() {
    const todayDateStr = getFormattedDate(0);
    const lastSavedDate = localStorage.getItem('last_saved_date');

    if (lastSavedDate !== todayDateStr) {
        water = 0;
        caloriesCurrent = 0;
        localStorage.setItem('water_today', '0');
        localStorage.setItem('calories_current', '0');
        localStorage.setItem('last_saved_date', todayDateStr);
        syncTodayDataToCalendar();
    }
}

// ==========================================================================
// 🚀 ЗАПУСК ПРИ СТАРТЕ ПРИЛОЖЕНИЯ
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    checkDailyReset();

    if (document.getElementById('bmi-height')) document.getElementById('bmi-height').value = localStorage.getItem('user_height') || ''; 
    if (document.getElementById('bmi-weight')) document.getElementById('bmi-weight').value = localStorage.getItem('user_weight') || '';
    if (document.getElementById('weight-target')) document.getElementById('weight-target').value = localStorage.getItem('user_target_weight') || '';
    
    if (document.getElementById('calories-current')) document.getElementById('calories-current').innerText = caloriesCurrent; 
    if (document.getElementById('calories-target')) document.getElementById('calories-target').innerText = caloriesTarget;
    if (document.getElementById('water-count')) document.getElementById('water-count').innerText = water;
    if (document.getElementById('water-target')) document.getElementById('water-target').innerText = waterTarget;

    const modal = document.getElementById('calendar-modal');
    const btnClose = document.getElementById('btn-modal-close');
    const btnSave = document.getElementById('btn-modal-save');

    if (btnClose) btnClose.onclick = () => { modal.style.display = 'none'; };
    if (btnSave) {
        btnSave.onclick = () => {
            if (!selectedCalendarDate) return;

            const wVal = parseInt(document.getElementById('modal-water').value, 10) || 0;
            const cVal = parseInt(document.getElementById('modal-calories').value, 10) || 0;
            const sVal = document.getElementById('modal-workout-status').value;
            const weVal = parseFloat(document.getElementById('modal-weight').value) || 0;

            const updatedData = { water: wVal, calories: cVal, workoutStatus: sVal, weight: weVal };
            localStorage.setItem(`calendar_day_${selectedCalendarDate}`, JSON.stringify(updatedData));

            const todayKey = getFormattedDate(0);
            if (selectedCalendarDate === todayKey) {
                water = wVal; caloriesCurrent = cVal;
                if (weVal > 0) localStorage.setItem('user_weight', weVal.toString());
                document.getElementById('water-count').innerText = water;
                document.getElementById('calories-current').innerText = caloriesCurrent;
                localStorage.setItem('water_today', water.toString());
                localStorage.setItem('calories_current', caloriesCurrent.toString());
            }

            modal.style.display = 'none';
            calculateBMI();
            renderHeatmapCalendar();
            renderWorkoutDashboard();
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            alert("Данные за день успешно перезаписаны, Бро! 🦾");
        };
    }

    calculateBMI();
    syncTodayDataToCalendar();
    renderWorkoutDashboard();
    renderHeatmapCalendar();
});
