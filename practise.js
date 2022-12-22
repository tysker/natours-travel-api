const pipeline = [
  { '$match': { secretTour: [Object] } },
  { '$geoNear': { near: [Object], distanceField: 'distance' } }
]

pipeline.map( el => console.log(el))
const filter = pipeline.filter(el => el.$geoNear)
console.log(!pipeline.filter(el => el.$geoNear).length);
if(!pipeline.filter(el => el.$geoNear).length) {
  console.log("Success!");
}

console.log(filter);
