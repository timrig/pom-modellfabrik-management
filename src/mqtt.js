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
            console.log(nachrichtArray);
            if(nachrichtArray[0]==2 && abfrageAuftragV2==false) {
                console.log("MQTT Auftrag 2 angenommen");
                mqttAuftragV2(nachrichtArray[1],nachrichtArray[2]);
            }
            else if(nachrichtArray[0]==3 && abfrageAuftragV3==false) {
                console.log("MQTT Auftrag 3 angenommen");
                mqttAuftragV3(nachrichtArray[1],nachrichtArray[2]);
            }
        }
    }
    connect();
}

function mqttPubAuftrag(v,soll,ivl) {
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
        var messagePub = v + "," + soll + "," + ivl;
        if(v==2) {
            client.publish("auftrag/v2", messagePub);
        }
        else if(v==3) {
            client.publish("auftrag/v3", messagePub);
        }
    }
    connectPub();
}

function mqttAuftragV2(soll,ivl){
    sollAnzV2=soll;
    console.log("Auftrag angenommen");
    sollAnz+=parseInt(sollAnzV2);
    console.log("Soll-Gesamt: " + sollAnz);
    document.getElementById("sollGes").innerHTML=sollAnz;
    ivlV2=ivl;
    console.log("Intervall: " + ivlV2);
    abfrageAuftragV2=true;
    y=setInterval(function() {sollProZeit(2)},ivlV2);
}

function mqttAuftragV3(soll,ivl){
    sollAnzV3=soll;
    console.log("Auftrag angenommen");
    sollAnz+=parseInt(sollAnzV3);
    console.log("Soll-Gesamt: " + sollAnz);
    document.getElementById("sollGes").innerHTML=sollAnz;
    ivlV3=ivl;
    console.log("Intervall: " + ivlV3);
    abfrageAuftragV3=true;
    z=setInterval(function() {sollProZeit(3)},ivlV3);
}