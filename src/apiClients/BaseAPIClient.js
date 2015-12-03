export default class BaseAPIClient {
  constructor(username, password, baseUri) {
    this.auth = "Basic " + new Buffer(username + ":"
              + password).toString("base64");
    this.baseUri = baseUri;
  }

  buildJsonAndSecureOptions() {
    return {
      json: true,
      headers : {
        "Authorization" : this.auth
      }
    }
  }
}
