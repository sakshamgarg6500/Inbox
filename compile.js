const path = require("path");
const fs = require("fs");
const solc = require("solc");
//importing the solidity compiler

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
//__dirname takes us to the home directory of his project
//then comes folder
//then comes file

const source = fs.readFileSync(inboxPath, "utf8");
//utf8 refers to type of file encoding

// console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[":Inbox"];
//exporting the compiled source code
//1 refers to the number of contracts we are trying to compile
//contracts[":Inbox"] to destructure the object
