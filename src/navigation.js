document.getElementById("btnManagement").addEventListener("click", function() {
  this.style.backgroundColor = 	"#d3d3d3";
  document.getElementById("btnUebersicht").style.backgroundColor = "#00a2ff";
  document.getElementById("btnUebersicht2").style.backgroundColor = "#00a2ff";
  document.getElementById("btnExport").style.backgroundColor = "#00a2ff";
});
document.getElementById("btnUebersicht").addEventListener("click", function() {
  this.style.backgroundColor = 	"#d3d3d3";
  document.getElementById("btnManagement").style.backgroundColor = "#00a2ff";
  document.getElementById("btnUebersicht2").style.backgroundColor = "#00a2ff";
  document.getElementById("btnExport").style.backgroundColor = "#00a2ff";
});
document.getElementById("btnUebersicht2").addEventListener("click", function() {
  this.style.backgroundColor = 	"#d3d3d3";
  document.getElementById("btnManagement").style.backgroundColor = "#00a2ff";
  document.getElementById("btnUebersicht").style.backgroundColor = "#00a2ff";
  document.getElementById("btnExport").style.backgroundColor = "#00a2ff";
});
document.getElementById("btnExport").addEventListener("click", function() {
  this.style.backgroundColor = 	"#d3d3d3";
  document.getElementById("btnManagement").style.backgroundColor = "#00a2ff";
  document.getElementById("btnUebersicht").style.backgroundColor = "#00a2ff";
  document.getElementById("btnUebersicht2").style.backgroundColor = "#00a2ff";
});

function managementBtn() {
  document.getElementById("management").style.display = "block";
  document.getElementById("übersicht").style.display = "none";
  document.getElementById("übersicht2").style.display = "none";
  document.getElementById("export").style.display = "none";
}
function uebersichtBtn() {
  document.getElementById("übersicht").style.display = "block";
  document.getElementById("übersicht2").style.display = "none";
  document.getElementById("management").style.display = "none";
  document.getElementById("export").style.display = "none";
}
function uebersicht2Btn() {
  document.getElementById("übersicht").style.display = "block";
  document.getElementById("übersicht2").style.display = "block";
  document.getElementById("management").style.display = "none";
  document.getElementById("export").style.display = "none";
}
function exportBtn() {
  document.getElementById("export").style.display = "block";
  document.getElementById("management").style.display = "none";
  document.getElementById("übersicht").style.display = "none";
  document.getElementById("übersicht2").style.display = "none";
}