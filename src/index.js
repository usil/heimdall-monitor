import './css/main.css';
import EntryPointEventListener from './listeners/EntryPointEventListener.js';
import TodayHeaderEventListener from './listeners/TodayHeaderEventListener.js';

var _CONTEXT = {};
_CONTEXT["EntryPointEventListener"] = new EntryPointEventListener();
_CONTEXT["TodayHeaderEventListener"] = new TodayHeaderEventListener();

document.addEventListener("DOMContentLoaded", function(event) {

  //register global router
  document.addEventListener("simple-event", eventRouter);

  // Dispatch/Trigger/Fire the entrypoiny event
  // document.dispatchEvent(new CustomEvent("simpleEvent", {
  //   "detail": "EntryPointEvent"
  // }));
  document.dispatchEvent(new CustomEvent("simple-event", {
    'detail': {
      eventId: "EntryPointEvent"
    }
  }));
});


function eventRouter(e) {
  console.log(e.detail.eventId);
  if (typeof _CONTEXT[`${e.detail.eventId}Listener`] !== 'undefined') {
    var listener = _CONTEXT[`${e.detail.eventId}Listener`];
    var payload = e.detail.payload;
    listener.start(payload)
  }

}
