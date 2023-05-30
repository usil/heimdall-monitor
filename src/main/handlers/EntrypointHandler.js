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
        console.log(typeof heimdallUserToken)
        if(typeof heimdallUserToken === 'undefined' || heimdallUserToken === null){
          console.debug("token is null, go to login");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }
        console.debug("token was found, validating ..."+heimdallUserToken);
        var tokenInformation = null;

        try {
          tokenInformation = await this.heimdallApiClient.tokenValidate(heimdallUserToken)
        } catch (error) {
          console.error(error);
          console.error("token was found but cannot be validated");
          localStorage.removeItem("heimdallUserToken");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;          
        }

        if (tokenInformation.code == 200000 && tokenInformation.content.active === true) {
          //heimdallUserToken exists and is valid
          console.debug("token was found and is valid, go to home");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "homeDashboardHandler",
              httpErrorDetail : {
                code:"aaa",
                message:"bbb",
                httpStatus: "ccc"
              }
            }
          }));
          resolve();
          return;
        } else {
          //go to login page
          console.debug("token was found but is not active, go to login");
          localStorage.removeItem("heimdallUserToken");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }
      }else if(pathName === "/microsoft/ssr-callback"){
        window.history.pushState('', '', '/');
        var microsoftAuthCode = params.code;
        if(typeof microsoftAuthCode === 'undefined'  || microsoftAuthCode == null ){
          console.debug("microsoft [code] was not received in /microsoft/ssr-callback, go to login");
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "unauthorizedEventHandler"
            }
          }));
          resolve();
          return;
        }

        console.debug("code was received from microsoft");
        var tokenInformation = await this.heimdallApiClient.getTokenUsingMicrosoftAuthCode(microsoftAuthCode)
        if (tokenInformation.code === 200000 && typeof tokenInformation.content.access_token !== 'undefined') {
          console.debug("new token was received in /microsoft/ssr-callback, go to home");
          localStorage.setItem("heimdallUserToken", tokenInformation.content.access_token);
          //heimdallUserToken exists and is valid
          document.dispatchEvent(new CustomEvent("simple-event", {
            'detail': {
              eventId: "homeDashboardHandler"
            }
          }));
          resolve();
        } else {
          //go to login page
          console.debug("token was not returned in exchange of microsoft auth code, go to login");
          if (heimdallUserToken == null) {
            document.dispatchEvent(new CustomEvent("simple-event", {
              'detail': {
                eventId: "unauthorizedEventHandler",
                params : {
                  httpErrorDetail : tokenInformation
                }
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
