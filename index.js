const io = require("socket.io")(3000, {
  cors:{
    origin: "*"//["http://localhost:8080"],
  }
});

const fs = require("fs");


let classlist = JSON.parse(fs.readFileSync("./storage/classlist.json", "utf8"));
let classcomments = JSON.parse(fs.readFileSync("./storage/classcomments.json", "utf8"));

let ratings = ["Enjoyment", "Difficulty", "Workload", "Usefulness", "APScore"]

let ratelimitTime = 60000;
let ratelimits = new Set();


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

    if(reqindex >= comments.length) return;

    for(var i = reqindex; i >= 0 && i > reqindex - batchsize; i--){

      commentlist.push(stripComment(comments[i]));

    }

    socket.emit("comments", classid, commentlist, reqindex);

  });

  socket.on("getcommentslength", classid => {

    let size = classcomments[classid].length;

    console.log("SEND LENGTH", size);

    socket.emit("commentslength", classid, size)

  })

  socket.on("opinion", (classid, comment) => {


    comment.date = new Date().getTime();

    comment.ip = socket.handshake.address;

    console.log(comment, classid);

    let valid = validComment(comment);

    if(!valid){
      console.log("INVALID COMMENT!");
      socket.emit("opinionuploaded", "failed")
      return;
    }


    classcomments[classid].push(comment)
    ratelimits.add(comment.ip);

    setTimeout( () => {
      console.log("SENT");
      socket.emit("opinionuploaded", comment)
    }, 500);

    setTimeout( () => {

      ratelimits.delete(comment.ip)

    }, ratelimitTime)

    computeScores()

  })

})

function stripComment(comment){

  return {

    author: comment.author,
    content: comment.content,
    rating: comment.rating,
    date: comment.date

  }


}

function validComment(comment){

  let validKeys = ["author", "content", "date", "rating", "ip"]


  let objKeys = Object.keys(comment);

  if(ratelimits.has(comment.ip)) return false;


  for(var i = 0; i < objKeys.length; i++){

    if(validKeys.indexOf(objKeys[i]) == -1){
      return false;
    }

  }

  let keys = Object.keys(comment.rating);

  for(var i = 0; i < keys.length; i++){

    if(typeof comment.rating[keys[i]] != "number"){
      return false;
    }

    if(comment.rating[keys[i]] < 0 || comment.rating[keys[i]] > 1){
      return false;
    }

    if(ratings.indexOf(keys[i]) == -1){
      return false;
    }

  }

  if(typeof comment.author != "string") return false;
  if(comment.author.length > 32 || comment.author.length == 0) return false;

  if(typeof comment.content != "string") return false;
  if(comment.content.length > 1000 || comment.content.length == 0) return false;

  return true;

}
