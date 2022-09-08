const axios = require('axios');

const gibdd = async (text) => {
    return new Promise((resolve, reject) => {
        const url = `https://api-cloud.ru/api/gibdd.php?type=gibdd&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        axios.get(url)
            .then(async (res) => {
                let response = "response:";
                if(res.data.found == true)
                {
                    let obj = [];
                    res.data.ownershipPeriod.forEach(element => {obj.push(`\n\n<b>Последняя регистрация:</b> ${element.lastOperation},\n <b>Информация о регистрации:</b> ${element.lastOperationInfo},\n <b>Тип владелец:</b> ${element.simplePersonType},\n <b>Расшифровка Тип владелец:</b> ${element.simplePersonTypeInfo},\n <b>Дата регистрации:</b> ${element.from},\n <b>Дата снятия с учета:</b> ${element.to},\n <b>Период владения:</b> ${element.period}`); return obj});
                    
                    let car = `\n<b>vin:</b> ${res.data.vehicle.vin},\n<b>Номер кузова:</b> ${res.data.vehicle.bodyNumber},\n<b>Номер двигателя:</b> ${res.data.vehicle.engineNumber},\n<b>Модель:</b> ${res.data.vehicle.model},\n<b>Цвет ТС:</b> ${res.data.vehicle.color},\n<b>Год ТС:</b> ${res.data.vehicle.year},\n<b>Рабочий объем (см³):</b> ${res.data.vehicle.engineVolume},\n<b>Мощность л.с.:</b> ${res.data.vehicle.powerHp},\n<b>Мощность кВт:</b> ${res.data.vehicle.powerKwt},\n<b>Категория ТС:</b> ${res.data.vehicle.category},\n<b>Тип ТС:</b> ${res.data.vehicle.type},\n<b>Расшифровка Тип ТС:</b> ${res.data.vehicle.typeinfo}\n`;

                    let passport = `\n<b>number:</b> ${res.data.vehiclePassport.number},\n<b>issue:</b> ${res.data.vehiclePassport.issue}\n`
                    let check = "Не подлежит утилизацию\n";
                    let utilization = "";
                    if(res.data.utilicazia == 1){
                        check = `Подлежит утилизации\n<b>Информация для утилизации:</b> ${JSON.stringify(res.data.utilicaziainfo)}\n`;
                    }
                    utilization = `<b>Утилизация:</b> ${check}\n`;
                    
                    response = `${utilization}<b>Машина:</b> ${car} \n\n<b>Пасспорт:</b> ${passport} \n\n<b>История регистрации:</b> ${obj}`;
                    console.log(response);
                }
                else
                {
                    response = res.data.message + " для проверки ГИБДД";
                }
                 resolve(response);
            })
            .catch((error) => console.log(error));
    });
}

const restrict = async (text) => {
    return new Promise((resolve,reject) => {
        const url = `https://api-cloud.ru/api/gibdd.php?type=restrict&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        const encodeurl = encodeURI(url);
        axios.get(encodeurl)
            .then(async (res) => {
                let response = "a";
                console.log("asfasfdsa");
                if(res.data.count > 0){
                    let obj = [];
                    res.data.records.forEach(element => {obj.push(`\n\n<b>Порядковый номер штрафа:</b> ${element.num},\n<b>Регион:</b> ${element.regname},\n<b>Основание ограничения:</b> ${element.osnOgr},\n<b>Ключ ГИБДД:</b> ${element.gid},\n<b>Год транспортного средства:</b> ${element.tsyear},\n<b>VIN транспортного средства:</b> ${element.tsVIN},\n<b>Дата наложения ограничения:</b> ${element.dateogr} \n<b>Вид ограничения:</b> ${element.ogrkod} \n<b>Расшифровка Вид ограничения:</b> ${element.ogrkodinfo} \n<b>Марка (модель) ТС:</b> ${element.tsmodel} \n<b>Номер кузова:</b> ${element.tsKuzov} \n<b>Срок окончания ограничения:</b> ${element.dateadd} \n<b>Телефон инициатора:</b> ${element.phone} \n<b>Кем наложено:</b> ${element.divtype} \n<b>Расшифровка Кем наложено:</b> ${element.divtypeinfo} `); return obj});
                    response = `<b>Количество ограничений:</b> ${res.data.count}\n<b>Записи:</b> ${obj}`;
                }
                else{
                    response = res.data.message;
                }
                 resolve(response);
            })
            .catch((error) => console.log(error));
    });
}

const dtp = async (text) => {
    return new Promise((resolve,reject) => {
        const url = `https://api-cloud.ru/api/gibdd.php?type=dtp&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        // const encodeurl = encodeURI(url);
        axios.get(url)
            .then(async (res) => {
                let response = "";
                if(res.data.count > 0){
                    let obj = [];
                    res.data.records.forEach(element => {obj.push(`\n\n<b>Номер ДТП:</b> ${element.num},\n <b>Дата ДТП:</b> ${element.AccidentDateTime},\n <b>Повреждения:</b> ${element.VehicleDamageState},\n <b> Номер инцидента</b> ${element.AccidentNumber},\n <b>Тип:</b> ${element.AccidentType},\n <b>Описание инцидента:</b> ${element.DamageDestription},\n <b>Марка ТС:</b> ${element.VehicleMark} \n <b> Год выпуска ТС:</b> ${element.VehicleYear} \n <b>Место ДТП:</b> ${element.AccidentPlace} \n <b>Модель ТС:</b> ${element.VehicleModel} \n <b> Владелец:</b> ${element.OwnerOkopf} \n <b>Регион владения:</b> ${element.RegionName} \n <b>Нанесенный ущерб:</b> \n <b>Изображение ущерба:</b> ${element.DamagePointsSVG} \n <b> Изображение ущерба + описание:</b> ${element.DamagePointsSVGdesc} `); return obj});
                    response = `<b> Количество ДТП:</b> ${res.data.count}\n <b>Записи:</b> ${obj}`;
                }
                else{
                    response = "Участие в дорожно-транспортных происшествиях не найдено";
                }
                 resolve(response);
            })
            .catch((error) => console.log(error));
    });
}

const wasted = async (text) => {
    return new Promise((resolve,reject) => {
        const url = `https://api-cloud.ru/api/gibdd.php?type=wanted&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        // const encodeurl = encodeURI(url);
        axios.get(url)
            .then(async (res) => {
                let response = "";
                if(res.data.count > 0){
                    let obj = [];
                    res.data.records.forEach(element => {obj.push(`\n\n<b>Номер ареста:</b> ${element.num},\n <b>Регион инициатора розыска:</b> ${element.AccidentDateTime},\n <b>Номер кузова:</b> ${element.VehicleDamageState},\n <b> Марка (модель) ТС</b> ${element.AccidentNumber},\n <b>Дата постоянного учета в розыске:</b> ${element.AccidentType},\n <b>VIN ТС:</b> ${element.DamageDestription},\n <b>Год ТС:</b> ${element.VehicleMark} \n `); return obj});
                    response = `<b>🚨🚨🚨Количество в розыске:</b> ${res.data.count}\n <b>Записи:</b> ${obj}`;
                }
                else{
                    response = res.data.message;
                }
                 resolve(response);
            })
            .catch((error) => console.log(error));
    });
}

let vin = async (text) => {
    return new Promise((resolve, reject) => {
        let response = "response: ";
        const url = `https://api-cloud.ru/api/vindecoder.php?type=vin&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        axios.get(url)
        .then(async (res) => {
            response = `👮👮👮\n<b>Марка:</b> ${res.data.Make.value}\n<b>Модель:</b> ${res.data.Model.value}\n<b>Год:</b> ${res.data.Year.value}\n<b>Тип кузова:</b> ${res.data.Body.value}\n<b>Тип двигателя:</b> ${res.data.Engine.value}\n<b>Тип топлива:</b> ${res.data.Fuel.value}\n<b>Тип трансмиссии:</b> ${res.data.Transmission.value}\n<b>Класс авто:</b> ${res.data.classCar.value}\n<b>Тип авто:</b> ${res.data.typeCar.value}\n<b>Произведено в:</b> ${res.data.Manufactured.value}\n<b>Отличие кузова:</b> ${res.data.Body_type.value}\n<b>Количество дверей:</b> ${res.data.Number_doors.value}\n<b>Количество мест:</b> ${res.data.Number_seats.value}\n<b>Рабочий объем двигателя:</b> ${res.data.Displacement.value}\n<b>Объем двигателя:</b> ${res.data.Displacement_nominal.value}\n<b>Количество клапанов:</b> ${res.data.Engine_valves.value}\n<b>Количество цилиндров:</b> ${res.data.cylinders.value}\n<b>Механическая коробка передач:</b> ${res.data.gearbox.value}\n<b>Мощность л.с.:</b> ${res.data.HorsePower.value}\n<b>Мощность двигателя кВт:</b> ${res.data.KiloWatts.value}\n<b>Стандарт выбросов:</b> ${res.data.Emission_standard.value}\n<b>Трансмиссия:</b> ${res.data.Driveline.value}\n`;
            resolve(response);
        })
        .catch((error) => console.log(error));
    });
}

const gost = async (text) => {
    return new Promise((resolve,reject) =>{
        const url = `https://api-cloud.ru/api/gost.php?type=vin&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`
        let response;
        axios.get(url)
            .then(async (res) =>{
                if(res.data.count == 0){
                    response = res.data.message;
                }
                else{
                    response = `<b>Дата:</b> ${res.data.date}\n<b>Организатор:</b> ${res.data.organizator}\n<b>Марка:</b> ${res.data.marka}\n<b>Namets:</b> ${res.data.namets}\n<b>Причины:</b> ${res.data.reasons}\n<b>Рекомандации:</b> ${recommendation}\n`
                }
                resolve(response);
            })
            .catch((error) => {
                console.log(error);
            });
    });
}

module.exports = {
    vin,
    gibdd,
    gost,
    restrict,
    dtp,
    wasted
}

// JTMHT05J505009419