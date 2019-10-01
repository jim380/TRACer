# TRACer
A Telegram bot for making OT-node queries

## Downloads
**Prerequisite**
- [node.js](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)<br/>```$ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -```<br/>```$ sudo apt-get install -y nodejs```<br>
1. ```$ git clone https://github.com/jim380/TRACer```

## Configuration
2. ```$ cd TRACer```<br>
3. ```$ nano config.json``` and fill in the empty field for ```"token"``` and ```"url"```.<br> 
```
Example: 

{
    "token"  : "539560409:KLFoxtOMmcDRnPWQLdNRvttKHpBSAUVC0Y5",
    "url" : "http://254.45.646.157"
  }
```

## Deploy
#### Method 1 – from source
4. ```$ npm i```<br>
5. ```$ node app.js```<br>

#### Method 2 – via docker
<<<<<<< HEAD
4. ```$ docker build -t <image_name> .```<br>
5. ```$ docker run --rm -dt -v $(pwd):/usr/src/TRACer --name <image_name> <container_name> .```<br>

## Hot-load code modification if needed
6. ```$ docker exec -it <container_name> bash ```<br>
7. ```$ apt-get update ```<br>
8. ```$ apt-get install nano```<br>
9. ```$ export TERM=xterm```<br>
=======
COMMING SOON<br>
>>>>>>> e6cd8f0cb0f827db716b4d2aacb2ac46c9cbf6aa

## Contact
@jim380
