const puppeteer = require("puppeteer")
const axios = require('axios')
const UserAgent = require("user-agents");
const { load } = require("cheerio");

async function aster(grnz, techpassportNumber) {
    return new Promise(async (resolve,reject) => {
        let useragent = new UserAgent();
        let res = await axios.get(`https://api.getproxylist.com/proxy?allowsCustomHeaders=1&allowsHttps=1&'
        '%27%27%27%20%27allowsPost=1&apiKey=20cdcf4236a1ba151a60ac1fab0b56fa550341a2&%27%27country[]=UA&'
        '%27%20%27maxConnectTime=1&minUptime=90&protocol[]=http`);
        let ip = res.data.ip;
        let port = res.data.port;
        console.log("RPA is started");

        const cookies = [
        {name: 'SESSION', value: 'N2RhZDEwNmMtYjdmMC00MWExLWExMzAtNGZmZTliMGQ4NWM0', domain: 'aster.kz'}
        ];

        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage()
        // page.setUserAgent(useragent.toString());

        await page.setExtraHTTPHeaders({
            // 'authority': 'aster.kz',
            'scheme': 'https',
            'accept': '*/*',
            // 'accept-encoding': 'gzip, deflate, br',
            // 'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            // 'sec-fetch-dest': 'empty',
            // 'sec-fetch-mode': 'cors',
            // 'sec-fetch-site': 'same-origin',
            'user-agent': `${useragent.toString()}`,
            'X-Requested-With': 'XMLHttpRequest',
        })

        await page.setCookie(...cookies);
        await page.goto("https://aster.kz/aster-check") 

        console.log("Main Page");

        await page.type(`input[name="grnz"]`, `${grnz}`)
        await page.type(`input[name="techpassportNumber"]`, `${techpassportNumber}`)
        setTimeout(async () => await page.click("#btn-rc-grnz-mainpage"), 1000)

        await page.waitForNavigation();

        console.log(page.url().length);

        setTimeout(async () => await page.click("#btn-buy-vin-report"), 500)

        await page.waitForNavigation();
        console.log("Found/Waiting for content");

        let names;

        setTimeout(async () => {
            names = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".btn")).map((x,idx) => (x.toString()));
            })
            console.log('Done/Parsing');
            await page.goto(names[3]);
            // await page.waitForNavigation({waitUntil: load});
            console.log(page.url());

            let res = "";

            const modifications = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".collapsed-item__header")).map((x,idx) => (x.innerText));
            })
            const modifications_key = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".info-table__key")).map((x,idx) => (x.innerText));
            })
            const modifications_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".info-table__value")).map((x,idx) => (x.innerText));
            })
            const all_key = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".vin-table-info__key")).map((x,idx) => (x.innerText));
            })
            const all_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".vin-table-info__value")).map((x,idx) => (x.innerText));
            })

            size_arr = all_key.length;
            res += `<b>${all_key[size_arr-2]}</b>: ${ all_value[size_arr-2]}\n<b>${all_key[size_arr-1]}</b>: ${all_value[size_arr-1]}\n\n<b>МОДИФИКАЦИИ</b>:\n`

            let size = modifications_key.length;
            let size_one = modifications_key.length/modifications.length;
            for(let i = 0;i < size;i++){
                if(i % size_one == 0){
                    res += `<b>\n${modifications[i/size_one]}</b>\n\n`
                }
                res += `<b>${modifications_key[i]}</b>: ${modifications_value[i]}\n`;
            }


            resolve(res);
        }, 60000);
    })
}

module.exports = aster;

