# Redirect Testing Docker Container

This tool runs a httpd Alpine container to test redirects locally on your machine.

It also uses Mocha tests (via node.js) to check that the package is deploying correctly.

---

## To use the file:

### Pre-requisites

- `./conf.d/urlrewrite_example.conf` is an example file that takes mod_rewrite rules.
  - You should create the file `./conf.d/urlrewrite.conf` that contains all the redirect rules that are wanting to be checked.
  - Worth noting that the example rules that are in the example conf file are the ones in the testing file so make sure that is also updated if you want the build to run correctly.
- `./test/redirect.test.js` is where the tests are hosted. These tests will stop the docker build happening if they fail.
  - The example tests start around `Line 50` of the file and the syntax should be pretty self explanatory.

### Building and running the docker container

- First of all lets build the container...
- `cd` to the redirect-testing folder then run

`$ docker build -t redirect-testing .`

- this will build a docker container called **redirect-testing** which can be checked to make sure it exists sing the command

`$ docker images`

- you should see the container listed there.

  - some useful commands if this looks really busy:
    - Stop all containers: `$ docker kill $(docker ps -q)`
    - Remove all containers: `$ docker rm $(docker ps -a -q)`
    - Remove all docker images: `$ docker rmi $(docker images -q)`
    - List all dangling docker images (images with no relation to any tagged images): `$ docker images -f dangling=true`
    - Purge dangling images: `$ docker images purge`
    - Purging All Unused or Dangling Images, Containers, Volumes, and Networks (anthing dangling): `$ docker system prune`
    - Purge all stopped as well as dangling: `$ docker system prune -a`
    - [...more useful commands](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)

- Now, (assuming the build worked correctly - if not debug as per the terminal information) lets get the container running:

`$ docker run --name redirect_testing -p 8080:80 -d redirect-testing`

- This will start the container and expose it to your laptop on port **8080** so that you can test redirects by going to either: (http://localhost:8080/) or (http://127.0.0.1:8080/) dependant on your machine settings.

---

## Making updates

If you want to check a new file, update `./conf.d/urlrewrite.conf` file with the latest rules and rebuild the container.

- run `$ docker rm -f redirect_testing` to stop & remove the current version (replacing the name if you changed it)
- rebuild the container `$ docker build -t redirect-testing .`
- start it up again `$ docker run --name redirect_testing -p 8080:80 -d redirect-testing`

---

Any questions, contact [rob@whitemouse.com](mailto:rob@whitemouse.com).
