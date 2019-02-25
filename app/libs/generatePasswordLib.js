const bcrypt = require('bcryptjs')
const saltRounds = 10

/* Custom Library */
let logger = require('../libs/loggerLib')

let hashpassword = (myPlaintextPassword) => {
  let salt = bcrypt.genSaltSync(saltRounds)
  let hash = bcrypt.hashSync(myPlaintextPassword, salt)
  return hash
}


let comparePassword = (oldPassword, hashpassword, cb) => {
  bcrypt.compare(oldPassword, hashpassword, (err, res) => {
    console.log(oldPassword,hashpassword);
    if (err) {
      console.log("error in");
      logger.error(err.message, 'Comparison Error', 5)
      cb(err, null)
    } else {
      console.log("elsesss>>",res);
      cb(null, res)
    }
  })
}


let comparePasswordSync = (myPlaintextPassword, hash) => {
  return bcrypt.compareSync(myPlaintextPassword, hash)
}

module.exports = {
  hashpassword: hashpassword,
  comparePassword: comparePassword,
  comparePasswordSync: comparePasswordSync
}
