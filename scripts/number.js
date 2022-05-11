import fs from 'fs';

for (let index = 0; index <= 99999; index++) {
  const length = index.toString().length;
  if(length === 1) fs.writeFileSync(`./words/number-3.txt`, `00${index}` + '\n', { flag: 'a' });
  if(length === 2) fs.writeFileSync(`./words/number-3.txt`, `0${index}` + '\n', { flag: 'a' });
  if(length === 3) fs.writeFileSync(`./words/number-3.txt`, index + '\n', { flag: 'a' });
  if(length === 4) fs.writeFileSync(`./words/number-4.txt`, index + '\n', { flag: 'a' });
  if(length === 5) fs.writeFileSync(`./words/number-5.txt`, index + '\n', { flag: 'a' });
}