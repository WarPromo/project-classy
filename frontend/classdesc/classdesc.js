
let currentclass = "";
let ratingnames = ["Enjoyment", "Difficulty", "Work", "Useful", "APScore"];
let lockedin = [];

function reviewsection(revdata, classy){


  let container = document.createElement("div");
  container.classList.add("reviewcontainer");

  let ranking = "<b>#" + (metrics[revdata.type].indexOf(classy) + 1) +"</b>";

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

  setTimeout(() => {
    reviewbar.style.width = (revdata.rating * 100) + "%";
  })


  for(var i = 0; i < reviewrange.length; i++){
    if(revdata.rating <= reviewrange[i]){
      let value = i;
      if(sorting == "Difficulty" || sorting == "Work") value = 4 - i;
      reviewbar.setAttribute("value", i);
      break;
    }
  }

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

  //document.body.scrolling = 'no';

}

function hideclassdesc(event, bypass=false){

  let classdesccontainer = document.getElementById("classdesccontainer");

  if(!bypass && event.target != classdesccontainer) return;

  classopen = null;

  classdesccontainer.style.display = "none";

  //document.body.scrolling = 'yes';

  removeopinion()
}
