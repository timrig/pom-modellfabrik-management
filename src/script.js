var sollAnzV1=0;
var sollAnzV2=0;
var sollAnzV3=0;
var sollAnz=0;
var schichtzeit=0;
var personal=0;
var personalVerf=0;
var krankheit=0;
var unfallfrei=0;
var sollAnzProZeit=0;
var sollAnzV1ProZeit=0;
var sollAnzV2ProZeit=0;
var sollAnzV3ProZeit=0;
var zeitV2=0;
var zeitV3=0;
var istAnz=0;
var istAnzV1=0;
var istAnzV2=0;
var istAnzV3=0;
var erf=0;
var zeit=0;
var zeitAlt;
var durchZeit=0;
var durchZeitMW=0;
var nr=0;
var zeitSumme=0;
var taktIst=0;
var prod=0;
var ausschuss=0;
var ausschussAnt=0;
var x=0;
var y=0;
var z=0;
var teileAnzMin=0;
var min=1;
var reihe=1;
var option;
var station;
var count=1;
var zeitR1={};
var idStr="";
var ivlV1=0;
var ivlV2=0;
var ivlV3=0;
var schichtende=true;
var abfrageAuftragV2=false;
var abfrageAuftragV3=false;

//Soll Parameter
function sollBtn() {
  if(document.getElementById("sollAnzV1").value!="NaN"){
    sollAnzV1=document.getElementById("sollAnzV1").value;
    document.getElementById("soll1").innerHTML=sollAnzV1;
    sollAnz=parseInt(sollAnzV1);
  }
  if(document.getElementById("schichtzeit").value!="NaN"){
    schichtzeit=document.getElementById("schichtzeit").value;
    document.getElementById("soll2").innerHTML=schichtzeit;
  }
  if(document.getElementById("personal").value!="NaN"){
    personal=document.getElementById("personal").value;
    document.getElementById("soll3").innerHTML=personal;
  }
  if(document.getElementById("krankheit").value!="NaN"){
    krankheit=document.getElementById("krankheit").value;
    document.getElementById("soll4").innerHTML=krankheit;
  }
  if(document.getElementById("unfallfrei").value!="NaN"){
    unfallfrei=document.getElementById("unfallfrei").value;
    document.getElementById("soll5").innerHTML=unfallfrei;
  }
  updateParameter();
}

//Update Personalverfügbarkeit
function updateParameter() {
  personalVerf=((personal-krankheit)/personal*100).toFixed(2);
  document.getElementById("personalVerf").innerHTML=personalVerf;
  updateChart(personal,krankheit,"krankChart");
  document.getElementById("unfallfreiSeit").innerHTML=unfallfrei;
}

//Schichtstart
function startBtn() {
  if((sollAnzV1=="") || schichtzeit=="") {
    alert("Bitte alle Parameter festlegen!");
  }
  else {
    istAnz=0;
    istAnzV1=0;
    istAnzV2=0;
    istAnzV3=0;
    ausschuss=0;
    teileAnzMin=0;
    sollAnzProZeit=0;
    sollAnzV1ProZeit=0;
    sollAnzV2ProZeit=0;
    sollAnzV3ProZeit=0;
    document.getElementById("istAnzZeit").innerHTML=teileAnzMin;
    document.getElementById("istAnz").innerHTML=istAnz;
    document.getElementById("ausschussAnt").innerHTML="0";
    document.getElementById("istGes").innerHTML=istAnz;
    document.getElementById("sollAnz").innerHTML="0";
    document.getElementById("sollGes").innerHTML=sollAnz;
    document.getElementById("prod").innerHTML="0";
    updateChart(ausschuss,istAnz,"ausschussAntChart");
    updateChart(sollAnz,istAnz,"erfuellungChart");
    if(document.getElementById("sollAnzV2").value > 0 && document.getElementById("sollAnzV2Zeit").value > 0) {
      sollAnzV2=document.getElementById("sollAnzV2").value;
      sollAnz+=parseInt(sollAnzV2);
      zeitV2=document.getElementById("sollAnzV2Zeit").value;
      document.getElementById("sollGes").innerHTML=sollAnz;
      ivlV2=Math.round((zeitV2/sollAnzV2)*60*1000);
      y=setInterval(function() {sollProZeit(2)},ivlV2);
    }
    else {
      sollAnzV2=0;
      ivlV2=0;
    }
    if(document.getElementById("sollAnzV3").value > 0 && document.getElementById("sollAnzV3Zeit").value > 0) {
      sollAnzV3=document.getElementById("sollAnzV3").value;
      sollAnz+=parseInt(sollAnzV3);
      zeitV3=document.getElementById("sollAnzV3Zeit").value;
      document.getElementById("sollGes").innerHTML=sollAnz;
      ivlV3=Math.round((zeitV3/sollAnzV3)*60*1000);
      z=setInterval(function() {sollProZeit(3)},ivlV3);
    }
    else {
      sollAnzV3=0;
      ivlV3=0;
    }
    console.log("Schicht gestartet!");
    document.getElementById("management").style.display = "none";
    document.getElementById("übersicht").style.display = "block";
    document.getElementById("übersicht2").style.display = "block";
    document.getElementById("export").style.display = "none";
    document.getElementById("btnManagement").style.backgroundColor = "#00a2ff";
    document.getElementById("btnUebersicht").style.backgroundColor = "#00a2ff";
    document.getElementById("btnUebersicht2").style.backgroundColor = "#d3d3d3";
    document.getElementById("btnExport").style.backgroundColor = "#00a2ff";
  }
  ivlV1=Math.round((schichtzeit/sollAnzV1)*60*1000);
  sqlQuerySchichtUpdate(true);
  x=setInterval(function() {sollProZeit(1)},ivlV1);
  t=setInterval(teileProMin,60*1000);
}

function auftragV2Btn() {
  sollAnzV2=document.getElementById("sollAnzV2").value;
  console.log("Auftrag angenommen");
  sollAnz+=parseInt(sollAnzV2);
  console.log("Soll-Gesamt: " + sollAnz);
  zeitV2=document.getElementById("sollAnzV2Zeit").value;
  document.getElementById("sollGes").innerHTML=sollAnz;
  ivlV2=Math.round((zeitV2/sollAnzV2)*60*1000);
  if(schichtende==false) sqlQuerySchichtUpdate(true);
  y=setInterval(function() {sollProZeit(2)},ivlV2);
  abfrageAuftragV2=true;
  mqttPubAuftrag(2,sollAnzV2,ivlV2);
}

function auftragV3Btn() {
  sollAnzV3=document.getElementById("sollAnzV3").value;
  console.log("Auftrag angenommen");
  sollAnz+=parseInt(sollAnzV3);
  console.log("Soll-Gesamt: " + sollAnz);
  zeitV3=document.getElementById("sollAnzV3Zeit").value;
  document.getElementById("sollGes").innerHTML=sollAnz;
  ivlV3=Math.round((zeitV3/sollAnzV3)*60*1000);
  if(schichtende==false) sqlQuerySchichtUpdate(true);
  z=setInterval(function() {sollProZeit(3)},ivlV3);
  abfrageAuftragV3=true;
  mqttPubAuftrag(3,sollAnzV3,ivlV3);
}


function sollProZeit(v) {
  if(v==1) {
    sollAnzV1ProZeit++;
    if(sollAnzV1ProZeit==sollAnzV1) {
      console.log("Soll Stecker V1 fertig!");
      clearInterval(x);
      ivlV1=0;
    }
  }
  else if(v==2) {
    sollAnzV2ProZeit++;
    if(sollAnzV2ProZeit==sollAnzV2) {
      console.log("Soll Stecker V2 fertig!");
      clearInterval(y);
      ivlV2=0;
      abfrageAuftragV2=false;
    }
  }
  else if(v==3) {
    sollAnzV3ProZeit++;
    if(sollAnzV3ProZeit==sollAnzV3) {
      console.log("Soll Stecker V3 fertig!");
      clearInterval(z);
      ivlV3=0;
      abfrageAuftragV3=false;
    }
  }
  sollAnzProZeit++;
  document.getElementById("sollAnz").innerHTML=sollAnzProZeit;
  produkt();
  if(parseInt(sollAnzV1ProZeit)+parseInt(sollAnzV2ProZeit)+parseInt(sollAnzV3ProZeit)==parseInt(sollAnz)){
    console.log("Schichtende!");
    clearInterval(t);
    schichtende=true;
    sqlQuerySchichtUpdate(false);
  }
  else sqlQuerySchichtUpdate(true);
}

//Fertiges Bauteil
function fertig(variante) {
  if(variante==1) {
    istAnzV1++;
  }
  else if(variante==2) {
    istAnzV2++;
  }
  else if(variante==3) {
    istAnzV3++;
  }
  tblFertig();
  datenAktualisierung();
}

function datenAktualisierung() {
  istAnz=parseInt(istAnzV1)+parseInt(istAnzV2)+parseInt(istAnzV3);
  document.getElementById("istAnz").innerHTML=istAnz;
  document.getElementById("istGes").innerHTML=istAnz;
  document.getElementById("sollGes").innerHTML=sollAnz;
  ausschussAnt=(ausschuss/(ausschuss+istAnz)*100).toFixed(2);
  document.getElementById("ausschussAnt").innerHTML=ausschussAnt;
  produkt();
  updateChart(ausschuss,istAnz,"ausschussAntChart");
  updateChart(sollAnz,istAnz,"erfuellungChart");
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Produktivität
function produkt() {
  prod=(istAnz/sollAnzProZeit*100).toFixed(2);
  document.getElementById("prod").innerHTML=prod;
  let farbe;
  switch (true) {
    case prod >= 80:
      farbe = 'green';
      break;
    case prod >= 40 && prod < 80:
      farbe = 'orange';
      break;
    case prod < 40:
      farbe = 'red';
      break;
    default:
      farbe = 'black';
  }
  document.getElementById("prod").style.color=farbe;
}

//Paramter Personal, Krankheit und Unfallfrei updaten
function updateBtn() {
  if(document.getElementById("personal").value!="NaN"){
    personal=document.getElementById("personal").value;
    document.getElementById("soll3").innerHTML=personal;
  }
  if(document.getElementById("krankheit").value!="NaN"){
    krankheit=document.getElementById("krankheit").value;
    document.getElementById("soll4").innerHTML=krankheit;
  }
  if(document.getElementById("unfallfrei").value!="NaN"){
    unfallfrei=document.getElementById("unfallfrei").value;
    document.getElementById("soll5").innerHTML=unfallfrei;
  }
  updateParameter();
}

//Berechnung Teile pro Minute
function teileProMin() {
  teileAnzMin=(istAnz/min).toFixed(2);
  min++;
  document.getElementById("istAnzZeit").innerHTML=teileAnzMin;
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Ausschuss
function ausschussTeile(station) {
  if(station==0) ausschuss--;
  else ausschuss++;
  ausschussAnt=(ausschuss/(parseInt(ausschuss)+parseInt(istAnz))*100).toFixed(2);
  document.getElementById("ausschussAnt").innerHTML=ausschussAnt;
  tblDefekt();
  updateChart(ausschuss,istAnz,"ausschussAntChart");
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Tabelle Durchlaufzeiten
function durchTbl(linie,pos,id) {
  idStr=String(id);
  console.log("RFID " + idStr + " gelesen an Linie " + linie + " und Position " + pos);
  if(pos===1) {
    if (typeof zeitR1[linie + "," + idStr] === 'undefined' || zeitR1[linie + "," + idStr] === 0) {
      zeitR1[linie + "," + idStr] = new Date().getTime();
      console.log("Startzeit für RFID " + idStr + " an Linie " + linie + " gespeichert");
    }
  }
  else if(pos===2 && zeitR1[linie + "," + idStr]>0) {
    console.log("Fertigungszeit für RFID " + idStr + " an Linie " + linie + " gespeichert");
    dlz = (new Date().getTime() - zeitR1[linie + "," + idStr]) / 1000;
    zeitR1[linie + "," + idStr]=0;
    var table = document.getElementById("durchTbl");
    var newRow = table.insertRow(table.rows.length);
    var cell = newRow.insertCell(0);
    cell.classList.add("zweiBorder");
    cell.innerHTML = "Linie: " + linie;
    var cell = newRow.insertCell(1);
    cell.classList.add("zweiBorder");
    cell.innerHTML = dlz.toFixed(2) + " Sekunden";
    durchZeiten(dlz);
  }
}

//Durchschnitt der Durchlaufzeiten
function durchZeiten(dlz) {
  durchZeit+=dlz;
  durchZeitMW=durchZeit/count;
  console.log("Durchschnittliche Durchlaufzeit: " + durchZeitMW);
  document.getElementById("durchZeit").innerHTML=durchZeitMW.toFixed(2);
  count++;
}

//Reset
function reset() {
  console.log("Reset!");
  clearInterval(x);
  clearInterval(y);
  clearInterval(z);
  sqlQuerySchichtUpdate(false);
  location.reload();
}