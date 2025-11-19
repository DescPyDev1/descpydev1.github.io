// Модуль для проверки статуса заёмщика.

function analyzeClientStatus(clientData) {
    const { property, liabilities, marital_status } = clientData;
    
    // Проверка на стоп-факторы
    const hasStopFactors = checkStopFactors(liabilities);
    if (hasStopFactors) {
        return "Нецелевой";
    }
    
    // Анализ имущества
    const propertyAnalysis = analyzeProperty(property, marital_status);
    
    // Расчет общего долга
    const totalDebt = calculateTotalDebt(liabilities);
    
    // Расчет выгоды по спецпредложению
    const specialOfferBenefit = calculateSpecialOfferBenefit(totalDebt);
    
    // Применение логики классификации
    // ЦЕЛЕВОЙ: нет имущества ИЛИ только одно жилье
    if (propertyAnalysis.hasNoProperty || propertyAnalysis.hasOnlyOneResidence) {
        // Проверка экономической целесообразности
        if (!hasEconomicSense(totalDebt, specialOfferBenefit)) {
            return "Нецелевой";
        }
        return "Целевой";
    }
    
    // ОКОЛОЦЕЛЕВОЙ: дополнительное имущество стоимостью от 100,000 руб.
    if (propertyAnalysis.hasAdditionalProperty && propertyAnalysis.totalPropertyValue >= 100000) {
        // Проверка экономической целесообразности
        if (!hasEconomicSense(totalDebt, specialOfferBenefit)) {
            return "Нецелевой";
        }
        return "Околоцелевой";
    }
    
    // ОКОЛОЦЕЛЕВОЙ: нет имущества + выгода менее 100,000 руб.
    if (propertyAnalysis.hasNoProperty && specialOfferBenefit < 100000) {
        return "Околоцелевой";
    }
    
    // Если не подпадает под другие категории - проверяем экономическую целесообразность
    if (!hasEconomicSense(totalDebt, specialOfferBenefit)) {
        return "Нецелевой";
    }
    
    // По умолчанию - околоцелевой
    return "Околоцелевой";
};

// Вспомогательные функции
function checkStopFactors(liabilities) {
    if (!liabilities) return false;
    
    // Проверка долгов по статье 159 УК РФ, причинению ущерба, штрафов ГИБДД
    const stopKeywords = [
        'уголовный', '159 ук', 'причинение ущерба', 
        'гибдд', 'штраф', 'преступление'
    ];
    
    return liabilities.some(liability => {
        const description = (liability['Вид обяз-ва'] + ' ' + (liability['Банк'] || '')).toLowerCase();
        return stopKeywords.some(keyword => description.includes(keyword));
    });
};

function analyzeProperty(property, maritalStatus) {
    const hasNoProperty = !property || property.length === 0;
    
    if (hasNoProperty) {
        return {
            hasNoProperty: true,
            hasOnlyOneResidence: false,
            hasAdditionalProperty: false,
            totalPropertyValue: 0
        };
    }
    
    // Определяем типы имущества
    const realEstateItems = property.filter(item => 
        ['квартира', 'дом', 'жилье', 'недвижимость'].some(type => 
            item['Наименование'].toLowerCase().includes(type)));
    
    const vehicleItems = property.filter(item => 
        ['автомобиль', 'транспорт', 'машина'].some(type => 
            item['Наименование'].toLowerCase().includes(type)));
    
    const otherProperty = property.filter(item => 
        ['дача', 'земля', 'участок', 'гараж'].some(type => 
            item['Наименование'].toLowerCase().includes(type)));
    
    const hasOnlyOneResidence = property.length === 1 && realEstateItems.length === 1;
    const hasAdditionalProperty = property.length > 1 || vehicleItems.length > 0 || otherProperty.length > 0;
    
    // Расчет общей стоимости имущества
    const totalPropertyValue = property.reduce((sum, item) => {
        return sum + (parseFloat(item['Стоимость']) || 0);
    }, 0);
    
    return {
        hasNoProperty: false,
        hasOnlyOneResidence,
        hasAdditionalProperty,
        totalPropertyValue,
        realEstateCount: realEstateItems.length,
        vehicleCount: vehicleItems.length,
        otherPropertyCount: otherProperty.length
    };
};

function calculateTotalDebt(liabilities) {
    if (!liabilities) return 0;
    
    return liabilities.reduce((sum, liability) => {
        return sum + (parseFloat(liability['Общая сумма']) || 0);
    }, 0);
};

function calculateSpecialOfferBenefit(totalDebt) {
    if (totalDebt > 300000) {
        return 0;
    }
    
    const specialOfferCost = 79900 + 50000;
    const benefit = totalDebt - specialOfferCost;
    
    return Math.max(benefit, 0);
};

function hasEconomicSense(totalDebt, specialOfferBenefit) {
    if (totalDebt <= 300000) {
        return specialOfferBenefit >= 100000;
    }
    
    if (totalDebt >= 500000) {
        return true;
    }
    
    // Минимальная выгода должна быть 100,000 руб.
    const minStandardCost = 165000;
    const benefit = totalDebt - minStandardCost;
    return benefit >= 100000;
};