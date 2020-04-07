FROM httpd:alpine 

## Installing NodeJS & npm
RUN apk add --update nodejs npm

## Copy Apache redirect rules
COPY ./conf.d /usr/local/apache2/conf.d
COPY ./httpd.conf /usr/local/apache2/conf.d/redirect.conf
RUN echo "Include /usr/local/apache2/conf.d/redirect.conf" >> /usr/local/apache2/conf/httpd.conf; 

## Copy & run tests
WORKDIR /opt/redirect
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY ./test test
COPY ./test.sh test.sh
RUN chmod +x test.sh
RUN /opt/redirect/test.sh