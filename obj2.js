const { someObj } = require("./obj");

const foo = () => someObj.someProp.push("aa");

console.log(someObj);

module.exports = { foo };
