const io = require("socket.io")(3000, {
  cors:{
    origin: "*"//["http://localhost:8080"],
  }
});

const fs = require("fs");


let classlist = JSON.parse(fs.readFileSync("./storage/classlist.json", "utf8"));
let classcomments = JSON.parse(fs.readFileSync("./storage/classcomments.json", "utf8"));



computeScores();


function computeScores(){

  for(var i = 0; i < classlist.length; i++){

    let comments = classcomments[classlist[i].id];

    let scores = {};

    for(var j = 0; j < comments.length; j++){
      let keys = Object.keys(comments[j].rating);

      for(var k = 0; k < keys.length; k++){

        if(keys[k] == "APScore") continue;

        if(keys[k] in scores == false){
          scores[keys[k]] = [0,0];
        }

        scores[keys[k]][0] += comments[j].rating[keys[k]];
        scores[keys[k]][1]++;

      }
    }

    let keys = Object.keys(scores);


    for(var j = 0; j < keys.length; j++){

      classlist[i].rating[keys[j]] = scores[keys[j]][0] / scores[keys[j]][1];

    }

  }

  fs.writeFileSync("./storage/classlist.json", JSON.stringify(classlist));
  fs.writeFileSync("./storage/classcomments.json", JSON.stringify(classcomments));

}


io.on("connection", socket => {
  console.log(socket.id);

  socket.on("getclasses", () =>{

    console.log("Send classes", classlist);

    setTimeout(() => {
        socket.emit("classes", classlist);
    }, 1000)



  })

  socket.on("getcomments", (classid, reqindex, batchsize) => {

    let commentlist = [];
    let comments = classcomments[classid];

    for(var i = reqindex; i >= 0 && i > reqindex - batchsize; i--){

      commentlist.push(comments[i]);

    }

    socket.emit("comments", classid, commentlist, reqindex);

  });

  socket.on("getcommentslength", classid => {

    let size = classcomments[classid].length;

    console.log("SEND LENGTH", size);

    socket.emit("commentslength", classid, size)

  })

  socket.on("opinion", (classid, comment) => {

    console.log(classid);

    if(classid in classcomments){

      classcomments[classid].push(comment)

      setTimeout( () => {
        console.log("SENT");

        socket.emit("opinionuploaded", comment)
      }, 500);

      computeScores()

    }

  })

})
