function addopinion(){

  document.getElementById("opinioninput").style.display = "";

  document.getElementById("usercomments").style.display = "none";

  pausecommentloading = true;

}

function removeopinion(){


  document.getElementById("opinioninput").style.display = "none";

  document.getElementById("usercomments").style.display = "";

  pausecommentloading = false;

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



function checkblank(){

  let submitbutton = document.getElementById("")

  let inp1 = document.getElementById("opinioninputauthor");
  let inp2 = document.getElementById("opinioninputmsg");

  let blank1 = inp1.value.split(' ').join('').length > 0
  let blank2 = inp2.value.split(' ').join('').length > 1

  let blank3 = false;

  for(var i = 0; i < lockedin.length; i++){
    if(lockedin[i] != false) blank3 = true;
  }

  if(!(blank1 && blank2 && blank3)){

    document.getElementById("opinionsubmit").disabled = true;

  }
  else{
    document.getElementById("opinionsubmit").disabled = false;
  }

}


function setratingscales(){

  let scales = document.getElementsByClassName("setrating");

  let startcol = [230,230,230];
  let endcol = [210,210,210];

  let startcol2 = [255,255,0];
  let endcol2 = [0,255,0];

  for(var i = 0; i < scales.length; i++){

    lockedin.push(false);

    let buttons = scales[i].children[1].children;

    let cols = [];
    let cols2 = [];

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

        buttons[i].style.background = `rgba(${cols[i][0]},${cols[i][1]},${cols[i][2]})`

      }

    }

    for(var j = 0; j < buttons.length; j++){

      let am = j / (buttons.length - 1);

      let col = [];
      let col2 = [];


      for(var k = 0; k < startcol.length; k++){
        col.push(startcol[k] + am * (endcol[k] - startcol[k]));
        col2.push(startcol2[k] + am * (endcol2[k] - startcol2[k]));
      }

      cols.push(col);
      cols2.push(col2);


      buttons[j].style.background = `rgba(${col[0]}, ${col[1]}, ${col[2]})`;

      let num = j;

      buttons[j].onmouseover = () => {


        if(lockedin[numi] != false) return;

        for(var a = 0; a < buttons.length; a++){
          let col = cols2;
          if(a > num){
            col = cols;
          }
          buttons[a].style.background = `rgba(${col[a][0]},${col[a][1]},${col[a][2]})`
        }


      }

      buttons[j].onclick = () => {

        lockedin[numi] = 0.2 + num / buttons.length;

        for(var a = 0; a < buttons.length; a++){
          let col = cols2;
          if(a > num){
            col = cols;
          }
          buttons[a].style.background = `rgba(${col[a][0]},${col[a][1]},${col[a][2]})`
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
