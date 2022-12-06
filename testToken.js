const jwt = require('jsonwebtoken');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODY0NjViNDc5NDRhNGYyNDNkZDc5MyIsImlhdCI6MTY2OTc1MDY5OSwiZXhwIjoxNjc3NTI2Njk5fQ.a3LeQddIMP40T7VrIqsurOZWG2iSnED76fjL8QNV-KU"
const decode = jwt.decode(token, {complete: true});

console.log(decode.payload);


const date1 = Date.now() + 10 * 60 * 1000;
const date2 = Date.now();

const result1 = new Date(date1);
const result2 = new Date(date2);

console.log(result1);
console.log(result2);
