const axios = require('axios');
const cheerio = require('cheerio');
const { find } = require('domutils');
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
            if ($(element).find('a').attr('title') === undefined) {
                return;
            }
            let auxStatus = $(element).find('span.sc-1j5op1p-0').attr('title');
            let status = auxStatus.toString().split('|');
            const car = {
                titleName: $(element).find('a').attr('title'),
                status: {
                    mileage: status[0].trim(),
                    gearshift: status[1].trimLeft().replace('Câmbio:', ''),
                    fuel: status[2],
                },
                carUrl: $(element).find('a').attr('href'),
                carImgUrl:
                    $(element).find('.sc-101cdir-0').attr('data-src') !==
                    undefined
                        ? $(element).find('.sc-101cdir-0').attr('data-src')
                        : $(element).find('.sc-101cdir-1').attr('src'),
                carValue: $(element).find('p.sc-1iuc9a2-8').text(),
                postedTime: $(element).find('span.wlwg1t-1').text(),
            };

            cars.push(car);
        });

        console.log(cars);
    } catch (err) {
        console.error(err);
    }
}

GetTable('https://rs.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios');
