
const socket = io("ws://localhost:3000");


socket.emit("getclasses");

socket.on("classes", (classlist) => {

  console.log(classlist);

  document.getElementById("classesloading").style.opacity = 0;

  makesortedlist(classlist);
  makeclasslist(sortingmetric)

})

socket.on("opinionuploaded", (comment) => {
  opinionuploaded = true;

  console.log(comment);
  commentsection(comment, true);

  socket.emit("getclasses");
})

socket.on("comments", commentsreceived);

socket.on("commentslength", commentslength);

let classopen = null;


function init(){
  setratingscales();
  checkblank();
  classlistinit();
}