
// Найдем элементы для вывода сообщений

// Элемент номер вопроса
const orderNumberField = document.querySelector('#orderNumberField');
// Элемент поле ответа
const answerField = document.querySelector('#answerField');
// Элемент мин. число
const inputMin = document.querySelector('#minvalue');
// Элемент макс. число
const inputMax = document.querySelector('#maxvalue');
// Блок ввода значений и старта игры
const inputValueBox = document.querySelector('#inputvaluebox');
// Блок вывода вспомогательных сообщений
const messageBox = document.querySelector('#messagebox');
// Сообщение
const textMassage = document.querySelector('#textmassage');

// Глобальные переменные
// Состояние игры
let gameRun = false;
// Минимальный предел диапазона
let minValue = 0;
// Максимальный предел диапазона
let maxValue = 0;
// Номер вопроса
let orderNumber = 0;

// Обработка событий от кнопок
document.querySelector('#btnStart').addEventListener('click', setValue);
document.querySelector('#btnRetry').addEventListener('click', setRetry);
document.querySelector('#btnOver').addEventListener('click', findNumber);
document.querySelector('#btnLess').addEventListener('click', findNumber);
document.querySelector('#btnEqual').addEventListener('click', setEqual);

// Рестарт
function setRetry() {
    // Не работает до окончания игры
    if (gameRun) { return; }

    console.clear();
    console.log(`Рестарт игры`);

    // Очиска значений номера вопроса, мин. и макс. значений, полей ввода значений, текстовых сообщений,
    // настройка блоков вывода сообщений
    orderNumber = 0;
    minValue = 0;
    maxValue = 0;
    inputMin.value = "";
    inputMax.value = "";
    orderNumberField.innerText = "";
    answerField.innerText = "";

    // Настройка блоков вывода при старте и рестарте
    // При загрузке страницы скрыт, появляется при вводе недопустимых значений или после старта игры
    if (!messageBox.classList.contains('collapse')) { addClass(messageBox, 'collapse'); };
    // Отображается до старта игры для ввода значений, скрывается после ввода корректных значений и нажатия кнопки старт
    if (inputValueBox.classList.contains('collapse')) { delClass(inputValueBox, 'collapse'); };
}

// Обработка значений блока ввода значеий
function setValue(event) {

    // Отмена отправки формы
    event.preventDefault;

    // если значения введены то проверяем их на пригодность
    // при введении не числовых значений или привышении лимитов устанавливаем допустимые максимумы
    if (inputMin.value && inputMax.value) {

        // minValue = (Number.parseInt(inputMin.value) || -999); //Короткий цикл
        minValue = (Number.parseInt(inputMin.value));
        minValue = (isFinite(minValue)) ? minValue : -999;
        minValue = ((minValue < -999) || (minValue > 999)) ? -999 : minValue;

        // maxValue = (Number.parseInt(inputMax.value) || 999); //Короткий цикл
        maxValue = (Number.parseInt(inputMax.value));
        maxValue = (isFinite(maxValue)) ? maxValue : 999;
        maxValue = ((maxValue < -999) || (maxValue > 999)) ? 999 : maxValue;

        // Если введеные значения равны - выводим сообщение с просьбой ввести разные числа
        // Ждем повторного ввода
        if (minValue === maxValue) {
            console.clear();
            console.log('Введите разные числа');
            textMassage.innerText = "Введите разные числа";
            if (messageBox.classList.contains('collapse')) { delClass(messageBox, 'collapse'); };

            // Прерываем дальнейшую обработку
            return;
            // Если минимальное значение больше максимального - выводим сообщение
            // Ждем повторного ввода
        } else if (minValue > maxValue) {
            console.clear();
            console.log('Максимальное значение должно быть больше минимального');
            textMassage.innerText = "Максимальное значение должно быть больше минимального";
            if (messageBox.classList.contains('collapse')) { delClass(messageBox, 'collapse'); };

            // Прерываем дальнейшую обработку
            return;
        }

        console.clear();
        console.log(`Заданное минимальное число: ${minValue}`);
        console.log(`Заданное минимальное число: ${maxValue}`);

        // Если числа нас устраивают:
        // Находим середину диапазона, формируем отображение числа, выводим предполагаемое число и т.д. по тексту

        answerNumber = Math.trunc((minValue + maxValue) / 2);
        answerString = stringAnswer(answerNumber);
        answerField.innerText = `Вы загадали число ${answerString}?`;

        // Устанавливаем номер вопроса
        orderNumber = 1;
        orderNumberField.innerText = orderNumber;

        // Скрываем блок ввода чисел диапазона угадывания
        inputValueBox.classList.toggle('collapse');

        // Сообщаем о том в каком диапозоне мы ищем число
        textMassage.innerText = `Угадываем число из диапазона: \n${minValue} \u{00f7} ${maxValue}`;
        if (messageBox.classList.contains('collapse')) { delClass(messageBox, 'collapse') };

        // Устанавливаем флаг начала игры для работы кнопок меньше, верно, больше
        gameRun = true;

        // Если поля остались пустыми - выводим соответствующее сообщение
        // До ввода значений ничего не происходит
    } else {
        console.clear();
        console.log('Вы не ввели значения');
        textMassage.innerText = "Поле не заполнено";
        if (messageBox.classList.contains('collapse')) { delClass(messageBox, 'collapse') };
    }
}

// Завершение игры в случае угадывания числа
function setEqual() {
    if (!gameRun) { return; }
    console.clear();
    console.log(`Число найдено`);

    // Если игра идет устанавливаем флаг окончания игры
    gameRun = false;

    // Выводим один из вариантов победного сообщения
    switch (getRandom(3)) {
        case 1: answerField.innerText = `Я всегда угадываю\n\u{1F60E}`;
            break;
        case 2: answerField.innerText = `ЭВРИКА!!!\n\u{1F60E}`;
            break;
        case 3: answerField.innerText = `Я победил\n\u{1F60E}`;
            break;
    }
}

// Угадываем число, основная функция перебора диапазона
function findNumber(event) {
    // Если игра завершена то и икать дальше нечего
    if (!gameRun) { return; }

    // Если диапазон поиска сошел на нет - выражаем свое возмущение и останавливаем игру    
    console.clear();
    console.log(`Минимальное число при начале проверки: ${minValue}`);
    console.log(`Максимальное число при начале проверки: ${maxValue}`);
    console.log(`Предполагаемое число при начале проверки: ${answerNumber}`);
    console.log("");

    // Условие выхода из игры по истощению диапазона (перебрали все возможные варианты)
    if (minValue === maxValue) {
        gameRun = false;
        switch (getRandom(3)) {
            case 1: answerField.innerText = `Вы загадали неправильное число!\n\u{1F914}`;
                break;
            case 2: answerField.innerText = `Я сдаюсь..\n\u{1F92F}`;
                break;
            case 3: answerField.innerText = `Это что-то новенькое..\n\u{1F92F}`;
                break;
        }

    } else {
        // Если все таки мы играем и у нас есть еще что искать
        // Реализуем обработку событий btnOver и btnLess в одной функции так как много в них общего

        // Предусматриваем вариант перепрыгивания мин и макс значений в диапозоне
        // для корректного завершения игры по истощению диапазона
        if (event.target.id === "btnOver") {
            // Сужаем диапозон поиска "слева" устанавливая нижний предел в число предыдущего ответа + 1
            // Например было: min=0, max=100, answer=(0+100)/2, то есть предыдущее число 50
            // Устанавливаем новый диапозон min=50+1, max=100, answer=(51+100)/2, то есть 75,5, что при округлении floor будет 75
            minValue = ((answerNumber + 1) > maxValue) ? maxValue : answerNumber + 1;
            answerNumber = Math.floor((minValue + maxValue) / 2);

        } else if (event.target.id === "btnLess") {
            // Сужаем диапозон поиска "справа" устанавливая верхний предел в число предыдущего ответа - 1
            // Например было: min=0, max=100, answer=(0+100)/2, то есть предыдущее число 50
            // Устанавливаем новый диапозон min=0, max=50-1, answer=(0+49)/2, то есть 24,5, что при округлении ceil будет 25
            maxValue = ((answerNumber - 1) < minValue) ? minValue : answerNumber - 1;
            answerNumber = Math.ceil((minValue + maxValue) / 2);
        }

        // Увеличиваем номер вопроса
        orderNumber++;
        orderNumberField.innerText = orderNumber;

        // Формируем строку ответа
        answerString = stringAnswer(answerNumber);

        // Выводим один из вариантов ответов угадываемого числа
        switch (getRandom(3)) {
            case 1: answerField.innerText = `Вы загадали число: ${answerString}?`;
                break;
            case 2: answerField.innerText = `Похоже на число: ${answerString}?`;
                break;
            case 3: answerField.innerText = `Допустим это число: ${answerString}?`;
                break;
        }

        console.log(`Текущее минимальное число: ${minValue}`);
        console.log(`Текущее максимальное число: ${maxValue}`);
        console.log(`Текущее предполагаемое число: ${answerNumber}`);
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

// Добавить класс
function addClass(element, className) {
    element.classList.add(className);
}

// Удалить класс
function delClass(element, className) {
    element.classList.remove(className);
}

// Получить случайное число
function getRandom(num) {
    return Math.round(Math.random() * num);
}

// Получить строку с числом в виде цифры (при привышении ддлины строки в 20 символов), либо цифру + пропись числа
function stringAnswer(number) {
    let result = (numberToString(number).length > 20) ? number : `${number} - ${numberToString(number)}`;
    return result;
}

// Преобразование числа в строку прописью
function numberToString(number) {

    // Массивы с текстовым предствалением чисел, пригодятся

    // "" - на случай если число от 0-99
    let hundredsToString = ["", "сто", "двести", "тритста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
    // "", "" - на случай если число от 0-9 и 10-19 (Возьмем из массива единиц)
    let dozensToString = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    // "" - на случай если число 0
    let unitsToString = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать", "двадцать"];

    // Результирующая строка
    let resultString = "";

    // Пытаемся сохранить аргумент как целое число
    let num = Number.parseInt(number);

    // Смотрим что из этого получилось
    if (isNaN(num)) {

        // Если parseInt вернула NaN, будем ругаться
        console.log(`Значение аргумента number: ${number}, Тип: ${typeof (number)}`);
        console.log(`Значение константы num: ${num} Тип: ${typeof (num)}`);
        return resultString = "Не число. Это все проделки пользователя";

    } else {

        // Если вернулось число надо бы посмотреть вдруг оно отрицательное
        // console.log(`Число: ${num} Тип: ${typeof (num)}`);

        // Если худшее подтвердилось - записываем в результирующую строку знак прописью
        resultString += (num < 0) ? "минус " : "";

        // Далее нам знак не важен, число берем по модулю
        // Установим ограничение на количество разрадов в чиле (Пусть будет 999)
        // С большим числом все равно работать не будет
        num = (Math.abs(num) >= 1000) ? 999 : Math.abs(num);

        // Смотрим сколько у нас единиц
        let units = num % 10;
        // console.log(`Единицы: ${units}`);

        // Находим десятки
        let dozens = num % 100 - units;
        // console.log(`Десятки: ${dozens}`);

        // Добираемся до сотен
        let hundreds = num % 1000 - dozens - units;
        // console.log("Сотни: " + hundreds);

        // Проверяем сколько набралось
        // Если по нулям, дописываем в результирующую строку "ноль"
        resultString += (units || dozens || hundreds) ? "" : "ноль";

        // Добавляем в строку сотни прописью, (индекс массива равен разряду сотен/100)
        resultString += `${hundredsToString[hundreds / 100]} `;

        // Теперь самое мудрёное - десятки (20....90) и как исключение единицы (1-19)
        // Если в разряде десятков число меньше 20, то пропись берем из массива единиц (1-19)
        if ((dozens + units) < 20) {
            resultString += unitsToString[dozens + units];
        } else {
            // Если в разряде десятков число 20 и более, то записываем наименование десятка
            // И после наименование единицы
            resultString += `${dozensToString[dozens / 10]} ${unitsToString[units]}`;
        }

        // Посмотрим что получилось, всё таки пол дня потратил
        // console.log(resultString);

        // Вернем строковое представление числа
        return resultString;
    }

}