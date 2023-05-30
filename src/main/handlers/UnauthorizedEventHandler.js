@EventHandler
function UnauthorizedEventHandler() {

  @Autowire(name = "settings")
  this.settings;

  @Autowire(name = "unauthorizedPage")
  this.unauthorizedPage;

  @Autowire(name = "heimdallApiClient")
  this.heimdallApiClient;  

  @Binding
  this.loginErrorMessage;  

  this.onLoad = (inboundParams) => {

    if(typeof inboundParams !== 'undefined' && typeof inboundParams.httpErrorDetail !== 'undefined' ){
      this.loginErrorMessage = `code: ${inboundParams.httpErrorDetail.code}
      message: ${inboundParams.httpErrorDetail.message}
      httpStatus: ${inboundParams.httpErrorDetail.httpStatus}`;
    }

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
