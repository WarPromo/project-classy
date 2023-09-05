function commentsection(commentdata, prepend = false){

  let usercommentcontainer = document.getElementById("usercommentscontainer");

  let contentcontainer = document.createElement("div");
  contentcontainer.classList.add("usercommentcontentcontainer")

  let commentcontainer = document.createElement("div")
  commentcontainer.classList.add("usercomment");

  let author = document.createElement("div");
  author.classList.add("usercommentauthor");
  author.textContent = "By " + commentdata.author + " • " + (new Date(commentdata.date).toLocaleDateString());

  contentcontainer.appendChild(author);

  let content = document.createElement("div");
  content.classList.add("usercommentcontent");
  content.textContent = commentdata.content;

  contentcontainer.appendChild(content);

  commentcontainer.appendChild(contentcontainer);

  let ratingscontainer = document.createElement("div");
  ratingscontainer.classList.add("usercommentratings");

  let ratings = commentdata.rating;

  let keys = Object.keys(ratings);

  let first = true;

  for(var i = 0; i < keys.length; i++){

    if(keys[i] == "APScore") continue;

    let ratingcontainer = document.createElement("div");
    ratingcontainer.classList.add("usercommentrating");

    if(first){
      ratingcontainer.classList.add("firstusercommentrating");
      first = false;
    }


    let ratingtype = document.createElement("p");
    ratingtype.classList.add("userreviewtype");
    ratingtype.innerHTML = keys[i];

    ratingcontainer.appendChild(ratingtype);

    let reviewcontainer = document.createElement("div")
    reviewcontainer.classList.add("userreview");

    let review = document.createElement("div");
    review.classList.add("userreviewbar");
    review.style.width = (100*ratings[keys[i]]) + "%"

    for(var j = 0; j < reviewrange.length; j++){
      if(ratings[keys[i]] <= reviewrange[j] + 0.01){
        let value = j;
        if(keys[i] == "Difficulty" || keys[i] == "Workload") value = 4 - j;
        review.setAttribute("value", value);
        break;
      }
    }

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

  if(devMode){

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("devdeletebutton");
    commentcontainer.appendChild(deleteButton);

    deleteButton.onclick = () => {

      console.log("REMOVE IT");

      socket.emit("removeopinion", classopen, commentdata, devPass);
      commentcontainer.remove();

    }

  }

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
