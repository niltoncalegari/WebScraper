const axios = require('axios');
const cheerio = require('cheerio');

async function GeFromTable(url) {
    try {
        const cars = [];
        for (let index = 0; index <= 100; index++) {
            let paginatedUrl = `${url}${'?o='}${index}`;
            const listData = await GetUrlData(paginatedUrl);
            let $ = cheerio.load(listData);

            const elemSelectorNotFound =
                '#column-main-content > div.h3us20-6 > div > div.h3us20-6 > div > div > h3';

            // if no one post or page was found break the loop
            // like this one https://rs.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/porsche?o=3
            if (
                $(elemSelectorNotFound).text() ===
                'Nenhum anúncio foi encontrado.'
            ) {
                break;
            }

            // else continue scraping pages and pushing to cars[]
            const elemSelector = '#ad-list > li.sc-1fcmfeb-2';

            $(elemSelector).each((index, element) => {
                if ($(element).find('a').attr('title') === undefined) {
                    return;
                }
                const car = {
                    titleName: $(element).find('a').attr('title'),
                    adUrl: $(element).find('a').attr('href'),
                    coverAdImgUrl:
                        $(element).find('.sc-101cdir-0').attr('data-src') !==
                        undefined
                            ? $(element).find('.sc-101cdir-0').attr('data-src')
                            : $(element).find('.sc-101cdir-1').attr('src'),
                    adCharacteristics: {
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
                    },
                };

                cars.push(JSON.stringify(car));
            });
        }

        console.log(cars);
        console.log(cars.length);
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

GeFromTable('https://olx.com.br/autos-e-pecas/carros-vans-e-utilitarios');
