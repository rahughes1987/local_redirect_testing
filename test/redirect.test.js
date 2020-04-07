const axios = require("axios");

// check(host, path, expectedRedirect, statusCode)
//  {host}: the host header of the request (without http(s)://)
//  {path}: the path after the host
//  {expectedRedirect}: the full URL of the Location header that should be returned
//  {statusCode}: the expected status code (optional, defaults to 302)
const check = function (host, path, expectedRedirect, statusCode) {
  path = path || "";
  if (path.substr(0, 1) === "/") path = path.substr(1);
  statusCode = statusCode || 302;

  // We can only check http because the Docker redirect server usually runs behind a loadbalancer
  return axios({
    method: "GET",
    url: `http://127.0.0.1/${path}`,
    headers: { Host: host },
    maxRedirects: 0,
  })
    .then(function (response) {
      return Promise.reject("No redirect status code received");
    })
    .catch(function (error) {
      const response = error.response;
      if (response.status === statusCode && response.headers.location === expectedRedirect) {
        return Promise.resolve();
      } else if (response.status !== statusCode) {
        return Promise.reject(
          'Received unexpected status code. Expected: "' +
            statusCode +
            '" got: "' +
            response.status +
            '"'
        );
      } else if (response.headers.location !== expectedRedirect) {
        console.log(response.headers.location);
        return Promise.reject(
          'Received unexpected redirect location. Expected: "' +
            expectedRedirect +
            '" got: "' +
            response.headers.location +
            '"'
        );
      } else {
        console.log(error);
        return Promise.reject("redirect failed!");
      }
    });
};

describe("Redirect server", function () {
  // Make sure we are running the test against the docker container and not production environment
  describe("Test domain redirect", function () {
    it("should redirect whitemousedigital.com to whitemouse.com", () =>
      check("whitemousedigital.com", null, "https://whitemouse.com/", 302));
  });

  describe("Test specific path redirect", function () {
    it("should redirect to mydomain.com", () =>
      check("whitemousedigital.com", null, "https://whitemouse.com/", 302));
    it("should redirect to mydomain.com while preserving path", () =>
      check(
        "whitemousedigital.com",
        "/testing/folder/path/",
        "https://whitemouse.com/testing/folder/path/",
        302
      ));
  });
});
