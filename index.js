const TelegramApi = require('node-telegram-bot-api');
const axios = require('axios');

const token = '5451607839:AAEp7E18xySiHJDcanCfiYerej926oAE9OE';

const bot = new TelegramApi(token, {polling: true})

const {vin, gibdd, restrict, gost, dtp, wasted} = require('./helpers');

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Расшифровка', callback_data: 'vin'}, {text: 'ГИБДД', callback_data: 'gibdd'} ],
            [{text: 'Отзывные компании ТС', callback_data: 'gost'}]
        ]
    }),
    parse_mode: 'HTML'
};

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Проверить еще раз', callback_data: '/again'}],
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Отправьте к нам вин-код машины и получите информацию`);
}

const start = async () => {
    
    let vinCode = '';

    bot.setMyCommands([
        {command: '/start', description: 'Запустить бота CheckAuto'},
        {command: '/info', description: 'Получить информацию о машине'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот Checkauto\nЗдесь вы сможете получить информацию о машине через вин-код. Чекавто проверяет юр. чистоту авто по данным РФ, (остальные страны, Корея, Америка, Дубай по запросу в личку админу)')
        }
    
        if(text === '/info'){
            return bot.sendMessage(chatId, 'Пожалуйста, отправьте вин-код и выберите услуги');
        }
        if(text === "1"){
            let message = "<b>TEST</b> osilay karoche <b>OSOSOOS</b>";
            let str = encodeURIComponent(message);
            await bot.sendMessage(chatId, message, {parse_mode: 'HTML'});
        }
        let words = text.split(' ');
        if(words.length == 1){
            if(text.length == 17){
                await bot.sendMessage(chatId, "Выберите услугу", gameOptions);
                vinCode = text;
            }
            else if(text.length < 17)
                await bot.sendMessage(chatId, "не хватает символов, вин код состоит из 17 символов")
            else
                await bot.sendMessage(chatId, "есть лишние символы, вин код состоит из 17 символов")
        }   
        else{
            await bot.sendMessage(chatId, "отправьте вин код без пробелов")
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === "vin") {
            await bot.sendMessage(chatId,"Это может занять некоторое время, пожалуйста подождите");
            await vin(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });     
            await bot.sendMessage(chatId,"Хотите проверить еще раз?",againOptions);
        } 
        else if(data === "gibdd"){
            await bot.sendMessage(chatId,"Это может занять некоторое время, пожалуйста подождите");
            await gibdd(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,"Информация машины из ГИБДД")
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            await bot.sendMessage(chatId,"Ищем наличие ограничений машины, пожалуйста подождите");
            await restrict(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            await bot.sendMessage(chatId,"Ищем участие в дорожно-транспортных происшествиях машины, пожалуйста подождите");
            await dtp(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            await bot.sendMessage(chatId,"Ищем информацию про нахождений в розыске машины, пожалуйста подождите");
            await wasted(vinCode).then(async (ans) => {
                await bot.sendMessage(chatId,ans,{parse_mode: 'HTML'});
            });
            await bot.sendMessage(chatId,"Хотите проверить еще раз?",againOptions);
        }
        else{
        }  
    })
}


start();