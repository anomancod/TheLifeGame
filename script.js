// ======== НАЧАЛЬНЫЕ ОБЪЯВЛЕНИЯ ========
const tableCon = document.getElementById('tableCon');
let mapTable = document.createElement('table');

let speedOfUpd = 500; // скорость обновления карты

const mapH = 48; // высота карты(таблицы)
const mapW = 48; // ширина карты(таблицы)

for(let i = 0; i < mapH; i++){
    const row = document.createElement('tr');
    for(let j = 0; j < mapW; j++){
        const cell = document.createElement('td');
        cell.textContent = '';
        cell.style.border = '1px solid black';
        cell.style.height = '15px';
        cell.style.width = '15px';
        cell.style.textAlign = 'center';
        cell.style.padding = '0px';
        cell.style.borderColor = 'black';
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

// пустая клетка
const emptyCell = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// ======== КОНСТАНТЫ ========
const hpPeaceCells = 100; // нач. и макс. ХП мирных клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpWarCells = 250; // нач. и макс. ХП боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpPlusPerTurn = 5; // восстановление хп в ход {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyForCmdRestHp = 20; // трата энергии на восстановление ХП в cmd функции {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const rateHpRestInCmd = 2; // коэффицент восполнения ХП в cmd функции (на это число будет делится макс. ХП клетки) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpMinusPerTurnAtMinusEnergy = 20; // кол-во ХП отнимаемое в ход при энергии меньшей или равной 0 {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const maxEneryTrans = 1000; // макс. энергия стебля (транспортной клетки) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEnerySprout = 500; // макс. энергия отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEneryWar = 500; // макс. энергия боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyToCreateSprout = 25; // кол-во энергии для создания отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateManaMiner = 25; // кол-во энергии для создания манновика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateOrgMiner = 25; // кол-во энергии для создания органика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateEnerMiner = 25; // кол-во энергии для создания энергика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateMeleeFighter = 25; // кол-во энергии для создания ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateDistantFighter = 25; // кол-во энергии для создания дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyConsumSprout = 10; // потребление энергии в ход отростком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyConsumTrans = 5; // потребление энергии в ход стеблем (странспортной клеткой) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyConsumWar = 15; // потребление энергии в ход боевой клеткой {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
// добывающие клетки не тратят энергии

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

const energyTransferPerTurn = 150; // энергия передаваемая стеблем (транспортной клеткой) в ход {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyMinePerTurn = 200; // энергия добывающаяся в ход энергиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
// трата энергии в почве = вырабатке энергии энергиком
const energyFromOrgPerTurn = 300; // энергия добывающаяся в ход органиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const orgForEnerPerTurn = 200; // кол-во органики тратящейся органиком для производства энергии в ход {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const manaEnergyPerTurn = 100; // кол-во энергии из манны добывающаяся манновиком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}


// ======== МАССИВЫ ДАННЫХ ========

// 3X массив: клетки ([mapH]x[mapW]x[11])
const mapCell = [];
for(let i = 0; i < mapH; i++){
    const r0 = [];
    for(let j = 0; j < mapW; j++){
        const r1 = [];
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
            r1.push(0);
        }
        r0.push(r1);
    }
    mapGround.push(r0);
}

// 3X массив: геномы ([countOfFractions]x[countOfGenoms]x[14])
const genoms = [];
let countOfFractions = 1; // кол-во фракций
let countOfGenoms = 32; // кол-во геномов во фракциях
for(let i = 0; i < countOfFractions; i++){
    const r0 = [];
    for(let j = 0; j < countOfGenoms; j++){
        const r1 = [];
        for(let t = 0; t < 15; t++){
            r1.push(0);
            // здесь нужно сделать рандом от 0 до 255 включительно, пока пускай везде просто будет 0
        }
        r0.push(r1);
    }
    mapCell.push(r0);    
}

// 1X массив: if-ые функции генома ([функции])
const ifFunc = [ifEnergyRise, ifEnerInGroundMoreOrg, ifObsracleFront, ifObsracleLeft, ifObsracleRight, ifNotObsracle, ifOrgRightMoreOrgLeft, ifOrgLeftMoreOrgRight, ifOrgFrontMoreOrgLeft, ifOrgFrontMoreOrgRight, ifOrgInGroundMoreP2, ifOrgInGround3x3MoreP18, ifRandom0to255MoreP, ifEnemyNear, ifHPCellLessP12];
// ^^^ объявляем массив для if-функций ^^^

// 1X массив: cmd-ые функции генома ([функции])
const cmdFunc = [cmdSkipTurn, cmdTransformIntoSeed, cmdTransformIntoSeedAndMove, cmdMoveEnerInGroundLeft, cmdMoveEnerInGroundRight, cmdMoveEnerInGroundFront, cmdMoveOrgInGroundLeft, cmdMoveOrgInGroundRight, cmdMoveOrgInGroundFront, cmdTransformEnerIntoOrg3x3, cmdRestHP];
// ^^^ объявляем массив для cmd-функций ^^^

// 1X массив: цвета фракций ([цвета{кол-во = кол-ву фракций; индекс цвета = индекс фракции}])
const fractionColors = ['red', 'blue', 'green', 'yellow']

// ======== ФУНКЦИИ ГЕНОМА ========

// главная функкция генома
function mainGenome(i, j){
    let gen = genoms[mapCell[i][j][3]][mapCell[i][j][10]]; // берем строчку-ген
    if(gen[3] > 104 && gen[5] > 104){ // если 2 условия не заданы
        for(let a = 0; a < 3; a++){ // повторяем 3 раза (0, 1, 2; для каждой стороны)
            if(gen[0+a] < 95){ // если ответвление есть
                if(gen[0+a] < 30){ // *отросток
                    createSprout(i, j, a);
                }
                if(gen[0+a] < 45){ // *манновик
                    createManaMiner(i, j, a);
                }
                if(gen[0+a] < 60){ // *органик
                    createOrgMiner(i, j, a);
                }
                if(gen[0+a] < 75){ // *энергик
                    createEnerMiner(i, j, a);
                }
                if(gen[0+a] < 85){ // *ближняя боевая клетка
                    createMeleeFighter(i, j, a);
                }
                if(gen[0+a] < 95){ // *дальняя боевая клетка
                    createDistantFighter(i, j, a);
                }
            }
        }
    }
    if(gen[3] < 105 || gen[5] < 105){ // если хотя бы одно из условий задано
        if(gen[3] < 105){ // если первое условие задано
            let resFirstIf = ifFunc[Math.ceil(gen[3]/7) - 1](i, j, gen[4]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
        }
        if(gen[5] < 105){ // если второе условие задано
            let resSecondIf = ifFunc[Math.ceil(gen[3]/7) - 1](i, j, gen[5]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - не выпол., 1 - выпол.)
        }

        if(resFirstIf + resSecondIf === 2){ // если 2 условия выполнились
            if(gen[9] < 33) { // если первая команда задана
                cmdFunc[Math.ceil(gen[9]/3) - 1](i, j);
                let resRa = rand(0, 1);
                if(resRa === 0){
                    mapCell[i][j][10] = Math.ceil(gen[10]/32 - 1); // меняем номер строчки-гена
                }
                else{
                    mapCell[i][j][10] = Math.ceil(gen[11]/32 - 1); // меняем номер строчки-гена
                }
            }
            else{ // если первая команда не задана
                mapCell[i][j][10] = Math.ceil(gen[7]/32 - 1); // меняем номер строчки-гена
            }
        }
        else{ // если хотя бы одно условие не выполнилось
            if(gen[12] < 33) { // если вторая команда задана
                cmdFunc[Math.ceil(gen[12]/3) - 1](i, j);
                let resRa = rand(0, 1);
                if(resRa === 0){
                    mapCell[i][j][10] = Math.ceil(gen[13]/32 - 1); // меняем номер строчки-гена
                }
                else{
                    mapCell[i][j][10] = Math.ceil(gen[14]/32 - 1); // меняем номер строчки-гена
                }
            }
        }
    }
}

// --- строительные функции ---
function specifyDirect(i, j, direct){ // вспомогательная функция выбирающее направление (direct: 0 - слева; 1 - спереди; 2 - справа;)
    let rightDirect; // 0 - слева; 1 - сверху; 2 - справа; 3 - снизу;
    if(mapCell[i][j][9] != -1){ // если есть родитель
        if(mapCell[i][j][9] === 0){ // если родитель слева
            if(direct === 0 && i != 0){
                return i - 1, j, 3, 1;
            }
            else{
                isBreak = 1;
            }
            if(direct === 1 && j != mapW){
                return i, j + 1, 0, 2;
            }
            if(direct === 2 && i != mapH){
                return i + 1, j, 1, 3;
            }
        }
        if(mapCell[i][j][9] === 1){ // если родитель спереди
            if(direct === 0 && j != mapW){
                return i, j + 1, 0, 2;
            }
            if(direct === 1 && i != mapH){
                return i + 1, j, 1, 3;
            }
            if(direct === 2 && j != 0){
                return i, j - 1, 2, 0;
            }
        }
        if(mapCell[i][j][9] === 2){ // если родитель справа
            if(direct === 0 && i != mapH){
                return i + 1, j, 1, 3;
            }
            if(direct === 1 && j != 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 2 && i != 0){
                return i - 1, j, 3, 1;
            }
        }
        if(mapCell[i][j][9] === 3){ // если родитель сзади
            if(direct === 0 && j != 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 1 && i != 0){
                return i - 1, 3, 1, 3;
            }
            if(direct === 2 && j != mapW){
                return i, j + 1, 0, 2;
            }
        }
    }
    else{ // если нет родителя
        let randPer = rand(0, 3);
        if(randPer === 0){ // если родитель слева
            if(direct === 0 && i != 0){
                return i - 1, j, 3, 1;
            }
            if(direct === 1 && j != mapW){
                return i, j + 1, 0, 2;
            }
            if(direct === 2 && i != mapH){
                return i + 1, j, 1, 3;
            }
        }
        if(randPer === 1){ // если родитель спереди
            if(direct === 0 && j != mapW){
                return i, j + 1, 0, 2;
            }
            if(direct === 1 && i != mapH){
                return i + 1, j, 1, 3;
            }
            if(direct === 2 && j != 0){
                return i, j - 1, 2, 0;
            }
        }
        if(randPer === 2){ // если родитель справа
            if(direct === 0 && i != mapH){
                return i + 1, j, 1, 3;
            }
            if(direct === 1 && j != 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 2 && i != 0){
                return i - 1, j, 3, 1;
            }
        }
        if(randPer === 3){ // если родитель сзади
            if(direct === 0 && j != 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 1 && i != 0){
                return i - 1, 3, 1, 3;
            }
            if(direct === 2 && j != mapW){
                return i, j + 1, 0, 2;
            }
        }
    }

    return -1; // возвращает -1 в случае если нужная клетка находится за границами карты
}

function createSprout(i, j, direct){ // создание отростка
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии

    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){ // если координата создаваемой клетки пуста
        if(mapCell[i][j][1] >= energyToCreateSprout){ // если хватает энергии для создания отростка
            mapCell[iC][iC][2] = 1; // изменяем тип клетки на отросток
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateSprout; // вычитаем энергию на создание
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3); // передаем созданному отростку треть энергии
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3); // вычитаем переданную энергию
            mapCell[iC][jC][4] = 1; // устанавливаем чтобы клетка не компилировалась в этом ходу
            mapCell[iC][jC][9] = directOfParent; // устанавливаем для создаваемой клетки направление к родителю

            mapCell[i][j][2] = 2; // меняем данную клетку на стебель
            mapCell[i][j][energyTo + 5] = 1; // передаем энергию по указанному направлению
        }

    }
}

function createManaMiner(i, j, direct){ // создание манновика
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateManaMiner){
            mapCell[iC][iC][2] = 3;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateManaMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createOrgMiner(i, j, direct){ // создание органика
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateOrgMiner){
            mapCell[iC][iC][2] = 4;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateOrgMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createEnerMiner(i, j, direct){ // создание энергика
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateEnerMiner){
            mapCell[iC][iC][2] = 5;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateEnerMiner;
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;
            mapCell[iC][jC][directOfParent+5] = 1; // добывающая клетка передает энергию в сторону родителя

            mapCell[i][j][2] = 2;
        }
    }
}

function createMeleeFighter(i, j, direct){ // создание ближника
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateMeleeFighter){
            mapCell[iC][iC][2] = 7;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateMeleeFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

function createDistantFighter(i, j, direct){ // создание дальника
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateDistantFighter){
            mapCell[iC][iC][2] = 8;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateDistantFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 1;
            mapCell[iC][jC][9] = directOfParent;

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

// --- if-ые функции ---
function ifEnergyRise(i, j){ // если кол-во энергии клетки растет
    if(mapCell[i][j][11] < mapCell[i][j][1]){ // если энергии в предыдущий ход больше чем энергии в этот ход
        return 1;
    }
    else{
        return 0;
    }
}

function ifEnerInGroundMoreOrg(i, j){ // если энергии в почве больше чем органики
    if(mapGround[i][j][0] > mapGround[i][j][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifObsracleFront(i, j){ // если препятствие спереди
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 1);

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
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 0);
    
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
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 2);
    
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
    if(mapCell[i][j][9] === -1 || mapCell[i][j][9] === 3){ // если родителя нет или он располагается снизу
        if(i != 0 && j != 0 && j != mapW && mapCell[i-1][j][2] === 0 && mapCell[i][j-1][2] === 0 && mapCell[i][j+1][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 0){ // если родитель слева
        if(i != 0 && j != 0 && j != mapW && mapCell[i][j+1][2] === 0 && mapCell[i-1][j][2] === 0 && mapCell[i+1][j][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 1){ // если родитель спереди
        if(i != 0 && j != 0 && j != mapW && mapCell[i+1][j][2] === 0 && mapCell[i][j+1][2] === 0 && mapCell[i][j-1][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
    if(mapCell[i][j][9] === 2){ // если родитель справа
        if(i != 0 && j != 0 && j != mapW && mapCell[i][j-1][2] === 0 && mapCell[i-1][j][2] === 0 && mapCell[i+1][j][2] === 0){
            return 1;
        }
        else{
            return 0;
        }
    }
}

function ifOrgRightMoreOrgLeft(i, j){ // если органики справа больше чем органики слева
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 0);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let iCq;
    let jCq;
    iCq, jCq = specifyDirect(i, j, 2);
    
    if(iCq === -1) // если клетка за границами карты, прерываем функцию
        return -1;
    
    if(mapGround[iC][jC][1] > mapGround[iCq][jCq][1]){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgLeftMoreOrgRight(i, j){ // если органики слева больше чем органики справа
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 0);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let iCq;
    let jCq;
    iCq, jCq = specifyDirect(i, j, 2);
    
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
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 1);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let iCq;
    let jCq;
    iCq, jCq = specifyDirect(i, j, 0);
    
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
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 1);
    
    if(iC === -1) // если клетка за границами карты, прерываем функцию
        return -1;

    let iCq;
    let jCq;
    iCq, jCq = specifyDirect(i, j, 2);
    
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
    if(mapGround[i][j][2] > P*2){
        return 1;
    }
    else{
        return 0;
    }
}

function ifOrgInGround3x3MoreP18(i, j, P){ // если органики в почве в квадрате 3x3 больше чем P * 18
    if(i != 0 && i != mapH && j != 0 && j != mapW){
        orgIn3x3 = mapGround[i-1][j-1][2] + mapGround[i-1][j][2] + mapGround[i-1][j+1][2] + mapGround[i][j-1][2] + mapGround[i][j][2] + mapGround[i][j+1][2] + mapGround[i+1][j-1][2] + mapGround[i+1][j][2] + mapGround[i+1][j+1][2];
        if(orgIn3x3 > P * 18){
            return 1;
        }
        else{
            return 0;
        }
    }
}

function ifRandom0to255MoreP(i, j, P){ // если рандомное число от 0 до 255 больше P
    if(rand(0, 255) > P){
        return 1;
    }
    else{
        return 0;
    }
} 

function ifEnemyNear(i, j){ // если в соседней клетке есть враг
    let counter = 0;
    if(i != 0 && j != 0 && mapCell[i-1][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != 0 && mapCell[i-1][j][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != 0 && j != mapW && mapCell[i-1][j+1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(j != 0 && mapCell[i][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(j != mapW && mapCell[i][j+1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH && j != 0 && mapCell[i+1][j-1][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH && mapCell[i+1][j][3] != mapCell[i][j][3]){
        counter = 1;
    }
    if(i != mapH && j != mapW && mapCell[i+1][j+1][3] != mapCell[i][j][3]){
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
    if(mapCell[i][j][0] < P / 2){
        return 1;
    }
    else{
        return 0;
    }
}

// --- cmd-ые функции ---
function cmdSkipTurn(i, j){ // пропустить ход
    mapCell[i][j][4] = 1;
}

function cmdTransformIntoSeed(i, j){ // превратиться в семечко
    if(mapCell[i][j][1] > energyToTransformIntoSeed){
        mapCell[i][j][1] = mapCell[i][j][1] - energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);
    }
}

function cmdTransformIntoSeedAndMove(i, j){ // превратится в семечко и переместиться
    if(mapCell[i][j][1] > energyToTransformIntoSeed){
        mapCell[i][j][1] = mapCell[i][j][1] - energyToTransformIntoSeed;
        mapCell[i][j][2] = 6;
        mapCell[i][j][9] = -1;
        mapCell[i][j][4] = rand(minTurnsAsSeed, maxTurnsAsSeed);

        let moveDirection = rand(0, 3);
        let maxMove = rand(1, 32);
        if(moveDirection === 0){
            for(let a = 1; a < maxMove; a++){
                if(j < a || mapCell[i][j-a][2] != 0){
                    if(mapCell[i][j][1] > a * rateEnergyToMoveSeedByCell){
                        map[i][j][1] = map[i][j][1] - a * rateEnergyToMoveSeedByCell;
                        mapCell[i][j-a+1] = mapCell[i][j]; // копируем (перемещаем) клетку на нужную позицию
                        mapCell[i][j] = emptyCell; // очищаем (приравниваем к пустой) клетку на прошлой позиции

                        break;
                    }
                }
            }
        }
        if(moveDirection === 1){
            for(let a = 1; a < maxMove; a++){
                if(i > a || mapCell[i+a][j][2] != 0){
                    if(mapCell[i][j][1] > a * rateEnergyToMoveSeedByCell){
                        map[i][j][1] = map[i][j][1] - a * rateEnergyToMoveSeedByCell;
                        mapCell[i+a-1][j] = mapCell[i][j]; // копируем (перемещаем) клетку на нужную позицию
                        mapCell[i][j] = emptyCell; // очищаем (приравниваем к пустой) клетку на прошлой позиции

                        break;
                    }
                }
            }
        }
        if(moveDirection === 2){
            for(let a = 1; a < maxMove; a++){
                if(j > a || mapCell[i][j+a][2] != 0){
                    if(mapCell[i][j][1] > a * rateEnergyToMoveSeedByCell){
                        map[i][j][1] = map[i][j][1] - a * rateEnergyToMoveSeedByCell;
                        mapCell[i][j+a-1] = mapCell[i][j]; // копируем (перемещаем) клетку на нужную позицию
                        mapCell[i][j] = emptyCell; // очищаем (приравниваем к пустой) клетку на прошлой позиции

                        break;
                    }
                }
            }
        }
        if(moveDirection === 3){
            for(let a = 1; a < maxMove; a++){
                if(i < a || mapCell[i-a][j][2] != 0){
                    if(mapCell[i][j][1] > a * rateEnergyToMoveSeedByCell){
                        map[i][j][1] = map[i][j][1] - a * rateEnergyToMoveSeedByCell;
                        mapCell[i-a+1][j] = mapCell[i][j]; // копируем (перемещаем) клетку на нужную позицию
                        mapCell[i][j] = emptyCell; // очищаем (приравниваем к пустой) клетку на прошлой позиции

                        break;
                    }
                }
            }
        }
    }
}

function cmdMoveEnerInGroundLeft(i, j){ // переместить энергию из почвы налево
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 0);
    
    if(iC === -1)
        return -1;
    
    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundRight(i, j){ // переместить энергию из почвы направо
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 2);
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveEnerInGroundFront(i, j){ // переместить энергию из почвы вперёд
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 1);
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][0] = mapGround[iC][jC][0] + mapGround[i][j][0];
        mapGround[i][j][0] = 0;
    }
}

function cmdMoveOrgInGroundLeft(i, j){ // переместить органику из почвы налево
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 0);
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundRight(i, j){ // переместить органику из почвы направо
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 2);
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdMoveOrgInGroundFront(i, j){ // переместить органику из почвы вперёд
    let iC;
    let jC;
    iC, jC = specifyDirect(i, j, 1);
    
    if(iC === -1)
        return -1;

    if(mapCell[i][j][1] > energyForMoveEnerOrOrg){
        mapCell[i][j][1] = mapCell[i][j][1] - energyForMoveEnerOrOrg;
        mapGround[iC][jC][1] = mapGround[iC][jC][1] + mapGround[i][j][1];
        mapGround[i][j][1] = 0;
    }
}

function cmdTransformEnerIntoOrg3x3(i, j){ // преобразовать энергию в органику в квадрате 3x3
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

function cmdRestHP(i, j){ // восстановить ХП (половину)
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
const period = setInterval(() => {
    for(let i = 0; i < mapH; i++){ // проходимся по всем элементам массива
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
                if(mapCell[i][j][4] != 0){ // если компилируем клетку
                    mapTable.rows[i].cells[j].textContent = '@';
                    mapTable.rows[i].cells[j].style.color = fractionColors[mapCell[i][j][3]];

                    // вычет энергии, ХП клетки и проверка на смерть (если надо - смерть)
                    mapCell[i][j][1] = mapCell[i][j][1] - energyConsumSprout; // трата энергии в ход
                    if(mapCell[i][j][1] <= 0){
                        mapCell[i][j][0] = mapCell[i][j][0] - hpMinusPerTurnAtMinusEnergy; // отнимаем ХП за минусовую (или равную 0) энергию
                    }
                    if(mapCell[i][j][0] <= 0){ // если ХП клетки меньше или равно 0 (убиваем клетку)
                        // процедуры перед смертью клетки
                        if(i != 0 && mapCell[i-1][j][9] === 3){ // сверху
                            mapCell[i-1][j][9] === -1; // устанавливаем что нет родителя
                            mapCell[i-1][j][8] = 0; // передаем что энергию передавать более не надо
                        }
                        if(j != 0 && mapCell[i][j-1][9] === 3){ // слева
                            mapCell[i][j-1][9] === -1; // устанавливаем что нет родителя
                            mapCell[i-1][j][7] = 0; // передаем что энергию передавать более не надо
                        }
                        if(i != mapH && mapCell[i+1][j][9] === 3){ // снизу
                            mapCell[i+1][j][9] === -1; // устанавливаем что нет родителя
                            mapCell[i-1][j][6] = 0; // передаем что энергию передавать более не надо
                        }
                        if(j != mapW && mapCell[i][j+1][9] === 3){ // справа
                            mapCell[i][j+1][9] === -1; // устанавливаем что нет родителя
                            mapCell[i-1][j][5] = 0; // передаем что энергию передавать более не надо
                        }

                        mapGround[i][j][0] = mapGround[i][j][0] + mapCell[i][j][1]; // передаем почве энергию клетки
                        mapGround[i][j][1] = mapGround[i][j][1] + hpPeaceCells; // передаем почве органику равную макс. ХП данной клетки

                        mapCell[i][j] = emptyCell; // убиваем клетку
                    }

                    // механики клетки
                    mainGenome(i, j); // вызываем основную функцию генома
                }
                else{
                    mapCell[i][j][4] = mapCell[i][j][4] - 1; // если не компилируем - снижаем не компиляцию на 1
                }
            }
            if(mapCell[i][j][2] === 2){ // если тип клетки - стебель
                //
            }
            if(mapCell[i][j][2] === 3){ // если тип клетки - манновик
                //
            }
            if(mapCell[i][j][2] === 4){ // если тип клетки - органик
                //
            }
            if(mapCell[i][j][2] === 5){ // если тип клетки - энергик
                //
            }
            if(mapCell[i][j][2] === 6){ // если тип клетки - семя
                //
            }
            if(mapCell[i][j][2] === 7){ // если тип клетки - ближник
                //
            }
            if(mapCell[i][j][2] === 8){ // если тип клетки - дальник
                //
            }
        }
    }

    //for(let i = 0; i < mapH; i++){ ### ВЫНЕСТИ В 0-Й ШАГ ИТЕРАЦИИ КЛЕТКИ (ПРОВЕРКУ КОМПИЛЯЦИИ) ###
    //    for(let j = 0; j < mapW; j++){
    //        if(mapCell[i][j][4] != 0){
    //            mapCell[i][j][4] = mapCell[i][j][4] - 1; // возвращаем итерацию для следующего хода всех не итерируемых в этом ходу клеток и отбавляем таймер спячки для семян
    //        }
    //    }
    //}
}, speedOfUpd);