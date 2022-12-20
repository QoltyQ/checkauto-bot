const TelegramApi = require('node-telegram-bot-api');
const UserModel = require('./db');
const token = '5451607839:AAEp7E18xySiHJDcanCfiYerej926oAE9OE';

const bot = new TelegramApi(token, {polling: true})

const {vin, gibdd, restrict, gost, dtp, wasted, customs, zalog, eaisto} = require('./helpers');

const admin = "709029307";

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Полная информация', callback_data: 'vin'}]
        ]
    })
};

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Проверить еще раз', callback_data: '/again'}],
        ]
    })
}

const updateRequest = async (requestNumber,username) => {
    await UserModel.update(
        {
            requests: requestNumber,
        },
        {
            where: {userName: username}
        }
        );
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Отправьте к нам вин-код машины и получите информацию`);
}

const start = async () => {
    
    let isAdmin = false;
    let requestNumber = 0;
    let vinCode = '';

    bot.setMyCommands([
        {command: '/start', description: 'Запустить бота CheckAuto'},
        {command: '/info', description: 'Получить информацию о машине'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        let allow = 0;
        isAdmin = true ? chatId == admin : false;
        requestNumber = 0;
        
        if(text === '/start'){
            if(isAdmin){
                await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/5.webp");
                await bot.sendMessage(chatId,"Hello, Admin\nОтправь мне телефон номер или никнэйм пользователя, без @. Например: whoisadmin");
            } else {
                if(msg.chat.username === undefined){
                    console.log("s");
                    return bot.sendMessage(chatId, `Вы кажется не верифицированы, пожалуйста добавьте @username и свяжитесь с Админом @wayiwkimkeptur:)`);
                } else {
                    await UserModel.findOne( {where: { userName: msg.chat.username.toString() } } ).then(async (user) => {
                            user.update({chatId: chatId.toString()});
                            allow = 1;
                            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
                            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот Checkauto\nЗдесь вы сможете получить информацию о машине через вин-код. Чекавто проверяет юр. чистоту авто по данным РФ, (остальные страны, Корея, Америка, Дубай по запросу в личку админу)\n\nОтправьте /info боту чтобы узнать число остатки своих запросов')
                        }).catch(() => {
                            return bot.sendMessage(chatId, `Вы кажется не верифицированы, пожалуйста свяжитесь с Админом @wayiwkimkeptur:)`)  
                        })
                    }
                }
        }
        else if(text === '/info'){
            if(!isAdmin){
                if(msg.chat.username === undefined){
                    return bot.sendMessage(chatId, `Вы кажется не верифицированы, пожалуйста добавьте @username и свяжитесь с Админом @wayiwkimkeptur:)`);
                }
                await UserModel.findOne({where: {userName: msg.chat.username}})
                .then((user) => {
                    allow = 1;
                    if(user.requests > 0)
                        return bot.sendMessage(chatId, `Привет, у вас есть еще ${user.requests} число запросов. Если у вас заканчиваются запросы, свяжитесь с Админом - @wayiwkimkeptur\n\nА теперь можете отправить вин-код машины и выбрать услугу.`);
                    else{
                        return bot.sendMessage(chatId, `Привет, у вас кажется закончились число доступных запросов. Пожалуйста, свяжитесь с Админом @wayiwkimkeptur :).`);
                    }
                })
                .catch(() => {
                    return bot.sendMessage(chatId, `Я вас не нашел среди верифицированных пользователей:( Свяжитесь с Админом @wayiwkimkeptur :)`)
                });    
            }
            else {
                await UserModel.findAll().then((user) => console.log(user));
            }
        }
        else if(!text){
            return bot.sendMessage(chatId, `Я вас не понимаю, пожалуйста попробуйте позже`);
        } 
        else {
            let words = text.split(' ');
            if(words.length == 1){
                if(!isAdmin){
                    if(msg.chat.username === undefined){
                        return bot.sendMessage(chatId, `Вы кажется не верифицированы, пожалуйста добавьте @username и свяжитесь с Админом @wayiwkimkeptur:)`);
                    }
                    await UserModel.findOne({where: {userName: msg.chat.username}}).then((user) => {
                        allow = 1;
                        requestNumber = user.requests; 
                    }).catch(() => allow = 0);
                    if(text.length == 17){
                        if(allow){
                            if(requestNumber > 0){
                                // console.log(requestNumber)
                                await bot.sendMessage(chatId, "Выберите услугу", gameOptions);
                                vinCode = text;
                            } else{
                                await bot.sendMessage(chatId, "У вас кажется закончились число доступных запросов. Пожалуйста, свяжитесь с Админом @wayiwkimkeptur:)");
                            }
                        } else {
                            await bot.sendMessage(chatId, "Вы не верифицированы, пожалуйста свяжитесь с Админом @wayiwkimkeptur:)");
                        }
                    }
                    else if(text.length < 17)
                    {
                        console.log(allow)
                        if(allow)
                            await bot.sendMessage(chatId, "Проверьте свой вин код. Потому что,не хватает символов, вин код состоит из 17 символов")
                        else
                            await bot.sendMessage(chatId, "Вы не верифицированы, пожалуйста свяжитесь с Админом @wayiwkimkeptur:)")
                            
                        }
                    else {
                        if(allow)
                            await bot.sendMessage(chatId, "Проверьте свой вин код. Потому что,не хватает символов, вин код состоит из 17 символов")
                        else
                            await bot.sendMessage(chatId, "Вы не верифицированы, пожалуйста свяжитесь с Админом @wayiwkimkeptur:)")
                    }
                }
                else {
                    await UserModel.create({userName: text, isVerified: true, requests: 50}).then(async (user) => {
                        return bot.sendMessage(chatId, `Пользователь создан с верификацией: ${user.isVerified}, и с лимитом: ${user.requests}`);
                    }).catch((error) => console.log(error));
                }
            }   
            else{
                if(!isAdmin){
                    if(msg.chat.username == "undefined"){
                        return bot.sendMessage(chatId, `Вы кажется не верифицированы, пожалуйста добавьте @username и свяжитесь с Админом @wayiwkimkeptur:)`);
                    }
                    await UserModel.findOne({where: {userName: msg.chat.username}}).then((user) => {
                        allow = 1;
                        requestNumber = user.requests; 
                    }).catch(() => allow = 0);
                    if(allow)
                        await bot.sendMessage(chatId, "отправьте вин код без пробелов")
                    else 
                        await bot.sendMessage(chatId, "Вы не верифицированы, пожалуйста свяжитесь с Админом @wayiwkimkeptur:)");
                }
                else 
                    await bot.sendMessage(chatId, "отправьте username или номер без пробелов")
            }
        }
    })
    
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        let str = "";
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === "vin") {
            requestNumber--;
            await updateRequest(requestNumber,msg.message.chat.username);
            await bot.sendMessage(chatId,"Расшифруем вин-код, пожалуйста подождите");

            await vin(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });

            await bot.sendMessage(chatId,"Ищем информацию машины из ГИБДД, пожалуйста подождите");
            await gibdd(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,"Информация машины из ГИБДД")
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            
            await bot.sendMessage(chatId,"Ищем наличие ограничений машины, пожалуйста подождите");
            await restrict(vinCode).then(async (ans) => {
                    const max_size = 4096
                    var messageString = ans
                    var amount_sliced = messageString.length / max_size
                    var start = 0
                    var end = max_size
                    var message;
                    var messagesArray = []
                    for (let i = 0; i < amount_sliced; i++) {
                        message = messageString.slice(start, end)
                        await bot.sendMessage(chatId,message);
                        messagesArray.push(message)
                        start = start + max_size
                        end = end + max_size
                    }
                    
            });
            
            await bot.sendMessage(chatId,"Ищем участие в дорожно-транспортных происшествиях машины, пожалуйста подождите");
            await dtp(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            
            await bot.sendMessage(chatId,"Ищем информацию про нахождений в розыске машины, пожалуйста подождите");
            await wasted(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            
            await bot.sendMessage(chatId,"Проверяем диагностических карт, пробег");
            await eaisto(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });

            await bot.sendMessage(chatId,"Проверяем информацию от Отзывных компании");
            await gost(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });

            await bot.sendMessage(chatId,"Проверяем информацию о таможенном оформлении");
            await customs(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });    

            await bot.sendMessage(chatId,"Проверяем залоги");
            await zalog(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });

            if(requestNumber > 0)
                await bot.sendMessage(chatId,`Хотите проверить еще раз?`,againOptions);
            else
                await bot.sendMessage(chatId,`Ой у вас закончились число доступных запросов, свяжитесь с Админом @wayiwkimkeptur :)`);
        } 
    })
}


start();