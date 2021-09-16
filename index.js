const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function GeFromTable(url) {
    try {
        const listData = await GetUrlData(url);

        const cars = [];
        let $ = cheerio.load(listData);
        const elemSelector = '#ad-list > li.sc-1fcmfeb-2';

        $(elemSelector).each((index, element) => {
            if ($(element).find('a').attr('title') === undefined) {
                return;
            }

            const carUrl = $(element).find('a').attr('href');
            let carValues = GetCarCharacteristics(carUrl);
            const car = {
                titleName: $(element).find('a').attr('title'),
                carUrl: carUrl,
                carAdImgUrl:
                    $(element).find('.sc-101cdir-0').attr('data-src') !==
                    undefined
                        ? $(element).find('.sc-101cdir-0').attr('data-src')
                        : $(element).find('.sc-101cdir-1').attr('src'),
                //carValue: $(element).find('p.sc-1iuc9a2-8').text(),
                //postedTime: $(element).find('span.wlwg1t-1').text(),
                Char: carValues,
            };

            cars.push(car);
        });

        console.log(cars);
    } catch (err) {
        console.error(err);
    }
}

async function GetCarCharacteristics(carUrl) {
    try {
        let carCharacteristics = {
            categorie: null,
            model: null,
            brand: null,
            type: null,
            modelYear: null,
            mileAge: null,
            engine: null,
            fuel: null,
            gearShift: null,
            steeringWheel: null,
            color: null,
            doors: null,
        };

        const carCharList = await puppetGetCarChar(carUrl);

        console.log(JSON.stringify(carCharList));

        return carCharacteristics;
    } catch (err) {
        console.error(err);
    }
}

async function puppetGetCarChar(urlCarChar) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            handleSIGINT: false,
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 
        const url = urlCarChar;
        const promise = page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.goto(url);
        await promise;

        const resultScrape = await page.evaluate(() => {
            const cars = [];
            [...document.querySelectorAll("#content > div.sc-18p038x-3 > div > div.sc-bwzfXH > div.duvuxf-0 > div.h3us20-6 > div > div > div > div.sc-bwzfXH > div > div > div.sc-hmzhuo")].map((x) => cars.push(x.textContent));
            return cars;
        });

        await browser.close();
        return resultScrape;
    } catch (err) {
        console.error(err);
    }
}

async function GetUrlData(url) {
    try {
        let { data } = await axios({
            method: 'GET',
            url: url,
        });
        return data;
    } catch (err) {
        console.error(err);
    }
}

GeFromTable('https://rs.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios');
