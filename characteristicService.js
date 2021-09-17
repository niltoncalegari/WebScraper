const puppeteer = require('puppeteer');

class CharacterisService {
    constructor() {}

    GetCarCharacteristics(carUrl) {
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

    puppetGetCarChar(urlCarChar) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                handleSIGINT: false,
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            const url = urlCarChar;
            const promise = page.waitForNavigation({
                waitUntil: 'networkidle2',
            });
            await page.goto(url);
            await promise;

            const resultScrape = await page.evaluate(() => {
                const cars = [];
                [
                    ...document.querySelectorAll(
                        '#content > div.sc-18p038x-3 > div > div.sc-bwzfXH > div.duvuxf-0 > div.h3us20-6 > div > div > div > div.sc-bwzfXH > div > div > div.sc-hmzhuo'
                    ),
                ].map((x) => cars.push(x.textContent));
                return cars;
            });

            await browser.close();
            return resultScrape;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = CharacterisService;
