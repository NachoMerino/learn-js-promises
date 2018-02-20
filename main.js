const fs = require('fs');
const mysql = require('mysql');
const randomstring = require('randomstring');


// load all the mySQL data from the folder
// IMPORTANT go to /home/.ioops/.config.json and add you user and pass for mySQL DB
// edit the file with nano or ny text editor
let osFolder = process.env.HOME + '/.ioops';
let ioopsConfig = null;
if (!fs.existsSync(osFolder)) {
  fs.mkdirSync(osFolder);
  let initialConfig = {
    mysql_user: '',
    mysql_db: '',
    mysql_pwd: '',
  }
  fs.writeFileSync(osFolder + '/.config.json', JSON.stringify(initialConfig));
  console.log('The config folder does not exist, it has been created now. The server will exit now');
  process.exit();
} else {
  ioopsConfig = require(osFolder + '/.config.json');
}

const con = mysql.createConnection({
  host: 'localhost',
  user: ioopsConfig.mysql_user,
  password: ioopsConfig.mysql_pwd,
  database: ioopsConfig.mysql_db,
});


// example without promises
/*
const user = 'jim';
con.query(`select * from users where username = "${user}"`, (err, rows) => {
  let userFolder = `./${user}`;
  if (err) {
    throw err;
  } else {
    console.log(rows);
    if (rows.length === 0) {
      console.log(`User ${user} does not exist`);
      process.exit();
    }
    if (rows[0].folderexists) {
      console.log(`User ${user} has a folder in ./${user}`);
      process.exit();
    } else if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder);
      console.log('The user folder does not exist, it has been created now.');
      createJSONFile(user, userFolder);
    } else {
      console.log(`Creating files for ${user} in ./${user}`);
      createJSONFile(user, userFolder);
    }
  }
});
*/

// function to handle the resolve in the promise
// function to create the json file
function createJSONFile(userName) {
  // set the folders location
  let folder = `./${userName}`;
  console.log(`Creating JSON file in ${userName}'s folder`);
  // generate a random string
  const rndString = randomstring.generate(20);
  // write the file 
  fs.writeFileSync(`${folder}/${userName}.json`, JSON.stringify(rndString));
  // set in out db that the folder has been created
  con.query(`UPDATE users set folderexists = 1 where username = '${userName}'`, (err, rows) => {
    if (err) {
      throw err;
    } else {
      // ending the program, everything has been made
      console.log(`DB updated for user ${userName}, now the personal folder exists`);
      console.log('ending program... BYE');
      process.exit();
    }
  });
}

// function to handle the rejects in the promise
function error(x) {
  console.log(x);
  process.exit();
}


// PROMISES SOLUTION
function checkUser(user) {
  let userFolder = `./${user}`;
  // create the promise
  return new Promise((resolve, reject) => {
    // build all the logic to figerout when it a resolve(good to GO) and when its a reject(NO GO)
    // query to the server
    con.query(`select * from users where username = "${user}"`, (err, rows) => {
      if (err) {
        // if conection error
        reject(err);
      }
      if (rows.length === 0) {
        // if user does not exist
        reject(`User ${user} does not exist`);
      }
      if (rows.length > 0 && rows[0].folderexists === 1) {
        // if DB has a parmamiter called folderexist whit value 1 (check createJSONFile function)
        reject(`User ${user} has a folder in ./${user}`);
      } else if (rows.length > 0 && !fs.existsSync(userFolder)) {
        // creating folder because does not exist
        fs.mkdirSync(userFolder);
        console.log('The user folder does not exist, it has been created now.');
        // revolve our promise pasing as paramiter our user name
        resolve(user);
      } else if (rows.length > 0) {
        // if user exist and the folder aswell, but there is not file inside
        console.log(`Creating files for ${user} in ./${user}`);
        // resolving with or username
        resolve(user);
      }
    })
  })
}

// calling your function that contains a promise
// IMPORTANT the parameter of checkUser need to be filled, with an eisting user or not in our DB
checkUser('bo')
  .then((resolve) => {createJSONFile(resolve) }, (reject) => { error(reject) });
