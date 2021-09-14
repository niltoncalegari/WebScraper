const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function GetTable(url) {
    try {
        const { data } = await axios({
            method: 'GET',
            url: url,
        });

        const $ = cheerio.load(data);
        const cars = [];
        const elemSelector = '#ad-list > li.sc-1fcmfeb-2';

        $(elemSelector).each((index, element) => {
            const car = {
                titleName: $(element).find('a').attr('title'),
                carUrl: $(element).find('a').attr('href'),
                carImgUrl: $(element).find('div.sc-101cdir-2').text(),
                carValue: $(element).find('p.sc-1iuc9a2-8').text(),
            };

            cars.push(car);
        });

        console.log(cars);
    } catch (err) {
        console.error(err);
    }
}

GetTable('https://rs.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios');
