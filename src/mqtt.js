//Topics
const topic_fertigV1 = 'fertig/v1';
const topic_fertigV2 = 'fertig/v2';
const topic_fertigV3 = 'fertig/v3';
const topic_ausschussS1 = 'ausschuss/s1';
const topic_ausschussS2 = 'ausschuss/s2';
const topic_ausschussS3 = 'ausschuss/s3';
const topic_rep = 'rep';
const topic_dlzL11 = 'l1/dlz/1';
const topic_dlzL12 = 'l1/dlz/2';
const topic_dlzL21 = 'l2/dlz/1';
const topic_dlzL22 = 'l2/dlz/2';
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
        client.subscribe('fertig/#');
        client.subscribe('rep/#');
        client.subscribe('ausschuss/#');
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
        if(message.payloadString==topic_fertigV1) {
            fertig(1);
        }
        else if(message.payloadString==topic_fertigV2) {
            fertig(2);
        }
        else if(message.payloadString==topic_fertigV3) {
            fertig(3);
        }
        else if(message.payloadString==topic_ausschussS1) {
            ausschussTeile(1);
        }
        else if(message.payloadString==topic_ausschussS2) {
            ausschussTeile(2);
        }
        else if(message.payloadString==topic_ausschussS3) {
            ausschussTeile(3);
        }
        else if(message.payloadString==topic_rep) {
            ausschussTeile(0);
        }
        else if (message.destinationName === topic_dlzL11 || message.destinationName === topic_dlzL12) {
            var id=String(message.payloadString);
            if(message.destinationName  === topic_dlzL11) durchTbl(1,1,id);
            else durchTbl(1,2,id);
        }
        else if (message.destinationName === topic_dlzL21 || message.destinationName === topic_dlzL22) {
            var id=String(message.payloadString);
            if(message.destinationName  === topic_dlzL21) durchTbl(2,1,id);
            else durchTbl(2,2,id);
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