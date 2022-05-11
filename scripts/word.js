import got from 'got';
import cheerio from 'cheerio';
import fs from 'fs';

const getWords = async (length) => {
  const response = await got(`https://www.englishtools.org/zh-cn/english-words-that-end-with/any/${length}/1`);
  const $ = cheerio.load(response.body);
  let last = $( $('.last')[0].children[0]).attr('data-page');
  let words = []
  for (let index = 1; index <= last + 1; index++) {
    console.log(`${length}位单词，正在获取第${index}页`);
    const url = `https://www.englishtools.org/zh-cn/english-words-that-end-with/any/${length}/${index}`;
    const response = await got(url);
    const $ = cheerio.load(response.body);
    const elements = $('tbody tr td');
    elements.each((index, element) => {
      words.push($(element).text());
      fs.writeFileSync(`./words/word-${length}.txt`, $(element).text() + '\n', { flag: 'a' });
    })
  }
  return words;
}

getWords(3)
getWords(4)
getWords(5)