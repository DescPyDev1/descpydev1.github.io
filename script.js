// script.js

let incomeCount = 1;
let realEstateCounter = 1;
let movableCounter = 1;
let liabilityCount = 1;

// Вспомогательные функции.
async function pdfToBase64(pdfBytes) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Убираем data:application/pdf;base64, префикс
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
};

// Функция для показа/скрытия поля "другое" для вида сделки
function toggleTransactionTypeOtherInput(select) {
    const otherInput = select.parentNode.querySelector('input[name$="[other_type]"]');
    if (select.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

// Функция для показа/скрытия поля "другое" для объекта сделки
function toggleTransactionItemOtherInput(select) {
    const otherInput = select.parentNode.querySelector('input[name$="[other_item]"]');
    if (select.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

// Функция для переключения поля "Другое" в источниках дохода
function toggleIncomeOtherInput(selectElement) {
    const otherInput = selectElement.parentElement.querySelector('.other-input');
    if (selectElement.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

// Функция для показа/скрытия поля даты просрочки
function toggleOverdueDateInput(checkbox) {
    const dynamicItem = checkbox.closest('.dynamic-item');
    const overdueDateInput = dynamicItem.querySelector('input[name$="[overdue_date]"]');
    
    if (checkbox.checked) {
        overdueDateInput.style.display = 'block';
    } else {
        overdueDateInput.style.display = 'none';
        overdueDateInput.value = '';
    }
};

function toggleRealEstateOtherInput(selectElement) {
    const otherInput = selectElement.parentElement.querySelector('.other-input');
    if (selectElement.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

function toggleMovableOtherInput(selectElement) {
    const otherInput = selectElement.parentElement.querySelector('.other-input');
    if (selectElement.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

// Функция для переключения поля "Другое" в обязательствах
function toggleLiabilityOtherInput(selectElement) {
    const otherInput = selectElement.parentElement.querySelector('.other-input');
    if (selectElement.value === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
};

// Функция для добавления новой сделки
function addTransactionItem() {
    const transactionItems = document.getElementById('transactionItems');
    const index = transactionItems.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updateRemoveButtons();">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Вид сделки</label>
                <select name="transactions[${index}][type]" onchange="toggleTransactionTypeOtherInput(this)">
                    <option value="">Выберите вид сделки</option>
                    <option value="Продажа">Продажа</option>
                    <option value="Дарение">Дарение</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="transactions[${index}][other_type]" placeholder="Укажите вид сделки" class="other-input" style="display: none;">
            </div>
            <div class="form-group">
                <label>Что продал</label>
                <select name="transactions[${index}][item]" onchange="toggleTransactionItemOtherInput(this)">
                    <option value="">Выберите объект сделки</option>
                    <option value="Квартира">Квартира</option>
                    <option value="Машина">Машина</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="transactions[${index}][other_item]" placeholder="Укажите объект сделки" class="other-input" style="display: none;">
            </div>
            <div class="form-group">
                <label>За сколько продал</label>
                <input type="number" name="transactions[${index}][amount]" placeholder="0">
            </div>
            <div class="form-group">
                <label>Дата сделки</label>
                <input type="text" name="transactions[${index}][date]" placeholder="ДД.ММ.ГГГГ">
            </div>
        </div>
    `;
    
    transactionItems.appendChild(newItem);
    updateRemoveButtons();
};

function addIncomeItem() {
    const incomeItems = document.getElementById('incomeItems');
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Источник дохода</label>
                <select name="income[${incomeCount}][name]" onchange="toggleIncomeOtherInput(this)">
                    <option value="">Выберите источник дохода</option>
                    <option value="ЗП">Зарплата</option>
                    <option value="Пособие">Пособие</option>
                    <option value="Пенсия">Пенсия</option>
                    <option value="Неофициальный доход">Неофициальный доход</option>
                    <option value="Алименты">Алименты</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="income[${incomeCount}][other_name]" placeholder="Укажите источник дохода" class="other-input">
            </div>
            <div class="form-group">
                <label>Сумма в месяц</label>
                <input type="number" name="income[${incomeCount}][salary]" placeholder="0">
            </div>
            <!-- Добавленный чекбокс "удерживается-ли" -->
            <div class="form-group">
                <label class="checkbox-group">
                    <input type="checkbox" name="income[${incomeCount}][is_withheld]">
                    Удерживается-ли
                </label>
            </div>
        </div>
    `;
    incomeItems.appendChild(newItem);
    incomeCount++;
    
    // Инициализируем обработчики для нового элемента
    const newSelect = newItem.querySelector('select[name^="income"]');
    toggleIncomeOtherInput(newSelect);
};

function addRealEstateItem() {
    const container = document.getElementById('realEstateItems');
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Наименование имущества</label>
                <select name="real_estate[${realEstateCounter}][name]" onchange="toggleRealEstateOtherInput(this)">
                    <option value="">Выберите вид имущества</option>
                    <option value="Квартира">Квартира</option>
                    <option value="Дом">Дом</option>
                    <option value="Дача">Дача</option>
                    <option value="Апартаменты">Апартаменты</option>
                    <option value="Земельный участок">Земельный участок</option>
                    <option value="Коммерческая недвижимость">Коммерческая недвижимость</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="real_estate[${realEstateCounter}][other_name]" placeholder="Укажите вид имущества" class="other-input">
            </div>
            <div class="form-group">
                <label>Стоимость</label>
                <input type="number" name="real_estate[${realEstateCounter}][cost]" placeholder="0">
            </div>
            <div class="form-group">
                <label>Доля владения</label>
                <select name="real_estate[${realEstateCounter}][ownership_share]">
                    <option value="">Выберите долю владения</option>
                    <option value="100%">100%</option>
                    <option value="1/2">1/2</option>
                    <option value="1/3">1/3</option>
                    <option value="1/4">1/4</option>
                    <option value="1/5">1/5</option>
                    <option value="1/6">1/6</option>
                    <option value="1/7">1/7</option>
                    <option value="1/8">1/8</option>
                    <option value="1/9">1/9</option>
                    <option value="1/10">1/10</option>
                </select>
            </div>
            <!-- Чекбоксы на одном уровне -->
            <div class="form-group">
                <div class="checkbox-row">
                    <label class="checkbox-group">
                        <input type="checkbox" name="real_estate[${realEstateCounter}][is_jointly]">
                        Совместно нажитое
                    </label>
                    <label class="checkbox-group">
                        <input type="checkbox" name="real_estate[${realEstateCounter}][is_pledged]">
                        В залоге
                    </label>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newItem);
    realEstateCounter++;
};

// Функция для добавления нового источника дохода
function addMovableItem() {
    const container = document.getElementById('movableItems');
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item';
    newItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Наименование имущества</label>
                <select name="movable[${movableCounter}][name]" onchange="toggleMovableOtherInput(this)">
                    <option value="">Выберите вид имущества</option>
                    <option value="Автомобиль">Автомобиль</option>
                    <option value="Автобус">Автобус</option>
                    <option value="Мотоцикл">Мотоцикл</option>
                    <option value="Прицеп">Прицеп</option>
                    <option value="Снегоход">Снегоход</option>
                    <option value="Спецтехника">Спецтехника</option>
                    <option value="Трактор">Трактор</option>
                    <option value="Катер (лодка)">Катер (лодка)</option>
                    <option value="Вагончик">Вагончик</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="movable[${movableCounter}][other_name]" placeholder="Укажите вид имущества" class="other-input">
            </div>
            <div class="form-group">
                <label>Стоимость</label>
                <input type="number" name="movable[${movableCounter}][cost]" placeholder="0">
            </div>
            <div class="form-group">
                <label class="checkbox-group">
                    <input type="checkbox" name="movable[${movableCounter}][is_jointly]">
                    Совместно нажитое
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-group">
                    <input type="checkbox" name="movable[${movableCounter}][is_pledged]">
                    В залоге
                </label>
            </div>
        </div>
    `;
    container.appendChild(newItem);
    movableCounter++;
};

function addLiabilityItem() {
    const liabilityItems = document.getElementById('liabilityItems');
    const index = liabilityItems.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'dynamic-item';
    newItem.innerHTML = `
        <button type="button" class="remove-btn">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Вид обязательства</label>
                <select name="liabilities[${index}][name]" onchange="toggleLiabilityOtherInput(this)">
                    <option value="">Выберите вид обязательства</option>
                    <option value="МФО">МФО</option>
                    <option value="Автокредит">Автокредит</option>
                    <option value="Ипотека">Ипотека</option>
                    <option value="Кредитная карта">Кредитная карта</option>
                    <option value="Ущерб">Ущерб</option>
                    <option value="other">Другое</option>
                </select>
                <input type="text" name="liabilities[${index}][other_name]" placeholder="Укажите вид обязательства" class="other-input">
            </div>
            <!-- НОВОЕ ПОЛЕ: Банк выдавший кредит -->
            <div class="form-group">
                <label>Банк выдавший кредит</label>
                <input type="text" name="liabilities[${index}][bank_name]" placeholder="Введите название банка">
            </div>
            <div class="form-group">
                <label>Ежемесячный платеж</label>
                <input type="number" name="liabilities[${index}][monthly_payment]" placeholder="0" class="monthly-payment-input">
            </div>
            <div class="form-group">
                <label>Общая сумма</label>
                <input type="number" name="liabilities[${index}][total_liability]" placeholder="0" class="total-liability-input">
            </div>
            <div class="form-group">
                <label>Дата приобретения кредита</label>
                <input type="text" name="liabilities[${index}][loan_date]" placeholder="ДД.ММ.ГГГГ">
            </div>
            <div class="form-group">
                <label>Срок кредита (лет)</label>
                <input type="number" name="liabilities[${index}][loan_term]" placeholder="0" step="0.1" min="0">
            </div>
            <div class="form-group">
                <label>Сумма внесенных платежей</label>
                <input type="number" name="liabilities[${index}][paid_amount]" placeholder="0">
            </div>
            <div class="form-group">
                <label class="checkbox-group">
                    <input type="checkbox" name="liabilities[${index}][has_overdues]" onchange="toggleOverdueDateInput(this)">
                    Имеются ли просрочки
                </label>
                <input type="text" name="liabilities[${index}][overdue_date]" placeholder="ДД.ММ.ГГГГ" class="overdue-date-input">
            </div>
            <div class="form-group">
                <label class="checkbox-group">
                    <input type="checkbox" name="liabilities[${index}][has_guarantor]">
                    Есть-ли поручитель
                </label>
            </div>
        </div>
    `;
    
    liabilityItems.appendChild(newItem);
    updateRemoveButtons();
    
    // Добавляем обработчики событий для новых полей ввода
    const monthlyPaymentInput = newItem.querySelector('.monthly-payment-input');
    const totalLiabilityInput = newItem.querySelector('.total-liability-input');
    
    monthlyPaymentInput.addEventListener('input', updateLiabilitiesTotals);
    totalLiabilityInput.addEventListener('input', updateLiabilitiesTotals);
    
    // Обновляем итоги после добавления нового элемента
    updateLiabilitiesTotals();
};

// Функция для пересчета общих сумм обязательств
function updateLiabilitiesTotals() {
    const monthlyPaymentInputs = document.querySelectorAll('.monthly-payment-input');
    const totalLiabilityInputs = document.querySelectorAll('.total-liability-input');
    
    let totalMonthlyPayment = 0;
    let totalLiabilities = 0;
    
    // Суммируем все ежемесячные платежи
    monthlyPaymentInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalMonthlyPayment += value;
    });
    
    // Суммируем все общие суммы обязательств
    totalLiabilityInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalLiabilities += value;
    });
    
    // Обновляем отображение сумм
    document.getElementById('totalMonthlyPayment').textContent = totalMonthlyPayment.toLocaleString('ru-RU');
    document.getElementById('totalLiabilities').textContent = totalLiabilities.toLocaleString('ru-RU');
};

function showDebugInfo(info) {
    const debugDiv = document.getElementById('debugInfo');
    debugDiv.innerHTML = `<strong>Отладочная информация:</strong><br>${info}`;
    debugDiv.style.display = 'block';
};

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
};

function serializeFormData(formData) {
    // Получаем значения из формы
    const dealId = formData.get('deal_id') || '';
    const lastName = formData.get('last_name') || '';
    const firstName = formData.get('first_name') || '';
    const middleName = formData.get('middle_name') || '';
    const birthDate = formData.get('birth_date') || '';
    const location = formData.get('location') || '';
    
    // Преобразуем значения семейного положения
    const maritalStatusValue = formData.get('marital_status') || '';
    const maritalStatusMap = {
        'married': 'Женат/Замужем',
        'single': 'Холост/Не замужем', 
        'divorced': 'Разведен(а)',
        'widowed': 'Вдовец/Вдова'
    };
    const maritalStatus = maritalStatusMap[maritalStatusValue] || maritalStatusValue;
    
    // Преобразуем значения пола
    const genderValue = formData.get('gender') || '';
    const genderMap = {
        'male': 'Мужской',
        'female': 'Женский'
    };
    const gender = genderMap[genderValue] || genderValue;
    
    // Получаем количество детей на иждивении
    const numberOfDependents = parseInt(formData.get('dependents_children')) || 0;
    
    // Обрабатываем новый чекбокс и выбор типа организации
    const isBusinessOwner = formData.get('is_business_owner') === 'on';
    const businessTypeValue = formData.get('business_type') || '';
    const isBusinessActive = formData.get('is_business_active') === 'on';
    let businessType = "Нет";
    
    if (isBusinessOwner && businessTypeValue) {
        // Если чекбокс выбран и выбран тип организации
        if (businessTypeValue === 'ИП') {
            businessType = businessTypeValue;
        } else if (businessTypeValue === 'ООО') {
            businessType = businessTypeValue;
        }
    }
    
    // ИСПРАВЛЕНИЕ: Правильно собираем данные для всех типов динамических элементов
    const realEstateData = [];
    const movableData = [];
    const incomeData = [];
    const liabilitiesData = [];
    const transactionsData = [];

    // Собираем все ключи формы и группируем их по типам и индексам
    const formDataMap = {};
    
    formData.forEach((value, key) => {
        // Обрабатываем поля с индексами вида liabilities[0][name], liabilities[1][name] и т.д.
        const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const [, type, index, field] = match;
            
            if (!formDataMap[type]) {
                formDataMap[type] = {};
            }
            if (!formDataMap[type][index]) {
                formDataMap[type][index] = {};
            }
            
            // Обрабатываем разные типы полей
            if (field === 'is_jointly' || field === 'is_pledged' || field === 'has_guarantor' || 
                field === 'has_overdues' || field === 'is_withheld') {
                formDataMap[type][index][field] = value === 'on';
            } else if (field === 'salary' || field === 'cost' || 
                       field === 'monthly_payment' || field === 'total_liability' ||
                       field === 'paid_amount' || field === 'loan_term' ||
                       field === 'amount') {
                formDataMap[type][index][field] = parseFloat(value) || 0;
            } else {
                formDataMap[type][index][field] = value;
            }
        }
    });

    // ИСПРАВЛЕНИЕ: Обрабатываем каждый тип данных отдельно, включая первый элемент
    if (formDataMap.liabilities) {
        Object.keys(formDataMap.liabilities).forEach(index => {
            const item = formDataMap.liabilities[index];
            if (item.name && item.name.trim() !== '') {
                liabilitiesData.push(item);
            }
        });
    }

    if (formDataMap.real_estate) {
        Object.keys(formDataMap.real_estate).forEach(index => {
            const item = formDataMap.real_estate[index];
            if (item.name && item.name.trim() !== '') {
                realEstateData.push(item);
            }
        });
    }

    if (formDataMap.movable) {
        Object.keys(formDataMap.movable).forEach(index => {
            const item = formDataMap.movable[index];
            if (item.name && item.name.trim() !== '') {
                movableData.push(item);
            }
        });
    }

    if (formDataMap.income) {
        Object.keys(formDataMap.income).forEach(index => {
            const item = formDataMap.income[index];
            if (item.name && item.name.trim() !== '') {
                incomeData.push(item);
            }
        });
    }

    if (formDataMap.transactions) {
        Object.keys(formDataMap.transactions).forEach(index => {
            const item = formDataMap.transactions[index];
            if (item.type && item.type.trim() !== '') {
                transactionsData.push(item);
            }
        });
    }

    const realEstateProperty = realEstateData.map(item => {
        // Если выбрано "Другое", используем значение из поля other_name
        let propertyName = item.name;
        if (item.name === 'other' && item.other_name) {
            propertyName = item.other_name;
        }
        
        return {
            'Наименование': propertyName || '',
            'Доля': item.ownership_share || '',
            'Залог': item.is_pledged ? "Да" : "Нет",
            'Совм': item.is_jointly ? "Да" : "Нет",
            'Стоимость': item.cost || 0
        };
    });

    const movableProperty = movableData.map(item => {
        // Если выбрано "Другое", используем значение из поля other_name
        let propertyName = item.name;
        if (item.name === 'other' && item.other_name) {
            propertyName = item.other_name;
        }
        
        return {
            'Наименование': propertyName || '',
            'Доля': "", // Для движимости всегда пустая строка
            'Залог': item.is_pledged ? "Да" : "Нет",
            'Совм': item.is_jointly ? "Да" : "Нет",
            'Стоимость': item.cost || 0
        };
    });

    // Объединяем недвижимое и движимое имущество
    const property = [...realEstateProperty, ...movableProperty];

    const sources_of_official_income = incomeData.map(item => {
        // Если выбрано "Другое", используем значение из поля other_name
        let incomeName = item.name;
        if (item.name === 'other' && item.other_name) {
            incomeName = item.other_name;
        }
        
        return {
            'Источник получения дохода': incomeName || '',
            'Сумма в месяц': item.salary || 0,
            'Удерживается': item.is_withheld ? "Да" : "Нет"
        };
    });

    // Получаем все ежемесячные расходы
    const houseExpenses = parseInt(formData.get('house_expenses')) || 0;
    const foodExpenses = parseInt(formData.get('food_expenses')) || 0;
    const transportExpenses = parseInt(formData.get('transport_expenses')) || 0;
    const medicalExpenses = parseInt(formData.get('medical_expenses')) || 0;
    const mobileExpenses = parseInt(formData.get('mobile_expenses')) || 0;
    const childrenExpenses = parseInt(formData.get('children_expenses')) || 0;
    const alimonyExpenses = parseInt(formData.get('alimony_expenses')) || 0;
    const fspExpenses = parseInt(formData.get('fsp_expenses')) || 0;
    const utilitiesExpenses = parseInt(formData.get('utilities_expenses')) || 0;
    
    // Создаем массив всех ежемесячных расходов
    const monthly_expenses = [];
    
    if (houseExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Расходы на аренду жилья',
            'Сумма в месяц': houseExpenses
        });
    }
    if (foodExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Расходы на продукты питания',
            'Сумма в месяц': foodExpenses
        });
    }
    if (transportExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Расходы на транспорт и ГСМ',
            'Сумма в месяц': transportExpenses
        });
    }
    if (medicalExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Расходы на медицину',
            'Сумма в месяц': medicalExpenses
        });
    }
    if (mobileExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Расходы на мобильную связь',
            'Сумма в месяц': mobileExpenses
        });
    }
    if (childrenExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Содержание детей',
            'Сумма в месяц': childrenExpenses
        });
    }
    if (alimonyExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Алименты',
            'Сумма в месяц': alimonyExpenses
        });
    }
    if (fspExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Удержания от ФСП',
            'Сумма в месяц': fspExpenses
        });
    }
    if (utilitiesExpenses > 0) {
        monthly_expenses.push({
            'Вид расходов': 'Коммунальные платежи',
            'Сумма в месяц': utilitiesExpenses
        });
    }

    const liabilities = liabilitiesData.map(item => {
        // Если выбрано "Другое", используем значение из поля other_name
        let liabilityName = item.name;
        if (item.name === 'other' && item.other_name) {
            liabilityName = item.other_name;
        }
        
        // Обрабатываем просрочки
        let overdueStatus = "Нет";
        if (item.has_overdues && item.overdue_date) {
            overdueStatus = item.overdue_date;
        }
        
        return {
            'Вид обяз-ва': liabilityName || '',
            'Банк': item.bank_name || '', // НОВОЕ ПОЛЕ: Банк выдавший кредит
            'Ежемес. платеж': item.monthly_payment || 0,
            'Общая сумма': item.total_liability || 0,
            'Дата получения': item.loan_date || '',
            'Срок': item.loan_term || 0,
            'Сумма внесённых платежей': item.paid_amount || 0,
            'Поручитель': item.has_guarantor ? "Да" : "Нет",
            'Просрочки': overdueStatus
        };
    });

    // Обрабатываем сделки заёмщика
    const hasTransactionsCheckbox = formData.get('has_transactions') === 'on';
    const borrower_deals = [];
    
    if (hasTransactionsCheckbox) {
        // Если чекбокс активен, собираем данные о сделках
        transactionsData.forEach(item => {
            // Обрабатываем вид сделки
            let dealType = item.type;
            if (item.type === 'other' && item.other_type) {
                dealType = item.other_type;
            }
            
            // Обрабатываем объект сделки
            let dealItem = item.item;
            if (item.item === 'other' && item.other_item) {
                dealItem = item.other_item;
            }
            
            borrower_deals.push({
                'Вид сделки': dealType || '',
                'Что продал': dealItem || '',
                'За сколько продал': item.amount || 0,
                'Дата': item.date || ''
            });
        });
    }

    // Получаем дополнительные флаги и преобразуем их в "Да"/"Нет"
    const isCoBorrower = formData.get('is_co_borrower') === 'on' ? "Да" : "Нет";
    const hasTransactions = hasTransactionsCheckbox ? "Да" : "Нет";
    const hasOverdues = formData.get('has_overdues') === 'on' ? "Да" : "Нет";

    const payload = {
        type: "liability",
        dealId: dealId,
        fullname: {
            name: firstName,
            secondname: lastName,
            surname: middleName,
            birthday: birthDate,
            city: location
        },
        marital_status: maritalStatus,
        gender: gender,
        number_of_dependence: numberOfDependents,
        property: property,
        liabilities: liabilities,
        sources_of_official_income: sources_of_official_income,
        monthly_expenses: monthly_expenses,
        isCoBorrower: isCoBorrower,
        hasTransactions: hasTransactions,
        hasOverdues: hasOverdues,
        business_type: businessType,
        is_active: isBusinessActive ? "Да" : "Нет",
        borrower_deals: borrower_deals
    };

    return payload;
};

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    try {
        // Сериализуем данные формы
        const formData = new FormData(this);
        const serializedData = serializeFormData(formData);
        
        // Получаем статус клиента и обновляем данные.
        const clientStatus = analyzeClientStatus(serializedData);
        serializedData['clientStatus'] = clientStatus;

        // Получаем ФИО менеджера из сделки.
        const managerId = await getManagerId(serializedData.dealId);
        console.log("MANAGER_ID: ", managerId);
        const managerFullname = await getUserWithId(managerId);
        console.log("MANAGER_FULLANME: ", managerFullname);
        serializedData.managerFullname = managerFullname;
        
        // Вызываем функцию из pdfEdit.js для создания PDF
        const pdfBytes = await main_function(serializedData);

        // Добавляем полученный PDF файл в сделку в битриксе.
        await updateDeal(serializedData.dealId, await pdfToBase64(pdfBytes));
        
        // Создаем Blob из байтов PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Находим кнопку для скачивания PDF
        const downloadBtn = document.getElementById('downloadPdf');
        
        // Настраиваем кнопку для скачивания
        downloadBtn.href = url;
        downloadBtn.download = 'анкета_заемщика.pdf';
        downloadBtn.classList.remove('hidden');
        
        // Показываем сообщение об успехе
        document.getElementById('successMessage').style.display = 'block';
        
    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
        
        // Получаем информацию о строке ошибки
        let errorLocation = 'Неизвестное место';
        if (error.stack) {
            errorLocation = error.stack;
            // Парсим stack trace чтобы получить строку
            const stackLines = error.stack.split('\n');
            if (stackLines.length > 1) {
                // Берем вторую строку
                const locationLine = stackLines[1].trim();
                // Упрощаем вывод для пользователя
                errorLocation = locationLine.split('/').pop() || locationLine;
            }
        }
        
        document.getElementById('errorText').textContent = 
            `Произошла ошибка при создании PDF документа. 
             Ошибка: ${error.message}
             Место: ${errorLocation}
             Пожалуйста, попробуйте еще раз.`;
        document.getElementById('errorMessage').style.display = 'block';
        
    } finally {
        // Восстанавливаем кнопку отправки
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loanForm').addEventListener('submit', handleFormSubmit);
    
    const existingMonthlyInputs = document.querySelectorAll('.monthly-payment-input');
    const existingTotalInputs = document.querySelectorAll('.total-liability-input');

    // Инициализация полей "Другое" для существующих элементов
    const incomeSelects = document.querySelectorAll('select[name^="income"][name$="[name]"]');
    incomeSelects.forEach(select => {
        toggleIncomeOtherInput(select);
    });

    const liabilitySelects = document.querySelectorAll('select[name^="liabilities"][name$="[name]"]');
    liabilitySelects.forEach(select => {
        toggleLiabilityOtherInput(select);
    });
    
    existingMonthlyInputs.forEach(input => {
        input.addEventListener('input', updateLiabilitiesTotals);
    });
    
    existingTotalInputs.forEach(input => {
        input.addEventListener('input', updateLiabilitiesTotals);
    });
});