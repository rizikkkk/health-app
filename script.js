const tg = window?.Telegram?.WebApp; if (tg) { tg.ready(); tg.expand(); }

const courseDatabase = {
    posture: {
        kyphosis: [{ name: "Лодочка со сведением лопаток", type: "reps", target: 15, desc: "Лежа на животе, плавно своди лопатки." }, { name: "Упражнение 'Кобра'", type: "reps", target: 12, desc: "Лежа на животе, плавно вытяни грудной отдел вверх." }, { name: "Статическая планка для спины", type: "time", target: 45, desc: "Держи тело ровно. Пресс напряжен." }],
        slouch: [{ name: "Y-T-W подъемы рук на животе", type: "reps", target: 12, desc: "Поднимай руки вверх буквой Y, T, W." }, { name: "Вращение плечами у стены", type: "reps", target: 20, desc: "Прижмись спиной к стене, вращай плечи назад." }],
        scoli: [{ name: "Боковая планка (Левая)", type: "time", target: 30, desc: "Стабилизация косых мышц." }, { name: "Боковая планка (Правая)", type: "time", target: 30, desc: "Симметричное укрепление мышечного корсета спины." }]
    }, fatburn: [{ name: "Взрывные Берпи", type: "reps", target: 12, desc: "Упор лежа, отжимание, прыжок вверх." }, { name: "Приседания с выпрыгиванием", type: "reps", target: 15, desc: "Опускайся до параллели и выпрыгивай вверх." }, { name: "Упражнение 'Скалолаз'", type: "time", target: 45, desc: "В упоре лежа быстро подтягивай колени к груди." }],
    power: [{ name: "Отжимания широким хватом", type: "reps", target: 12, desc: "Глубокие отжимания от пола." }, { name: "Обратные отжимания от стула", type: "reps", target: 15, desc: "Опора руками на край стула сзади." }, { name: "Выпады назад попеременно", type: "reps", target: 16, desc: "Шаг назад, угол в коленях 90 градусов." }]
};

function switchScreen(id, btn) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

let water = parseInt(localStorage.getItem('water_today') || '0', 10);
let waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);

function checkWaterColor() {
    const display = document.getElementById('water-count'); if (!display) return;
    if (water >= waterTarget) { display.style.setProperty('color', '#00b0ff', 'important'); } 
    else { display.style.setProperty('color', '#5288c1', 'important'); }
}

function addWaterManual() {
    const input = document.getElementById('input-add-water'); const val = parseInt(input.value, 10); if (!val || val <= 0) return;
    water += val; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    input.value = ""; checkWaterColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddWater(amount) {
    water += amount; document.getElementById('water-count').innerText = water; localStorage.setItem('water_today', water.toString());
    checkWaterColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetWater() {
    water = 0; document.getElementById('water-count').innerText = "0"; localStorage.setItem('water_today', "0");
    checkWaterColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}

let caloriesCurrent = parseInt(localStorage.getItem('calories_current') || '0', 10); 
let caloriesTarget = parseInt(localStorage.getItem('calories_target') || '2000', 10);

function checkCaloriesColor() {
    const d = document.getElementById('calories-current'); if (!d) return;
    if (caloriesCurrent > caloriesTarget) { d.style.setProperty('color', '#f44336', 'important'); } 
    else { d.style.setProperty('color', '#4caf50', 'important'); }
}

function addCalories() {
    const i = document.getElementById('input-add-calories'); const v = parseInt(i.value, 10); if (!v || v <= 0) return;
    caloriesCurrent += v; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    i.value = ""; checkCaloriesColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddCalories(amount) {
    caloriesCurrent += amount; document.getElementById('calories-current').innerText = caloriesCurrent; localStorage.setItem('calories_current', caloriesCurrent.toString());
    checkCaloriesColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetCalories() {
    caloriesCurrent = 0; document.getElementById('calories-current').innerText = "0"; localStorage.setItem('calories_current', "0");
    checkCaloriesColor(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}
let bmiCat = localStorage.getItem('bmi_category') || 'normal';

function calculateBMI() {
    const h = parseFloat(document.getElementById('bmi-height').value); 
    const w = parseFloat(document.getElementById('bmi-weight').value); 
    const t = parseFloat(document.getElementById('weight-target').value);
    const res = document.getElementById('bmi-result'); 
    
    if (!h || !w) { res.style.display = 'none'; return; }
    
    localStorage.setItem('user_height', h); 
    localStorage.setItem('user_weight', w); 
    if (t) localStorage.setItem('user_target_weight', t);

    const bmi = (w / ((h/100) * (h/100))).toFixed(1); 
    let txt = "", col = "#5288c1";
    
    let bmr = Math.round((10 * w) + (6.25 * h) - (5 * 25) + 5); 
    let normCalories = Math.round(bmr * 1.375); 
    let targetCal = normCalories;
    let targetWater = 2000; 
    let p = 0, f = 0, c = 0;

    if (bmi < 18.5) { 
        txt = "Дефицит массы"; col = "#e5a93b"; bmiCat = "deficit"; 
        targetCal = Math.round(normCalories + 400); 
        targetWater = Math.round((w * 35) + 500); 
        p = Math.round(w * 2); f = Math.round(w * 1.1); c = Math.round((targetCal - (p*4 + f*9)) / 4); 
    } else if (bmi >= 18.5 && bmi < 25) { 
        txt = "Нормальный вес"; col = "#4caf50"; bmiCat = "normal"; 
        targetCal = normCalories; 
        targetWater = Math.round((w * 35) + 500); 
        p = Math.round(w * 1.6); f = Math.round(w * 1.0); c = Math.round((targetCal - (p*4 + f*9)) / 4); 
    } else { 
        txt = "Избыточный вес"; col = "#f44336"; bmiCat = "excess"; 
        targetCal = Math.round(normCalories - 450); 
        targetWater = Math.round((w * 40) + 500); 
        p = Math.round(w * 1.8); f = Math.round(w * 0.8); c = Math.round((targetCal - (p*4 + f*9)) / 4); 
    }

    caloriesTarget = targetCal; 
    localStorage.setItem('calories_target', caloriesTarget.toString()); 
    localStorage.setItem('bmi_category', bmiCat); 
    if(document.getElementById('calories-target')) document.getElementById('calories-target').innerText = caloriesTarget;
    
    waterTarget = targetWater;
    localStorage.setItem('water_target', waterTarget.toString());
    if(document.getElementById('water-target')) document.getElementById('water-target').innerText = waterTarget;

    res.style.display = 'block'; res.style.color = col;
    res.innerHTML = `<div>ИМТ: ${bmi} (${txt})</div><div style="font-size:15px; color:#fff; margin-top:8px;">🎯 Цель питания: <strong>${caloriesTarget} ккал</strong></div><div class="macro-grid"><div class="macro-item" style="border-bottom:2px solid #5288c1;">🧬 Б: ${p}г</div><div class="macro-item" style="border-bottom:2px solid #e5a93b;">🥑 Ж: ${f}г</div><div class="macro-item" style="border-bottom:2px solid #4caf50;">🍞 У: ${c}г</div></div>`;
    if(document.getElementById('status-text')) document.getElementById('status-text').innerText = `ИМТ: ${bmi} (${txt}). Цель питания: ${caloriesTarget} ккал.`; 
    
    // ЛОГИКА ИНТЕРАКТИВНОЙ ШКАЛЫ ВЕСА
    // ЛОГИКА ИНТЕРАКТИВНОЙ ШКАЛЫ ВЕСА (Грамотный расчет без багов)
    const progressContainer = document.getElementById('weight-progress-container');
    if (progressContainer && t) {
        progressContainer.style.display = 'block';
        
        let percent = 0;
        
        if (w > t) {
            // Режим: Похудение (Текущий вес больше целевого)
            // За базовый диапазон берем разницу + 15 кг от цели как точку старта
            let maxRange = t + 15; 
            if (w >= maxRange) {
                percent = 0;
            } else {
                percent = Math.round(((maxRange - w) / (maxRange - t)) * 100);
            }
            
            const diff = (w - t).toFixed(1);
            document.getElementById('weight-motivation-text').innerText = `Бро, до заветной цели осталось скинуть всего ${diff} кг! 🔥`;
        } 
        else if (w < t) {
            // Режим: Набор массы (Текущий вес меньше целевого)
            // За базовый диапазон берем разницу - 15 кг от цели как точку старта
            let minRange = t - 15;
            if (w <= minRange) {
                percent = 0;
            } else {
                percent = Math.round(((w - minRange) / (t - minRange)) * 100);
            }
            
            const diff = (t - w).toFixed(1);
            document.getElementById('weight-motivation-text').innerText = `Бро, до заветной цели осталось набрать еще ${diff} кг! 🔥`;
        } 
        else {
            // Идеальное попадание в цель
            percent = 100;
            document.getElementById('weight-motivation-text').innerText = `Красава, Бро! Цель достигнута! Ты машина! 👑🏆`;
        }
        
        // Ограничиваем проценты от 0 до 100, чтобы полоса не вылезала за края
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        
        document.getElementById('weight-progress-bar').style.width = percent + '%';
        document.getElementById('weight-progress-text').innerText = percent + '%';
        
    } else if (progressContainer) {
        progressContainer.style.display = 'none';
    }

    checkCaloriesColor();
    checkWaterColor();
}

function togglePostureSub() { const cat = document.getElementById('workout-category').value; document.getElementById('sub-posture-group').style.display = (cat === 'posture') ? 'block' : 'none'; }
let currentExercises = [], exIndex = 0, totalRounds = 3, currentRound = 1, timerInterval, isTimerRunning = false;

function startWorkoutSession() {
    const cat = document.getElementById('workout-category').value; if (cat === 'none') { alert("Бро, выбери сначала цель тренировки!"); return; }
    currentExercises = (cat === 'posture') ? courseDatabase.posture[document.getElementById('posture-type').value] : courseDatabase[cat]; if (!currentExercises || currentExercises.length === 0) return;
    exIndex = 0; currentRound = 1; isTimerRunning = false; clearInterval(timerInterval); document.getElementById('workout-setup-card').style.display = 'none'; document.getElementById('workout-player-container').style.display = 'block'; showCurrentStep();
}

function showCurrentStep() {
    const ex = currentExercises[exIndex]; const btnAction = document.getElementById('btn-action'); clearInterval(timerInterval); isTimerRunning = false;
    document.getElementById('player-round-info').innerText = `КРУГ ${currentRound} ИЗ ${totalRounds}`; document.getElementById('player-ex-name').innerText = ex.name; document.getElementById('player-ex-desc').innerText = ex.desc;
    if (ex.type === "reps") { document.getElementById('player-ex-target').innerText = `${ex.target} РАЗ`; document.getElementById('player-timer-digits').style.display = 'none'; btnAction.innerText = "Выполнено! Далее"; btnAction.className = "btn-success"; }
    else { document.getElementById('player-ex-target').innerText = `ДЕРЖИМ ВРЕМЯ`; document.getElementById('player-timer-digits').style.display = 'block'; document.getElementById('player-timer-digits').innerText = `00:${ex.target}`; btnAction.innerText = "🟢 Запустить таймер"; btnAction.className = "btn-success"; }
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
        if (currentRound < totalRounds) { currentRound++; exIndex = 0; alert(`👊 Круг выполнен! Приготовиться к КРУГУ №${currentRound}!`); showCurrentStep(); } 
        else { const currentCat = document.getElementById('workout-category').value; const currentToday = new Date().getDate(); localStorage.setItem(`done_${currentCat}_day_${currentToday}`, 'true'); exitWorkoutSession(); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy'); alert("Бро, поздравляю! Ты прошел все 3 КРУГА тренировки подряд! 🔥🦾"); }
    }
}

function exitWorkoutSession() { 
    clearInterval(timerInterval); 
    document.getElementById('workout-player-container').style.display = 'none'; 
    document.getElementById('workout-setup-card').style.display = 'block'; 
    const select = document.getElementById('workout-category');
    if (select) { select.value = 'none'; select.disabled = false; }
    if (document.getElementById('sub-posture-group')) { document.getElementById('sub-posture-group').style.display = 'none'; }
}

function saveGoals() { localStorage.setItem('goal_posture', document.getElementById('goal-posture').checked); localStorage.setItem('goal_fatburn', document.getElementById('goal-fatburn').checked); localStorage.setItem('goal_power', document.getElementById('goal-power').checked); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); }

function updateWorkoutMenu() {
    const select = document.getElementById('workout-category'); if (!select) return;
    const showPosture = document.getElementById('goal-posture').checked; const showFatburn = document.getElementById('goal-fatburn').checked; const showPower = document.getElementById('goal-power').checked;
    select.options[1].style.display = showPosture ? 'block' : 'none'; select.options[2].style.display = showFatburn ? 'block' : 'none'; select.options[3].style.display = showPower ? 'block' : 'none';
    if (select.value === 'posture' && !showPosture) select.value = 'none'; if (select.value === 'fatburn' && !showFatburn) select.value = 'none'; if (select.value === 'power' && !showPower) select.value = 'none'; togglePostureSub();
}

function renderTableCalendar() {
    const container = document.getElementById('calendar-table-container'); if (!container) return; container.innerHTML = "";
    const goals = [{ id: 'posture', name: '🧘‍♂️ Коррекция осанки', checked: document.getElementById('goal-posture').checked }, { id: 'fatburn', name: '🔥 Похудение и жиросжигание', checked: document.getElementById('goal-fatburn').checked }, { id: 'power', name: '💪 Прокачка мышц дома', checked: document.getElementById('goal-power').checked }];
    const today = new Date().getDate();
    goals.forEach(goal => {
        if (goal.checked) {
            let rowHtml = `<div class="calendar-row"><div class="calendar-row-title">${goal.name}</div><div class="calendar-days-line">`;
            for (let day = 1; day <= 7; day++) {
                const storageKey = `done_${goal.id}_day_${day}`; const isDone = localStorage.getItem(storageKey) === 'true'; let dayClass = "calendar-box-day"; if (isDone) dayClass += " day-done"; if (day === today) dayClass += " day-today-border";
                rowHtml += `<div class="${dayClass}" onclick="toggleDayManual('${goal.id}', ${day})"><span style="font-size:10px; opacity:0.6;">день</span><strong>${day}</strong></div>`;
            }
            rowHtml += `</div></div>`; container.innerHTML += rowHtml;
        }
    });
}

function toggleDayManual(goalId, day) { const storageKey = `done_${goalId}_day_${day}`; const currentState = localStorage.getItem(storageKey) === 'true'; localStorage.setItem(storageKey, !currentState); if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium'); renderTableCalendar(); }

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bmi-height').value = localStorage.getItem('user_height') || ''; 
    document.getElementById('bmi-weight').value = localStorage.getItem('user_weight') || '';
    if(document.getElementById('weight-target')) document.getElementById('weight-target').value = localStorage.getItem('user_target_weight') || '';
    
    document.getElementById('calories-current').innerText = caloriesCurrent; 
    document.getElementById('calories-target').innerText = caloriesTarget;
    document.getElementById('water-count').innerText = water;
    
    waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);
    if(document.getElementById('water-target')) document.getElementById('water-target').innerText = waterTarget;

    document.getElementById('goal-posture').checked = localStorage.getItem('goal_posture') !== 'false'; 
    document.getElementById('goal-fatburn').checked = localStorage.getItem('goal_fatburn') === 'true'; 
    document.getElementById('goal-power').checked = localStorage.getItem('goal_power') === 'true';
    
    calculateBMI(); checkCaloriesColor(); checkWaterColor(); updateWorkoutMenu(); renderTableCalendar();
});

