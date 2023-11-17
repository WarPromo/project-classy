

let opiniontypes = [

  ["Horrible!", "Boring", "Okay", "Good", "Fun!"],
  ["Easy", "Kinda Easy", "Medium", "Hard", "Very Hard!"],
  ["Almost no work", "Some work", "Medium work", "Lots of work", "Tons of work!"],
  ["Useless!", "Barely Useful", "Sometimes Useful", "Useful", "Must Learn!"]

]


function addopinion(){

  clearopinion();

  document.getElementById("opinioninput").style.display = "";

  document.getElementById("usercomments").style.display = "none";

  pausecommentloading = true;

}

function removeopinion(){


  document.getElementById("opinioninput").style.display = "none";

  document.getElementById("usercomments").style.display = "";

  pausecommentloading = false;

  document.getElementById("classdesc").scrollTop = 0;

  clearopinion();

}

function opinionauthorblur(event){

  let words = event.target.value.split(' ');
  let newarr = [];

  for(var i = 0; i < words.length; i++){

    if(words[i] == '') continue;
    else newarr.push(words[i]);


  }

  event.target.value = newarr.join(' ');

  checkblank();

}


function opinioncommentblur(event){

  let words = event.target.value.split(' ');
  let newarr = [];

  for(var i = 0; i < words.length; i++){

    if(words[i] == '') continue;
    else newarr.push(words[i]);


  }

  event.target.value = newarr.join(' ');

  checkblank();

}


let ratetitle = `Rate the course<span style="color:red">*</span>`
let ratetitlecomplete = `Rate the course <span style="color:lightblue">✓</span>`;

let writeopinion = `Write your opinion<span style="color:red">*</span>`
let writeopinioncomplete = `Write your opinion <span style="color:lightblue">✓</span>`

let agreement = `Agreement<span style="color:red">*</span>`
let agreementcomplete = `Agreement <span style="color:lightblue">✓</span>`

function clickagreement(event){



  let agreementinp = document.getElementById("agreementcheckbox");

  if(event.target == agreementinp) return;

  agreementinp.click();

}

function checkblank(){
  let inp1 = document.getElementById("opinioninputauthor");
  let inp2 = document.getElementById("opinioninputmsg");

  let agreementinp = document.getElementById("agreementcheckbox");

  let blank0 = agreementinp.checked;

  let blank1 = inp1.value.split(' ').join('').length > 0
  let blank2 = inp2.value.split(' ').join('').length > 0

  let blank3 = false;

  for(var i = 0; i < lockedin.length; i++){
    if(lockedin[i] != false) blank3 = true;
  }

  let agreementelem = document.getElementById("agreementbox");
  agreementelem.innerHTML = agreement;
  if(blank0) agreementelem.innerHTML = agreementcomplete;

  let writeelem = document.getElementById("writeopinion");
  writeelem.innerHTML = writeopinion
  if(blank1 && blank2) writeelem.innerHTML = writeopinioncomplete

  let rateelem = document.getElementById("ratecourse");
  rateelem.innerHTML = ratetitle
  if(blank3) rateelem.innerHTML = ratetitlecomplete


  if(!(blank0 && blank1 && blank2 && blank3)){

    document.getElementById("opinionsubmit").disabled = true;

  }
  else{
    document.getElementById("opinionsubmit").disabled = false;
  }

}


function opinioninputfocus(){

  let classdesc = document.getElementById("classdesc");
  //classdesc.classList.add("noscroll");


}

function opinioninputblur(){

  let classdesc = document.getElementById("classdesc");
  //classdesc.classList.remove("noscroll");

}


function setratingscales(){

  let scales = document.getElementsByClassName("setrating");

  for(var i = 0; i < scales.length; i++){

    lockedin.push(false);

    console.log(scales[i]);

    let buttons = scales[i].children[1].children[1].children;

    let name = scales[i].children[0].innerHTML;

    let numi = i;

    scales[i].children[2].style.display = "none";

    let isapscore = scales[i].id == "apscorerating"

    scales[i].children[2].onclick = () => {

      scales[numi].classList.remove("ratingselected");
      lockedin[numi] = false;
      scales[numi].children[2].style.display = "none";

      checkblank();

    }

    scales[i].onmouseout = () => {

      if(lockedin[numi] != false) return;

      for(var i = 0; i < buttons.length; i++){

        buttons[i].setAttribute("value", -i - 1)

      }

      scales[numi].children[1].children[0].innerHTML = "";

    }

    for(var j = 0; j < buttons.length; j++){

      buttons[j].setAttribute("value", -j - 1);

      let num = j;

      buttons[j].onmouseover = () => {


        if(lockedin[numi] != false) return;

        for(var a = 0; a < buttons.length; a++){
          let value = num;

          if(name == "Difficulty" || name == "Workload") value = buttons.length - num - 1;

          if(a > num) value = -a - 1;

          if(isapscore && value >= 0) value = buttons.length - 1;

          buttons[a].setAttribute("value", value);
        }

        if(!isapscore){

          let label = opiniontypes[ratingnames.indexOf(name)][num];
          scales[numi].children[1].children[0].innerHTML = label;

        }


      }

      buttons[j].onclick = () => {

        lockedin[numi] = 0.2 + num / buttons.length;

        for(var a = 0; a < buttons.length; a++){
          let value = num;

          if(name == "Difficulty" || name == "Workload") value = buttons.length - num - 1;

          if(a > num) value = -a - 1;

          if(isapscore && value >= 0) value = buttons.length - 1;

          buttons[a].setAttribute("value", value);
        }

        if(!isapscore){

          let label = opiniontypes[ratingnames.indexOf(name)][num];
          scales[numi].children[1].children[0].innerHTML = label;

        }

        scales[numi].classList.add("ratingselected");

        scales[numi].children[2].style.display = "";

        checkblank();

      }


    }


  }

}

let opinionuploaded = false;
let opinionuploading = false;

function clearopinion(){

  let ratings = document.getElementsByClassName("setrating");

  for(var i = 0; i < ratings.length; i++){

    if(ratings[i].children[2].style.display != "none"){
      ratings[i].children[2].click();
    }

    let scale = ratings[i].children[1].children[1];

    for(var j = 0; j < scale.children.length; j++){

      scale.children[j].setAttribute("value", -j - 1);

    }

    ratings[i].children[1].children[0].innerHTML = " ";

  }

  let checkbox = document.getElementById("agreementcheckbox");

  if(checkbox.checked){
    checkbox.click();
  }

  let authorinp = document.getElementById("opinioninputauthor");
  let contentinp = document.getElementById("opinioninputmsg");

  authorinp.value = "";
  contentinp.value = "";

  checkblank();


}

let opinionFadeNum = 0;

function submitopinion(me){

  if(opinionuploading) return;

  opinionuploading = true

  me.classList.add("opinionuploading")

  let author = document.getElementById("opinioninputauthor").value;
  let content = document.getElementById("opinioninputmsg").value;

  let comment = {
    author: author,
    content: content,
    rating: {},
  }

  for(var i = 0; i < lockedin.length; i++){

    if(lockedin[i] != false){

      comment.rating[ratingnames[i]] = lockedin[i];

    }

  }

  me.children[0].style.display = "none";
  me.children[1].style.display = "";

  let cancelbutton = document.getElementById("opinioncancel");

  cancelbutton.disabled = true;

  let permaBanned = localStorage.getItem("banned") || false;

  if(permaBanned){
    setTimeout(() => {
      opinionuploaded = "failed";
      document.getElementById("opinionfailed").textContent = "You are permanently banned due to vulgar language.";
    }, 1000)
  }
  else{
    socket.emit("opinion", classopen, comment);
  }


  let myinterval = setInterval(() => {

    if(opinionuploaded != false){


      me.children[0].style.display = "";
      me.children[1].style.display = "none";
      me.classList.remove("opinionuploading")
      cancelbutton.disabled = false;

      if(opinionuploaded == true){
        removeopinion()
      }
      else{

        let failedupload = document.getElementById("opinionfailed");
        failedupload.style.opacity = 1;
        opinionFadeNum++;
        let num = opinionFadeNum;


        setTimeout(() => {
          if(num == opinionFadeNum) failedupload.style.opacity = 0;
        }, 5000);

      }



      clearInterval(myinterval);
      opinionuploaded = false;
      opinionuploading = false;

    }


  }, 100)



}
