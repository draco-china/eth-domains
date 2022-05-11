import got from 'got';
import cheerio from 'cheerio';
import fs from 'fs';

const getCountry = async () => {
  const response = await got(`https://studycli.org/zh-CN/learn-chinese/country-names-in-chinese/`);
  const $ = cheerio.load(response.body);
  const elements = $('tbody tr td[class="column-1"]');
  let country = []
  elements.each((index, element) => {
    const name = $(element).text()
    if(name.indexOf(' ') === -1 && name.indexOf('-') === -1) {
      country.push(name);
      fs.writeFileSync(`./words/country.txt`,name + '\n', { flag: 'a' });
    }
  })
  return country;
}

getCountry()