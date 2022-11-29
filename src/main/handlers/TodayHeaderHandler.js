@EventHandler
function TodayHeaderHandler() {

  this.onLoad = (inboundParams) => {
    return new Promise(async(resolve, reject) => {
      var targetServices = inboundParams.targetServices;
      var atLeastOneIncidentNow = false;
      for (var targetService of targetServices) {
        var length = targetService.statusDetail.length;
        var todayIncidentsCount = targetService.statusDetail[length - 1].incidentsCount;
        if (todayIncidentsCount > 0) {
          atLeastOneIncidentNow = true;
          break;
        }
      }
      console.log(atLeastOneIncidentNow);
  
      var beforeClass = document.getElementById("globalTodayStatus").className;
      if (atLeastOneIncidentNow) {
        document.getElementById("globalTodayStatus").className = beforeClass.replace(/green/g, 'yellow')
        document.getElementById("globalTodayStatusLabel").innerHTML = "At least one System is unstable"
      } else {
        document.getElementById("globalTodayStatus").className = beforeClass.replace(/yellow/g, 'green')
        document.getElementById("globalTodayStatusLabel").innerHTML = "All Systems Operational"
      }
      resolve();
    });    
  };

}
module.exports = TodayHeaderHandler;
