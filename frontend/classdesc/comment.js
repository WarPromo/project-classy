function commentsection(commentdata, prepend = false){

  let usercommentcontainer = document.getElementById("usercommentscontainer");

  let commentcontainer = document.createElement("div")
  commentcontainer.classList.add("usercomment");

  let ratingscontainer = document.createElement("div");
  ratingscontainer.classList.add("usercommentratings");

  let ratings = commentdata.rating;

  let keys = Object.keys(ratings);

  for(var i = 0; i < keys.length; i++){

    if(keys[i] == "APScore") continue;

    let ratingcontainer = document.createElement("div");
    ratingcontainer.classList.add("usercommentrating");

    let ratingtype = document.createElement("p");
    ratingtype.classList.add("userreviewtype");
    ratingtype.innerHTML = keys[i];

    ratingcontainer.appendChild(ratingtype);

    let reviewcontainer = document.createElement("div")
    reviewcontainer.classList.add("userreview");

    let review = document.createElement("div");
    review.classList.add("userreviewbar");
    review.style.width = (100*ratings[keys[i]]) + "%"

    reviewcontainer.appendChild(review);
    ratingcontainer.appendChild(reviewcontainer);

    ratingscontainer.appendChild(ratingcontainer);

  }

  if(commentdata.rating.APScore != null){

    let ratingcontainer = document.createElement("div");
    ratingcontainer.classList.add("usercommentrating");

    let aptext = document.createElement("p");
    aptext.classList.add("userreviewtype");
    aptext.innerHTML = "AP Score";

    let apscore = document.createElement("p");
    apscore.classList.add("userreviewapscore");

    apscore.innerHTML = Math.round(commentdata.rating.APScore * 5);

    ratingcontainer.appendChild(aptext);
    ratingcontainer.appendChild(apscore);

    ratingscontainer.appendChild(ratingcontainer);

  }

  commentcontainer.appendChild(ratingscontainer);

  let contentcontainer = document.createElement("div");
  contentcontainer.classList.add("usercommentcontentcontainer")

  let content = document.createElement("div");
  content.classList.add("usercommentcontent");
  content.innerHTML = commentdata.content;

  contentcontainer.appendChild(content);

  let author = document.createElement("div");
  author.classList.add("usercommentauthor");
  author.innerHTML = "By " + commentdata.author;

  contentcontainer.appendChild(author);
  commentcontainer.appendChild(contentcontainer);

  if(!prepend){
    usercommentcontainer.appendChild(commentcontainer);
  }
  else{
    usercommentcontainer.prepend(commentcontainer);
  }

  //return commentcontainer;



}


let reqindex = null;
let batchsize = 5
let pausecommentloading = false;

function commentsreceived(classid, comments, index){

  console.log(comments);

  if(index != reqindex || classid != classopen || classopen == null) return;

  for(var i = 0; i < comments.length; i++){

    commentsection(comments[i]);

  }

  reqindex -= comments.length;

  if(reqindex == -1){

    document.getElementById("commentsloadingcontainer").style.display = "none";

  }

}

function requestbatch(){

  if(reqindex == null){
    socket.emit("getcommentslength", classopen);
    return;
  }

  if(classopen == null || reqindex == -1) return;

  console.log("GET BATCH", reqindex, batchsize);

  socket.emit("getcomments", classopen, reqindex, batchsize);

}

function commentslength(classid, length){

  if(classid != classopen) return;
  if(classopen == null) return;
  if(reqindex != null) return;

  reqindex = length-1;

  if(reqindex == -1){

    document.getElementById("commentsloadingcontainer").style.display = "none";

  }
}

setInterval(() => {

  //console.log(classopen)

  if(classopen == null || pausecommentloading) return;

  let classdesc = document.getElementById("classdesc");

  let scroll = classdesc.scrollTop + classdesc.offsetHeight;
  let scrollLength = classdesc.scrollHeight;
  let range = 500;

  let scrollDist = scrollLength - scroll;

  //console.log(scrollLength, scroll, scrollDist);

  if(scrollDist < range){
    requestbatch();
  }

}, 100)
