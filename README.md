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
4. ```$ npm i```
5. ```$ node app.js```

#### Method 2 – via docker
COMMING SOON<br>
4. ```$ npm i```
5. ```$ docker build -t <image_name> .```
6. ```$ docker run -i --name <image_name> <container_name>```

## Contact
@jim380
