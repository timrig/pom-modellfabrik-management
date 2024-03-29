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
var ivlStatus=0;
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
var timerAZ=0;
var timerAZ2=0;
var timerAZ3=0;
var schichtende=true;
var abfrageAuftragV2=false;
var abfrageAuftragV3=false;
var abfrageUpdateParameter=false;
var dlzBufferFertig;
var dlzBufferAusschuss;
var rowBufferFertig;
var rowBufferAusschuss;
var abfrageDLZ=false;
var zeitEnde;
var zeitEndeV2;
var zeitEndeV3;
var schichtAbfrage=false;
var resetAbfrage=false;
var istV2Plus;
var istV2Minus;
var istV3Plus;
var istV3Minus;

//Soll Parameter
function sollBtn() {
  if(schichtAbfrage==true) alert("Die Parameter können nur bei inaktiver Schicht verändert werden!");
  else {
    if(document.getElementById("sollAnzV1").value!="NaN"){
      sollAnzV1=document.getElementById("sollAnzV1").value;
      document.getElementById("soll1").innerHTML=sollAnzV1;
      sollAnz=parseInt(sollAnzV1);
    }
    if(document.getElementById("schichtzeit").value!="NaN"){
      schichtzeit=document.getElementById("schichtzeit").value;
      document.getElementById("soll2").innerHTML=schichtzeit;
    }
  }
}

//Schichtstart
function startBtn() {
  schichtAbfrage = true;
  let text = "Soll wirklich eine neue Schicht gestartet werden?";
  if (confirm(text) == true) {
    if((sollAnzV1=="") || schichtzeit=="") {
      alert("Bitte alle Parameter festlegen!");
    }
    else {
      startSchicht();
    }
  }
  mqttPubStart(sollAnzV1,schichtzeit);
}

function startSchicht() {
  istAnz=0;
  istAnzV1=0;
  istAnzV2=0;
  istAnzV3=0;
  sollAnzV2=0;
  sollAnzV3=0;
  ausschuss=0;
  teileAnzMin=0;
  sollAnzProZeit=0;
  sollAnzV1ProZeit=0;
  sollAnzV2ProZeit=0;
  sollAnzV3ProZeit=0;
  istV2Plus=0;
  istV2Minus=0;
  istV3Plus=0;
  istV3Minus=0;
  document.getElementById("istAnzZeit").innerHTML=teileAnzMin;
  document.getElementById("istAnz").innerHTML=istAnz;
  document.getElementById("ausschussAnt").innerHTML="0&#037;";
  document.getElementById("istGes").innerHTML=istAnz;
  document.getElementById("sollAnz").innerHTML="0";
  document.getElementById("sollGes").innerHTML=sollAnz;
  document.getElementById("prod").innerHTML="0&#037;";
  document.getElementById("istV2Plus").innerHTML = istV2Plus;
  document.getElementById("istV2Minus").innerHTML = istV2Minus;
  document.getElementById("istV3Plus").innerHTML = istV3Plus;
  document.getElementById("istV3Minus").innerHTML = istV3Minus;
  document.getElementById("istV2").innerHTML=istAnzV2;
  document.getElementById("sollV2").innerHTML=sollAnzV2;
  document.getElementById("istV3").innerHTML=istAnzV3;
  document.getElementById("sollV3").innerHTML=sollAnzV3;
  updateChart(ausschuss,1,"ausschussAntChart");
  updateChart(sollAnz,istAnz,"erfuellungChart");
  if(sollAnzV2 > 0 && zeitV2 > 0) {
    updateIvl(2);
  }
  else {
    sollAnzV2=0;
    ivlV2=0;
  }
  if(sollAnzV3 > 0 && zeitV3 > 0) {
    updateIvl(3);
  }
  else {
    sollAnzV3=0;
    ivlV3=0;
  }
  let time = new Date();
  time.setMinutes(time.getMinutes() + parseInt(schichtzeit));
  zeitEnde = time.getTime();
  timerAZ=setInterval(function() {azTimer(1)},1000);
  t=setInterval(teileProMin,60*1000);
  updateIvl(1);
  console.log("Schicht gestartet!");
  statusOn("Die Schicht wurde erfolgreich gestartet!");
  document.getElementById("divStart").style.display = "none";
  document.getElementById("divEnde").style.display = "block";
}

function azTimer(v) {
  let now = new Date().getTime();
  let ende;
  let zeit;
  if(v==1) {
    ende = zeitEnde;
    zeit = parseInt(schichtzeit);
  }
  else if(v==2) {
    ende = zeitEndeV2;
    zeit = parseInt(6);
  }
  else if(v==3) {
    ende = zeitEndeV3;
    zeit = parseInt(10);
  }
  let schichtTimer=zeit*60-((ende - now)/1000);
  let hour = Math.floor(schichtTimer / 3600);
  let minute = Math.floor((schichtTimer - hour*3600)/60);
  let seconds = (schichtTimer - (hour*3600 + minute*60)).toFixed(0);
  if(hour < 10) hour = "0"+hour;
  if(minute < 10) minute = "0"+minute;
  if(seconds < 10) seconds = "0"+seconds;
  if(v==1) {
    document.getElementById("schichtTimer").innerHTML = "Arbeitszeit: " + hour + ":" + minute + ":" + seconds;
    if(Math.round(schichtTimer) <= (zeit*60)) updateTimeChart(schichtTimer,zeit*60,v);
  }
  if(v>1 && Math.round(schichtTimer) <= (zeit*60)) {
    let timer;
    if(v==2) timer="zeitV2";
    else if(v==3) timer="zeitV3";
    document.getElementById(timer).innerHTML = "Arbeitszeit: " + hour + ":" + minute + ":" + seconds;
    updateTimeChart(schichtTimer,zeit*60,v);
  }
  else {
    if(v==2) {
        clearInterval(timerAZ2);
    }
    else if(v==3) {
        clearInterval(timerAZ3);
    }
  }
}

function updateIvl(v) {
  let now = new Date().getTime();
  let ende;
  let zeit;
  if(v==1) {
    ende = parseInt(zeitEnde);
    zeit = parseInt(schichtzeit);
    let schichtTimer=zeit*60000-(ende - now);
    if(x>0) clearInterval(x);
    ivlV1=Math.round((zeit*60000-schichtTimer)/(sollAnzV1-sollAnzV1ProZeit));
    console.log(ende,zeit,ivlV1);
    sqlQuerySchichtUpdate(true);
    x=setInterval(function() {sollProZeit(1)},ivlV1);
  }
  else if(v==2) {
    if(y>0) clearInterval(y);
    ivlV2=Math.round((6/2)*60*1000);
    if(schichtende==false) sqlQuerySchichtUpdate(true);
    y=setInterval(function() {sollProZeit(2)},ivlV2);
  }
  else if(v==3) {
    if(z>0) clearInterval(z);
    ivlV3=Math.round((7/4)*60*1000);
    if(schichtende==false) sqlQuerySchichtUpdate(true);
    z=setInterval(function() {sollProZeit(3)},ivlV3);
  } 
}

function auftragV1Btn() {
  sollAnzV2+=2;
  console.log("Auftrag Variante 1 angenommen");
  document.getElementById("sollV2").innerHTML = sollAnzV2;
  sollAnzV1-=2;
  updateIvl(1);
  zeitV2=6;
  updateIvl(2);
  abfrageAuftragV2=true;
  mqttPubAuftrag(2,ivlV1);
  let time = new Date();
  time.setMinutes(time.getMinutes() + parseInt(6));
  zeitEndeV2 = time.getTime();
  timerAZ2=setInterval(function() {azTimer(2)},1000);
  updateChart(sollAnzV2,istAnzV2,"erfuellungChartV2");
  statusOn("Auftrag für Variante 1 (Losgröße: 2, Zeit: 6min) wurde erfolgreich angenommen!");
}

function auftragV2Btn() {
  sollAnzV3+=4;
  console.log("Auftrag Variante 2 angenommen");
  document.getElementById("sollV3").innerHTML = sollAnzV3;
  sollAnzV1-=4;
  updateIvl(1);
  zeitV3=7;
  updateIvl(3);
  abfrageAuftragV3=true;
  mqttPubAuftrag(3,ivlV1);
  let time = new Date();
  time.setMinutes(time.getMinutes() + parseInt(10));
  zeitEndeV3 = time.getTime();
  timerAZ3=setInterval(function() {azTimer(3)},1000);
  updateChart(sollAnzV3,istAnzV3,"erfuellungChartV3");
  statusOn("Auftrag für Variante 2 (Losgröße: 4, Zeit: 7min) wurde erfolgreich angenommen!");
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
    document.getElementById("divStart").style.display = "block";
    document.getElementById("divEnde").style.display = "none";
    schichtAbfrage = false;
    clearInterval(t);
    clearInterval(timerAZ);
    schichtende=true;
    sqlQuerySchichtUpdate(false);
  }
  else sqlQuerySchichtUpdate(true);
}

//Fertiges Bauteil
function fertig(linie,variante) {
  if(variante==1) {
    istAnzV1++;
    if(linie==1 && dlzBufferFertig>0) {
      zeitR1[linie + "," + idStr]=0;
      dlz = (new Date().getTime()-dlzBufferFertig)/1000;
      dlzBufferFertig = 0;
      var table = document.getElementById("durchTbl");
      table.rows[rowBufferFertig].cells[3].innerHTML = dlz.toFixed(2) + " Sekunden";
      durchZeiten(dlz);
    }
  }
  else if(variante==2) {
    istAnzV2++;
    if(istAnzV2==sollAnzV2) clearInterval(timerAZ2);
    updateChart(sollAnzV2,istAnzV2,"erfuellungChartV2");
    document.getElementById("istV2").innerHTML = istAnzV2;
    let now = new Date().getTime();
    if((zeitEndeV2 - now)/1000>0) {
      istV2Plus++;
      document.getElementById("istV2Plus").innerHTML = istV2Plus;
    }
    else {
      istV2Minus++;
      document.getElementById("istV2Minus").innerHTML = istV2Minus;
    }
  }
  else if(variante==3) {
    istAnzV3++;
    if(istAnzV3==sollAnzV3) clearInterval(timerAZ3);
    updateChart(sollAnzV3,istAnzV3,"erfuellungChartV3");
    document.getElementById("istV3").innerHTML = istAnzV3;
    let now = new Date().getTime();
    if((zeitEndeV3 - now)/1000>=180) {
      istV3Plus++;
      document.getElementById("istV3Plus").innerHTML = istV3Plus;
    }
    else {
      istV3Minus++;
      document.getElementById("istV3Minus").innerHTML = istV3Minus;
    }
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
  document.getElementById("ausschussAnt").innerHTML = ausschussAnt + "&#037;";
  produkt();
  updateChart(ausschuss,istAnz,"ausschussAntChart");
  updateChart(sollAnz,istAnz,"erfuellungChart");
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Produktivität
function produkt() {
  prod=(istAnz/sollAnzProZeit*100).toFixed(2);
  document.getElementById("prod").innerHTML = prod + "&#037;";
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

//Berechnung Teile pro Minute
function teileProMin() {
  teileAnzMin=(istAnz/min).toFixed(2);
  min++;
  document.getElementById("istAnzZeit").innerHTML=teileAnzMin;
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Ausschuss
function ausschussTeile(linie,station) {
  if(station==0) {
    ausschuss--;
    istAnzV1++;
    istAnz=parseInt(istAnzV1)+parseInt(istAnzV2)+parseInt(istAnzV3);
    document.getElementById("istAnz").innerHTML=istAnz;
    document.getElementById("istGes").innerHTML=istAnz;
    updateChart(sollAnz,istAnz,"erfuellungChart");
      if(linie==1 && dlzBufferAusschuss>0) {
        zeitR1[linie + "," + idStr]=0;
        dlz = (new Date().getTime()-dlzBufferAusschuss)/1000;
        dlzBufferAusschuss = 0;
        var table = document.getElementById("durchTbl");
        table.rows[rowBufferAusschuss].cells[3].innerHTML=dlz.toFixed(2) + " Sekunden";
        durchZeiten(dlz);
      }
  }
  else ausschuss++;
  if(linie==1 && station==3 && dlzBufferFertig>0) dlzBufferFertig=0;
  ausschussAnt=(ausschuss/(parseInt(ausschuss)+parseInt(istAnz))*100).toFixed(2);
  document.getElementById("ausschussAnt").innerHTML = ausschussAnt + "&#037;";
  tblDefekt();
  updateChart(ausschuss,istAnz,"ausschussAntChart");
  if(schichtende==false) sqlQuerySchichtUpdate(true);
}

//Tabelle Durchlaufzeiten
function durchTbl(linie,pos,klasse,id) {
  idStr=String(id);
  console.log("RFID " + idStr + " gelesen an Linie " + linie + " und Position " + pos);
  if(pos===1) {
    if (typeof zeitR1[linie + "," + idStr] === 'undefined' || zeitR1[linie + "," + idStr] === 0) {
      zeitR1[linie + "," + idStr] = new Date().getTime();
      console.log("Startzeit für RFID " + idStr + " an Linie " + linie + " gespeichert");
    }
  }
  else if(pos===2 && zeitR1[linie + "," + idStr]>0 && klasse===1) {
    console.log("Fertigungszeit für RFID " + idStr + " an Linie " + linie + " gespeichert");
    dlz = (new Date().getTime() - zeitR1[linie + "," + idStr]) / 1000;
    dlzBufferFertig = zeitR1[linie + "," + idStr];
    var table = document.getElementById("durchTbl");
    var newRow = table.insertRow(table.rows.length);
    var cell = newRow.insertCell(0);
    cell.classList.add("vierBorder");
    cell.innerHTML = id;
    var cell = newRow.insertCell(1);
    cell.classList.add("vierBorder");
    cell.innerHTML = dlz.toFixed(2) + " Sekunden";
    var cell = newRow.insertCell(2);
    cell.classList.add("vierBorder");
    var cell = newRow.insertCell(3);
    cell.classList.add("vierBorder");
    rowBufferFertig = table.rows.length-1;
  }
  else if(pos===2 && zeitR1[linie + "," + idStr]>0 && klasse===2) {
    console.log("Fertigungszeit für RFID " + idStr + " an Linie " + linie + " gespeichert");
    dlz = (new Date().getTime() - zeitR1[linie + "," + idStr]) / 1000;
    dlzBufferAusschuss = zeitR1[linie + "," + idStr];
    var table = document.getElementById("durchTbl");
    var newRow = table.insertRow(table.rows.length);
    var cell = newRow.insertCell(0);
    cell.classList.add("vierBorder");
    cell.innerHTML = id;
    var cell = newRow.insertCell(1);
    cell.classList.add("vierBorder");
    var cell = newRow.insertCell(2);
    cell.classList.add("vierBorder");
    cell.innerHTML = dlz.toFixed(2) + " Sekunden";
    var cell = newRow.insertCell(3);
    cell.classList.add("vierBorder");
    rowBufferAusschuss = table.rows.length-1;
  }
}

//Durchschnitt der Durchlaufzeiten
function durchZeiten(dlz) {
  durchZeit+=dlz;
  durchZeitMW=durchZeit/count;
  console.log("Durchschnittliche Durchlaufzeit: " + durchZeitMW);
  document.getElementById("durchZeit").innerHTML = durchZeitMW.toFixed(2) + " Sek.";
  count++;
}

//Paramter Personal, Krankheit und Unfallfrei updaten
function updateBtn() {
  abfrageUpdateParameter = true;
  let text="";
  if(document.getElementById("personal").value!=""){
    personal=document.getElementById("personal").value;
    document.getElementById("soll3").innerHTML=personal;
    text+="Mitarbeiterzahl ";
  }
  if(document.getElementById("krankheit").value!=""){
    krankheit=document.getElementById("krankheit").value;
    document.getElementById("soll4").innerHTML=krankheit;
    text+="Krankheitsfälle ";
  }
  if(document.getElementById("unfallfrei").value!=""){
    unfallfrei=document.getElementById("unfallfrei").value;
    document.getElementById("soll5").innerHTML=unfallfrei;
    text+="Unfallfrei ";
  }
  personalVerf=((personal-krankheit)/personal*100).toFixed(2);
  document.getElementById("personalVerf").innerHTML = personalVerf + "&#037;";
  updateChart(personal,krankheit,"krankChart");
  if(unfallfrei>0 && unfallfrei<=1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tag";
  if(unfallfrei>1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tagen";
  sqlQuerySchichtUpdate(true);
  text+=" erfolgreich aktualisiert!"
  statusOn(text);
  mqttPubUpdateParameter();
}

function schichtEnde() {
  let text = "Soll die aktive Schicht wirklich beendet werden?";
  if (confirm(text) == true) {
    schichtAbfrage = false;
    document.getElementById("divStart").style.display = "block";
    document.getElementById("divEnde").style.display = "none";
    clearInterval(x);
    clearInterval(y);
    clearInterval(z);
    clearInterval(timerAZ);
    clearInterval(timerAZ2);
    clearInterval(timerAZ3);
    sqlQuerySchichtUpdate(false);
    mqttPubSchichtende();
  }
}

//Reset
function reset() {
  let text = "Sollen die Daten wirklich zurückgesetzt werden?";
  if (confirm(text) == true) {
    schichtEnde();
    resetAbfrage = true;
    mqttPubReset();
    console.log("Reset!");
    clearInterval(x);
    clearInterval(y);
    clearInterval(z);
    clearInterval(timerAZ);
    clearInterval(timerAZ2);
    clearInterval(timerAZ3);
    istAnz=0,
    ausschuss=0,
    sollAnz=0,
    sollAnzV1=0,
    sollAnzV2=0,
    sollAnzV3=0,
    sollAnzProZeit=0,
    sollAnzV1ProZeit=0,
    sollAnzV2ProZeit=0,
    sollAnzV3ProZeit=0,
    ivlV1=0,
    ivlV2=0,
    ivlV3=0,
    min=1,
    unfallfrei=0,
    krankheit=0,
    personal=0,
    istAnzV1=0,
    istAnzV2=0,
    istAnzV3=0,
    durchZeitMW=0,
    schichtzeit=0,
    zeitEnde=0,
    zeitEndeV2=0;
    zeitEndeV3=0;
    istV2Plus=0;
    istV2Minus=0;
    istV3Plus=0;
    istV3Minus=0;
    sqlQuerySchichtUpdate(false);
    setTimeout(location.reload.bind(location), 1000);
  }
}

//Status anzeigen
function statusOn(text) {
  document.getElementById("statusText").innerHTML = text;
  document.getElementById("status").style.display = "block";
  ivlStatus=setInterval(statusOff,5*1000);
}

//Status ausblenden
function statusOff() {
  document.getElementById("statusText").innerHTML = "";
  document.getElementById("status").style.display = "none";
  clearInterval(ivlStatus);
}