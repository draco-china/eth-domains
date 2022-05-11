import path from 'path';
import fs from 'fs';

function sliceArray (arr, size) {
  var arr2 = [];
  for(var i=0; i<arr.length; i=i+size){
    arr2.push(arr.slice(i,i+size));
  }
  return arr2;
}

const dirs = fs.readdirSync('./words');
for (let index = 0; index < dirs.length; index++) {
  const dir = dirs[index];
  console.log(dir);
  const file = fs.readFileSync(path.join('./words', dir), 'utf-8').split('\n');
  console.log(file);
  sliceArray(file, 1000).forEach((arr, index) => {
    fs.writeFileSync(`./split-words/${dir.split('.')[0]}-${index}.txt`, arr.join('\n'), { flag: 'a' });
  })
}
