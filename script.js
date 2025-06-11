// ======== НАЧАЛЬНЫЕ ОБЪЯВЛЕНИЯ ========
const tableCon = document.getElementById('tableCon');
let mapTable = document.createElement('table');

let speedOfUpd = 1000; // скорость обновления карты

const mapH = 48; // высота карты(таблицы)
const mapW = 48; // ширина карты(таблицы)

for(let i = 0; i < mapH; i++){
    const row = document.createElement('tr');
    for(let j = 0; j < mapW; j++){
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
function rand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// пустая клетка (бесполезна, по крайней мере пока)
//const emptyCell = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// ======== КОНСТАНТЫ ========
const hpPeaceCells = 1000; // нач. и макс. ХП мирных клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpWarCells = 250; // нач. и макс. ХП боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpPlusPerTurn = 5; // восстановление хп в ход {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyForCmdRestHp = 20; // трата энергии на восстановление ХП в cmd функции {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const rateHpRestInCmd = 2; // коэффицент восполнения ХП в cmd функции (на это число будет делится макс. ХП клетки) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpMinusPerTurnAtMinusEnergy = 20; // кол-во ХП отнимаемое в ход при энергии меньшей или равной 0 {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const maxEneryTrans = 10000; // макс. энергия стебля (транспортной клетки) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEnerySprout = 5000; // макс. энергия отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEneryWar = 500; // макс. энергия боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyToCreateSprout = 0; // кол-во энергии для создания отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateManaMiner = 0; // кол-во энергии для создания манновика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateOrgMiner = 0; // кол-во энергии для создания органика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateEnerMiner = 0; // кол-во энергии для создания энергика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateMeleeFighter = 0; // кол-во энергии для создания ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateDistantFighter = 0; // кол-во энергии для создания дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyConsumSprout = 25; // потребление энергии в ход отростком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyConsumTrans = 10; // потребление энергии в ход стеблем (странспортной клеткой) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyConsumWar = 25; // потребление энергии в ход боевой клеткой {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
// добывающие клетки не тратят энергии
const minerConstEnergy = 250; // постоянная энергия у майнеров

// ОРГАНИКА ПРИ СМЕРТИ КЛЕТКИ РАВНА МАКС. ХП ЭТОЙ КЛЕТКИ

const energyToMeleeCombat = 50; // трата энергии на удар ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToDistantCombat = 75; // трата энергии на выстрел дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const damageOfMeleeCombat = 25; // урон от удара ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const damageOfDistantCombat = 25; // урон от выстрела дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyToTransformIntoSeed = 100; // энергия для становления семенем {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const minTurnsAsSeed = 1; // минимальное кол-во ходов как семя
// (!!!) компилируемость клетки для семени является счетчиком ходов для становлением отростком (!!!)
const maxTurnsAsSeed = 20; // максимальное кол-во ходов как семя
const rateEnergyToMoveSeedByCell = 5; // коэффицент (для кол-во переместившихся ходов) затрачиваемой энергии для перемещения семени {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyForTransformEnerIntoOrg3x3 = 100; // энергия за трансформацию всей энергии в 3x3 квадрате в органику {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyForMoveEnerOrOrg = 25; // энергия за перемещение всей энергии или органики из одной клетки в другую {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyMinePerTurn = 200; // энергия добывающаяся в ход энергиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
// трата энергии в почве = вырабатке энергии энергиком
const energyFromOrgPerTurn = 300; // энергия добывающаяся в ход органиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const orgForEnerPerTurn = 200; // кол-во органики тратящейся органиком для производства энергии в ход {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const manaEnergyPerTurn = 100; // кол-во энергии из манны добывающаяся манновиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const plusEnergyIfTransIntoSprout = 500; // доп. энергия при трансформации в отросток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const turnsForUpdateFact = 5; // кол-во ходов для обновления факторов {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}


// ======== ТАКТИКИ ========
const expansionTact = []; // экспансия
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let minerIn = rand(0, 2);
    interArr[minerIn] = rand(30, 74); // задаем в 1 из 3 ячеек случайный майнер
    let tester = 2;
    if(tester - minerIn === 2) {interArr[1] = 0; interArr[2] = 0;} // задаем незанятые ячейки отростками
    if(tester - minerIn === 1) {interArr[0] = 0; interArr[2] = 0;}
    if(tester - minerIn === 0) {interArr[0] = 0; interArr[1] = 0;}

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
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if(tester - sproutIn === 2) {interArr[1] = rand(45, 74); interArr[2] = rand(45, 74);} // задаем незанятые ячейки энергиками или органиками на рандом
    if(tester - sproutIn === 1) {interArr[0] = rand(45, 74); interArr[2] = rand(45, 74);}
    if(tester - sproutIn === 0) {interArr[0] = rand(45, 74); interArr[1] = rand(45, 74);}

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
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if(tester - sproutIn === 2) {interArr[1] = 35; interArr[2] = 35;} // задаем незанятые ячейки манновиками
    if(tester - sproutIn === 1) {interArr[0] = 35; interArr[2] = 35;}
    if(tester - sproutIn === 0) {interArr[0] = 35; interArr[1] = 35;}

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
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if(tester - sproutIn === 2) {interArr[1] = 80; interArr[2] = 80;} // задаем незанятые ячейки ближниками
    if(tester - sproutIn === 1) {interArr[0] = 80; interArr[2] = 80;}
    if(tester - sproutIn === 0) {interArr[0] = 80; interArr[1] = 80;}

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

const warDistantv = []; // война ближний бой
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sproutIn = rand(0, 2);
    interArr[sproutIn] = 0; // задаем в случайную клетку отросток
    let tester = 2;
    if(tester - sproutIn === 2) {interArr[1] = 90; interArr[2] = 90;} // задаем незанятые ячейки дальниками
    if(tester - sproutIn === 1) {interArr[0] = 90; interArr[2] = 90;}
    if(tester - sproutIn === 0) {interArr[0] = 90; interArr[1] = 90;}

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
for(let i = 0; i < countOfGenoms; i++){
    if(i < 4){ // для 4 геномов
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
    else{ // для остальных 28
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
for(let i = 0; i < countOfGenoms; i++){
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
for(let i = 0; i < countOfGenoms; i++){
    const interArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    interArr[directOfNomands] = 0; // в направлении движения создаем отросток
    let tester = 2;
    if(tester - directOfNomands === 2) {interArr[1] = rand(60, 84); interArr[2] = rand(60, 84);} // задаем незанятые ячейки ближниками и/или энергиками
    if(tester - directOfNomands === 1) {interArr[0] = rand(60, 84); interArr[2] = rand(60, 84);}
    if(tester - directOfNomands === 0) {interArr[0] = rand(60, 84); interArr[1] = rand(60, 84);}

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
for(let i = 0; i < mapH; i++){
    const r0 = []; // let для приравнивания пустой клетки (смерти)
    for(let j = 0; j < mapW; j++){
        const r1 = []; // let для приравнивания пустой клетки (смерти)
        for(let t = 0; t < 12; t++){
            r1.push(0);
        }
        r0.push(r1);
    }
    mapCell.push(r0);    
}

// 3X массив: почва ([mapH]x[mapW]x[1{0 - энергия, 1 - органика}])
const mapGround = [];
for(let i = 0; i < mapH; i++){
    const r0 = [];
    for(let j = 0; j < mapW; j++){
        const r1 = [];
        for(let t = 0; t < 2; t++){
            r1.push(rand(0, 2500)); // устанавливаем рандомную энергию и органику в почве
        }
        r0.push(r1);
    }
    mapGround.push(r0);
}

// 3X массив: геномы ([countOfFractions]x[countOfGenoms]x[14])
const genoms = [];
let countOfFractions = 4; // кол-во фракций
let countOfGenoms = 32; // кол-во геномов во фракциях
for(let i = 0; i < countOfFractions; i++){
    const r0 = [];
    for(let j = 0; j < countOfGenoms; j++){
        const r1 = [];
        for(let t = 0; t < 15; t++){
            r1.push(rand(0, 255));
            if(t === 3 || t === 5){ // ТЕСТОВОЕ ТОЛЬКО СОЗДАНИЕ КЛЕТОК
                r1.push(105, 255);
            }
        }
        r0.push(r1);
    }
    genoms.push(r0);    
}

// 4X массив: тактики ([countOfFractions]x[Кол-во тактик]x[countOfGenoms]x[14])
const tactics = [];
let countOfFractions = 4; // кол-во фракций
let countOfGenoms = 32; // кол-во геномов в тактике

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
const fractionColors = ['lightgreen', 'pink', 'lightblue', 'yellow']

// ======== ФУНКЦИИ ГЕНОМА ========

// главная функкция генома
function mainGenome(i, j){
    //let gen = genoms[mapCell[i][j][3]][mapCell[i][j][10]]; // берем строчку-ген
    let gen = tactics[mapCell[i][j][3]][tactRightNow][mapCell[i][j][10]]; // берем строчку-ген как строчку из тактики выбранной фракции в данный момент
    let resFirstIf = 0;
    let resSecondIf = 0;
    if(gen[3] > 104 && gen[5] > 104){ // если 2 условия не заданы
        for(let a = 0; a < 3; a++){ // повторяем 3 раза (0, 1, 2; для каждой стороны)
            if(gen[0+a] < 95){ // если ответвление есть
                if(gen[0+a] < 30){ // *отросток
                    createSprout(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Отросток');
                } else if(gen[0+a] < 45){ // *манновик
                    createManaMiner(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Манновик');
                } else if(gen[0+a] < 60){ // *органик
                    createOrgMiner(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Органик');
                } else if(gen[0+a] < 75){ // *энергик
                    createEnerMiner(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Энергик');
                } else if(gen[0+a] < 85){ // *ближняя боевая клетка
                    createMeleeFighter(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Ближника');
                } else if(gen[0+a] < 95){ // *дальняя боевая клетка
                    createDistantFighter(i, j, a);
                    console.log('Отросток['+i+']['+j+'] создает: Дальника');
                }
            }
        }
    }
    if(gen[3] < 105 || gen[5] < 105){ // если хотя бы одно из условий задано
        if(gen[3] < 105){ // если первое условие задано
            resFirstIf = ifFunc[Math.floor(gen[3]/7)](i, j, gen[4]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
            if(resFirstIf === 1){
                console.log('Отросток['+i+']['+j+'] Успешно');
            }
            else{
                console.log('Отросток['+i+']['+j+'] Не успешно');
            }
        }
        if(gen[5] < 105){ // если второе условие задано
            resSecondIf = ifFunc[Math.floor(gen[5]/7)](i, j, gen[6]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
             if(resSecondIf === 1){
                console.log('Отросток['+i+']['+j+'] Успешно');
             }
            else{
                console.log('Отросток['+i+']['+j+'] Не успешно');
            }
        }

        if(resFirstIf + resSecondIf === 2){ // если 2 условия выполнились
            if(gen[9] < 33) { // если первая команда задана
                cmdFunc[Math.floor(gen[9]/3)](i, j);
                let resRa = rand(0, 1);
                if(resRa === 0){
                    mapCell[i][j][10] = Math.floor(gen[10]/8); // меняем номер строчки-гена
                }
                else{
                    mapCell[i][j][10] = Math.floor(gen[11]/8); // меняем номер строчки-гена
                }
            }
            else{ // если первая команда не задана
                mapCell[i][j][10] = Math.ceil(gen[7]/32); // меняем номер строчки-гена
            }
        }
        else{ // если хотя бы одно условие не выполнилось
            if(gen[12] < 33) { // если вторая команда задана
                cmdFunc[Math.floor(gen[12]/3)](i, j);
                let resRa = rand(0, 1);
                if(resRa === 0){
                    mapCell[i][j][10] = Math.floor(gen[13]/8); // меняем номер строчки-гена
                }
                else{
                    mapCell[i][j][10] = Math.floor(gen[14]/8); // меняем номер строчки-гена
                }
            }
        }
    }
}

// --- строительные функции ---
function specifyDirect(i, j, direct){ // вспомогательная функция выбирающее направление (direct: 0 - слева; 1 - спереди; 2 - справа;)
    if(mapCell[i][j][9] != -1){ // если есть родитель
        if(mapCell[i][j][9] === 0){ // если родитель слева
            if(direct === 0 && i != 0){
                return [i - 1, j, 3, 1];
            }
            if(direct === 1 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
            if(direct === 2 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
        }
        if(mapCell[i][j][9] === 1){ // если родитель спереди
            if(direct === 0 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
            if(direct === 1 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
            if(direct === 2 && j != 0){
                return [i, j - 1, 2, 0];
            }
        }
        if(mapCell[i][j][9] === 2){ // если родитель справа
            if(direct === 0 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
            if(direct === 1 && j != 0){
                return [i, j - 1, 2, 0];
            }
            if(direct === 2 && i != 0){
                return [i - 1, j, 3, 1];
            }
        }
        if(mapCell[i][j][9] === 3){ // если родитель сзади
            if(direct === 0 && j != 0){
                return [i, j - 1, 2, 0];
            }
            if(direct === 1 && i != 0){
                return [i - 1, j, 1, 3];
            }
            if(direct === 2 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
        }
    }
    else{ // если нет родителя
        let randPer = rand(0, 3);
        if(randPer === 0){ // если родитель слева
            if(direct === 0 && i != 0){
                return [i - 1, j, 3, 1];
            }
            if(direct === 1 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
            if(direct === 2 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
        }
        if(randPer === 1){ // если родитель спереди
            if(direct === 0 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
            if(direct === 1 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
            if(direct === 2 && j != 0){
                return [i, j - 1, 2, 0];
            }
        }
        if(randPer === 2){ // если родитель справа
            if(direct === 0 && i != mapH-1){
                return [i + 1, j, 1, 3];
            }
            if(direct === 1 && j != 0){
                return [i, j - 1, 2, 0];
            }
            if(direct === 2 && i != 0){
                return [i - 1, j, 3, 1];
            }
        }
        if(randPer === 3){ // если родитель сзади
            if(direct === 0 && j != 0){
                return [i, j - 1, 2, 0];
            }
            if(direct === 1 && i != 0){
                return [i - 1, j, 1, 3];
            }
            if(direct === 2 && j != mapW-1){
                return [i, j + 1, 0, 2];
            }
        }
    }

    return -1; // возвращает -1 в случае если нужная клетка находится за границами карты
}

function createSprout(i, j, direct){ // создание отростка
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){ // если координата создаваемой клетки пуста
        if(mapCell[i][j][1] >= energyToCreateSprout){ // если хватает энергии для создания отростка
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

function createManaMiner(i, j, direct){ // создание манновика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateManaMiner){
            mapCell[iC][jC][2] = 3;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateManaMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createOrgMiner(i, j, direct){ // создание органика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateOrgMiner){
            mapCell[iC][jC][2] = 4;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateOrgMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createEnerMiner(i, j, direct){ // создание энергика
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateEnerMiner){
            mapCell[iC][jC][2] = 5;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[iC][jC][1] = minerConstEnergy; // задаем постоянную энергию майнеров
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateEnerMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createMeleeFighter(i, j, direct){ // создание ближника
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateMeleeFighter){
            mapCell[iC][jC][2] = 7;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateMeleeFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][3] = mapCell[i][j][3]; // устанавливаем фракцию равную фракции родителя

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

function createDistantFighter(i, j, direct){ // создание дальника
    let sDMas = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateDistantFighter){
            mapCell[iC][jC][2] = 8;
            mapCell[iC][jC][0] = hpPeaceCells; // задаем начальное-максимальное хп
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateDistantFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
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
function ifEnergyRise(i, j){ // если кол-во энергии клетки растет
    console.log('Отросток['+i+']['+j+'] проверяет: Рост энергии');
    if(mapCell[i][j][11] < mapCell[i][j][1]){ // если энергии в предыдущий ход больше чем энергии в этот ход
        return 1;
    }
    else{
        return 0;
    }
}

function ifEnerInGroundMoreOrg(i, j){ // если энергии в почве больше чем органики
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли энергии чем органики');
    if(mapGround[i][j][0] > mapGround[i][j][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifObsracleFront(i, j){ // если препятствие спереди
    console.log('Отросток['+i+']['+j+'] проверяет: Есть ли препятствие спереди');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];

    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapCell[iC][jC][2] != 0){
        return 1;
    }
    else{
        return 0;
    }
}

function ifObsracleLeft(i, j){ // если препятствие слева
    console.log('Отросток['+i+']['+j+'] проверяет: Есть ли препятствие слева');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] != 0){
        return 1;
    }
    else{
        return 0;
    }
}

function ifObsracleRight(i, j){ // если препятствие справа
    console.log('Отросток['+i+']['+j+'] проверяет: Есть ли препятствие справа');
    let sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    let directOfParent = sDMas[2];
    let energyTo = sDMas[3];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] != 0){
        return 1;
    }
    else{
        return 0;
    }
}

function ifNotObsracle(i, j){ // если с трёх сторон препятствий нет
    console.log('Отросток['+i+']['+j+'] проверяет: Нет ли препятствий с трёх сторон');
    if(mapCell[i][j][9] === -1 || mapCell[i][j][9] === 3){ // если родителя нет или он располагается снизу
        if(i != 0 && j != 0 && j != mapW-1 && mapCell[i-1][j][2] === 0 && mapCell[i][j-1][2] === 0 && mapCell[i][j+1][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 0){ // если родитель слева
        if(i != 0 && j != 0 && j != mapW-1 && i != mapH-1 && mapCell[i][j+1][2] === 0 && mapCell[i-1][j][2] === 0 && mapCell[i+1][j][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 1){ // если родитель спереди
        if(i != 0 && j != 0 && j != mapW-1 && i != mapH-1 && mapCell[i+1][j][2] === 0 && mapCell[i][j+1][2] === 0 && mapCell[i][j-1][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 2){ // если родитель справа
        if(i != 0 && j != 0 && j != mapW-1 && i != mapH-1 && mapCell[i][j-1][2] === 0 && mapCell[i-1][j][2] === 0 && mapCell[i+1][j][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
}

function ifOrgRightMoreOrgLeft(i, j){ // если органики справа больше чем органики слева
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли справа органики чем слева');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];
    
    if(iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapGround[iCq][jCq][1] > mapGround[iC][jC][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgLeftMoreOrgRight(i, j){ // если органики слева больше чем органики справа
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли слева органики чем справа');
    let sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];
    
    if(iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapGround[iCq][jCq][1] > mapGround[iC][jC][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgFrontMoreOrgLeft(i, j){ // если органики спереди больше чем органики слева
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли спереди органики чем слева');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];
    
    if(iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapGround[iC][jC][1] > mapGround[iCq][jCq][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgFrontMoreOrgRight(i, j){ // если органики спереди больше чем органики справа
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли спереди органики чем справа');
    let sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMas === -1) return 0;
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let sDMasq = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    if (sDMasq === -1) return 0;
    let iCq = sDMasq[0];
    let jCq = sDMasq[1];
    
    if(iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapGround[iC][jC][1] > mapGround[iCq][jCq][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgInGroundMoreP2(i, j, P){ // если органики в почве больше P * 2
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли органики в почве чем '+P*2);
    if(mapGround[i][j][1] > P*2){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgInGround3x3MoreP18(i, j, P){ // если органики в почве в квадрате 3x3 больше чем P * 18
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли органики в почве 3x3 чем '+P*18);
    if(i != 0 && i != mapH-1 && j != 0 && j != mapW-1){
        orgIn3x3 = mapGround[i-1][j-1][1] + mapGround[i-1][j][1] + mapGround[i-1][j+1][1] + mapGround[i][j-1][1] + mapGround[i][j][1] + mapGround[i][j+1][1] + mapGround[i+1][j-1][1] + mapGround[i+1][j][1] + mapGround[i+1][j+1][1];
        if(orgIn3x3 > P * 18){
            return 1;
        }
        else{
            return 0;
        }
    }
}

function ifRandom0to255MoreP(i, j, P){ // если рандомное число от 0 до 255 больше P
    console.log('Отросток['+i+']['+j+'] проверяет: Больше ли рандомное число чем '+P);
    if(rand(0, 255) > P){
        return 1;
    }
    else{
        return 0;
    }
} 

function ifEnemyNear(i, j){ // если в соседней клетке есть враг
    console.log('Отросток['+i+']['+j+'] проверяет: Есть ли враг в соседней клетке');
    let counter = 0;
    if(i != 0 && j != 0 && mapCell[i-1][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != 0 && mapCell[i-1][j][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != 0 && j != mapW-1 && mapCell[i-1][j+1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(j != 0 && mapCell[i][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(j != mapW-1 && mapCell[i][j+1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH-1 && j != 0 && mapCell[i+1][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH-1 && mapCell[i+1][j][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH-1 && j != mapW-1 && mapCell[i+1][j+1][3] != mapCell[i][j][3]){
        counter = 1;
    }

    if(counter === 1){
        return 1;
    }
    else{
        return 0;
    }
}

function ifHPCellLessP12(i, j, P){ // если ХП клетки меньше P / 2
    console.log('Отросток['+i+']['+j+'] проверяет: Меньше ли хп чем '+P/2);
    if(mapCell[i][j][0] < P / 2){
        return 1;
    }
    else{
        return 0;
    }
}

// --- cmd-ые функции ---
function cmdSkipTurn(i, j){ // пропустить ход
    console.log('Отросток['+i+']['+j+'] исполняет: Пропустить ход');
    mapCell[i][j][4] = 1;
}

function cmdTransformIntoSeed(i, j){ // превратиться в семечко
    console.log('Отросток['+i+']['+j+'] исполняет: Превратиться в семечко');
    if(mapCell[i][j][1] > energyToTransformIntoSeed){
        mapCell[i][j][1] = mapCell[i][j][1] - energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);
    }
}

function cmdTransformIntoSeedAndMove(i, j) { // превратится в семечко и переместиться
    console.log('Отросток['+i+']['+j+'] исполняет: Превратиться в семечко и полететь');
    if (mapCell[i][j][1] > energyToTransformIntoSeed) {
        mapCell[i][j][1] -= energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);

        let moveDirection = rand(0, 3);
        let maxMove = rand(1, 32);
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

function cmdMoveEnerInGroundLeft(i, j){ // переместить энергию из почвы налево
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить энергию из почвы налево');
    const sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;
    
    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundRight(i, j){ // переместить энергию из почвы направо
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить энергию из почвы направо');
    const sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundFront(i, j){ // переместить энергию из почвы вперёд
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить энергию из почвы вперёд');
    const sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveOrgInGroundLeft(i, j){ // переместить органику из почвы налево
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить органику из почвы налево');
    const sDMas = specifyDirect(i, j, 0); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundRight(i, j){ // переместить органику из почвы направо
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить органику из почвы направо');
    const sDMas = specifyDirect(i, j, 2); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundFront(i, j){ // переместить органику из почвы вперёд
    console.log('Отросток['+i+']['+j+'] исполняет: Переместить органику из почвы вперёд');
    const sDMas = specifyDirect(i, j, 1); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии
    let iC = sDMas[0];
    let jC = sDMas[1];
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdTransformEnerIntoOrg3x3(i, j){ // преобразовать энергию в органику в квадрате 3x3
    console.log('Отросток['+i+']['+j+'] исполняет: Преобразовать энергию в органику в квадрате 3x3');
    if(mapCell[i][j][1] > energyForTransformEnerIntoOrg3x3){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForTransformEnerIntoOrg3x3;
        for(let a = 0; a < 3; a++){
            for(let b = 0; b < 3; b++){
                if(i+1-a >= 0 && i+1-a < mapH && j+1-b >= 0 && j+1-b < mapW){
                    mapGround[i+1-a][j+1-b][1] = mapGround[i+1-a][j+1-b][1] + mapGround[i+1-a][j+1-b][0];
                    mapGround[i+1-a][j+1-b][0] = 0;
                }
            }
        }
    }
}

function cmdRestHP(i, j){ // восстановить ХП
    console.log('Отросток['+i+']['+j+'] исполняет: Восстановить ХП');
    if(mapCell[i][j][1] > energyForCmdRestHp){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForCmdRestHp;

        if(mapCell[i][j][2] < 7){ // если тип клетки не боевой
            mapCell[i][j][0] = mapCell[i][j][0] + hpPeaceCells / rateHpRestInCmd;
            if(mapCell[i][j][0] > hpPeaceCells){
                mapCell[i][j][0] = hpPeaceCells;
            }
        }
        else{
            mapCell[i][j][0] = mapCell[i][j][0] + hpWarCells / rateHpRestInCmd;
            if(mapCell[i][j][0] > hpPeaceCells){
                mapCell[i][j][0] = hpPeaceCells;
            }
        }
    }
}


// ======== ГЛАВНЫЙ ЦИКЛ ========

// --- Вспомогательные функции ---
function cellDeath(i, j, relate){ // смерть
    if(relate === 0){
        maxHp = hpPeaceCells;
    }
    else{
        maxHp = hpWarCells;
    }

    if(mapCell[i][j][0] <= 0){ // если ХП клетки меньше или равно 0 (убиваем клетку)
        console.log('Клетка['+i+']['+j+'] Умирает');
        
        // счетчик смертей
        if(mapCell[i][j][1] <= 0){ // если энергия была меньше или равна 0
            factCounters[mapCell[i][j][3]][0] += 1; // то зачисляем в счетчик "ненасильственных" убийств
        }
        else{
            factCounters[mapCell[i][j][3]][1] += 1; // то зачисляем в счетчик "насильственных" убийств
        }

        // процедуры перед смертью клетки
        if(i != 0 && mapCell[i-1][j][9] === 3){ // сверху
            mapCell[i-1][j][9] = -1; // устанавливаем что нет родителя
            mapCell[i-1][j][8] = 0; // передаем что энергию передавать более не надо
        }
        if(j != 0 && mapCell[i][j-1][9] === 3){ // слева
            mapCell[i][j-1][9] = -1; // устанавливаем что нет родителя
            mapCell[i-1][j][7] = 0; // передаем что энергию передавать более не надо
        }
        if(i != mapH-1 && mapCell[i+1][j][9] === 3){ // снизу
            mapCell[i+1][j][9] = -1; // устанавливаем что нет родителя
            mapCell[i-1][j][6] = 0; // передаем что энергию передавать более не надо
        }
        if(j != mapW-1 && mapCell[i][j+1][9] === 3){ // справа
            mapCell[i][j+1][9] = -1; // устанавливаем что нет родителя
            mapCell[i-1][j][5] = 0; // передаем что энергию передавать более не надо
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
    }

}

function drawTransCell(i, j){ // отображение формы стебля (транспортной клетки)
    let sumOfNumLine = mapCell[i][j][5] + mapCell[i][j][6] + mapCell[i][j][7] + mapCell[i][j][8]; // кол-во клеток которым передается энергия

    if(sumOfNumLine === 0){
        mapTable.rows[i].cells[j].textContent = '.';
    }
    if(sumOfNumLine === 1){
        if(mapCell[i][j][9] === 0 || mapCell[i][j][9] === 2){
            mapTable.rows[i].cells[j].textContent = '-';
        }
        if(mapCell[i][j][9] === 1 || mapCell[i][j][9] === 3){
            mapTable.rows[i].cells[j].textContent = '|';
        }
    }
    if(sumOfNumLine === 2){
        if(mapCell[i][j][9] === 0){
            mapTable.rows[i].cells[j].textContent = '-|';
        }
        if(mapCell[i][j][9] === 1){
            mapTable.rows[i].cells[j].textContent = '⟂';
        }
        if(mapCell[i][j][9] === 2){
            mapTable.rows[i].cells[j].textContent = '|-';
        }
        if(mapCell[i][j][9] === 3){
            mapTable.rows[i].cells[j].textContent = 'т';
        }
    }
    if(sumOfNumLine === 3){
        mapTable.rows[i].cells[j].textContent = '+';
    }
}

function transferEnergy(i, j){ // любая передача энергии (для стебля и производственных клеток)
    let sumOfNumLine = mapCell[i][j][5] + mapCell[i][j][6] + mapCell[i][j][7] + mapCell[i][j][8]; // кол-во клеток которым передается энергия
    for(let z = 0; z < sumOfNumLine; z++){ // повторяем столько раз, сколько есть клеток куда передается энергия
        if(mapCell[i][j][1] >= energyConsumTrans){ // если есть энергия которую можно передавать
            if(mapCell[i][j][5] === 1){ // если передаем энергию влево
                mapCell[i][j-1][1] = mapCell[i][j-1][1] + Math.trunc(mapCell[i][j][1] / sumOfNumLine); // передаем энергию деленную на кол-во клеток которым нужно передавать
                mapCell[i][j][1] = mapCell[i][j][1] - Math.trunc(mapCell[i][j][1] / sumOfNumLine); // отнимаем переданную энергию
            }
            else if(mapCell[i][j][6] === 1){ // если передаем энергию вверх
                mapCell[i-1][j][1] = mapCell[i-1][j][1] + Math.trunc(mapCell[i][j][1] / sumOfNumLine); // передаем энергию деленную на кол-во клеток которым нужно передавать
                mapCell[i][j][1] = mapCell[i][j][1] - Math.trunc(mapCell[i][j][1] / sumOfNumLine); // отнимаем переданную энергию
            }
            else if(mapCell[i][j][7] === 1){ // если передаем энергию вправо
                mapCell[i][j+1][1] = mapCell[i][j+1][1] + Math.trunc(mapCell[i][j][1] / sumOfNumLine); // передаем энергию деленную на кол-во клеток которым нужно передавать
                mapCell[i][j][1] = mapCell[i][j][1] - Math.trunc(mapCell[i][j][1] / sumOfNumLine); // отнимаем переданную энергию
            }
            else if(mapCell[i][j][8] === 1){ // если передаем энергию вниз
                mapCell[i+1][j][1] = mapCell[i+1][j][1] + Math.trunc(mapCell[i][j][1] / sumOfNumLine); // передаем энергию деленную на кол-во клеток которым нужно передавать
                mapCell[i][j][1] = mapCell[i][j][1] - Math.trunc(mapCell[i][j][1] / sumOfNumLine); // отнимаем переданную энергию
            }
        }
    }

    if(sumOfNumLine === 0){
        return 0;
    }
    else{
        return 1;
    }
}

// --- Константы и переменные для Главного Цикла и функций-механик ---
const tactRightNow = [0, 0, 0, 0]; // тактики в данный момент для фракций (0 - игрок; 1 - эксп; 2 - кач; 3 - кочевники)

const factCounters = []; // счетчики для факторов для каждой фракции
for(let i = 0; i < countOfFractions; i++){
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
const expArr = [0, 0, 0, 0, 0, 0];
minFactors.push(expArr);
const quaArr = [0, 0, 0, 0, 0, 0];
minFactors.push(quaArr);
const nomArr = [0, 0, 0, 0, 0, 0];
minFactors.push(nomArr);

let counterForUpdFact = 0; // счетчик для отмера ходов обнуления (обновления) факторов

// --- Главный Цикл ---
const period = setInterval(() => {
    for(let i = 0; i < mapH; i++){ // проходимся по всем элементам карты
        for(let j = 0; j < mapW; j++)
        {
            if(mapCell[i][j][2] === 0){ // если тип клетки - пустая
                if(mapCell[i][j][4] != 0){
                    mapTable.rows[i].cells[j].textContent = '';
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1;
                }
            }
            if(mapCell[i][j][2] === 1){ // если тип клетки - отросток
                if(mapCell[i][j][4] === 0){ // если компилируем клетку
                    mapTable.rows[i].cells[j].textContent = '@';
                    mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

                    mapCell[i][j][11] = mapCell[i][j][1]; // заполняем энергию в предыдущий ход

                    // вычет энергии, ХП клетки и проверка на смерть (если надо - смерть)
                    mapCell[i][j][1] = mapCell[i][j][1] - energyConsumSprout; // трата энергии в ход
                    if(mapCell[i][j][1] <= 0){
                        mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
                    }
                    cellDeath(i, j, 0); // вызываем смерть клетки (0 - мирная клетка, 1 - боевая клетка)

                    // механики клетки
                    mainGenome(i, j); // вызываем основную функцию генома
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 2){ // если тип клетки - стебель
                if(mapCell[i][j][4] === 0){
                    // счетчики
                    factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
                    factCounters[mapCell[i][j][3]][5] += 1; // кол-во отростков
                    factCounters[mapCell[i][j][3]][6] += 1; // кол-во мирных клеток

                    // графическое отображение
                    mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];
                    drawTransCell(i, j); // отображаем графическую форму клетки

                    // вычет энергии, ХП клетки и проверка на смерть (если надо - смерть)
                    mapCell[i][j][1] = mapCell[i][j][1] - energyConsumTrans; // трата энергии в ход
                    if(mapCell[i][j][1] <= 0){
                        mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
                    }
                    cellDeath(i, j, 0); // вызываем смерть клетки (0 - мирная клетка, 1 - боевая клетка)

                    // --- Механики Клетки ---

                    // прорабатываем вариант смерти клетки куда передаем энергию
                    if(mapCell[i][j][5] === 0 && mapCell[i][j][6] === 0 && mapCell[i][j][7] === 0 && mapCell[i][j][8] === 0){ // если стебель никуда не передает энергии
                        if(mapCell[i][j][9] != -1){ // если есть родитель
                            mapCell[i][j][5+mapCell[i][j][9]] = 1; // то передаем энергию в сторону родителя
                            let stopper = 0;
                            let sC = 1;
                            while(stopper === 0){
                                if(mapCell[i][j][9] === 0){ // если родитель слева
                                    if(j-sC != -1 && mapCell[i][j-sC][2] === 2){ // если слева (с расстоянием sC)
                                        mapCell[i][j-sC][7] = 0; // то не передаем энергию вправо 
                                    }
                                    else{
                                        stopper = 1; // останавливаем цикл
                                    }
                                }
                                if(mapCell[i][j][9] === 1){ // если родитель спереди
                                    if(i-sC != -1 && mapCell[i-sC][j][2] === 2){ // если спереди (с расстоянием sC)
                                        mapCell[i-sC][j][8] = 0; // то не передаем энергию вниз
                                    }
                                    else{
                                        stopper = 1; // останавливаем цикл
                                    }
                                }
                                if(mapCell[i][j][9] === 2){ // если родитель справа
                                    if(j+sC != mapW+1 && mapCell[i][j+sC][2] === 2){ // если справа (с расстоянием sC)
                                        mapCell[i][j+sC][5] = 0; // то не передаем энергию влево
                                    }
                                    else{
                                        stopper = 1; // останавливаем цикл
                                    }
                                }
                                if(mapCell[i][j][9] === 3){ // если родитель снизу
                                    if(i+sC != mapH+1 && mapCell[i+sC][j][2] === 2){ // если снизу (с расстоянием sC)
                                        mapCell[i+sC][j][6] = 0; // то не передаем энергию вверх
                                    }
                                    else{
                                        stopper = 1; // останавливаем цикл
                                    }
                                }

                                sC++;
                            }
                        }
                        else{ // если родителя нет
                            cellDeath(i, j, 0); // убиваем клетку т.к. она теперь бесполезна
                        }
                    }

                    // непосредственно передача энергии
                    transferEnergy(i, j);
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 3){ // если тип клетки - манновик
                if(mapCell[i][j][4] === 0){
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
                    if(prodRes === 0){ // если некуда передовать энергию - убиваем клетку из-за бесполезности
                        cellDeath(i, j);
                    }
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 4){ // если тип клетки - органик
                if(mapCell[i][j][4] === 0){
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
                    if(prodRes === 0){ // если некуда передовать энергию - убиваем клетку из-за бесполезности
                        cellDeath(i, j);
                    }
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 5){ // если тип клетки - энергик
                if(mapCell[i][j][4] === 0){
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
                    if(prodRes === 0){ // если некуда передовать энергию - убиваем клетку из-за бесполезности
                        cellDeath(i, j);
                    }
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 6){ // если тип клетки - семя
                if(mapCell[i][j][4] === 0){ // если таймер (а им является не-компиляция) пребывания семенем окончен
                    mapCell[i][j][2] = 1; // то делаем клетку отростком
                }
                else{ // иначе отбавляем этот таймер на единицу
                    mapCell[i][j][4] = mapCell[i][j][4] - 1;
                }
                // графика
                mapTable.rows[i].cells[j].textContent = '*';
                mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

                // семя ничего не тратит будучи семенем (разве что по нему может проходить урон)
            }
            if(mapCell[i][j][2] === 7){ // если тип клетки - ближник
                if(mapCell[i][j][4] === 0){
                    // счетчики
                    factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
                    factCounters[mapCell[i][j][3]][4] += 1; // кол-во боевых клеток

                    // графика
                    mapTable.rows[i].cells[j].textContent = 'б';
                    mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

                    // хп, энергия и прочее
                    mapCell[i][j][1] = mapCell[i][j][1] - energyConsumWar; // трата энергии в ход
                    if(mapCell[i][j][1] <= 0){
                        mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
                    }
                    cellDeath(i, j, 1);

                    // механики
                    if(mapCell[i][j][1] >= energyToMeleeCombat){ // если хватает энергии для атаки
                        mapCell[i][j][1] = mapCell[i][j][1] - energyToMeleeCombat; // тратим энергию за атаку
                        for(let a = 0; a < 3; a++){
                            for(let b = 0; b < 3; b++){
                                if(i-1+a >= 0 && i-1+a < mapH && j-1+a >= 0 && j-1+a < mapH && mapCell[i-1+a][j-1+a][2] != 0 && mapCell[i-1+a][j-1+a][3] != mapCell[i][j][3]){ // если не выходит за карту, атакуемая клетка не пустая и атакуемая клетка другой фракции
                                    mapCell[i-1+a][j-1+a][0] = mapCell[i-1+a][j-1+a][0] - damageOfMeleeCombat; // то наносим урон
                                }
                            }
                        }
                    }
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 8){ // если тип клетки - дальник
                if(mapCell[i][j][4] === 0){
                    // счетчики
                    factCounters[mapCell[i][j][3]][2] += 1; // кол-во клеток принадлежащих фракции
                    factCounters[mapCell[i][j][3]][4] += 1; // кол-во боевых клеток

                    // графика
                    mapTable.rows[i].cells[j].textContent = '#';
                    mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

                    // хп, энергия и прочее
                    mapCell[i][j][1] = mapCell[i][j][1] - energyConsumWar; // трата энергии в ход
                    if(mapCell[i][j][1] <= 0){
                        mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
                    }
                    cellDeath(i, j, 1);

                    // механики
                    if(mapCell[i][j][1] >= energyToDistantCombat){ // если хватает энергии для атаки
                        let attackDirect = rand(0, 3);
                        if(attackDirect === 0){ // стреляем налево
                            let stopper = 0;
                            let distant = 1;
                            while(stopper === 0){
                                if(j-distant < 0 || mapCell[i][j-distant][2] != 0){ // если следующая клетка за картой или она не пустая
                                    if(j-distant < 0){ // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    if(mapCell[i][j-distant][3] === mapCell[i][j][3]){ // если клетка нашей фракции - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    // теперь же, когда мы уверены что клетка есть и она не нашей фракции
                                    mapCell[i][j][1] = mapCell[i][j][1] - energyToDistantCombat; // вычитаем энергию за выстрел
                                    mapCell[i][j-distant][0] = mapCell[i][j-distant][0] - damageOfDistantCombat; // наносим урон
                                    for(let a = 1; a < distant; a++){
                                        mapTable.rows[i].cells[j-a].textContent = '<'; // рисуем красивую полосу стрельбы
                                        mapTable.rows[i].cells[j-a].style.color = fractionColors[mapCell[i][j][3]];
                                    }
                                }
                                distant++;
                            }
                        }
                        if(attackDirect === 1){ // стреляем вперед
                            let stopper = 0;
                            let distant = 1;
                            while(stopper === 0){
                                if(i-distant < 0 || mapCell[i-distant][j][2] != 0){ // если следующая клетка за картой или она не пустая
                                    if(i-distant < 0){ // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    if(mapCell[i-distant][j][3] === mapCell[i][j][3]){ // если клетка нашей фракции - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    // теперь же, когда мы уверены что клетка есть и она не нашей фракции
                                    mapCell[i][j][1] = mapCell[i][j][1] - energyToDistantCombat; // вычитаем энергию за выстрел
                                    mapCell[i-distant][j][0] = mapCell[i-distant][j][0] - damageOfDistantCombat; // наносим урон
                                    for(let a = 1; a < distant; a++){
                                        mapTable.rows[i-a].cells[j].textContent = '^'; // рисуем красивую полосу стрельбы
                                        mapTable.rows[i-a].cells[j].style.color = fractionColors[mapCell[i][j][3]];
                                    }
                                }
                                distant++;
                            }
                        }
                        if(attackDirect === 2){ // стреляем направо
                            let stopper = 0;
                            let distant = 1;
                            while(stopper === 0){
                                if(j+distant >= mapW || mapCell[i][j+distant][2] != 0){ // если следующая клетка за картой или она не пустая
                                    if(j+distant >= mapW){ // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    if(mapCell[i][j+distant][3] === mapCell[i][j][3]){ // если клетка нашей фракции - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    // теперь же, когда мы уверены что клетка есть и она не нашей фракции
                                    mapCell[i][j][1] = mapCell[i][j][1] - energyToDistantCombat; // вычитаем энергию за выстрел
                                    mapCell[i][j+distant][0] = mapCell[i][j+distant][0] - damageOfDistantCombat; // наносим урон
                                    for(let a = 1; a < distant; a++){
                                        mapTable.rows[i].cells[j+a].textContent = '>'; // рисуем красивую полосу стрельбы
                                        mapTable.rows[i].cells[j+a].style.color = fractionColors[mapCell[i][j][3]];
                                    }
                                }
                                distant++;
                            }
                        }
                        if(attackDirect === 3){ // стреляем вниз
                            let stopper = 0;
                            let distant = 1;
                            while(stopper === 0){
                                if(i+distant >= mapH || mapCell[i+distant][j][2] != 0){ // если следующая клетка за картой или она не пустая
                                    if(i+distant >= mapH){ // если клетка за границей карты - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    if(mapCell[i+distant][j][3] === mapCell[i][j][3]){ // если клетка нашей фракции - просто прерываем цикл, выстрела не будет
                                        stopper = 1;
                                    }
                                    // теперь же, когда мы уверены что клетка есть и она не нашей фракции
                                    mapCell[i][j][1] = mapCell[i][j][1] - energyToDistantCombat; // вычитаем энергию за выстрел
                                    mapCell[i+distant][j][0] = mapCell[i+distant][j][0] - damageOfDistantCombat; // наносим урон
                                    for(let a = 1; a < distant; a++){
                                        mapTable.rows[i+a].cells[j].textContent = 'V'; // рисуем красивую полосу стрельбы
                                        mapTable.rows[i+a].cells[j].style.color = fractionColors[mapCell[i][j][3]];
                                    }
                                }
                                distant++;
                            }
                        }
                    }
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
        }
    }
}, speedOfUpd);


// ======== ФУНКЦИИ МЕХАНИК ========
function restorOfSprouts(fraction){ // функция-механика восстановления отростков
    let chanceOfTransform = rand(25, 50); // шанс преобразования в отросток рандомится от 25% до 50%

    for(let i = 0; i < mapH; i++){ // проходимся по всем элементам карты
        for(let j = 0; j < mapW; j++){
            // если клетка не пустая, не отросток, не стебель и не семя, и фракция соответствует
            if(mapCell[i][j][2] != 0 && mapCell[i][j][3] === fraction && mapCell[i][j][2] != 1 && mapCell[i][j][2] != 1 && mapCell[i][j][2] != 1){
                let isTransform = rand(0, 100);
                if(isTransform < chanceOfTransform){ // если выполняется шанс
                    mapCell[i][j][2] = 1; // меняем клетку на стебель
                    mapCell[i][j][1] = mapCell[i][j][1] + plusEnergyIfTransIntoSprout; // прибавляем доп. энергию при трансформации
                    mapCell[i][j][10] = rand(0, 32); // устанавливаем случайный номер генома в массиве функции
                }
            }
        }
    }
}

function whatAboutTactic(fraction){ // функция-механика для смен/поддержания тактик
    if(fraction === 1){ // если фракция - эксы
        // "аварийные тактики"
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "насильственных" убийств
            tactRightNow[faction] = 2; // то выбираем тактику "война: ближний бой"
            return 0;
        }
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "не насильственных" убийств
            tactRightNow[faction] = 1; // то выбираем тактику "производство: добыча"
            return 0;
        }

        // "стабильные" тактики
        if(factCounters[fraction][3] / factCounters[fraction][5] <= minFactors[faction][4]){ // активен ли фактор соот. доб. и отр.
            tactRightNow[faction] = 1; // то выбираем тактику "производство: добыча"
            return 0;
        }
        if(factCounters[fraction][2] <= minFactors[faction][2]){ // активен ли фактор кол-ва клеток для фракции
            tactRightNow[faction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }

        let randFact = rand(0, 1); // рандом 50 на 50
        if(randFact === 0){
            if(factCounters[fraction][3] / factCounters[fraction][4] <= minFactors[faction][3]){ // активен ли фактор соот. доб. и боев.
                tactRightNow[faction] = 1; // то выбираем тактику "производство: добыча"
                return 0;
            }
            if(factCounters[fraction][4] / factCounters[fraction][6] <= minFactors[faction][5]){ // активен ли фактор соот. боев. и мир.
                tactRightNow[faction] = 2; // то выбираем тактику "война: ближний бой"
                return 0;
            }
        }
        if(randFact === 1){
            tactRightNow[faction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }
    }
    if(fraction === 2){ // если фракция - качественники
        // "аварийные тактики"
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "насильственных" убийств
            tactRightNow[faction] = 3; // то выбираем тактику "война: ближний бой"
            return 0;
        }
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "не насильственных" убийств
            tactRightNow[faction] = 1; // то выбираем тактику "производство: производство"
            return 0;
        }

        // "стабильные" тактики
        if(factCounters[fraction][3] / factCounters[fraction][5] <= minFactors[faction][4]){ // активен ли фактор соот. доб. и отр.
            tactRightNow[faction] = 1; // то выбираем тактику "производство: производство"
            return 0;
        }
        if(factCounters[fraction][2] <= minFactors[faction][2]){ // активен ли фактор кол-ва клеток для фракции
            tactRightNow[faction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }

        let randFact = rand(0, 100); // рандом ста процентов
        if(randFact < 40){
            if(factCounters[fraction][3] / factCounters[fraction][4] <= minFactors[faction][3]){ // активен ли фактор соот. доб. и боев.
                tactRightNow[faction] = 1; // то выбираем тактику "производство: производство"
                return 0;
            }
            if(factCounters[fraction][4] / factCounters[fraction][6] <= minFactors[faction][5]){ // активен ли фактор соот. боев. и мир.
                tactRightNow[faction] = 2; // то выбираем тактику "война: дальний бой"
                return 0;
            }
        }
        else if(randFact < 80){
            tactRightNow[faction] = 4; // то выбираем тактику "развитие"
            return 0;
        }
        else{
            tactRightNow[faction] = 0; // то выбираем тактику "экспансия"
            return 0;
        }
    }
    if(fraction === 3){ // если фракция - кочевники
        // "аварийные тактики"
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "насильственных" убийств
            tactRightNow[faction] = 1; // то выбираем тактику "миграция"
            return 0;
        }
        if(factCounters[fraction][1] >= minFactors[faction][1]){ // активен ли фактор "не насильственных" убийств
            tactRightNow[faction] = 1; // то выбираем тактику "миграция"
            return 0;
        }

        // "стабильные" тактики
        // У КОЧЕВНИКОВ НЕТ СТАБИЛЬНЫХ ТАКТИК
    }
}


// ======== НАЧАЛЬНЫЕ ПАРАМЕТРЫ ========

// --- Тест №1 ---
/*mapCell[14][14][0] = hpPeaceCells;
mapCell[14][14][1] = maxEnerySprout;
mapCell[14][14][2] = 1;
mapCell[14][14][3] = 0;
mapCell[14][14][4] = 0;
mapCell[14][14][5] = 0;
mapCell[14][14][6] = 0;
mapCell[14][14][7] = 0;
mapCell[14][14][8] = 0;
mapCell[14][14][9] = -1;
mapCell[14][14][10] = 0;
mapCell[14][14][11] = 0;*/

// --- Тест №2 ---
/*for(let iT = 0; iT < 10; iT++){
    for(let jT = 0; jT < 10; jT++){
        mapCell[iT*4][jT*4][0] = hpPeaceCells;
        mapCell[iT*4][jT*4][1] = maxEnerySprout;
        mapCell[iT*4][jT*4][2] = 1;
        mapCell[iT*4][jT*4][3] = 0;
        mapCell[iT*4][jT*4][4] = 0;
        mapCell[iT*4][jT*4][5] = 0;
        mapCell[iT*4][jT*4][6] = 0;
        mapCell[iT*4][jT*4][7] = 0;
        mapCell[iT*4][jT*4][8] = 0;
        mapCell[iT*4][jT*4][9] = -1;
        mapCell[iT*4][jT*4][10] = rand(0, 31);
        mapCell[iT*4][jT*4][11] = 0;
    }
}*/

// --- Тест №3 ---
// фракция 1
let if1 = rand(0, mapH-1);
let jf1 = rand(0, mapW-1);
mapCell[if1][jf1][0] = hpPeaceCells;
mapCell[if1][jf1][1] = maxEnerySprout;
mapCell[if1][jf1][2] = 1;
mapCell[if1][jf1][3] = 0;
mapCell[if1][jf1][4] = 0;
mapCell[if1][jf1][5] = 0;
mapCell[if1][jf1][6] = 0;
mapCell[if1][jf1][7] = 0;
mapCell[if1][jf1][8] = 0;
mapCell[if1][jf1][9] = -1;
mapCell[if1][jf1][10] = rand(0, 31);
mapCell[if1][jf1][11] = 0;

// фракция 2
let if2 = rand(0, mapH-1);
let jf2 = rand(0, mapW-1);
mapCell[if2][jf2][0] = hpPeaceCells;
mapCell[if2][jf2][1] = maxEnerySprout;
mapCell[if2][jf2][2] = 1;
mapCell[if2][jf2][3] = 1;
mapCell[if2][jf2][4] = 0;
mapCell[if2][jf2][5] = 0;
mapCell[if2][jf2][6] = 0;
mapCell[if2][jf2][7] = 0;
mapCell[if2][jf2][8] = 0;
mapCell[if2][jf2][9] = -1;
mapCell[if2][jf2][10] = rand(0, 31);
mapCell[if2][jf2][11] = 0;

// фракция 3
let if3 = rand(0, mapH-1);
let jf3 = rand(0, mapW-1);
mapCell[if3][jf3][0] = hpPeaceCells;
mapCell[if3][jf3][1] = maxEnerySprout;
mapCell[if3][jf3][2] = 1;
mapCell[if3][jf3][3] = 2;
mapCell[if3][jf3][4] = 0;
mapCell[if3][jf3][5] = 0;
mapCell[if3][jf3][6] = 0;
mapCell[if3][jf3][7] = 0;
mapCell[if3][jf3][8] = 0;
mapCell[if3][jf3][9] = -1;
mapCell[if3][jf3][10] = rand(0, 31);
mapCell[if3][jf3][11] = 0;

// фракция 4
let if4 = rand(0, mapH-1);
let jf4 = rand(0, mapW-1);
mapCell[if4][jf4][0] = hpPeaceCells;
mapCell[if4][jf4][1] = maxEnerySprout;
mapCell[if4][jf4][2] = 1;
mapCell[if4][jf4][3] = 3;
mapCell[if4][jf4][4] = 0;
mapCell[if4][jf4][5] = 0;
mapCell[if4][jf4][6] = 0;
mapCell[if4][jf4][7] = 0;
mapCell[if4][jf4][8] = 0;
mapCell[if4][jf4][9] = -1;
mapCell[if4][jf4][10] = rand(0, 31);
mapCell[if4][jf4][11] = 0;