@EventHandler
function UnauthorizedEventHandler() {

  @Autowire(name = "settings")
  this.settings;

  @Autowire(name = "unauthorizedPage")
  this.unauthorizedPage;

  @Autowire(name = "heimdallApiClient")
  this.heimdallApiClient;  

  this.onLoad = () => {
    return new Promise(async(resolve, reject) => {          
      resolve();
    });    
  };

  @Render
  this.render = () => {
      return this.unauthorizedPage.getHtml();
  };
  
  @ActionListener(tagId="redirectToLoginButton", type="onclick", pageName="unauthorizedPage")
  this.gotoLoinRedirectButtonListener = async(e) => {
    var getAuthorizeUrlResponse = await this.heimdallApiClient.getAuthorizeUrl();
    if(getAuthorizeUrlResponse.code != 200000){
      return;
    }

    if(getAuthorizeUrlResponse.content.engine === "default"){
      window.location.href = this.settings.heimdallApiBaseUrl+getAuthorizeUrlResponse.content.authorizeUrl;
    }else{
      window.location.href = getAuthorizeUrlResponse.content.authorizeUrl;
    }

    
  };   

}
module.exports = UnauthorizedEventHandler;
