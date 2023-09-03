
let currentclass = "";
let ratingnames = ["Enjoyment", "Difficulty", "Work", "Useful", "APScore"];
let lockedin = [];

function reviewsection(revdata, classy){


  let container = document.createElement("div");
  container.classList.add("reviewcontainer");

  let ranking = "#" + (metrics[revdata.type].indexOf(classy) + 1);

  if(revdata.rating == 0){
    ranking = "N/A"
    container.classList.add("classratingcontainerinvalid")
  }

  let type = document.createElement("p");

  type.innerHTML = ranking + " in " + revdata.type;

  type.classList.add("reviewtype");

  container.appendChild(type);


  let reviewbarcontainer = document.createElement("div");
  reviewbarcontainer.classList.add("reviewbarbackground");

  let reviewbar = document.createElement("div");
  reviewbar.classList.add("reviewbar");

  reviewbar.style.width = (revdata.rating * 100) + "%";

  reviewbarcontainer.appendChild(reviewbar);

  container.appendChild(reviewbarcontainer);

  return container;




}

function showclassdesc(){

  reqindex = null;

  let classdesccontainer = document.getElementById("classdesccontainer");
  classdesccontainer.style.display = "";

  let commentsloadingcontainer = document.getElementById("commentsloadingcontainer");
  commentsloadingcontainer.style.display = "";

}

function hideclassdesc(event){

  let classdesccontainer = document.getElementById("classdesccontainer");

  if(event.target != classdesccontainer) return;

  classopen = null;

  classdesccontainer.style.display = "none";

  removeopinion()
}
