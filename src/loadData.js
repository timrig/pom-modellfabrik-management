async function getLoadData() {
    const id = 1;
    const endpoint = `/data-api/rest/Schicht/ID`;
    const response = await fetch(`${endpoint}/${id}`);
    const result = await response.json();
    console.table(result.value);
    schichtAbfrage=result.value[0].Schicht
    if(schichtAbfrage==true) {
        document.getElementById("divStart").style.display = "none";
        document.getElementById("divEnde").style.display = "block";
    }
    else {
        document.getElementById("divStart").style.display = "block";
        document.getElementById("divEnde").style.display = "none";
    }
    sollAnz=result.value[0].SollGes;
    document.getElementById("sollGes").innerHTML=sollAnz;
    schichtzeit=result.value[0].Schichtzeit;
    sollAnzV1=result.value[0].sollGesV1;
    sollAnzV2=result.value[0].sollGesV2;
    sollAnzV3=result.value[0].sollGesV3;
    sollAnzProZeit=result.value[0].SollZeit;
    document.getElementById("sollAnz").innerHTML=sollAnzProZeit;
    sollAnzV1ProZeit=result.value[0].SollZeitV1;
    sollAnzV2ProZeit=result.value[0].SollZeitV2;
    sollAnzV3ProZeit=result.value[0].SollZeitV3;
    ivlV1=result.value[0].IntervalV1;
    ivlV2=result.value[0].IntervalV2;
    ivlV3=result.value[0].IntervalV3;
    istAnz=result.value[0].Fertig;
    istAnzV1=result.value[0].FertigV1;
    istAnzV2=result.value[0].FertigV2;
    istAnzV3=result.value[0].FertigV3;
    document.getElementById("istAnz").innerHTML=istAnz;
    document.getElementById("istGes").innerHTML=istAnz;
    ausschuss=result.value[0].Defekt;
    ausschussAnt=(ausschuss/(parseInt(ausschuss)+parseInt(istAnz))*100).toFixed(2);
    document.getElementById("ausschussAnt").innerHTML=ausschussAnt + "&#037;";
    min=result.value[0].TeileProMin;
    document.getElementById("istAnzZeit").innerHTML=teileAnzMin;
    produkt();
    teileProMin();
    personal=result.value[0].MitarbeiterProSchicht;
    krankheit=result.value[0].Krankheitsfälle;
    unfallfrei=result.value[0].Unfallfrei;
    durchZeitMW=result.value[0].DDLZ;
    document.getElementById("durchZeit").innerHTML = durchZeitMW.toFixed(2) + " Sek.";
    if(result.value[0].ZeitEnde>0) {
        zeitEnde=result.value[0].ZeitEnde;
        if(zeitEnde>0) timerAZ=setInterval(azTimer,1000);
    }
    else zeitEnde=0;
    personalVerf=((personal-krankheit)/personal*100).toFixed(2);
    document.getElementById("personalVerf").innerHTML = personalVerf + "&#037;";
    if(unfallfrei>0 && unfallfrei<=1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tag";
    if(unfallfrei>1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tagen";
    updateChart(ausschuss,istAnz,"ausschussAntChart");
    updateChart(sollAnz,istAnz,"erfuellungChart");
    updateChart(personal,krankheit,"krankChart");
    if(result.value[0].Schicht == true) {
        if(ivlV1!=0) {
            x=setInterval(function() {sollProZeit(1)},ivlV1);
            t=setInterval(teileProMin,60*1000);
        }
        if(ivlV2!=0) {
            y=setInterval(function() {sollProZeit(2)},ivlV2);    
        }
        if(ivlV3!=0) {
            z=setInterval(function() {sollProZeit(3)},ivlV3);   
        }
    }
    document.getElementById("soll1").innerHTML=sollAnz;
    document.getElementById("soll2").innerHTML=schichtzeit;
    document.getElementById("soll3").innerHTML=personal;
    document.getElementById("soll4").innerHTML=krankheit;
    document.getElementById("soll5").innerHTML=unfallfrei;
}