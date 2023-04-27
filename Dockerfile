FROM --platform=linux/x86_64 ubuntu:latest

RUN apt update \
    && apt-get install -y wget


ADD __tests__ /__tests__
ADD bin /bin

RUN ["chmod", "-R", "+x", "/bin" ]
