window.onload = function() {
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    mqttServer = getParameterByName('server');
    mqttUser = getParameterByName('user');
    mqttPassword = getParameterByName('password');
    connectMQTT();
}

if(ivlV1>0) {
  document.getElementById("divStart").style.display = "none";
  document.getElementById("divEnde").style.display = "block";
}
else {
  document.getElementById("divStart").style.display = "block";
  document.getElementById("divEnde").style.display = "none";
}