import axios from "axios";

/*== API Configuration Data ==*/
const apiUser = "EXTRA_IR_Services";
const apiPassword = "CA2F7E18-66D7-4E27-96AA-381A4706810C";
const baseUrl = "https://data.argaam.com";
// const api_version = "1";

const AccessRefreshTokens = {
  accessTokenExpireIn: new Date(2020),
  getAccessToken: async function () {
    let app = this;
    if (this.accessTokenExpireIn < new Date()) {
      let authUrl = baseUrl + "/authenticate";
      let data = { username: apiUser, password: apiPassword };
      try {
        const response = await axios.post(authUrl, data);
        let data_1 = response.data;
        app.apiToken = data_1.jwtToken;
        app.accessTokenExpireIn = data_1.expires;
        localStorage.setItem("token", response.data.jwtToken);
      } catch (exception) {
        console.log("Error:" + exception);
        throw exception;
      }
    } else {
      return Promise.resolve(this.apiToken);
    }
  },
};

export default AccessRefreshTokens;
