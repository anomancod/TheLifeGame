// ======== НАЧАЛЬНЫЕ ОБЪЯВЛЕНИЯ ========
const tableCon = document.getElementById('tableCon');
let mapTable = document.createElement('table');

let speedOfUpd = 1000; // скорость обновления карты

const mapH = 48; // высота карты(таблицы)
const mapW = 48; // ширина карты(таблицы)

for (let i = 0; i < mapH; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < mapW; j++) {
        const cell = document.createElement('td');
        cell.textContent = '';
        cell.style.border = '1px solid grey';
        cell.style.height = '15px';
        cell.style.width = '15px';
        cell.style.textAlign = 'center';
        cell.style.padding = '0px';
        cell.style.borderColor = 'grey';
        cell.style.fontSize = '12px'
        row.appendChild(cell);
    }
    mapTable.appendChild(row);
}

tableCon.appendChild(mapTable);

// универсальная функция рандома целого числа в интервале включительно с двух сторон
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// ======== ЗНАЧЕНИЯ ДЛЯ ИНТЕРФЕЙСА ========
let IsPlay = false; // идёт ли игра?


// ======== КОНСТАНТЫ ========
const hpPeaceCells = 1000; // нач. и макс. ХП мирных клеток
const hpWarCells = 2000; // нач. и макс. ХП боевых клеток
const hpPlusPerTurn = 5; // восстановление хп в ход
const energyForCmdRestHp = 50; // трата энергии на восстановление ХП в cmd функции
const rateHpRestInCmd = 2; // коэффицент восполнения ХП в cmd функции (на это число будет делится макс. ХП клетки)
const hpMinusPerTurnAtMinusEnergy = 100; // кол-во ХП отнимаемое в ход при энергии меньшей или равной 0

const maxEnergyTrans = 10000; // макс. энергия стебля (транспортной клетки)
const maxEnergySprout = 5000; // макс. энергия отростка
const maxEnergyWar = 1000; // макс. энергия боевых клеток

const startSproutEnergy = 2500; // нач. энергия отростка

const energyToCreateSprout = 100; // кол-во энергии для создания отростка
const energyToCreateManaMiner = 100; // кол-во энергии для создания манновика
const energyToCreateOrgMiner = 100; // кол-во энергии для создания органика
const energyToCreateEnerMiner = 100; // кол-во энергии для создания энергика
const energyToCreateMeleeFighter = 100; // кол-во энергии для создания ближника
const energyToCreateDistantFighter = 100; // кол-во энергии для создания дальника

const energyConsumSprout = 50; // потребление энергии в ход отростком
const energyConsumTrans = 10; // потребление энергии в ход стеблем (странспортной клеткой)
const energyConsumWar = 50; // потребление энергии в ход боевой клеткой
// добывающие клетки не тратят энергии
const minerConstEnergy = 750; // постоянная энергия у майнеров

// ОРГАНИКА ПРИ СМЕРТИ КЛЕТКИ РАВНА МАКС. ХП ЭТОЙ КЛЕТКИ

const energyToMeleeCombat = 100; // трата энергии на удар ближника
const energyToDistantCombat = 200; // трата энергии на выстрел дальника

const damageOfMeleeCombat = 750; // урон от удара ближника
const damageOfDistantCombat = 250; // урон от выстрела дальника

const energyToTransformIntoSeed = 100; // энергия для становления семенем
const minTurnsAsSeed = 1; // минимальное кол-во ходов как семя
// (!!!) компилируемость клетки для семени является счетчиком ходов для становлением отростком (!!!)
const maxTurnsAsSeed = 15; // максимальное кол-во ходов как семя
const rateEnergyToMoveSeedByCell = 2; // коэффицент (для кол-во переместившихся ходов) затрачиваемой энергии для перемещения семени

const energyForTransformEnerIntoOrg3x3 = 50; // энергия за трансформацию всей энергии в 3x3 квадрате в органику
const energyForMoveEnerOrOrg = 25; // энергия за перемещение всей энергии или органики из одной клетки в другую

const energyMinePerTurn = 500; // энергия добывающаяся в ход энергиком
// трата энергии в почве = вырабатке энергии энергиком
const energyFromOrgPerTurn = 500; // энергия добывающаяся в ход органиком
const orgForEnerPerTurn = 500; // кол-во органики тратящейся органиком для производства энергии в ход
const manaEnergyPerTurn = 250; // кол-во энергии из манны добывающаяся манновиком

const plusEnergyIfTransIntoSprout = 500; // доп. энергия при трансформации в отросток

const turnsForUpdateFact = 5; // кол-во ходов для обновления факторов

const numInRatioForExp = 25; // число для соотношения: если отростков (с пустыми клетками вокруг) меньше [кол-во всех клеток] / (это число) для экспов
const numInRatioForQua = 20; // число для соотношения: если отростков (с пустыми клетками вокруг) меньше [кол-во всех клеток] / (это число) для качественников
const numInRatioForNom = 15; // число для соотношения: если отростков (с пустыми клетками вокруг) меньше [кол-во всех клеток] / (это число) для кочевников

const turnsNoChangeStartTacticExp = 8; // число ходов без смены начальной тактики ДЛЯ ЭКСПОВ
const turnsNoChangeStartTacticQua = 4; // число ходов без смены начальной тактики ДЛЯ КАЧЕСТВЕННИКОВ
const turnsNoChangeStartTacticNom = 5; // число ходов без смены начальной тактики ДЛЯ КОЧЕВНИКОВ

let turnsFromStart = 0; // счетчик ходов с начала

const startPlayerSprout = 2; // начальные клетки-отростки У ИГРОКА
const startExpSprout = 5; // начальные клетки-отростки У ЭКСПОВ
const startQuaSprout = 5; // начальные клетки-отростки У КАЧЕСТВЕННИКОВ
const startNomSprout = 5; // начальные клетки-отростки У КОЧЕВНИКОВ (НА ДЕЛЕ СЧИТАЕТСЯ 2 РАЗА Т.К. КОЧЕВНИКИ НАЧИЮТ В ДВУХ ЧЕТВЕРТЯХ)
const countOfStartSprout = [startPlayerSprout, startExpSprout, startQuaSprout, startNomSprout]; // закидываем все это в массив


// ======== ТАКТИКИ ========

// 4X массив: тактики ([countOfFractions]x[Кол-во тактик]x[countOfGenoms]x[14])
const tactics = [];
const countOfFractions = 4; // кол-во фракций
const countOfGenoms = 32; // кол-во геномов в тактике


const expansionTact = []; // экспансия
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let minerIn = rand(0, 2);
    interArr[minerIn] = rand(30, 74); // задаем в 1 из 3 ячеек случайный майнер
    let tester = 2;
    if (tester - minerIn === 2) { interArr[1] = 0; interArr[2] = 0; } // задаем незанятые ячейки отростками
    if (tester - minerIn === 1) { interArr[0] = 0; interArr[2] = 0; }
    if (tester - minerIn === 0) { interArr[0] = 0; interArr[1] = 0; }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    expansionTact.push(interArr);
}

const prodExtTact = []; // производство-добыча
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if (tester - sproutIn === 2) { interArr[1] = rand(45, 74); interArr[2] = rand(45, 74); } // задаем незанятые ячейки энергиками или органиками на рандом
    if (tester - sproutIn === 1) { interArr[0] = rand(45, 74); interArr[2] = rand(45, 74); }
    if (tester - sproutIn === 0) { interArr[0] = rand(45, 74); interArr[1] = rand(45, 74); }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    prodExtTact.push(interArr);
}

const prodProdTact = []; // производство производства
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if (tester - sproutIn === 2) { interArr[1] = 35; interArr[2] = 35; } // задаем незанятые ячейки манновиками
    if (tester - sproutIn === 1) { interArr[0] = 35; interArr[2] = 35; }
    if (tester - sproutIn === 0) { interArr[0] = 35; interArr[1] = 35; }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    prodProdTact.push(interArr);
}

const warMeleeTact = []; // война ближний бой
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if (tester - sproutIn === 2) { interArr[1] = rand(76, 90); interArr[2] = rand(76, 90); } // задаем незанятые ячейки ближниками и с меньшим шансом - дальниками
    if (tester - sproutIn === 1) { interArr[0] = rand(76, 90); interArr[2] = rand(76, 90); }
    if (tester - sproutIn === 0) { interArr[0] = rand(76, 90); interArr[1] = rand(76, 90); }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    warMeleeTact.push(interArr);
}

const warDistantTact = []; // война ближний бой
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if (tester - sproutIn === 2) { interArr[1] = 90; interArr[2] = 90; } // задаем незанятые ячейки дальниками
    if (tester - sproutIn === 1) { interArr[0] = 90; interArr[2] = 90; }
    if (tester - sproutIn === 0) { interArr[0] = 90; interArr[1] = 90; }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    warDistantTact.push(interArr);
}

const developmentTact = []; // развитие
for (let i = 0; i < countOfGenoms; i++) {
    if (i < 4) { // для 4 геномов
        const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        interArr[0] = rand(30, 74); // случайный майнер
        interArr[1] = rand(30, 74); // случайный майнер
        interArr[2] = rand(30, 74); // случайный майнер
        interArr[3] = 105; // не задаем условие 1
        interArr[4] = rand(0, 255);
        interArr[5] = 105; // не задаем условие 2
        interArr[6] = rand(0, 255);
        interArr[7] = rand(0, 255);
        interArr[8] = rand(0, 255);
        interArr[9] = rand(0, 255);
        interArr[10] = rand(0, 255);
        interArr[11] = rand(0, 255);
        interArr[12] = rand(0, 255);
        interArr[13] = rand(0, 255);
        interArr[14] = rand(0, 255);

        developmentTact.push(interArr);
    }
    else { // для остальных 28
        const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        interArr[0] = rand(30, 74); // случайный майнер
        interArr[1] = rand(30, 74); // случайный майнер
        interArr[2] = rand(30, 74); // случайный майнер
        interArr[3] = rand(0, 104); // ЗАДАЕМ случайное условие 1
        interArr[4] = rand(0, 255);
        interArr[5] = rand(0, 104); // ЗАДАЕМ случайное условие 2
        interArr[6] = rand(0, 255);
        interArr[7] = rand(0, 255);
        interArr[8] = rand(0, 255);
        interArr[9] = rand(0, 255);
        interArr[10] = rand(0, 255);
        interArr[11] = rand(0, 255);
        interArr[12] = rand(0, 255);
        interArr[13] = rand(0, 255);
        interArr[14] = rand(0, 255);

        developmentTact.push(interArr);
    }
}

const migrationTact = []; // миграция
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    interArr[0] = rand(0, 255); // случайное создание
    interArr[1] = rand(0, 255); // случайное создание
    interArr[2] = rand(0, 255); // случайное создание
    interArr[3] = rand(0, 104); // ЗАДАЕМ случайное условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = rand(0, 104); // ЗАДАЕМ случайное условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = 6; // задаем команду 1 как семя-перемещение
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = 6; // задаем команду 2 как семя-перемещение
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    migrationTact.push(interArr);
}

const nomandismTact = []; // кочевничество
let directOfNomands = rand(0, 2); // направление движения кочевников
for (let i = 0; i < countOfGenoms; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    interArr[directOfNomands] = 0; // в направлении движения создаем отросток
    let tester = 2;
    if (tester - directOfNomands === 2) { interArr[1] = rand(60, 84); interArr[2] = rand(60, 84); } // задаем незанятые ячейки ближниками и/или энергиками
    if (tester - directOfNomands === 1) { interArr[0] = rand(60, 84); interArr[2] = rand(60, 84); }
    if (tester - directOfNomands === 0) { interArr[0] = rand(60, 84); interArr[1] = rand(60, 84); }

    interArr[3] = 105; // не задаем условие 1
    interArr[4] = rand(0, 255);
    interArr[5] = 105; // не задаем условие 2
    interArr[6] = rand(0, 255);
    interArr[7] = rand(0, 255);
    interArr[8] = rand(0, 255);
    interArr[9] = rand(0, 255);
    interArr[10] = rand(0, 255);
    interArr[11] = rand(0, 255);
    interArr[12] = rand(0, 255);
    interArr[13] = rand(0, 255);
    interArr[14] = rand(0, 255);

    nomandismTact.push(interArr);
}


// ======== МАССИВЫ ДАННЫХ ========

// 3X массив: клетки ([mapH]x[mapW]x[11])
const mapCell = []; // let для приравнивания пустой клетки (смерти)
for (let i = 0; i < mapH; i++) {
    const r0 = []; // let для приравнивания пустой клетки (смерти)
    for (let j = 0; j < mapW; j++) {
        const r1 = []; // let для приравнивания пустой клетки (смерти)
        for (let t = 0; t < 12; t++) {
            r1.push(0);
        }
        r0.push(r1);
    }
    mapCell.push(r0);
}

// 3X массив: почва ([mapH]x[mapW]x[1{0 - энергия, 1 - органика}])
const mapGround = [];
for (let i = 0; i < mapH; i++) {
    const r0 = [];
    for (let j = 0; j < mapW; j++) {
        const r1 = [];
        for (let t = 0; t < 2; t++) {
            r1.push(rand(0, 2500)); // устанавливаем рандомную энергию и органику в почве
        }
        r0.push(r1);
    }
    mapGround.push(r0);
}

// 3X массив: геномы ([countOfFractions]x[countOfGenoms]x[14]) // УСТАРЕЛО
/*const genoms = [];
let countOfFractions = 4; // кол-во фракций
let countOfGenoms = 32; // кол-во геномов во фракциях
for (let i = 0; i < countOfFractions; i++) {
    const r0 = [];
    for (let j = 0; j < countOfGenoms; j++) {
        const r1 = [];
        for (let t = 0; t < 15; t++) {
            r1.push(rand(0, 255));
            if (t === 3 || t === 5) { // ТЕСТОВОЕ ТОЛЬКО СОЗДАНИЕ КЛЕТОК
                r1.push(105, 255);
            }
        }
        r0.push(r1);
    }
    genoms.push(r0);
}*/

const playerFrac = []; // тут нужно будет заполнить тактиками
tactics.push(playerFrac);
const expFrac = [expansionTact, prodExtTact, warMeleeTact, migrationTact]; // тут нужно будет заполнить тактиками
tactics.push(expFrac);
const quaFrac = [expansionTact, prodProdTact, warDistantTact, warMeleeTact, developmentTact]; // тут нужно будет заполнить тактиками
tactics.push(quaFrac);
const nomadFrac = [nomandismTact, migrationTact]; // тут нужно будет заполнить тактиками
tactics.push(nomadFrac);

// 1X массив: if-ые функции генома ([функции])
const ifFunc = [ifEnergyRise, ifEnerInGroundMoreOrg, ifObsracleFront, ifObsracleLeft, ifObsracleRight, ifNotObsracle, ifOrgRightMoreOrgLeft, ifOrgLeftMoreOrgRight, ifOrgFrontMoreOrgLeft, ifOrgFrontMoreOrgRight, ifOrgInGroundMoreP2, ifOrgInGround3x3MoreP18, ifRandom0to255MoreP, ifEnemyNear, ifHPCellLessP12];
// ^^^ объявляем массив для if-функций ^^^

// 1X массив: cmd-ые функции генома ([функции])
const cmdFunc = [cmdSkipTurn, cmdTransformIntoSeed, cmdTransformIntoSeedAndMove, cmdMoveEnerInGroundLeft, cmdMoveEnerInGroundRight, cmdMoveEnerInGroundFront, cmdMoveOrgInGroundLeft, cmdMoveOrgInGroundRight, cmdMoveOrgInGroundFront, cmdTransformEnerIntoOrg3x3, cmdRestHP];
// ^^^ объявляем массив для cmd-функций ^^^

// 1X массив: цвета фракций ([цвета{кол-во = кол-ву фракций; индекс цвета = индекс фракции}])
const fractionColors = ['lightgreen', 'pink', 'aqua', 'yellow'];

// ======== ФУНКЦИИ ГЕНОМА ========

// главная функкция генома
function mainGenome(i, j) {
    const frac = mapCell[i][j][3];
    const tactIdx = tactRightNow[frac];
    const geneIdx = mapCell[i][j][10];
    if (tactIdx < 0 || tactIdx >= tactics[frac].length) return; // проверка для устранениях ошибок
    if (geneIdx < 0 || geneIdx >= tactics[frac][tactIdx].length) return; // проверка для устранениях ошибок
    let gen = tactics[frac][tactIdx][geneIdx]; // берем строчку-ген как строчку из тактики выбранной фракции в данный момент
    let resFirstIf = 0;
    let resSecondIf = 0;
    if (gen[3] > 104 && gen[5] > 104) { // если 2 условия не заданы
        for (let a = 0; a < 3; a++) { // повторяем 3 раза (0, 1, 2; для каждой стороны)
            if (gen[0 + a] < 95) { // если ответвление есть
                if (gen[0 + a] < 30) { // *отросток
                    createSprout(i, j, a);
                } else if (gen[0 + a] < 45) { // *манновик
                    createManaMiner(i, j, a);
                } else if (gen[0 + a] < 60) { // *органик
                    createOrgMiner(i, j, a);
                } else if (gen[0 + a] < 75) { // *энергик
                    createEnerMiner(i, j, a);
                } else if (gen[0 + a] < 85) { // *ближняя боевая клетка
                    createMeleeFighter(i, j, a);
                } else if (gen[0 + a] < 95) { // *дальняя боевая клетка
                    createDistantFighter(i, j, a);
                }
            }
        }
    }
    if (gen[3] < 105 || gen[5] < 105) { // если хотя бы одно из условий задано
        if (gen[3] < 105) { // если первое условие задано
            const ifIndex = Math.min(Math.floor(gen[3] / (105 / ifFunc.length)), ifFunc.length - 1); // индекс для корректного вызова функции
            resFirstIf = ifFunc[ifIndex](i, j, gen[4]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
            if (resFirstIf === 1) {
                console.log('Отросток[' + i + '][' + j + '] Успешно');
            }
            else {
                console.log('Отросток[' + i + '][' + j + '] Не успешно');
            }
        }
        if (gen[5] < 105) { // если второе условие задано
            const ifIndex = Math.min(Math.floor(gen[5] / (105 / ifFunc.length)), ifFunc.length - 1); // индекс для корректного вызова функции
            resSecondIf = ifFunc[ifIndex](i, j, gen[6]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
            if (resSecondIf === 1) {
                console.log('Отросток[' + i + '][' + j + '] Успешно');
            }
            else {
                console.log('Отросток[' + i + '][' + j + '] Не успешно');
            }
        }

        if (resFirstIf + resSecondIf === 2) { // если 2 условия выполнились
            if (gen[9] < 33) { // если первая команда задана
                const cmdIndex = Math.min(Math.floor(gen[9] / (33 / cmdFunc.length)), cmdFunc.length - 1); // корректный индекс для вызова команды
                cmdFunc[cmdIndex](i, j); // вызываем команду по корректному индексу
                let resRa = rand(0, 1);
                if (resRa === 0) {
                    mapCell[i][j][10] = Math.floor(gen[10] / 8); // меняем номер строчки-гена
                }
                else {
                    mapCell[i][j][10] = Math.floor(gen[11] / 8); // меняем номер строчки-гена
                }
            }
            else { // если первая команда не задана
                mapCell[i][j][10] = Math.ceil(gen[7] / 32); // меняем номер строчки-гена
            }
        }
        else { // если хотя бы одно условие не выполнилось
            if (gen[12] < 33) { // если вторая команда задана
                const cmdIndex = Math.min(Math.floor(gen[12] / (33 / cmdFunc.length)), cmdFunc.length - 1); // корректный индекс для вызова команды
                cmdFunc[cmdIndex](i, j); // вызываем команду по корректному индексу
                let resRa = rand(0, 1);
                if (resRa === 0) {
                    mapCell[i][j][10] = Math.floor(gen[13] / 8); // меняем номер строчки-гена
                }
                else {
                    mapCell[i][j][10] = Math.floor(gen[14] / 8); // меняем номер строчки-гена
                }
            }
        }
    }
}

// --- строительные функции ---
function specifyDirect(i, j, direct) { // вспомогательная функция выбирающее направление (direct: 0 - слева; 1 - спереди; 2 - справа;)
    if (mapCell[i][j][9] != -1) { // если есть родитель
        if (mapCell[i][j][9] === 0) { // если родитель слева
            if (direct === 0 && i != 0) {
                return [i - 1, j, 3, 1];
            }
            if (direct === 1 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
            if (direct === 2 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
        }
        if (mapCell[i][j][9] === 1) { // если родитель спереди
            if (direct === 0 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
            if (direct === 1 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
            if (direct === 2 && j != 0) {
                return [i, j - 1, 2, 0];
            }
        }
        if (mapCell[i][j][9] === 2) { // если родитель справа
            if (direct === 0 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
            if (direct === 1 && j != 0) {
                return [i, j - 1, 2, 0];
            }
            if (direct === 2 && i != 0) {
                return [i - 1, j, 3, 1];
            }
        }
        if (mapCell[i][j][9] === 3) { // если родитель сзади
            if (direct === 0 && j != 0) {
                return [i, j - 1, 2, 0];
            }
            if (direct === 1 && i != 0) {
                return [i - 1, j, 1, 3];
            }
            if (direct === 2 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
        }
    }
    else { // если нет родителя
        let randPer = rand(0, 3);
        if (randPer === 0) { // если родитель слева
            if (direct === 0 && i != 0) {
                return [i - 1, j, 3, 1];
            }
            if (direct === 1 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
            if (direct === 2 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
        }
        if (randPer === 1) { // если родитель спереди
            if (direct === 0 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
            if (direct === 1 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
            if (direct === 2 && j != 0) {
                return [i, j - 1, 2, 0];
            }
        }
        if (randPer === 2) { // если родитель справа
            if (direct === 0 && i != mapH - 1) {
                return [i + 1, j, 1, 3];
            }
            if (direct === 1 && j != 0) {
                return [i, j - 1, 2, 0];
            }
            if (direct === 2 && i != 0) {
                return [i - 1, j, 3, 1];
            }
        }
        if (randPer === 3) { // если родитель сзади
            if (direct === 0 && j != 0) {
                return [i, j - 1, 2, 0];
            }
            if (direct === 1 && i != 0) {
                return [i - 1, j, 1, 3];
            }
            if (direct === 2 && j != mapW - 1) {
                return [i, j + 1, 0, 2];
            }
        }
    }

    return -1; // возвращает -1 в случае если нужная клетка находится за границами карты
}

function createSprout(i, j, direct) { // создание отростка
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) { // если координата создаваемой клетки пуста
        if (mapCell[i][j][1] >= energyToCreateSprout) { // если хватает энергии для создания отростка
            console.log('Отросток[' + i + '][' + j + '] создает: Отросток');

            mapCell[iC][jC][2] = 1; // изменяем тип клетки на отросток
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateSprout; // вычитаем энергию на создание
            mapCell[iC][jC][1] = Math.round(mapCell[i][j][1] / 3); // передаем созданному отростку треть энергии
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3); // вычитаем переданную энергию
            mapCell[iC][jC][4] = 1; // устанавливаем чтобы клетка не компилировалась в этом ходу
            mapCell[iC][jC][9] = directOfParent; // устанавливаем для создаваемой клетки направление к родителю
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2; // меняем данную клетку на стебель
            mapCell[i][j][energyTo + 5] = 1; // передаем энергию по указанному направлению
        }

    }
}

function createManaMiner(i, j, direct) { // создание манновика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) {
        if (mapCell[i][j][1] >= energyToCreateManaMiner) {
            console.log('Отросток[' + i + '][' + j + '] создает: Манновик');

            mapCell[iC][jC][2] = 3;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateManaMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent + 5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createOrgMiner(i, j, direct) { // создание органика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) {
        if (mapCell[i][j][1] >= energyToCreateOrgMiner) {
            console.log('Отросток[' + i + '][' + j + '] создает: Органик');

            mapCell[iC][jC][2] = 4;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateOrgMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent + 5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createEnerMiner(i, j, direct) { // создание энергика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) {
        if (mapCell[i][j][1] >= energyToCreateEnerMiner) {
            console.log('Отросток[' + i + '][' + j + '] создает: Энергик');

            mapCell[iC][jC][2] = 5;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateEnerMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent + 5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createMeleeFighter(i, j, direct) { // создание ближника
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) {
        if (mapCell[i][j][1] >= energyToCreateMeleeFighter) {
            console.log('Отросток[' + i + '][' + j + '] создает: Ближника');

            mapCell[iC][jC][2] = 7;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateMeleeFighter;
            mapCell[iC][jC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

function createDistantFighter(i, j, direct) { // создание дальника
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (mapCell[iC][jC][2] === 0) {
        if (mapCell[i][j][1] >= energyToCreateDistantFighter) {
            console.log('Отросток[' + i + '][' + j + '] создает: Дальника');

            mapCell[iC][jC][2] = 8;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateDistantFighter;
            mapCell[iC][jC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

// --- if-ые функции ---
function ifEnergyRise(i, j) { // если кол-во энергии клетки растет
    console.log('Отросток[' + i + '][' + j + '] проверяет: Рост энергии');
    if (mapCell[i][j][11] < mapCell[i][j][1]) { // если энергии в предыдущий ход больше чем энергии в этот ход
        return 1;
    }
    else {
        return 0;
    }
}

function ifEnerInGroundMoreOrg(i, j) { // если энергии в почве больше чем органики
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли энергии чем органики');
    if (mapGround[i][j][0] > mapGround[i][j][1]) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifObsracleFront(i, j) { // если препятствие спереди
    console.log('Отросток[' + i + '][' + j + '] проверяет: Есть ли препятствие спереди');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapCell[iC][jC][2] != 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifObsracleLeft(i, j) { // если препятствие слева
    console.log('Отросток[' + i + '][' + j + '] проверяет: Есть ли препятствие слева');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapCell[iC][jC][2] != 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifObsracleRight(i, j) { // если препятствие справа
    console.log('Отросток[' + i + '][' + j + '] проверяет: Есть ли препятствие справа');
    let sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapCell[iC][jC][2] != 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifNotObsracle(i, j) { // если с трёх сторон препятствий нет
    console.log('Отросток[' + i + '][' + j + '] проверяет: Нет ли препятствий с трёх сторон');
    if (mapCell[i][j][9] === -1 || mapCell[i][j][9] === 3) { // если родителя нет или он располагается снизу
        if (i != 0 && j != 0 && j != mapW - 1 && mapCell[i - 1][j][2] === 0 && mapCell[i][j - 1][2] === 0 && mapCell[i][j + 1][2] === 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    if (mapCell[i][j][9] === 0) { // если родитель слева
        if (i != 0 && j != 0 && j != mapW - 1 && i != mapH - 1 && mapCell[i][j + 1][2] === 0 && mapCell[i - 1][j][2] === 0 && mapCell[i + 1][j][2] === 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    if (mapCell[i][j][9] === 1) { // если родитель спереди
        if (i != 0 && j != 0 && j != mapW - 1 && i != mapH - 1 && mapCell[i + 1][j][2] === 0 && mapCell[i][j + 1][2] === 0 && mapCell[i][j - 1][2] === 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    if (mapCell[i][j][9] === 2) { // если родитель справа
        if (i != 0 && j != 0 && j != mapW - 1 && i != mapH - 1 && mapCell[i][j - 1][2] === 0 && mapCell[i - 1][j][2] === 0 && mapCell[i + 1][j][2] === 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

function ifOrgRightMoreOrgLeft(i, j) { // если органики справа больше чем органики слева
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли справа органики чем слева');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];

    if (iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapGround[iCq][jCq][1] > mapGround[iC][jC][1]) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifOrgLeftMoreOrgRight(i, j) { // если органики слева больше чем органики справа
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли слева органики чем справа');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];

    if (iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapGround[iCq][jCq][1] > mapGround[iC][jC][1]) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifOrgFrontMoreOrgLeft(i, j) { // если органики спереди больше чем органики слева
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли спереди органики чем слева');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];

    if (iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if (mapGround[iC][jC][1] > mapGround[iCq][jCq][1]) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifOrgFrontMoreOrgRight(i, j) { // если органики спереди больше чем органики справа
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли спереди органики чем справа');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];

    if (mapGround[iC][jC][1] > mapGround[iCq][jCq][1]) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifOrgInGroundMoreP2(i, j, P) { // если органики в почве больше P * 2
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли органики в почве чем ' + P * 2);
    if (mapGround[i][j][1] > P * 2) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifOrgInGround3x3MoreP18(i, j, P) { // если органики в почве в квадрате 3x3 больше чем P * 18
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли органики в почве 3x3 чем ' + P * 18);
    if (i != 0 && i != mapH - 1 && j != 0 && j != mapW - 1) {
        orgIn3x3 = mapGround[i - 1][j - 1][1] + mapGround[i - 1][j][1] + mapGround[i - 1][j + 1][1] + mapGround[i][j - 1][1] + mapGround[i][j][1] + mapGround[i][j + 1][1] + mapGround[i + 1][j - 1][1] + mapGround[i + 1][j][1] + mapGround[i + 1][j + 1][1];
        if (orgIn3x3 > P * 18) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

function ifRandom0to255MoreP(i, j, P) { // если рандомное число от 0 до 255 больше P
    console.log('Отросток[' + i + '][' + j + '] проверяет: Больше ли рандомное число чем ' + P);
    if (rand(0, 255) > P) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifEnemyNear(i, j) { // если в соседней клетке есть враг
    console.log('Отросток[' + i + '][' + j + '] проверяет: Есть ли враг в соседней клетке');
    let counter = 0;
    if (i != 0 && j != 0 && mapCell[i - 1][j - 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (i != 0 && mapCell[i - 1][j][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (i != 0 && j != mapW - 1 && mapCell[i - 1][j + 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (j != 0 && mapCell[i][j - 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (j != mapW - 1 && mapCell[i][j + 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (i != mapH - 1 && j != 0 && mapCell[i + 1][j - 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (i != mapH - 1 && mapCell[i + 1][j][3] != mapCell[i][j][3]) {
        counter = 1;
    }
    if (i != mapH - 1 && j != mapW - 1 && mapCell[i + 1][j + 1][3] != mapCell[i][j][3]) {
        counter = 1;
    }

    if (counter === 1) {
        return 1;
    }
    else {
        return 0;
    }
}

function ifHPCellLessP12(i, j, P) { // если ХП клетки меньше P / 2
    console.log('Отросток[' + i + '][' + j + '] проверяет: Меньше ли хп чем ' + P / 2);
    if (mapCell[i][j][0] < P / 2) {
        return 1;
    }
    else {
        return 0;
    }
}

// --- cmd-ые функции ---
function cmdSkipTurn(i, j) { // пропустить ход
    console.log('Отросток[' + i + '][' + j + '] исполняет: Пропустить ход');
    mapCell[i][j][4] = 1;
}

function cmdTransformIntoSeed(i, j) { // превратиться в семечко
    console.log('Отросток[' + i + '][' + j + '] исполняет: Превратиться в семечко');
    if (mapCell[i][j][1] > energyToTransformIntoSeed) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);
    }
}

function cmdTransformIntoSeedAndMove(i, j) { // превратится в семечко и переместиться
    console.log('Отросток[' + i + '][' + j + '] исполняет: Превратиться в семечко и полететь');
    if (mapCell[i][j][1] > energyToTransformIntoSeed) {
        mapCell[i][j][1] -= energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);

        let moveDirection = rand(0, 3);
        let maxMove = rand(1, 48);
        let newI = i, newJ = j;

        for (let a = 1; a <= maxMove; a++) {
            if (moveDirection === 0 && newJ - 1 >= 0 && mapCell[newI][newJ - 1][2] === 0) newJ--; // влево
            else if (moveDirection === 1 && newI + 1 < mapH && mapCell[newI + 1][newJ][2] === 0) newI++; // вниз
            else if (moveDirection === 2 && newJ + 1 < mapW && mapCell[newI][newJ + 1][2] === 0) newJ++; // вправо
            else if (moveDirection === 3 && newI - 1 >= 0 && mapCell[newI - 1][newJ][2] === 0) newI--; // вверх
            else break;

            if (mapCell[i][j][1] < a * rateEnergyToMoveSeedByCell) break;
        }

        if (newI !== i || newJ !== j) {
            let distance = Math.abs(newI - i) + Math.abs(newJ - j);
            mapCell[i][j][1] -= distance * rateEnergyToMoveSeedByCell;
            mapCell[newI][newJ] = [...mapCell[i][j]]; // копируем данные
            mapCell[i][j] = [0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0]; // очищаем старую позицию
        }
    }
}

function cmdMoveEnerInGroundLeft(i, j) { // переместить энергию из почвы налево
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить энергию из почвы налево');
    const sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundRight(i, j) { // переместить энергию из почвы направо
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить энергию из почвы направо');
    const sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundFront(i, j) { // переместить энергию из почвы вперёд
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить энергию из почвы вперёд');
    const sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveOrgInGroundLeft(i, j) { // переместить органику из почвы налево
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить органику из почвы налево');
    const sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundRight(i, j) { // переместить органику из почвы направо
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить органику из почвы направо');
    const sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundFront(i, j) { // переместить органику из почвы вперёд
    console.log('Отросток[' + i + '][' + j + '] исполняет: Переместить органику из почвы вперёд');
    const sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) // если клетка за границами карты, прерываем функцию
        return;
    let iC = sDMas[0];
    let jC = sDMas[1];

    if (mapCell[i][j][1] > energyForMoveEnerOrOrg) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdTransformEnerIntoOrg3x3(i, j) { // преобразовать энергию в органику в квадрате 3x3
    console.log('Отросток[' + i + '][' + j + '] исполняет: Преобразовать энергию в органику в квадрате 3x3');
    if (mapCell[i][j][1] > energyForTransformEnerIntoOrg3x3) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForTransformEnerIntoOrg3x3;
        for (let a = 0; a < 3; a++) {
            for (let b = 0; b < 3; b++) {
                if (i + 1 - a >= 0 && i + 1 - a < mapH && j + 1 - b >= 0 && j + 1 - b < mapW) {
                    mapGround[i + 1 - a][j + 1 - b][1] = mapGround[i + 1 - a][j + 1 - b][1] + mapGround[i + 1 - a][j + 1 - b][0];
                    mapGround[i + 1 - a][j + 1 - b][0] = 0;
                }
            }
        }
    }
}

function cmdRestHP(i, j) { // восстановить ХП
    console.log('Отросток[' + i + '][' + j + '] исполняет: Восстановить ХП');
    if (mapCell[i][j][1] > energyForCmdRestHp) {
        mapCell[i][j][1] = mapCell[i][j][1] - energyForCmdRestHp;

        if (mapCell[i][j][2] < 7) { // если тип клетки не боевой
            mapCell[i][j][0] = mapCell[i][j][0] + hpPeaceCells / rateHpRestInCmd;
            if (mapCell[i][j][0] > hpPeaceCells) {
                mapCell[i][j][0] = hpPeaceCells;
            }
        }
        else {
            mapCell[i][j][0] = mapCell[i][j][0] + hpWarCells / rateHpRestInCmd;
            if (mapCell[i][j][0] > hpPeaceCells) {
                mapCell[i][j][0] = hpPeaceCells;
            }
        }
    }
}


// ======== ГЛАВНЫЙ ЦИКЛ ========

// --- Вспомогательные функции ---
function cellDeath(i, j, relate) { // смерть
    if (relate === 0) {
        maxHp = hpPeaceCells;
    }
    else {
        maxHp = hpWarCells;
    }

    if (mapCell[i][j][0] <= 0) { // если ХП клетки меньше или равно 0 (убиваем клетку)
        console.log('Клетка[' + i + '][' + j + '] Умирает');

        // счетчик смертей
        if (mapCell[i][j][1] <= 0) { // если энергия была меньше или равна 0
            factCounters[mapCell[i][j][3]][0] += 1; // то зачисляем в счетчик "ненасильственных" убийств
        }
        else {
            factCounters[mapCell[i][j][3]][1] += 1; // то зачисляем в счетчик "насильственных" убийств
        }

        // процедуры перед смертью клетки
        if (i != 0 && mapCell[i - 1][j][9] === 3) { // сверху
            mapCell[i - 1][j][9] = -1; // устанавливаем что нет родителя
            mapCell[i - 1][j][8] = 0; // передаем что энергию передавать более не надо
        }
        if (j != 0 && mapCell[i][j - 1][9] === 3) { // слева
            mapCell[i][j - 1][9] = -1; // устанавливаем что нет родителя
            mapCell[i - 1][j][7] = 0; // передаем что энергию передавать более не надо
        }
        if (i != mapH - 1 && mapCell[i + 1][j][9] === 3) { // снизу
            mapCell[i + 1][j][9] = -1; // устанавливаем что нет родителя
            mapCell[i - 1][j][6] = 0; // передаем что энергию передавать более не надо
        }
        if (j != mapW - 1 && mapCell[i][j + 1][9] === 3) { // справа
            mapCell[i][j + 1][9] = -1; // устанавливаем что нет родителя
            mapCell[i - 1][j][5] = 0; // передаем что энергию передавать более не надо
        }

        mapGround[i][j][0] = mapGround[i][j][0] + mapCell[i][j][1]; // передаем почве энергию клетки
        mapGround[i][j][1] = mapGround[i][j][1] + hpPeaceCells; // передаем почве органику равную макс. ХП данной клетки

        console.log(mapCell[i][j]); // данные перед смертью

        // убиваем клетку
        mapCell[i][j][0] = 0;
        mapCell[i][j][1] = 0;
        mapCell[i][j][2] = 0;
        mapCell[i][j][3] = 0;
        mapCell[i][j][4] = 0;
        mapCell[i][j][5] = 0;
        mapCell[i][j][6] = 0;
        mapCell[i][j][7] = 0;
        mapCell[i][j][8] = 0;
        mapCell[i][j][9] = -1;
        mapCell[i][j][10] = 0;
        mapCell[i][j][11] = 0;

        // отображаем как пустую
        mapTable.rows[i].cells[j].textContent = '';
    }

}

function drawTransCell(i, j) { // отображение формы стебля (транспортной клетки)
    let sumOfNumLine = mapCell[i][j][5] + mapCell[i][j][6] + mapCell[i][j][7] + mapCell[i][j][8]; // кол-во клеток которым передается энергия

    if (sumOfNumLine === 0) {
        mapTable.rows[i].cells[j].textContent = '.';
    }
    if (sumOfNumLine === 1) {
        if (mapCell[i][j][9] === 0 || mapCell[i][j][9] === 2) {
            mapTable.rows[i].cells[j].textContent = '-';
        }
        if (mapCell[i][j][9] === 1 || mapCell[i][j][9] === 3) {
            mapTable.rows[i].cells[j].textContent = '|';
        }
    }
    if (sumOfNumLine === 2) {
        if (mapCell[i][j][9] === 0) {
            mapTable.rows[i].cells[j].textContent = '-|';
        }
        if (mapCell[i][j][9] === 1) {
            mapTable.rows[i].cells[j].textContent = '⟂';
        }
        if (mapCell[i][j][9] === 2) {
            mapTable.rows[i].cells[j].textContent = '|-';
        }
        if (mapCell[i][j][9] === 3) {
            mapTable.rows[i].cells[j].textContent = 'т';
        }
    }
    if (sumOfNumLine === 3) {
        mapTable.rows[i].cells[j].textContent = '+';
    }
}

function transferEnergy(i, j) {
    let sumOfNumLine = mapCell[i][j][5] + mapCell[i][j][6] + mapCell[i][j][7] + mapCell[i][j][8];
    if (sumOfNumLine === 0 || mapCell[i][j][1] < energyConsumTrans) return 0;

    const directions = [
        { flag: 5, di: 0, dj: -1 }, // влево
        { flag: 6, di: -1, dj: 0 }, // вверх
        { flag: 7, di: 0, dj: 1 },  // вправо
        { flag: 8, di: 1, dj: 0 }   // вниз
    ];

    directions.forEach(({ flag, di, dj }) => {
        if (mapCell[i][j][flag] === 1) {
            let targetI = i + di, targetJ = j + dj;
            if (targetI >= 0 && targetI < mapH && targetJ >= 0 && targetJ < mapW) {
                let transfer = Math.trunc(mapCell[i][j][1] / sumOfNumLine);
                mapCell[targetI][targetJ][1] += transfer;
                mapCell[i][j][1] -= transfer;
            }
        }
    });
    return 1;
}

// --- Константы и переменные для Главного Цикла и функций-механик ---
const tactRightNow = [0, 0, 0, 0]; // тактики в данный момент для фракций (0 - игрок; 1 - эксп; 2 - кач; 3 - кочевники)

const factCounters = []; // счетчики для факторов для каждой фракции
for (let i = 0; i < countOfFractions; i++) {
    const interArr = [0, 0, 0, 0, 0, 0, 0];
    // 0: счетчик смертей от недостатка энергии
    // 1: счетчик смертей от убийств
    // 2: счетчик для кол-ва клеток принадлежащих фракции
    // 3: счетчик кол-ва добывающих клеток
    // 4: счетчик кол-ва боевых клеток
    // 5: счетчик кол-ва отростковых клеток
    // 6: счетчик кол-ва мирных клеток
    factCounters.push(interArr);
}

const minFactors = []; // мин. значения каждого фактора для каждой фракции (у фракции игрока всё 0)
const playerArr = [0, 0, 0, 0, 0, 0];
// 0: мин. кол-во смертей от недостатка энергии для активации этого фактора
// 1: мин. кол-во смертей от убийств для активации этого фактора
// 2: макс. кол-во клеток принадлежащих фракции для активации этого фактора
// 3: макс. соотношение между добывающими и боевыми клетками для активации этого фактора
// 4: макс. соотношение между добывающими и отростковыми клетками для активации этого фактора
// 5: макс. соотношение между боевыми и мирными клетками для активации этого фактора
minFactors.push(playerArr);
const expArr = [factCounters[1][2] / 5, factCounters[1][2] / 5, 250, 1, 1.5, 0.2];
minFactors.push(expArr);
const quaArr = [factCounters[2][2] / 8, factCounters[2][2] / 8, 120, 1.5, 2, 0.33];
minFactors.push(quaArr);
const nomArr = [factCounters[3][2], factCounters[3][2] / 10, 75, 1, 1.5, 0.25];
minFactors.push(nomArr);

let counterForUpdFact = 0; // счетчик для отмера ходов обнуления (обновления) факторов

// --- Главная Функция ---
function mainFunc(i, j) {
    if (mapCell[i][j][2] === 0) { // если тип клетки - пустая
        if (mapCell[i][j][4] === 0) { // если компилируем клетку
            mapTable.rows[i].cells[j].textContent = '';
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1;
        }
    }
    if (mapCell[i][j][2] === 1) { // если тип клетки - отросток
        if (mapCell[i][j][4] === 0) { // если компилируем клетку
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][5] += 1; // кол-во отростков
            factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

            // графическое отображение
            mapTable.rows[i].cells[j].textContent = '@';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            mapCell[i][j][11] = mapCell[i][j][1]; // заполняем энергию в предыдущий ход

            // вычет энергии, ХП клетки и проверка на смерть (если надо - смерть)
            mapCell[i][j][1] = mapCell[i][j][1] - energyConsumSprout; // трата энергии в ход
            if (mapCell[i][j][1] <= 0) {
                mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
            }
            cellDeath(i, j, 0); // вызываем смерть клетки (0 - мирная клетка, 1 - боевая клетка)

            // механики клетки
            mainGenome(i, j); // вызываем основную функцию генома
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 2) { // если тип клетки - стебель
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

            // графическое отображение
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];
            drawTransCell(i, j); // отображаем графическую форму клетки

            // вычет энергии, ХП клетки и проверка на смерть (если надо - смерть)
            mapCell[i][j][1] = mapCell[i][j][1] - energyConsumTrans; // трата энергии в ход
            if (mapCell[i][j][1] <= 0) {
                mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
            }
            cellDeath(i, j, 0); // вызываем смерть клетки (0 - мирная клетка, 1 - боевая клетка)

            // --- Механики Клетки ---

            // прорабатываем вариант смерти клетки куда передаем энергию
            if (mapCell[i][j][5] === 0 && mapCell[i][j][6] === 0 && mapCell[i][j][7] === 0 && mapCell[i][j][8] === 0) { // если стебель никуда не передает энергии
                if (mapCell[i][j][9] != -1) { // если есть родитель
                    mapCell[i][j][5 + mapCell[i][j][9]] = 1; // то передаем энергию в сторону родителя
                    let stopper = 0;
                    let sC = 1;
                    while (stopper === 0) {
                        if (mapCell[i][j][9] === 0) { // если родитель слева
                            if (j - sC != -1 && mapCell[i][j - sC][2] === 2) { // если слева (с расстоянием sC)
                                mapCell[i][j - sC][7] = 0; // то не передаем энергию вправо 
                            }
                            else {
                                stopper = 1; // останавливаем цикл
                            }
                        }
                        if (mapCell[i][j][9] === 1) { // если родитель спереди
                            if (i - sC != -1 && mapCell[i - sC][j][2] === 2) { // если спереди (с расстоянием sC)
                                mapCell[i - sC][j][8] = 0; // то не передаем энергию вниз
                            }
                            else {
                                stopper = 1; // останавливаем цикл
                            }
                        }
                        if (mapCell[i][j][9] === 2) { // если родитель справа
                            if (j + sC != mapW + 1 && mapCell[i][j + sC][2] === 2) { // если справа (с расстоянием sC)
                                mapCell[i][j + sC][5] = 0; // то не передаем энергию влево
                            }
                            else {
                                stopper = 1; // останавливаем цикл
                            }
                        }
                        if (mapCell[i][j][9] === 3) { // если родитель снизу
                            if (i + sC != mapH + 1 && mapCell[i + sC][j][2] === 2) { // если снизу (с расстоянием sC)
                                mapCell[i + sC][j][6] = 0; // то не передаем энергию вверх
                            }
                            else {
                                stopper = 1; // останавливаем цикл
                            }
                        }

                        sC++;
                    }
                }
                else { // если родителя нет
                    cellDeath(i, j, 0); // убиваем клетку т.к. она теперь бесполезна
                }
            }

            // непосредственно передача энергии
            transferEnergy(i, j);
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 3) { // если тип клетки - манновик
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][3] += 1; // кол-во майнеров
            factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

            // графика
            mapTable.rows[i].cells[j].textContent = 'м';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            // хп, энергия и прочее
            // производственная клетка не тратит энергии
            cellDeath(i, j, 0);

            // механики
            mapCell[i][j][1] = mapCell[i][j][1] + manaEnergyPerTurn; // начисляем энергию для её передачи
            let prodRes = transferEnergy(i, j);
            if (prodRes === 0) { // если некуда передовать энергию - убиваем клетку из-за бесполезности
                mapCell[i][j][0] = 0;
                cellDeath(i, j, 0);
            }
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 4) { // если тип клетки - органик
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][3] += 1; // кол-во майнеров
            factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

            // графика
            mapTable.rows[i].cells[j].textContent = 'о';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            // хп, энергия и прочее
            // производственная клетка не тратит энергии
            cellDeath(i, j, 0);

            // механики
            mapCell[i][j][1] = mapCell[i][j][1] + energyFromOrgPerTurn; // начисляем энергию для её передачи
            mapGround[i][j][1] = mapGround[i][j][1] - orgForEnerPerTurn; // тратим органику из почвы
            let prodRes = transferEnergy(i, j);
            if (prodRes === 0) { // если некуда передовать энергию - убиваем клетку из-за бесполезности
                mapCell[i][j][0] = 0;
                cellDeath(i, j, 0);
            }
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 5) { // если тип клетки - энергик
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][3] += 1; // кол-во майнеров
            factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

            // графика
            mapTable.rows[i].cells[j].textContent = 'э';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            // хп, энергия и прочее
            // производственная клетка не тратит энергии
            cellDeath(i, j, 0);

            // механики
            mapCell[i][j][1] = mapCell[i][j][1] + energyMinePerTurn; // начисляем энергию для её передачи
            mapGround[i][j][1] = mapGround[i][j][1] - energyMinePerTurn; // тратим энергию из почвы
            let prodRes = transferEnergy(i, j);
            if (prodRes === 0) { // если некуда передовать энергию - убиваем клетку из-за бесполезности
                mapCell[i][j][0] = 0;
                cellDeath(i, j, 0);
            }
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 6) { // если тип клетки - семя
        if (mapCell[i][j][4] === 0) { // если таймер (а им является не-компиляция) пребывания семенем окончен
            mapCell[i][j][2] = 1; // то делаем клетку отростком
        }
        else { // иначе отбавляем этот таймер на единицу
            mapCell[i][j][4] = mapCell[i][j][4] - 1;
        }
        // графика
        mapTable.rows[i].cells[j].textContent = '*';
        mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

        // семя ничего не тратит будучи семенем (разве что по нему может проходить урон)
    }
    if (mapCell[i][j][2] === 7) { // если тип клетки - ближник
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][4] += 1; // кол-во боевых клеток

            // графика
            mapTable.rows[i].cells[j].textContent = 'б';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            // хп, энергия и прочее
            mapCell[i][j][1] = mapCell[i][j][1] - energyConsumWar; // трата энергии в ход
            if (mapCell[i][j][1] <= 0) {
                mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
            }
            cellDeath(i, j, 1);

            // механики
            if (mapCell[i][j][1] >= energyToMeleeCombat) { // если хватает энергии для атаки
                mapCell[i][j][1] = mapCell[i][j][1] - energyToMeleeCombat; // тратим энергию за атаку
                for (let a = 0; a < 3; a++) {
                    for (let b = 0; b < 3; b++) {
                        if (i - 1 + a >= 0 && i - 1 + a < mapH && j - 1 + a >= 0 && j - 1 + a < mapH && mapCell[i - 1 + a][j - 1 + a][2] != 0 && mapCell[i - 1 + a][j - 1 + a][3] != mapCell[i][j][3]) { // если не выходит за карту, атакуемая клетка не пустая и атакуемая клетка другой фракции
                            mapCell[i - 1 + a][j - 1 + a][0] = mapCell[i - 1 + a][j - 1 + a][0] - damageOfMeleeCombat; // то наносим урон
                            mapTable.rows[i - 1 + a].cells[j - 1 + a].textContent = 'X'; // отображаем атаку ближника
                        }
                    }
                }
            }
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
    if (mapCell[i][j][2] === 8) { // если тип клетки - дальник
        if (mapCell[i][j][4] === 0) {
            // счетчики
            factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
            factCounters[mapCell[i][j][3]][4] += 1; // кол-во боевых клеток

            // графика
            mapTable.rows[i].cells[j].textContent = '#';
            mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

            // хп, энергия и прочее
            mapCell[i][j][1] = mapCell[i][j][1] - energyConsumWar; // трата энергии в ход
            if (mapCell[i][j][1] <= 0) {
                mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
            }
            cellDeath(i, j, 1);

            // механики
            if (mapCell[i][j][1] >= energyToDistantCombat) { // если хватает энергии для атаки
                let attackDirect = rand(0, 3);
                if (attackDirect === 0) { // стреляем налево
                    let stopper = 0;
                    let distant = 1;
                    while (stopper === 0) {
                        if (j - distant < 0) { // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                            stopper = 1;
                        }
                        mapCell[i][j][1] -= energyToDistantCombat; // вычитаем энергию за выстрел
                        if (mapCell[i][j - distant][3] != mapCell[i][j][3]) { // если фракция не наша
                            mapCell[i][j - distant][0] -= damageOfDistantCombat; // наносим урон
                            mapTable.rows[i].cells[j - distant].textContent = 'X'; // рисуем нанесение урона
                        }
                        distant++;
                    }
                }
                if (attackDirect === 1) { // стреляем вперед
                    let stopper = 0;
                    let distant = 1;
                    while (stopper === 0) {
                        if (i - distant < 0) { // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                            stopper = 1;
                        }
                        mapCell[i][j][1] -= energyToDistantCombat; // вычитаем энергию за выстрел
                        if (mapCell[i - distant][j][3] != mapCell[i][j][3]) { // если фракция не наша
                            mapCell[i - distant][j][0] -= damageOfDistantCombat; // наносим урон
                            mapTable.rows[i - distant].cells[j].textContent = 'X'; // рисуем нанесение урона
                        }
                        distant++;
                    }
                }
                if (attackDirect === 2) { // стреляем направо
                    let stopper = 0;
                    let distant = 1;
                    while (stopper === 0) {
                        if (j + distant > mapW) { // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                            stopper = 1;
                        }
                        mapCell[i][j][1] -= energyToDistantCombat; // вычитаем энергию за выстрел
                        if (mapCell[i][j + distant][3] != mapCell[i][j][3]) { // если фракция не наша
                            mapCell[i][j + distant][0] -= damageOfDistantCombat; // наносим урон
                            mapTable.rows[i].cells[j + distant].textContent = 'X'; // рисуем нанесение урона
                        }
                        distant++;
                    }
                }
                if (attackDirect === 3) { // стреляем вниз
                    let stopper = 0;
                    let distant = 1;
                    while (stopper === 0) {
                        if (i + distant > mapH) { // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                            stopper = 1;
                        }
                        mapCell[i][j][1] -= energyToDistantCombat; // вычитаем энергию за выстрел
                        if (mapCell[i + distant][j][3] != mapCell[i][j][3]) { // если фракция не наша
                            mapCell[i + distant][j][0] -= damageOfDistantCombat; // наносим урон
                            mapTable.rows[i + distant].cells[j].textContent = 'X'; // рисуем нанесение урона
                        }
                        distant++;
                    }
                }
            }
        }
        else {
            mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
        }
    }
}

// --- Главный Цикл ---
const period = setInterval(() => {
    if (IsPlay === true) { // если игра в данный момент идёт
        let whatMainSide = rand(0, 1); // рандом для выбора стороны компилирования
        if (whatMainSide === 0) { // слева-направо, сверху-вниз
            for (let i = 0; i < mapH; i++) { // проходимся по всем элементам карты
                for (let j = 0; j < mapW; j++) {
                    mainFunc(i, j);
                }
            }
        }
        else { // справа-налево, снизу-вверх
            for (let i = mapH - 1; i > 0; i--) { // проходимся по всем элементам карты
                for (let j = mapW - 1; j > 0; j--) {
                    mainFunc(i, j);
                }
            }
        }

        turnsFromStart += 1; // обновление счетчика ходов с запуска игры

        // восстановление отростков для каждой фракции
        let botFactCounterOfEmptyCells = [0, 0, 0, 0]; // массив для счета пустых клеток для каждой фракции
        for (let i = 0; i < mapH; i++) { // проходимся по всем элементам карты
            for (let j = 0; j < mapW; j++) {
                // если клетка - отросток
                if (mapCell[i][j][2] === 1) {

                    // проверяем есть ли пустые клетки вокруг
                    for (let a = 0; a < 3; a++) {
                        for (let b = 0; b < 3; b++) {
                            if (i - 1 + a >= 0 && i - 1 + a < mapH && j - 1 + a >= 0 && j - 1 + a < mapH && mapCell[i - 1 + a][j - 1 + a][2] === 0) { // если не выходит за карту и пустая
                                botFactCounterOfEmptyCells[mapCell[i][j][3]] += 1; // обновляем счетчик с учетом фракции
                                break; // мы считаем клетки с пустыми вокруг, а не пустые клетки вокруг, поэтому нам не важно их кол-во
                            }
                        }
                    }
                }
            }
        }

        if (botFactCounterOfEmptyCells[1] <= factCounters[1][2] / numInRatioForExp) { // если отростков с пустыми клетками вокруг меньше кол-во всех клеток на константу ДЛЯ ЭКСПОВ
            console.log("ВОССТАНАВЛИВАЕМ ОТРОСТКИ ЭКСПОВ. ПУСТЫШЕК: " + botFactCounterOfEmptyCells[1]);
            restoreOfSprouts(1); // то восстановливаем отростки экспов
        }
        if (botFactCounterOfEmptyCells[2] <= factCounters[2][2] / numInRatioForQua) { // если отростков с пустыми клетками вокруг меньше кол-во всех клеток на константу ДЛЯ КАЧЕСТВЕННИКОВ
            console.log("ВОССТАНАВЛИВАЕМ ОТРОСТКИ КАЧЕСТВЕННИКОВ. ПУСТЫШЕК: " + botFactCounterOfEmptyCells[2]);
            restoreOfSprouts(2); // то восстановливаем отростки качественников
        }
        if (botFactCounterOfEmptyCells[3] <= factCounters[3][2] / numInRatioForNom) { // если отростков с пустыми клетками вокруг меньше кол-во всех клеток на константу ДЛЯ КОЧЕВНИКОВ
            console.log("ВОССТАНАВЛИВАЕМ ОТРОСТКИ КОЧЕВНИКОВ. ПУСТЫШЕК: " + botFactCounterOfEmptyCells[3]);
            restoreOfSprouts(3); // то восстановливаем отростки кочевников
        }

        // обновляем данные для минимальных факторов
        minFactors[1][0] = factCounters[1][2] / 5;
        minFactors[1][1] = factCounters[1][2] / 5;
        minFactors[2][0] = factCounters[2][2] / 8;
        minFactors[2][1] = factCounters[2][2] / 8;
        minFactors[3][0] = factCounters[3][2];
        minFactors[3][1] = factCounters[3][2] / 10;

        // какие тактики на следующий ход?
        if (turnsFromStart >= turnsNoChangeStartTacticExp) { whatAboutTactic(1); } // обновляем тактику У ЭКСПОВ, если прошло достаточно ходов с начала
        if (turnsFromStart >= turnsNoChangeStartTacticQua) { whatAboutTactic(2); } // обновляем тактику У КАЧЕСТВЕННИКОВ, если прошло достаточно ходов с начала
        if (turnsFromStart >= turnsNoChangeStartTacticNom) { whatAboutTactic(3); } // обновляем тактику У КОЧЕВНИКОВ, если прошло достаточно ходов с началав

        // все по счетчикам-факторам
        for (let i = 0; i < countOfFractions; i++) { // обнуляем факторы-счетчики для соотношений каждый ход для всех фракций
            factCounters[i][2] = 0;
            factCounters[i][3] = 0;
            factCounters[i][4] = 0;
            factCounters[i][5] = 0;
            factCounters[i][6] = 0;
        }

        counterForUpdFact += 1; // обновляем счетчик обновления счетчиков факторов смертей
        if (countOfFractions >= turnsForUpdateFact) { // если счетчик равен (или вдруг привысил) кол-во ходов на обновление счетчиков факторов
            for (let i = 0; i < countOfFractions; i++) { // обнуляем все факторы-счетчики смертей всех фракций
                factCounters[i][0] = 0;
                factCounters[i][1] = 0;
            }
            counterForUpdFact = 0; // обнуляем счетчик обновления счетчиков факторов
        }
    }
}, speedOfUpd);


// ======== ФУНКЦИИ МЕХАНИК ========
function restoreOfSprouts(fraction) { // функция-механика восстановления отростков
    for (let i = 0; i < mapH; i++) { // проходимся по всем элементам карты
        for (let j = 0; j < mapW; j++) {
            // если клетка не пустая, не отросток, не стебель и не семя, и фракция соответствует
            if (mapCell[i][j][2] != 0 && mapCell[i][j][3] === fraction && mapCell[i][j][2] != 1 && mapCell[i][j][2] != 2 && mapCell[i][j][2] != 6) {

                // проверяем есть ли пустые клетки вокруг
                let counterOfEmptyCells = 0; // счетчик для пустых клеток
                for (let a = 0; a < 3; a++) {
                    for (let b = 0; b < 3; b++) {
                        if (i - 1 + a >= 0 && i - 1 + a < mapH && j - 1 + a >= 0 && j - 1 + a < mapH && mapCell[i - 1 + a][j - 1 + a][2] === 0) { // если не выходит за карту и пустая
                            counterOfEmptyCells += 1; // обновляем счетчик
                        }
                    }
                }

                if (counterOfEmptyCells != 0) {
                    let chanceOfTransform = rand(2 + counterOfEmptyCells * 2, 15 + counterOfEmptyCells * 2); // шанс преобразования в отросток рандомится от 2% до 15% (с добавляем прибавки от того сколько пустых клеток вокруг)
                    let isTransform = rand(0, 100);
                    if (isTransform < chanceOfTransform) { // если выполняется шанс
                        mapCell[i][j][2] = 1; // меняем клетку на стебель
                        mapCell[i][j][1] = mapCell[i][j][1] + plusEnergyIfTransIntoSprout; // прибавляем доп. энергию при трансформации
                        mapCell[i][j][10] = rand(0, 32); // устанавливаем случайный номер генома в массиве функции
                    }
                }
            }
        }
    }
}

function whatAboutTactic(fraction) { // функция-механика для смен/поддержания тактик
    if (fraction === 1) { // если фракция - эксы
        // "аварийные тактики"
        if (factCounters[fraction][1] >= minFactors[fraction][1]) { // активен ли фактор "насильственных" убийств
            console.log('===ТАКТИКА ЭКСПОВ:[ВОЙНА: БЛИЖНИЙ БОЙ]===');
            tactRightNow[fraction] = 2; // то выбираем тактику "война: ближний бой"
            return 0;
        }
        if (factCounters[fraction][0] >= minFactors[fraction][0]) { // активен ли фактор "не насильственных" убийств
            console.log('===ТАКТИКА ЭКСПОВ:[ПРОИЗВОДСТВО: ДОБЫЧА]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "производство: добыча"
            return 0;
        }

        // "стабильные" тактики
        if (factCounters[fraction][3] / factCounters[fraction][5] <= minFactors[fraction][4]) { // активен ли фактор соот. доб. и отр.
            console.log('===ТАКТИКА ЭКСПОВ:[ПРОИЗВОДСТВО: ДОБЫЧА]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "производство: добыча"
            return 0;
        }
        if (factCounters[fraction][2] <= minFactors[fraction][2]) { // активен ли фактор кол-ва клеток для фракции
            console.log('===ТАКТИКА ЭКСПОВ:[ЭКСПАНСИЯ]===');
            tactRightNow[fraction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }

        let randFact = rand(0, 1); // рандом 50 на 50
        if (randFact === 0) {
            if (factCounters[fraction][3] / factCounters[fraction][4] <= minFactors[fraction][3]) { // активен ли фактор соот. доб. и боев.
                console.log('===ТАКТИКА ЭКСПОВ:[ПРОИЗВОДСТВО: ДОБЫЧА]===');
                tactRightNow[fraction] = 1; // то выбираем тактику "производство: добыча"
                return 0;
            }
            if (factCounters[fraction][4] / factCounters[fraction][6] <= minFactors[fraction][5]) { // активен ли фактор соот. боев. и мир.
                console.log('===ТАКТИКА ЭКСПОВ:[ВОЙНА: БЛИЖНИЙ БОЙ]===');
                tactRightNow[fraction] = 2; // то выбираем тактику "война: ближний бой"
                return 0;
            }
        }
        if (randFact === 1) {
            console.log('===ТАКТИКА ЭКСПОВ:[ЭКСПАНСИЯ]===');
            tactRightNow[fraction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }
    }
    if (fraction === 2) { // если фракция - качественники
        // "аварийные тактики"
        if (factCounters[fraction][1] >= minFactors[fraction][1]) { // активен ли фактор "насильственных" убийств
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ВОЙНА: БЛИЖНИЙ БОЙ]===');
            tactRightNow[fraction] = 3; // то выбираем тактику "война: ближний бой"
            return 0;
        }
        if (factCounters[fraction][0] >= minFactors[fraction][0]) { // активен ли фактор "не насильственных" убийств
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ПРОИЗВОДСТВО: ПРОИЗВОДСТВО]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "производство: производство"
            return 0;
        }

        // "стабильные" тактики
        if (factCounters[fraction][3] / factCounters[fraction][5] <= minFactors[fraction][4]) { // активен ли фактор соот. доб. и отр.
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ПРОИЗВОДСТВО: ПРОИЗВОДСТВО]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "производство: производство"
            return 0;
        }
        if (factCounters[fraction][2] <= minFactors[fraction][2]) { // активен ли фактор кол-ва клеток для фракции
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ЭКСПАНСИЯ]===');
            tactRightNow[fraction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }

        let randFact = rand(0, 100); // рандом ста процентов
        if (randFact < 40) {
            if (factCounters[fraction][3] / factCounters[fraction][4] <= minFactors[fraction][3]) { // активен ли фактор соот. доб. и боев.
                console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ПРОИЗВОДСТВО: ПРОИЗВОДСТВО]===');
                tactRightNow[fraction] = 1; // то выбираем тактику "производство: производство"
                return 0;
            }
            if (factCounters[fraction][4] / factCounters[fraction][6] <= minFactors[fraction][5]) { // активен ли фактор соот. боев. и мир.
                console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ВОЙНА: ДАЛЬНИЙ БОЙ]===');
                tactRightNow[fraction] = 2; // то выбираем тактику "война: дальний бой"
                return 0;
            }
        }
        else if (randFact < 80) {
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[РАЗВИТИЕ]===');
            tactRightNow[fraction] = 4; // то выбираем тактику "развитие"
            return 0;
        }
        else {
            console.log('===ТАКТИКА КАЧЕСТВЕННИКОВ:[ЭКСПАНСИЯ]===');
            tactRightNow[fraction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }
    }
    if (fraction === 3) { // если фракция - кочевники
        // "аварийные тактики"
        if (factCounters[fraction][1] >= minFactors[fraction][1]) { // активен ли фактор "насильственных" убийств
            console.log('===ТАКТИКА КОЧЕВНИКОВ:[МИГРАЦИЯ]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "миграция"
            return 0;
        }
        else if (factCounters[fraction][0] >= minFactors[fraction][0]) { // активен ли фактор "не насильственных" убийств
            console.log('===ТАКТИКА КОЧЕВНИКОВ:[МИГРАЦИЯ]===');
            tactRightNow[fraction] = 1; // то выбираем тактику "миграция"
            return 0;
        }
        else {
            console.log('===ТАКТИКА КОЧЕВНИКОВ:[КОЧЕВНИЧЕСТВО]===');
            tactRightNow[fraction] = 0; // то выбираем тактику "кочевничество"
            return 0;
        }

        // "стабильные" тактики
        // У КОЧЕВНИКОВ НЕТ СТАБИЛЬНЫХ ТАКТИК
    }
}


// ======== НАЧАЛЬНЫЕ/ТЕСТОВЫЕ ПАРАМЕТРЫ ========

// --- все переменные и константы ---
let startExpPos = rand(0, 3); // случайно выбираем в какую четверть расселить экспов
let startQuaPos = 3;
let startNomPos = [0, 2];
// устанавливаем стартовые четверти других фракций в зависимости от стартовой четверти экспов
if (startExpPos === 0) {
    startQuaPos = 2;
    startNomPos = [1, 3];
}
if (startExpPos === 1) {
    startQuaPos = 3;
    startNomPos = [0, 2];
}
if (startExpPos === 2) {
    startQuaPos = 0;
    startNomPos = [1, 3];
}
if (startExpPos === 3) {
    startQuaPos = 1;
    startNomPos = [0, 2];
}

// устанавливаем отступы для каждой не-игровой тактики
const indentExp = 3; // экспы
const indentQua = 4; // качественники
const indentNom = 0; // кочевники

// задаем экспансию (или кочевничество) начало всем не-игровым фракциям
tactRightNow[1] = 0;
tactRightNow[2] = 0;
tactRightNow[3] = 0;

// --- функция начальных клеток ---
function startSprouts(startPos, indent, fraction) {
    const getRandomCoords = () => {
        let ri, rj;
        if (startPos === 0) {
            ri = rand(indent, mapH / 2 - indent);
            rj = rand(mapW / 2 + indent, mapW - indent);
        } else if (startPos === 1) {
            ri = rand(indent, mapH / 2 - indent);
            rj = rand(indent, mapW / 2 - indent);
        } else if (startPos === 2) {
            ri = rand(mapH / 2 + indent, mapH - indent);
            rj = rand(indent, mapW / 2 - indent);
        } else if (startPos === 3) {
            ri = rand(mapH / 2 + indent, mapH - indent);
            rj = rand(mapW / 2 + indent, mapW - indent);
        }
        return [ri, rj];
    };

    for (let t = 0; t < countOfStartSprout[fraction]; t++) {
        let [ri, rj] = getRandomCoords();
        let attempts = 0;
        while (mapCell[ri][rj][2] !== 0 && attempts < 100) {
            [ri, rj] = getRandomCoords();
            attempts++;
        }
        if (mapCell[ri][rj][2] === 0) {
            mapCell[ri][rj][0] = hpPeaceCells;
            mapCell[ri][rj][1] = startSproutEnergy;
            mapCell[ri][rj][2] = 1;
            mapCell[ri][rj][3] = fraction;
            mapCell[ri][rj][4] = 0;
            mapCell[ri][rj][5] = 0;
            mapCell[ri][rj][6] = 0;
            mapCell[ri][rj][7] = 0;
            mapCell[ri][rj][8] = 0;
            mapCell[ri][rj][9] = -1;
            mapCell[ri][rj][10] = rand(0, 31);
            mapCell[ri][rj][11] = 0;
        }
    }
}

// --- вызываем функцию для каждой фракции ---
startSprouts(startExpPos, indentExp, 1); // экспы
startSprouts(startQuaPos, indentQua, 2); // качественники
startSprouts(startNomPos[0], indentNom, 3); // коченивики 1
startSprouts(startNomPos[1], indentNom, 3); // коченивики 2