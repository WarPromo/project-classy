
import { Server } from 'socket.io'

import express from 'express'
import https from 'https'

import * as fs from 'fs'


let privateKey  = fs.readFileSync('server.key', 'utf8');
let certificate = fs.readFileSync('server.cer', 'utf8');

console.log(privateKey, certificate);

let credentials = {key: privateKey, cert: certificate};

let port = 8080;

const app = express();

app.use(express.static("./frontend"));

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => console.log("listening"));

const io = new Server();
io.attach(httpsServer);









import { ProfanityEngine } from '@coffeeandfun/google-profanity-words';

const profanity = new ProfanityEngine({ language: 'en' });


let classlist = JSON.parse(fs.readFileSync("./storage/classlist.json", "utf8"));
let classcomments = JSON.parse(fs.readFileSync("./storage/classcomments.json", "utf8"));

let ratings = ["Enjoyment", "Difficulty", "Workload", "Usefulness", "APScore"]

let ratelimitTime = 60000;
let ratelimitBadtime = 600000;

let ratelimits = new Set();
let ratelimitsBad = new Set();

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
  console.log("Connection: " + socket.id);

  socket.on("getclasses", () =>{

    //console.log("Send classes", classlist);

    setTimeout(() => {
      socket.emit("classes", classlist);
    }, 500)



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

    //console.log("SEND LENGTH", size);

    socket.emit("commentslength", classid, size)

  })

  socket.on("opinion", async (classid, comment) => {


    comment.date = new Date().getTime();

    comment.ip = socket.handshake.address;

    console.log(comment, classid);

    let valid = await validComment(comment);

    if(typeof valid != "boolean"){
      if(valid == "Failed") console.log("INVALID COMMENT!", comment.ip);
      socket.emit("opinionuploaded", {error: valid})

      if(valid.includes("Profanity")){

        console.log("PROFANITY");

        ratelimitsBad.add(comment.ip);

        setTimeout(() => {

          ratelimitsBad.delete(comment.ip)

        }, ratelimitBadtime)

      }

      return;
    }


    classcomments[classid].push(comment)
    ratelimits.add(comment.ip);

    setTimeout( () => {
      //console.log("SENT");
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

async function validComment(comment){

  let validKeys = ["author", "content", "date", "rating", "ip"]


  let objKeys = Object.keys(comment);

  if(ratelimits.has(comment.ip)) return "Please wait at least a minute before posting another comment";
  if(ratelimitsBad.has(comment.ip)) return "You are not allowed to post comments for 10 minutes due to vulgar language."

  for(var i = 0; i < objKeys.length; i++){

    if(validKeys.indexOf(objKeys[i]) == -1){
      return "Failed";
    }

  }

  let keys = Object.keys(comment.rating);

  for(var i = 0; i < keys.length; i++){

    if(typeof comment.rating[keys[i]] != "number"){
      return "Failed";
    }

    if(comment.rating[keys[i]] < 0 || comment.rating[keys[i]] > 1){
      return "Failed";
    }

    if(ratings.indexOf(keys[i]) == -1){
      return "Failed";
    }

  }

  if(typeof comment.author != "string") return "Failed";
  if(comment.author.length > 32 || comment.author.length == 0) return "Failed";
  let profaneAuthor = await profanity.hasCurseWords(comment.author);
  if(profaneAuthor) return "Profanity detected, you have been banned for 10 minutes."

  if(typeof comment.content != "string") return "Failed";
  if(comment.content.length > 1000 || comment.content.length == 0) return "Failed";
  let profaneContent = await profanity.hasCurseWords(comment.content);
  if(profaneContent) return "Profanity detected, you have been banned for 10 minutes."


  return true;

}
