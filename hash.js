const bcrypt = require("bcrypt");

async function run() {
  const salt = await bcrypt.genSalt(10); //asynchronous version of genSalt. Pass the number of rounds passed as argument the algorithm runs to generate the salt
  const hash = await bcrypt.hash("1234", salt); //hash the password using the salt generated
  console.log(salt);
  console.log(hash);
}

//salt - random string added before a password that will result in a
//different hashed password every time it is used

run();
