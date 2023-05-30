const axios = require("axios");
const querystring = require('querystring');

@Module
function HeimdallApiClient() {

    @Autowire(name = "settings")
    this.settings;

    // @Autowire(name = "securityContext")
    // this.securityContext;

    // this.getUserLoggedinDetails = async(externalOauth2Code) => {

    //     var requestBody = {
    //         code: externalOauth2Code
    //     };
    //     try {
    //         var loginHttpResponse = await axios.post(`${this.settings.walleApiBaseUrl}/v1/oauth2-external/callback`, requestBody);
    //         return loginHttpResponse.data;
    //     } catch (err) {
    //         return parseAxiosError(err, "Error while code was being exchanged by a user loggedin details.");
    //     }
    // };


    this.getAuthorizeUrl = async() => {
        try {
            var getAuthorizeUrlHttpResponse = await axios.get(`${this.settings.heimdallApiBaseUrl}/v1/oauth2/authorize-url`);
            return getAuthorizeUrlHttpResponse.data;
        } catch (err) {
            return parseAxiosError(err, "Error while auth url was being requested");
        }
    };    

    this.tokenValidate = async (token) => {
        try {
            var tokenInformation = await
                axios.post(`${this.settings.heimdallApiBaseUrl}/v1/oauth2/token/introspect`,
                    querystring.stringify({ token: token }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
            return tokenInformation.data;
        } catch (err) {
            return parseAxiosError(err, "Error while auth url was being requested");
        }
    };

    this.getTokenUsingMicrosoftAuthCode = async (code) => {
        try {
            var tokenInformation = await
                axios.post(`${this.settings.heimdallApiBaseUrl}/v1/oauth2/token/microsoft-auth-code`,{ code: code });
            return tokenInformation.data;
        } catch (err) {
            return parseAxiosError(err, "Error while auth url was being requested");
        }
    };

    this.findAllMonitoredPages = async () => {
        try {
            var response = await fetch(this.settings.heimdallApiBaseUrl+"/v1/monitor?daysAgo=90");
            return await response.json();           
          } catch (err) {
            return parseAxiosError(err, "Error while monitored pages were being requested");
          }
    };    

    prepareHttpRequestConfig = () => {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.securityContext.loggedinUserDetails.access_token}`
            }
        };
    };

    parseAxiosError = (err, alternativeMessage) => {
        console.log(err)
        if (!err.response && !err.response.data) {
            console.error(err)
            return {
                httpStatus: err.response.status,
                code: 500000,
                message: alternativeMessage
            };
        } else {
            console.error(JSON.stringify(err.response.data));
            return {
                ...err.response.data,
                httpStatus: err.response.status
            };
        }
    };

}

module.exports = HeimdallApiClient;