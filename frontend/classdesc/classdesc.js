
let currentclass = "";
let ratingnames = ["Enjoyment", "Difficulty", "Workload", "Usefulness", "APScore"];
let lockedin = [];

function reviewsection(revdata, classy) {


  let container = document.createElement("div");
  container.classList.add("reviewcontainer");

  let ranking = "<b>#" + (metrics[revdata.type].indexOf(classy) + 1) + "</b>";

  if (revdata.rating == 0) {
    ranking = "N/A"
    container.classList.add("classratingcontainerinvalid")
  }

  let type = document.createElement("p");

  type.innerHTML = ranking + " in " + revdata.type;
  if (revdata.type == "Overall") {
    type.innerHTML = ranking + " Overall";
    container.classList.add("classratingoverall")
  }


  type.classList.add("reviewtype");



  container.appendChild(type);


  let reviewbarcontainer = document.createElement("div");
  reviewbarcontainer.classList.add("reviewbarbackground");

  let reviewbar = document.createElement("div");
  reviewbar.classList.add("reviewbar");

  let value = null;

  for (var i = 0; i < reviewrange.length; i++) {
    if (revdata.rating <= reviewrange[i] + 0.01) {
      value = i;
      if (revdata.type == "Difficulty" || revdata.type == "Workload") value = 4 - i;

      reviewbar.setAttribute("value", value);
      break;
    }
  }




  setTimeout(() => {
    reviewbar.style.width = ((revdata.rating) * 100) + "%";
  }, 1)


  reviewbarcontainer.appendChild(reviewbar);
  container.appendChild(reviewbarcontainer);

  if (revdata.type != "Overall" && ranking != "N/A") {
    let label = document.createElement("p");
    label.classList.add("reviewlabel");
    let labelText = opiniontypes[ratingnames.indexOf(revdata.type)][i];
    label.innerHTML = '"' + labelText + '"';
    container.appendChild(label);
  }

  return container;




}

function showclassdesc() {

  reqindex = null;

  let classdesccontainer = document.getElementById("classdesccontainer");
  classdesccontainer.style.display = "";

  let commentsloadingcontainer = document.getElementById("commentsloadingcontainer");
  commentsloadingcontainer.style.display = "";

  classdesccontainer.classList.add("fastFadeIn")
  setTimeout(() => {
    classdesccontainer.classList.remove("fastFadeIn")
    classdesccontainer.style.display = "";
  }, 500)

  document.body.classList.add("noscroll");

}

function hideclassdesc(event, bypass = false) {

  let classdesccontainer = document.getElementById("classdesccontainer");

  if (!bypass && event.target != classdesccontainer) return;

  classopen = null;

  classdesccontainer.classList.add("fastFadeOut")
  setTimeout(() => {
    classdesccontainer.classList.remove("fastFadeOut")
    classdesccontainer.style.display = "none";
  }, 250)

  document.body.classList.remove("noscroll");

  removeopinion()
}
