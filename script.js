// ======== НАЧАЛЬНЫЕ ОБЪЯВЛЕНИЯ ========
const tableCon = document.getElementById('tableCon');
let mapTable = document.createElement('table');

let speedOfUpd = 500; // скорость обновления карты

const mapW = 48; // высота карты(таблицы)
const mapH = 48; // ширина карты(таблицы)

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


// ======== ХАРАКТЕРИСТИКИ КЛЕТОК ========
const hpPeaceCells = 100; // нач. и макс. HP мирных клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const hpWarCells = 250; // нач. и макс. HP боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const maxEneryTrans = 1000; // макс. энергия стебля (транспортной клетки) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEnerySprout = 500; // макс. энергия отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const maxEneryWar = 500; // макс. энергия боевых клеток {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyToCreateSprout = 25; // кол-во энергии для создания отростка {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateManaMiner = 25; // кол-во энергии для создания манновика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateOrgMiner = 25; // кол-во энергии для создания органика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateEnerMiner = 25; // кол-во энергии для создания энергика {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateMeleeFighter = 25; // кол-во энергии для создания ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToCreateDistantFighter = 25; // кол-во энергии для создания дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const enegyConsumSprout = 10; // потребление энергии в ход отростком {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const enegyConsumTrans = 5; // потребление энергии в ход стеблем (странспортной клеткой) {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyConsumWar = 15; // потребление энергии в ход боевой клеткой {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
// добывающие клетки не тратят энергии

// ОРГАНИКА ПРИ СМЕРТИ КЛЕТКИ РАВНА МАКС. ХП ЭТОЙ КЛЕТКИ

const energyToMeleeCombat = 50; // трата энергии на удар ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const energyToDistantCombat = 75; // трата энергии на выстрел дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const damageOfMeleeCombat = 25; // урон от удара ближника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}
const damageOfDistantCombat = 25; // урон от выстрела дальника {!!! ТЕСТОВОЕ ЗНАЧЕНИЕ !!!}

const energyToTransformIntoSeed = 100; // энергия для становления семенем

// ======== МАССИВЫ ДАННЫХ ========

// 3X массив: клетки ([mapH]x[mapW]x[10])
const mapCell = [];
for(let i = 0; i < mapH; i++){
    const r0 = [];
    for(let j = 0; j < mapW; j++){
        const r1 = [];
        for(let t = 0; t < 11; t++){
            r1.push(0);
        }
        r0.push(r1);
    }
    mapCell.push(r0);    
}

// 3X массив: почва ([mapH]x[mapW]x[1])
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
const ifFunc = []; // объявляем массив для if-функций

// 1X массив: cmd-ые функции генома ([функции])
const cmdFunc = []; // объявляем массив для cmd-функций


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
            let resFirstIf = ifFunc[Math.ceil(gen[3]/7) - 1](i, j, gen[4]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - выпол., 1 - не выпол.)
        }
        if(gen[5] < 105){ // если второе условие задано
            let resSecondIf = ifFunc[Math.ceil(gen[3]/7) - 1](i, j, gen[5]); // вызываем функций по нужному индексу и передаем коорд. с параметром и принимаем результат (0 - выпол., 1 - не выпол.)
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
            if(direct === 0){
                return i - 1, j, 3, 1;
            }
            if(direct === 1){
                return i, j + 1, 0, 2;
            }
            if(direct === 2){
                return i + 1, j, 1, 3;
            }
        }
        if(mapCell[i][j][9] === 1){ // если родитель спереди
            if(direct === 0){
                return i, j + 1, 0, 2;
            }
            if(direct === 1){
                return i + 1, j, 1, 3;
            }
            if(direct === 2){
                return i, j - 1, 2, 0;
            }
        }
        if(mapCell[i][j][9] === 2){ // если родитель справа
            if(direct === 0){
                return i + 1, j, 1, 3;
            }
            if(direct === 1){
                return i, j - 1, 2, 0;
            }
            if(direct === 2){
                return i - 1, j, 3, 1;
            }
        }
        if(mapCell[i][j][9] === 3){ // если родитель сзади
            rightDirect.push(0, 1, 2, 3);
            if(direct === 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 1){
                return i - 1, 3, 1, 3;
            }
            if(direct === 2){
                return i, j + 1, 0, 2;
            }
        }
    }
    else{ // если нет родителя
        let randPer = rand(0, 3);
        if(randPer === 0){ // если родитель слева
            if(direct === 0){
                return i - 1, j, 3, 1;
            }
            if(direct === 1){
                return i, j + 1, 0, 2;
            }
            if(direct === 2){
                return i + 1, j, 1, 3;
            }
        }
        if(randPer === 1){ // если родитель спереди
            if(direct === 0){
                return i, j + 1, 0, 2;
            }
            if(direct === 1){
                return i + 1, j, 1, 3;
            }
            if(direct === 2){
                return i, j - 1, 2, 0;
            }
        }
        if(randPer === 2){ // если родитель справа
            if(direct === 0){
                return i + 1, j, 1, 3;
            }
            if(direct === 1){
                return i, j - 1, 2, 0;
            }
            if(direct === 2){
                return i - 1, j, 3, 1;
            }
        }
        if(randPer === 3){ // если родитель сзади
            if(direct === 0){
                return i, j - 1, 2, 0;
            }
            if(direct === 1){
                return i - 1, 3, 1, 3;
            }
            if(direct === 2){
                return i, j + 1, 0, 2;
            }
        }
    }
}

function createSprout(i, j, direct){ // создание отростка
    let iC;
    let jC;
    let directOfParent;
    let energyTo;
    iC, jC, directOfParent, energyTo = specifyDirect(i, j, direct); // определяем кардинаты создаваемой клетки, направление родителя и направление для энергии

    if(mapCell[iC][jC][2] === 0){ // если координата создаваемой клетки пуста
        if(mapCell[i][j][1] >= energyToCreateSprout){ // если хватает энергии для создания отростка
            mapCell[iC][iC][2] = 1; // изменяем тип клетки на отросток
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateSprout; // вычитаем энергию на создание
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3); // передаем созданному отростку треть энергии
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3); // вычитаем переданную энергию
            mapCell[iC][jC][4] = 0; // устанавливаем чтобы клетка не компилировалась в этом ходу
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
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateManaMiner){
            mapCell[iC][iC][2] = 3;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateManaMiner;
            mapCell[iC][jC][4] = 0;
            mapCell[iC][jC][9] = directOfParent;

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
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateOrgMiner){
            mapCell[iC][iC][2] = 4;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateOrgMiner;
            mapCell[iC][jC][4] = 0;
            mapCell[iC][jC][9] = directOfParent;

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
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateEnerMiner){
            mapCell[iC][iC][2] = 5;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateEnerMiner;
            mapCell[iC][jC][4] = 0;
            mapCell[iC][jC][9] = directOfParent;

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
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateMeleeFighter){
            mapCell[iC][iC][2] = 7;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateMeleeFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 0;
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
    
    if(mapCell[iC][jC][2] === 0){
        if(mapCell[i][j][1] >= energyToCreateDistantFighter){
            mapCell[iC][iC][2] = 8;
            mapCell[i][j][1] = mapCell[i][j][1] - energyToCreateDistantFighter;
            mapCell[iC][iC][1] = Math.round(mapCell[i][j][1] / 3);
            mapCell[i][j][1] = mapCell[i][j][1] - Math.round(mapCell[i][j][1] / 3);
            mapCell[iC][jC][4] = 0;
            mapCell[iC][jC][9] = directOfParent;

            mapCell[i][j][2] = 2;
            mapCell[i][j][energyTo + 5] = 1;
        }
    }
}

// --- if-ые функции ---
function ifEnergyRise(i, j){ // если кол-во энергии клетки растет

}

// --- cmd-ые функции ---
// --


// ======== ГЛАВНЫЙ ЦИКЛ ========
const period = setInterval(() => {
    for(let i = 0; i < mapH; i++){ // проходимся по всем элементам массива
        for(let j = 0; j < mapW; j++)
        {
            if(mapCell[i][j][2] === 0){ // если тип клетки - пустая
                //
            }
            if(mapCell[i][j][2] === 1){ // если тип клетки - отросток
                //
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

    for(let i = 0; i < mapH; i++){
        for(let j = 0; j < mapW; j++){
            mapCell[i][j][4] = 1; // возвращаем итерацию для следующего хода всех не итерируемых в этом ходу клеток 
        }
    }
}, speedOfUpd);