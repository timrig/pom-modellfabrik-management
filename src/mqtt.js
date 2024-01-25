//Topics
const topic_fertigL1V1 = 'l1/fertig/v1';
const topic_fertigL2V1 = 'l2/fertig/v1';
const topic_fertigL3V1 = 'l3/fertig/v1';
const topic_fertigL3V2 = 'l3/fertig/v2';
const topic_fertigL3V3 = 'l3/fertig/v3';
const topic_ausschussL1S1 = 'l1/ausschuss/s1';
const topic_ausschussL1S2 = 'l1/ausschuss/s2';
const topic_ausschussL1S3 = 'l1/ausschuss/s3';
const topic_ausschussL2S1 = 'l2/ausschuss/s1';
const topic_ausschussL2S2 = 'l2/ausschuss/s2';
const topic_ausschussL2S3 = 'l2/ausschuss/s3';
const topic_ausschussL3S1 = 'l3/ausschuss/s1';
const topic_ausschussL3S2 = 'l3/ausschuss/s2';
const topic_ausschussL3S3 = 'l3/ausschuss/s3';
const topic_rep_1 = 'rep/1';
const topic_rep_2 = 'rep/2';
const topic_rep_3 = 'rep/3';
const topic_dlzL111 = 'l1/dlz/1/1';
const topic_dlzL121 = 'l1/dlz/2/1';
const topic_dlzL112 = 'l1/dlz/1/2';
const topic_dlzL122 = 'l1/dlz/2/2';
const topic_auftragV2 = 'auftrag/v2';
const topic_auftragV3 = 'auftrag/v3';
const topic_schichtende = 'schichtende';
const topic_reset = 'reset';
const topic_updateParameterOrga = 'updateParameter';

var mqttServer;
var mqttUser;
var mqttPassword;

function connectMQTT() {
  if( mqttServer === "" ||
      mqttUser === "" ||
      mqttPassword === ""
  ) {
    alert("Gib alle Parameter an!");
  }
  else {
    document.getElementById("management").style.display = "block";
    document.getElementById("übersicht").style.display = "none";
    document.getElementById("übersicht2").style.display = "none";
    document.getElementById("export").style.display = "none";
    document.getElementById("btnManagement").style.backgroundColor = "#d3d3d3";
    document.getElementById("btnUebersicht").style.backgroundColor = "#00a2ff";
    document.getElementById("btnUebersicht2").style.backgroundColor = "#00a2ff";
    document.getElementById("btnExport").style.backgroundColor = "#00a2ff";
    mqttSub(mqttServer,mqttUser,mqttPassword);
  }
  getLoadData();
}

function mqttSub(server,user,pw) {
    const host = server;
    const port = 8884;
    const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
    const username = user;
    const password = pw;

    const client = new Paho.Client(host, port, clientId);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    let isConnected = false;
    const connectOptions = {
        onSuccess: onConnect,
        userName: username,
        password: password,
        useSSL: true,
    };
    function connect() {
        client.connect(connectOptions);
    }

    function onConnect() {
        console.log('Verbunden zum MQTT Broker');
        isConnected = true;
        client.subscribe('l1/#');
        client.subscribe('l2/#');
        client.subscribe('l3/#');
        client.subscribe('rep/#');
        client.subscribe('auftrag/#');
        client.subscribe('schichtende');
        client.subscribe('reset');
        client.subscribe('updateParameter');
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            isConnected = false;
            console.log('Verbindung verloren: ' + responseObject.errorMessage);
            // Versuche alle 5 Sekunden eine erneute Verbindung
            setTimeout(connect, 5000);
        }
    }

    function onMessageArrived(message) {
        console.log('Nachricht empfangen: ' + message.payloadString);
        if(message.payloadString==topic_fertigL1V1) {
            fertig(1,1);
        }
        else if(message.payloadString==topic_fertigL2V1) {
            fertig(2,1);
        }
        else if(message.payloadString==topic_fertigL3V1) {
            fertig(3,1);
        }
        else if(message.payloadString==topic_fertigL3V2) {
            fertig(3,2);
        }
        else if(message.payloadString==topic_fertigL3V3) {
            fertig(3,3);
        }
        else if(message.payloadString==topic_ausschussL1S1) {
            ausschussTeile(1,1);
        }
        else if(message.payloadString==topic_ausschussL1S2) {
            ausschussTeile(1,2);
        }
        else if(message.payloadString==topic_ausschussL1S3) {
            ausschussTeile(1,3);
        }
        else if(message.payloadString==topic_ausschussL2S1) {
            ausschussTeile(2,1);
        }
        else if(message.payloadString==topic_ausschussL2S2) {
            ausschussTeile(2,2);
        }
        else if(message.payloadString==topic_ausschussL2S3) {
            ausschussTeile(2,3);
        }
        else if(message.payloadString==topic_ausschussL3S1) {
            ausschussTeile(3,1);
        }
        else if(message.payloadString==topic_ausschussL3S2) {
            ausschussTeile(3,2);
        }
        else if(message.payloadString==topic_ausschussL3S3) {
            ausschussTeile(3,3);
        }
        else if(message.payloadString==topic_rep_1) {
            ausschussTeile(1,0);
        }
        else if(message.payloadString==topic_rep_2) {
            ausschussTeile(2,0);
        }
        else if(message.payloadString==topic_rep_3) {
            ausschussTeile(3,0);
        }
        else if (message.destinationName === topic_dlzL111) {
            var id=String(message.payloadString);
            durchTbl(1,1,1,id);
        }
        else if (message.destinationName === topic_dlzL112) {
            var id=String(message.payloadString);
            durchTbl(1,1,2,id);
        }
        else if (message.destinationName === topic_dlzL121) {
            var id=String(message.payloadString);
            durchTbl(1,2,1,id);
        } 
        else if (message.destinationName === topic_dlzL122) {
            var id=String(message.payloadString);
            durchTbl(1,2,2,id);
        }
        else if (message.destinationName === topic_auftragV2 || message.destinationName === topic_auftragV3) {
            var nachricht=String(message.payloadString);
            var nachrichtArray=nachricht.split(",");
            if(nachrichtArray[0]==2 && abfrageAuftragV2==false) {
                console.log("MQTT Auftrag 2 angenommen");
                zeitEnde = nachrichtArray[1];
                mqttAuftragV2();
            }
            else if(nachrichtArray[0]==3 && abfrageAuftragV3==false) {
                console.log("MQTT Auftrag 3 angenommen");
                zeitEnde = nachrichtArray[1];
                mqttAuftragV3();
            }
            abfrageAuftragV2 = false;
            abfrageAuftragV3 = false;
        }
        else if (message.destinationName === topic_schichtende && schichtAbfrage == true) {
            mqttSchichtende();
        }
        else if (message.destinationName === topic_reset && schichtAbfrage == true) {
            mqttReset();
        }
        else if (message.destinationName === topic_updateParameterOrga && abfrageUpdateParameter == false) {
            mqttUpdateParameter();
            abfrageUpdateParameter = false;
        }
    }
    connect();
}

function mqttPubAuftrag(v,zeit) {
    const host = mqttServer;
    const port = 8884;
    const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
    const username = mqttUser;
    const password = mqttPassword;

    const client = new Paho.Client(host, port, clientId);

    const connectOptions = {
        onSuccess: onConnectPub,
        userName: username,
        password: password,
        useSSL: true,
    };
    function connectPub() {
        client.connect(connectOptions);
    }

    function onConnectPub() {
        var messagePub = v + "," + zeit;
        if(v==2) {
            client.publish("auftrag/v2", messagePub);
        }
        else if(v==3) {
            client.publish("auftrag/v3", messagePub);
        }
    }
    connectPub();
}

function mqttAuftragV2(){
    sollAnzV2+=2;
    console.log("Auftrag Variante 1 angenommen");
    document.getElementById("sollV2").innerHTML = sollAnzV2;
    sollAnzV1-=2;
    updateIvl(1);
    zeitV2=6;
    updateIvl(2);
    let time = new Date();
    time.setMinutes(time.getMinutes() + parseInt(6));
    zeitEndeV2 = time.getTime();
    timerAZ2=setInterval(function() {azTimer(2)},1000);
    updateChart(sollAnzV2,istAnzV2,"erfuellungChartV2");
    statusOn("Auftrag für Variante 1 (Losgröße: 2, Zeit: 6min) wurde erfolgreich angenommen!");
}

function mqttAuftragV3(){
    sollAnzV3+=4;
    console.log("Auftrag Variante 2 angenommen");
    document.getElementById("sollV3").innerHTML = sollAnzV3;
    sollAnzV1-=4;
    updateIvl(1);
    zeitV3=7;
    updateIvl(3);
    let time = new Date();
    time.setMinutes(time.getMinutes() + parseInt(10));
    zeitEndeV3 = time.getTime();
    timerAZ3=setInterval(function() {azTimer(3)},1000);
    updateChart(sollAnzV3,istAnzV3,"erfuellungChartV3");
    statusOn("Auftrag für Variante 2 (Losgröße: 4, Zeit: 7min) wurde erfolgreich angenommen!");
}

function mqttPubSchichtende() {
    const host = mqttServer;
    const port = 8884;
    const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
    const username = mqttUser;
    const password = mqttPassword;

    const client = new Paho.Client(host, port, clientId);

    const connectOptions = {
        onSuccess: onConnectPub,
        userName: username,
        password: password,
        useSSL: true,
    };
    function connectPub() {
        client.connect(connectOptions);
    }

    function onConnectPub() {
        client.publish("schichtende", "schichtende");
    }
    connectPub();
}

function mqttSchichtende() {
    schichtAbfrage = false;
    document.getElementById("divStart").style.display = "block";
    document.getElementById("divEnde").style.display = "none";
    clearInterval(x);
    clearInterval(y);
    clearInterval(z);
    clearInterval(timerAZ);
    clearInterval(timerAZ2);
    clearInterval(timerAZ3);
}

function mqttPubReset() {
    const host = mqttServer;
    const port = 8884;
    const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
    const username = mqttUser;
    const password = mqttPassword;

    const client = new Paho.Client(host, port, clientId);

    const connectOptions = {
        onSuccess: onConnectPub,
        userName: username,
        password: password,
        useSSL: true,
    };
    function connectPub() {
        client.connect(connectOptions);
    }

    function onConnectPub() {
        client.publish("reset", "reset");
    }
    connectPub();
}

function mqttReset() {
    console.log("Reset!");
    clearInterval(x);
    clearInterval(y);
    clearInterval(z);
    clearInterval(timerAZ);
    clearInterval(timerAZ2);
    clearInterval(timerAZ3);
    schichtAbfrage = false;
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
    location.reload();
}

function mqttPubUpdateParameter() {
    const host = mqttServer;
    const port = 8884;
    const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
    const username = mqttUser;
    const password = mqttPassword;

    const client = new Paho.Client(host, port, clientId);

    const connectOptions = {
        onSuccess: onConnectPub,
        userName: username,
        password: password,
        useSSL: true,
    };
    function connectPub() {
        client.connect(connectOptions);
    }

    function onConnectPub() {
        client.publish("updateParameter", "updateParameter");
    }
    connectPub();
}

async function mqttUpdateParameter() {
    const id = 1;
    const endpoint = `/data-api/rest/Schicht/ID`;
    const response = await fetch(`${endpoint}/${id}`);
    const result = await response.json();
    personal=result.value[0].MitarbeiterProSchicht;
    krankheit=result.value[0].Krankheitsfälle;
    unfallfrei=result.value[0].Unfallfrei;
    document.getElementById("soll3").innerHTML=personal;
    document.getElementById("soll4").innerHTML=krankheit;
    document.getElementById("soll5").innerHTML=unfallfrei;
    personalVerf=((personal-krankheit)/personal*100).toFixed(2);
    document.getElementById("personalVerf").innerHTML = personalVerf + "&#037;";
    if(unfallfrei>0 && unfallfrei<=1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tag";
    if(unfallfrei>1) document.getElementById("unfallfreiSeit").innerHTML = unfallfrei + " Tagen";
    updateChart(personal,krankheit,"krankChart");
}