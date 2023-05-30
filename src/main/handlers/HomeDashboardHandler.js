@EventHandler
function HomeDashboardHandler() {

  @Autowire(name = "settings")
  this.settings;

  @Autowire(name = "homePage")
  this.homePage;

  @Binding
  this.targetServices;

  @Autowire(name = "heimdallApiClient")
  this.heimdallApiClient;  

  this.onLoad = () => {
    return new Promise(async(resolve, reject) => {
      var response;
      try {
        response = await this.heimdallApiClient.findAllMonitoredPages();
        this.targetServices = response;           
      } catch (error) {
        console.error(error)
        this.targetServices = [];
      }
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
module.exports = HomeDashboardHandler;
