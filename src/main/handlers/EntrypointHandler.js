@EventHandler(entrypoint = "true")
function EntrypointHandler() {

  @Autowire(name = "settings")
  this.settings;

  @Autowire(name = "homePage")
  this.homePage;

  @Binding
  this.targetServices;

  this.onLoad = () => {
    return new Promise(async(resolve, reject) => {
      var response = await fetch(this.settings.heimdallMonitorApiBaseUrl+"/monitor/target/result-sumary/webs?sinceDay=90");
      this.targetServices = await response.json();           
      resolve();
    });    
  };

  @Render
  this.render = () => {
      return this.homePage.getHtml();
  };

  this.postRender = () => {
    //after home render,  launch the header event
    document.dispatchEvent(new CustomEvent("simple-event", {
        'detail': {
            eventId: "todayHeaderHandler",
            params: {
              targetServices:this.targetServices
            }
        }
    }));
  };  

}
module.exports = EntrypointHandler;
