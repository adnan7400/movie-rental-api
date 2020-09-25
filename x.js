//Modelling RelationShips -

//Trade-off between query performance vs consistency

//Using References (Normalization) -> CONSISTENCY
let author = {
  name: "Sakib",
};

let course = {
  author: "id",
};

//Using Embedded Documents (Denormalization) -> QUERY PERFORMANCE
//Embedding one document inside another document here.
let course = {
  author: {
    name: "Sakib",
  },
};

//Hybrid approach - when we need a snapshot of your data in a point in time
let author = {
  name: "Sakib",
  //50 other properties
};

let course = {
  author: {
    id: "ref",
    name: "Sakib",
  },
};
