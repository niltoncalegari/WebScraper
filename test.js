const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://rs.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios';
    await page.goto(url);

    const resultScrape = await page.evaluate(() => {
      const cars = []; 
      [...document.querySelectorAll("#ad-list > li.sc-1fcmfeb-2")].map(x => cars.push(x.textContent));
      return cars;
    });

    await browser.close();
    return resultScrape;
};

scrape().then((value) => {
  value.forEach(element => {
    console.log(element);
  });
});
