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
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active')); 
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active');
    
    // НАШЕ ОБНОВЛЕНИЕ: Если Бро зашел в календарь — сразу перерисовываем кубики
    if (id === 'screen-calendar') {
        renderHeatmapCalendar();
    }
    
    if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

let water = parseInt(localStorage.getItem('water_today') || '0', 10);
let waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);

function checkWaterColor() {
    const display = document.getElementById('water-count'); if (!display) return;
    if (water >= waterTarget) { display.style.setProperty('color', '#00b0ff', 'important'); } 
    else { display.style.setProperty('color', '#5288c1', 'important'); }
}

// ==========================================================================
// ОБНОВЛЕННЫЙ БЛОК ВОДЫ (С АВТООБНОВЛЕНИЕМ КАЛЕНДАРЯ)
// ==========================================================================
function addWaterManual() {
    const input = document.getElementById('input-add-water'); 
    const val = parseInt(input.value, 10); 
    if (!val || val <= 0) return;
    
    water += val; 
    document.getElementById('water-count').innerText = water; 
    localStorage.setItem('water_today', water.toString());
    input.value = ""; 
    checkWaterColor(); 
    
    // Перекрашиваем календарь прямо на лету!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddWater(amount) {
    water += amount; 
    document.getElementById('water-count').innerText = water; 
    localStorage.setItem('water_today', water.toString());
    checkWaterColor(); 
    
    // Перекрашиваем календарь прямо на лету!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetWater() {
    water = 0; 
    document.getElementById('water-count').innerText = "0"; 
    localStorage.setItem('water_today', "0");
    checkWaterColor(); 
    
    // Сбрасываем и в календаре тоже!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}


let caloriesCurrent = parseInt(localStorage.getItem('calories_current') || '0', 10); 
let caloriesTarget = parseInt(localStorage.getItem('calories_target') || '2000', 10);

function checkCaloriesColor() {
    const d = document.getElementById('calories-current'); if (!d) return;
    if (caloriesCurrent > caloriesTarget) { d.style.setProperty('color', '#f44336', 'important'); } 
    else { d.style.setProperty('color', '#4caf50', 'important'); }
}

// ==========================================================================
// ОБНОВЛЕННЫЙ БЛОК ЕДЫ (С АВТООБНОВЛЕНИЕМ КАЛЕНДАРЯ)
// ==========================================================================
function addCalories() {
    const i = document.getElementById('input-add-calories'); 
    const v = parseInt(i.value, 10); 
    if (!v || v <= 0) return;
    
    caloriesCurrent += v; 
    document.getElementById('calories-current').innerText = caloriesCurrent; 
    localStorage.setItem('calories_current', caloriesCurrent.toString());
    i.value = ""; 
    checkCaloriesColor(); 
    
    // Календарь сразу видит новую еду!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function quickAddCalories(amount) {
    caloriesCurrent += amount; 
    document.getElementById('calories-current').innerText = caloriesCurrent; 
    localStorage.setItem('calories_current', caloriesCurrent.toString());
    checkCaloriesColor(); 
    
    // Календарь сразу видит новую еду!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function resetCalories() {
    caloriesCurrent = 0; 
    document.getElementById('calories-current').innerText = "0"; 
    localStorage.setItem('calories_current', "0");
    checkCaloriesColor(); 
    
    // Обнуляем еду в календаре за сегодня!
    syncTodayDataToCalendar();
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
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
    // ЛОГИКА ИНТЕРАКТИВНОЙ ШКАЛЫ ВЕСА (Динамический расчет без залипания памяти)
    const progressContainer = document.getElementById('weight-progress-container');
    if (progressContainer && t) {
        progressContainer.style.display = 'block';
        
        let percent = 0;
        const range = 20; // Жесткий рабочий диапазон в 20 кг до цели
        
        if (w > t) {
            // Режим: Похудение
            if (w >= t + range) {
                percent = 0; // Если ты еще слишком далеко, полоса пустая
            } else {
                percent = Math.round(((t + range - w) / range) * 100);
            }
            const diff = (w - t).toFixed(1);
            document.getElementById('weight-motivation-text').innerText = `Бро, до заветной цели осталось скинуть всего ${diff} кг! 🔥`;
        } 
        else if (w < t) {
            // Режим: Набор массы
            if (w <= t - range) {
                percent = 0; // Если ты еще слишком далеко снизу, полоса пустая
            } else {
                percent = Math.round(((w - (t - range)) / range) * 100);
            }
            const diff = (t - w).toFixed(1);
            document.getElementById('weight-motivation-text').innerText = `Бро, до заветной цели осталось набрать еще ${diff} кг! 🔥`;
        } 
        else {
            percent = 100;
            document.getElementById('weight-motivation-text').innerText = `Красава, Бро! Цель достигнута! Ты машина! 👑🏆`;
        }
        
        // Страховка границ
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
    if (exIndex < currentExercises.length - 1) { 
        exIndex++; 
        showCurrentStep(); 
    } 
    else {
        if (currentRound < totalRounds) { 
            currentRound++; 
            exIndex = 0; 
            alert(`👊 Круг выполнен! Приготовиться к КРУГУ №${currentRound}!`); 
            showCurrentStep(); 
        } 
        else { 
            const currentCat = document.getElementById('workout-category').value; 
            const currentToday = new Date().getDate(); 
            localStorage.setItem(`done_${currentCat}_day_${currentToday}`, 'true'); 
            
            // НАШЕ ОБНОВЛЕНИЕ: Записываем тренировку в календарь!
            syncTodayDataToCalendar();
            
            exitWorkoutSession(); 
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy'); 
            alert("Бро, поздравляю! Ты прошел все 3 КРУГА тренировки подряд! 🔥🦾"); 
        }
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

// ==========================================================================
// НОВАЯ ЛОГИКА: КАЛЕНДАРЬ ВСЕВЛАСТИЯ (ПОЛНЫЙ ГОТОВЫЙ БЛОК)
// ==========================================================================

// Функция, которая узнает текущую дату компьютера/телефона
function getFormattedDate(dateOffset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Запоминаем, какой день Бро нажал в календаре
let selectedCalendarDate = null;

// Умная функция: берет все цифры за сегодня и сохраняет в календарь
function syncTodayDataToCalendar() {
    const todayKey = getFormattedDate(0);
    
    // Берем старые данные за сегодня из памяти или создаем чистые
    let dayData = JSON.parse(localStorage.getItem(`calendar_day_${todayKey}`) || '{}');
    
    // Записываем текущую воду и калории
    dayData.water = water;
    dayData.calories = caloriesCurrent;
    
    // Проверяем, была ли тренировка сегодня
    const todayObj = new Date();
    const currentToday = todayObj.getDate();
    const didWorkout = localStorage.getItem(`done_posture_day_${currentToday}`) === 'true' ||
                      localStorage.getItem(`done_fatburn_day_${currentToday}`) === 'true' ||
                      localStorage.getItem(`done_power_day_${currentToday}`) === 'true';
                      
    dayData.workouts = didWorkout ? 3 : (dayData.workouts || 0);
    dayData.weight = parseFloat(localStorage.getItem('user_weight') || '0');
    
    // Сохраняем в память телефона
    localStorage.setItem(`calendar_day_${todayKey}`, JSON.stringify(dayData));
}

// Функция, которая рисует 31 кубик на экране Календаря
function renderHeatmapCalendar() {
    const grid = document.getElementById('calendar-heatmap');
    if (!grid) return;
    grid.innerHTML = ""; // Очищаем старые кубики перед прорисовкой

    const todayObj = new Date();
    const currentYear = todayObj.getFullYear();
    const currentMonth = todayObj.getMonth();
    
    // Считаем, сколько дней в этом месяце
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Подтягиваем цели Бро для проверки успехов
    const targetW = parseInt(localStorage.getItem('water_target') || '2000', 10);
    const targetC = parseInt(localStorage.getItem('calories_target') || '2000', 10);
    const targetWeight = parseFloat(localStorage.getItem('user_target_weight') || '0');

    // Цикл: создаем кубик для каждого дня месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const yyyy = currentYear;
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        
        // Читаем из памяти данные за этот конкретный день
        const dayData = JSON.parse(localStorage.getItem(`calendar_day_${dateKey}`) || '{}');
        
        const dWater = dayData.water || 0;
        const dCalories = dayData.calories || 0;
        const dWorkouts = dayData.workouts || 0;
        const dWeight = dayData.weight || 0;

        // Считаем баллы (максимум 4)
        let score = 0;
        if (dWater >= targetW) score++; // Вода выполнена
        if (dCalories > 0 && dCalories <= targetC && dCalories >= (targetC - 400)) score++; // Еда в зеленом коридоре
        if (dWorkouts >= 3) score++; // Тренировка сделана полностью
        if (dWeight > 0) score++; // Вес записан

        // Проверяем, заслужил ли Бро Королевский день (Все 4 дела + вес дошел до цели)
        let isKing = false;
        if (score === 4 && targetWeight > 0) {
            const currentWeight = parseFloat(localStorage.getItem('user_weight') || '0');
            if ((currentWeight > targetWeight && dWeight <= targetWeight) || 
                (currentWeight < targetWeight && dWeight >= targetWeight) || 
                (dWeight === targetWeight)) {
                isKing = true;
            }
        }

        // Создаем сам кубик в HTML
        const dayBox = document.createElement('div');
        dayBox.heatmapDay = true; 
        dayBox.className = 'heatmap-day';
        dayBox.innerText = day;

        // Красим кубик в нужный цвет
        if (isKing) {
            dayBox.classList.add('level-king');
            dayBox.innerText = "👑"; // Дарим корону вместо цифры дня
        } else {
            dayBox.classList.add(`level-${score}`);
        }

        // Если кубик — это СЕГОДНЯ, добавляем синий контур
        if (day === todayObj.getDate() && currentMonth === todayObj.getMonth() && currentYear === todayObj.getFullYear()) {
            dayBox.classList.add('today');
        }

        // Нажатие на кубик — открывает всплывающее окно
        dayBox.onclick = () => {
            selectedCalendarDate = dateKey;
            document.getElementById('modal-date-title').innerText = `День Бро: ${dd}.${mm}.${yyyy}`;
            
            // Пишем в поля модалки старые цифры дня
            document.getElementById('modal-water').value = dayData.water || "";
            document.getElementById('modal-calories').value = dayData.calories || "";
            document.getElementById('modal-workouts').value = dayData.workouts || "";
            document.getElementById('modal-weight').value = dayData.weight || "";
            
            // Открываем модалку на экране
            document.getElementById('calendar-modal').style.display = 'flex';
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        };

        grid.appendChild(dayBox);
    }
}

// Слушатель для кнопок внутри всплывающего окна (Отмена и Сохранить)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('calendar-modal');
    const btnClose = document.getElementById('btn-modal-close');
    const btnSave = document.getElementById('btn-modal-save');

    if (btnClose) {
        btnClose.onclick = () => { modal.style.display = 'none'; };
    }

    if (btnSave) {
        btnSave.onclick = () => {
            if (!selectedCalendarDate) return;

            // Считываем, что Бро ввёл в поля руками
            const wVal = parseInt(document.getElementById('modal-water').value, 10) || 0;
            const cVal = parseInt(document.getElementById('modal-calories').value, 10) || 0;
            const woVal = parseInt(document.getElementById('modal-workouts').value, 10) || 0;
            const weVal = parseFloat(document.getElementById('modal-weight').value) || 0;

            // Записываем новые цифры в память
            const updatedData = { water: wVal, calories: cVal, workouts: woVal, weight: weVal };
            localStorage.setItem(`calendar_day_${selectedCalendarDate}`, JSON.stringify(updatedData));

            // Если Бро менял СЕГОДНЯШНИЙ день — обновляем цифры и на Главном экране
            const todayKey = getFormattedDate(0);
            if (selectedCalendarDate === todayKey) {
                water = wVal;
                caloriesCurrent = cVal;
                document.getElementById('water-count').innerText = water;
                document.getElementById('calories-current').innerText = caloriesCurrent;
                localStorage.setItem('water_today', water.toString());
                localStorage.setItem('calories_current', caloriesCurrent.toString());
                checkWaterColor();
                checkCaloriesColor();
            }

            modal.style.display = 'none'; // Закрываем окно
            renderHeatmapCalendar(); // Мгновенно перерисовываем кубики!
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            alert("Данные дня успешно сохранены, Бро! 🦾");
        };
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // Восстанавливаем рост и вес из памяти в поля ввода
    document.getElementById('bmi-height').value = localStorage.getItem('user_height') || ''; 
    document.getElementById('bmi-weight').value = localStorage.getItem('user_weight') || '';
    if(document.getElementById('weight-target')) {
        document.getElementById('weight-target').value = localStorage.getItem('user_target_weight') || '';
    }
    
    // Выводим текущую воду и калории на Главный экран
    document.getElementById('calories-current').innerText = caloriesCurrent; 
    document.getElementById('calories-target').innerText = caloriesTarget;
    document.getElementById('water-count').innerText = water;
    
    waterTarget = parseInt(localStorage.getItem('water_target') || '2000', 10);
    if(document.getElementById('water-target')) {
        document.getElementById('water-target').innerText = targetWater; // Исправлено на правильную цель воды
    }

    // Восстанавливаем галочки фокуса
    document.getElementById('goal-posture').checked = localStorage.getItem('goal_posture') !== 'false'; 
    document.getElementById('goal-fatburn').checked = localStorage.getItem('goal_fatburn') === 'true'; 
    document.getElementById('goal-power').checked = localStorage.getItem('goal_power') === 'true';
    
    // Запускаем расчет ИМТ, цветов счетчиков и меню тренировок
    calculateBMI(); 
    checkCaloriesColor(); 
    checkWaterColor(); 
    updateWorkoutMenu(); 
    
    // НАШЕ ОБНОВЛЕНИЕ: Сохраняем сегодняшние данные и включаем Календарь Всевластия!
    syncTodayDataToCalendar();
    renderHeatmapCalendar();
});


