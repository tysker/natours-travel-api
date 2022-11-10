const employee = {
  name: 'John Smith',
  position: 'Sales Manager'
};
const { position, ...employeeRest } = employee;
console.log(employeeRest); // { name: 'John Smith' }
console.log(employee);
console.log(position);
