import './css/main.css';
import ejs from 'ejs/ejs.min.js';
import template from './pages/template.html';

var targetServices = [];

for(var i=0; i < 5; i++) {

  var serviceDetail = {
    label: randomWord(5)+".com",
    globalStatus: "Operational",
    description: randomWord(25)
  }

  var statusDetail = [];
  for(var j=0; j < 90; j++) {
    var dayDetail = {
      dateString: "2022-04-03",
      averageResponseTimeMillis: "66ms"
    }

    if(randomBoolean()){
      dayDetail.incidentsCount = randomIntFromInterval(1,20);
    }else{
      dayDetail.incidentsCount = 0;
    }

    statusDetail.push(dayDetail);
  }
  serviceDetail.statusDetail = statusDetail;
  targetServices.push(serviceDetail);
}

console.log(JSON.stringify(targetServices, null, 4));
let html = ejs.render(template, {targetServices: targetServices});


document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("root").innerHTML = html;
});

function randomWord(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function randomBoolean() {
  return Math.random() < 0.5;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
