//https://www.tutorialspoint.com/babeljs/babeljs_quick_guide.htm
import ejs from 'ejs/ejs.min.js';
import template from '../pages/template.html';

class EntryPointEventListener {
  constructor() {

  }

  async start() {
    var response = await fetch("http://127.0.0.1:3000/monitor/target/result-sumary/webs?sinceDay=90");
    var targetServices = await response.json();

    let html = ejs.render(template, {
      targetServices: targetServices
    });
    document.getElementById("root").innerHTML = html;

    //update header
    document.dispatchEvent(new CustomEvent("simple-event", {
      'detail': {
        eventId: "TodayHeaderEvent",
        payload: targetServices
      }
    }));
  }
}

export default EntryPointEventListener;
