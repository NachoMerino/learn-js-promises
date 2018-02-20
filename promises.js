const fs = require('fs');
/*
function createFile(filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + '/' + filename, 'hallo', (err) => {
      if (err) {
        console.log('err:', err);
        reject();
      }
      resolve();
    });
  })
}

createFile('test1.txt')
  .then(() => { return createFile('text2.txt') }, () => { console.log('something went wrong') })
  .then(() => { return createFile('text3.txt') }, () => { console.log('something went wrong') })
  .then(() => { return createFile('text4.txt') }, () => { console.log('something went wrong') })
  .then(() => { return createFile('text5.txt') }, () => { console.log('something went wrong') });
*/

//

function createFile(x, filename) {
  console.log('x is:', x);
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + '/' + filename, 'hallo', (err) => {
      if (err) {
        console.log('err:', err);
        reject();
      }
      resolve(x + 1);
    });
  })
}

createFile(0, 'test0.txt')
  .then((x) => { return createFile(x, `text${x}.txt`) }, () => { console.log('something went wrong') })
  .then((x) => { return createFile(x, `text${x}.txt`) }, () => { console.log('something went wrong') })
  .then((x) => { return createFile(x, `text${x}.txt`) }, () => { console.log('something went wrong') })
  .then((x) => { return createFile(x, `text${x}.txt`) }, () => { console.log('something went wrong') });
