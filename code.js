const fs = require("fs");


let file = fs.readFileSync("descs.txt", "utf8");


file = file.split("\r\n\r\n");

let classes = [];
let classcomments = {};


for(var i = 0; i < file.length; i++){

  file[i] = file[i].split("\r\n");

  let classname = file[i][0];
  let id = classname.split(" ").join("").split("-").join("").toLowerCase();
  let classdesc = file[i][1];
  let classtags = file[i][2].split(" ");

  console.log(id);

  let object = {

    name: classname,
    id: id,
    description: classdesc,
    rating: {
      Enjoyment: 0,
      Difficulty: 0,
      Work: 0,
      Useful: 0
    },
    tags: classtags

  }

  classes.push(object);
  classcomments[id] = [];

}

fs.writeFileSync("classlist.json", JSON.stringify(classes))
fs.writeFileSync("classcomments.json", JSON.stringify(classcomments))
