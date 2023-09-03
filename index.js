const io = require("socket.io")(3000, {
  cors:{
    origin: "*"//["http://localhost:8080"],
  }
});


let classlist = [

{
  name: "AP Calculus BC",
  id:"apcalculusbc",
  description: "This class is all bout dat matematicas jdaskjkldjl;asjkl j kl;dskl; dasjkl; daskl;d fj asdkljf adkl;jf ad lasdfk ;l; ajdfl;  s jaskl;dj;kl",
  rating: {

    Comfort: 0,
    Difficulty: 0,
    Homework: 0

  },
  tags: ["Math"]
},

{
  name: "AP Calculus AB",
  id:"apcalculusab",
  description: "This class is all bout dat matematicas but easie fjasdil fjasdkl; fjasdkl;f  asdkl;;fj kl;asdj fkl;asjkl;df  ja kl;d sjafkl; jakl;r",
  rating: {

    Comfort: 0,
    Difficulty: 0,
    Homework: 0

  },
  tags: ["Math", "Science"]
},

]


let classlistsortings = [



]

let classcomments = {
  "apcalculusbc": [

      {
        author: "Johnny Boy",
        content: "This class is absolute shit!",
        rating:{
          Comfort: 0.0,
          APScore: 1
        },

      },{
        author: "Johnny Boy",
        content: "This class is absolute shit!",
        rating:{
          Comfort: 0.2,
          APScore: 2
        },

      },{
        author: "Johnny Boy",
        content: "This class is absolute shit!",
        rating:{
          Comfort: 0.4,
          APScore: 3
        },

      },{
        author: "Johnny Boy",
        content: "This class is absolute shit!",
        rating:{
          Comfort: 0.6,
          APScore: 4
        },

      },{
        author: "Johnny Boy",
        content: "This class is absolute shit!",
        rating:{
          Comfort: 0.8,
          APScore: 5
        },

      },

  ],
  "apcalculusab":[]

}


for(var i = 0; i < 70; i++){

  let clone = JSON.parse(JSON.stringify(classlist[0]));
  clone.id = Math.random() + "";
  classlist.push(clone);
  classcomments[clone.id] = [];

}


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
