function addopinion(){

  document.getElementById("opinioninput").style.display = "";

  document.getElementById("usercomments").style.display = "none";

  pausecommentloading = true;

}

function removeopinion(){


  document.getElementById("opinioninput").style.display = "none";

  document.getElementById("usercomments").style.display = "";

  pausecommentloading = false;

  document.getElementById("classdesc").scrollTop = 0;

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
let ratetitlecomplete = `Rate the course`;

let writeopinion = `Write your opinion<span style="color:red">*</span>`
let writeopinioncomplete = `Write your opinion`

let agreement = `Agreement<span style="color:red">*</span>`
let agreementcomplete = `Agreement`

function clickagreement(event){



  let agreementinp = document.getElementById("agreementcheckbox");

  if(event.target == agreementinp) return;

  agreementinp.click();

}

function checkblank(){

  let submitbutton = document.getElementById("")

  let inp1 = document.getElementById("opinioninputauthor");
  let inp2 = document.getElementById("opinioninputmsg");

  let agreementinp = document.getElementById("agreementcheckbox");

  let blank0 = agreementinp.checked;

  console.log(agreementinp);

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


function setratingscales(){

  let scales = document.getElementsByClassName("setrating");

  for(var i = 0; i < scales.length; i++){

    lockedin.push(false);

    let buttons = scales[i].children[1].children;

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

          buttons[a].setAttribute("value", value);
        }


      }

      buttons[j].onclick = () => {

        lockedin[numi] = 0.2 + num / buttons.length;

        for(var a = 0; a < buttons.length; a++){
          let value = num;

          if(name == "Difficulty" || name == "Workload") value = buttons.length - num - 1;

          if(a > num) value = -a - 1;

          buttons[a].setAttribute("value", value);
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

  socket.emit("opinion", classopen, comment);

  let myinterval = setInterval(() => {

    if(opinionuploaded){

      opinionuploading = false;

      me.children[0].style.display = "";
      me.children[1].style.display = "none";
      me.classList.remove("opinionuploading")

      cancelbutton.disabled = false;

      removeopinion()


      clearInterval(myinterval);

    }


  }, 100)



}
