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
                    res.data.ownershipPeriod.forEach(element => {obj.push(`"Последняя регистрация": ${element.lastOperation},\n "Информация о регистрации": ${element.lastOperationInfo},\n "Тип владелец": ${element.simplePersonType},\n "Расшифровка Тип владелец": ${element.simplePersonTypeInfo},\n "Дата регистрации": ${element.from},\n "Дата снятия с учета": ${element.to},\n "Период владения": ${element.period} \n\n`); return obj});
                    
                    let car = `\n"vin": ${res.data.vehicle.vin},\n"bodyNumber":${res.data.vehicle.bodyNumber},\n"engineNumber":${res.data.vehicle.engineNumber},\n"model":${res.data.vehicle.model},\n"color":${res.data.vehicle.color},\n"year":${res.data.vehicle.year},\n"engineVolume":"${res.data.vehicle.engineVolume}",\n"powerHp":${res.data.vehicle.powerHp},\n"powerKwt": ${res.data.vehicle.powerKwt},\n"category":${res.data.vehicle.category},\n"type":${res.data.vehicle.type},\n"typeinfo":${res.data.vehicle.typeinfo}\n`;

                    let passport = `\n"number": ${res.data.vehiclePassport.number},\n"issue": ${res.data.vehiclePassport.issue}\n`
                    
                    response = `Утилизация: ${JSON.stringify(res.data.utilicazia)}\n Утилизация: ${JSON.stringify(res.data.utilicaziainfo)}\n Машина: ${car} \n\n Пасспорт: ${passport} \n\n История регистрации: ${obj}}`;
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

let vin = async (text) => {
    return new Promise((resolve, reject) => {
        let response = "response: ";
        const url = `https://api-cloud.ru/api/vindecoder.php?type=vin&vin=${text}&token=a93da7c54a600fe89d6770f6f45ebf5b`;
        axios.get(url)
        .then(async (res) => {
            // console.log(res.data);
            response = ` Марка: ${res.data.Make.value}\n Модель: ${res.data.Model.value}\n Год: ${res.data.Year.value}\n Тип кузова: ${res.data.Body.value}\n Тип двигателя: ${res.data.Engine.value}\n Тип топлива: ${res.data.Fuel.value}\n Тип трансмиссии: ${res.data.Transmission.value}\n Класс авто: ${res.data.classCar.value}\n Тип авто: ${res.data.typeCar.value}\n Произведено в: ${res.data.Manufactured.value}\n Отличие кузова: ${res.data.Body_type.value}\n Количество дверей: ${res.data.Number_doors.value}\n Количество мест: ${res.data.Number_seats.value}\n Рабочий объем двигателя: ${res.data.Displacement.value}\n Объем двигателя: ${res.data.Displacement_nominal.value}\n Количество клапанов: ${res.data.Engine_valves.value}\n Количество цилиндров: ${res.data.cylinders.value}\n Механическая коробка передач: ${res.data.gearbox.value}\n Мощность л.с.: ${res.data.HorsePower.value}\n Мощность двигателя кВт: ${res.data.KiloWatts.value}\n Стандарт выбросов: ${res.data.Emission_standard.value}\n Трансмиссия: ${res.data.Driveline.value}\n `;
            // console.log("ADADAD");
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
                    response = `Дата: ${res.data.date}, \n Организатор: ${res.data.organizator},\n Марка: ${res.data.marka},\n Namets: ${res.data.namets}, \n Причины: ${res.data.reasons}, \n Рекомандации: ${recommendation}\n`
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
}

// JTMHT05J505009419