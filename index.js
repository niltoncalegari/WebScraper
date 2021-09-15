const axios = require('axios');
const cheerio = require('cheerio');
const { find } = require('domutils');
const express = require('express');

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
        const carData = await GetUrlData(carUrl);
        let $ = cheerio.load(carData);
        let charElemSelector = 'div[class=sc-57pm5w-0]';

        const testando = $(charElemSelector).html();

        let charSelector = [];
        console.log();
        $(charElemSelector).each((index, element) => {
            console.log($(element).find('.sc-57pm5w-0').text());
            characteristics.push($(element).find('.sc-57pm5w-0').text());
        });

        let carCharacteristics = {
            test: $(charElemSelector).html(),
            categorie: charSelector[0],
            model: charSelector[1],
            brand: charSelector[2],
            modelYear: charSelector[3],
            mileAge: charSelector[4],
            engine: charSelector[5],
            fuel: charSelector[6],
            gearShift: charSelector[7],
            steeringWheel: charSelector[8],
            color: charSelector[9],
            doors: charSelector[10],
        };

        return carCharacteristics;
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
