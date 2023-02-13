@EventHandler(entrypoint = "true")
  function EntrypointHandler() {

  @Autowire(name = "settings")
  this.settings;

  @Autowire(name = "homePage")
  this.homePage;

  @Autowire(name = "heimdallApiClient")
  this.heimdallApiClient;

  @Binding
  this.targetServices;

  this.onLoad = async () => {
    return new Promise(async (resolve, reject) => {
      //1 first thing to validate is if code=*** is received
      //this will indicate us that external oauth2 is redirecting

      var pathName = window.location.pathname;

      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

      if (pathName === "" || pathName === "/") {
        var heimdallUserToken = localStorage.getItem("heimdallUserToken");
        if(typeof heimdallUserToken === 'undefined' || heimdallUserToken == null){
          console.debug("token is null, go to login");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }

        var tokenInformation = await this.heimdallApiClient.tokenValidate(heimdallUserToken)
        if (tokenInformation.code == 200000 && tokenInformation.content.active === true) {
          //heimdallUserToken exists and is valid
          console.debug("token was found and is valid, go to home");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "homeDashboardHandler"
            }
          }));
          resolve();
          return;
        } else {
          //go to login page
          console.debug("token was found but is not active, go to login");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }
      }else if(pathName === "/default/callback"){
        window.history.pushState('', '', '/');
        var heimdallUserToken = params.access_token;
        if(typeof heimdallUserToken === 'undefined'  || heimdallUserToken == null ){
          console.debug("token was not received in /default/callback, go to login");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }

        var tokenInformation = await this.heimdallApiClient.tokenValidate(heimdallUserToken)
        if (tokenInformation.code === 200000 && tokenInformation.content.active === true) {
          console.debug("token was received in /default/callback and it is active, go to home");
          localStorage.setItem("heimdallUserToken", heimdallUserToken);
          //heimdallUserToken exists and is valid
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "homeDashboardHandler"
            }
          }));
          resolve();
        } else {
          //go to login page
          console.debug("token was received in /default/callback but is not active, go to login");
          if (heimdallUserToken == null) {
            document.dispatchEvent(new CustomEvent("simple-event", {
              'detail': {
                eventId: "unauthorizedEventHandler"
              }
            }));
            resolve();
            return;
          }
        } 
      }else{
        console.log(pathName+" is not supported")
      }
    });
  };

}
module.exports = EntrypointHandler;
