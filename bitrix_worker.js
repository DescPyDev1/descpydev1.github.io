const updateFileFieldWebhookUrl = "https://legal-shield.bitrix24.ru/rest/86466/ajh6x02od0rbf2qy/crm.timeline.comment.add.json";
const getDealWebhookUrl = "https://legal-shield.bitrix24.ru/rest/86466/ajh6x02od0rbf2qy/crm.deal.get.json";
const getUserWithIdWebhookUrl = "https://legal-shield.bitrix24.ru/rest/86466/ajh6x02od0rbf2qy/user.get.json";

async function getManagerId(dealId) {
    // Получаем ID менеджера из ответственного лица в сделке.
    try {
        const response = await axios.post(getDealWebhookUrl, {
            id: dealId
        });

        // Получаем ID ответственного лица.
        const deal = response.data['result']
        const userId = deal['ASSIGNED_BY_ID']
        return userId;
    } catch (error) {
        console.log(`Ошибка при получении ответственного лица сделки ${dealId}: `, error.message);
        throw error;
    }
};

// Функция для получения данных пользователя
async function getUserWithId(userId) {
    // Получаем ФИО пользователя по его ID.
    try {
        const response = await axios.post(getUserWithIdWebhookUrl, {
            ID: userId
        });

        // Получаем ФИО.
        const user = response.data['result'][0];
        const fullNameWithPatronymic = user.LAST_NAME + ' ' + user.NAME + (user.SECOND_NAME ? ' ' + user.SECOND_NAME : '');
        return fullNameWithPatronymic;
    } catch (error) {
        console.log(`Ошибка при получении ответственного лица: `, error.message);
    };
};

async function updateDeal(dealId, fileContent) {
    const currentTimestamp = Date.now();
    const fileName = `document_${currentTimestamp}.pdf`;

    try {
        const response = await axios.post(updateFileFieldWebhookUrl, {
            fields: {
                ENTITY_ID: dealId,
                ENTITY_TYPE: "deal",
                COMMENT: "PDF презентация",
                FILES: [[fileName, fileContent]]
            }
        });

        console.log("Сделка успешно обновлена", response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении сделки:', error.response?.data || error.message);
        throw error;
    }
};