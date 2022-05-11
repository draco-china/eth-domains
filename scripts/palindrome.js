import fs from 'fs';

const getPalindrome = async () => {
  const palindromes = fs.readFileSync(`./words/palindrome.txt`, 'utf-8').split('\r\n');
  palindromes.forEach(palindrome => {
    const value1 = palindrome.replace(/\s/g, '');
    if(value1 && value1.length <= 6) {
      fs.writeFileSync(`./words/palindrome-${value1.length}.txt`, value1 + '\n', { flag: 'a' });
    }
    const value2 = palindrome.replace(/\s./g, '');
    if(value2 && value2.length <= 6) {
      fs.writeFileSync(`./words/palindrome-${value2.length}.txt`, value2 + '\n', { flag: 'a' });
    }
  });
}

getPalindrome()
