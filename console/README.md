# RSK Node console


## Setup

Install [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/)

From the command line, execute ```npm install``` to install dependencies.


## RUN

From the command line, execute ```node console.js -server HOST:PORT```

If everything works as expected, the RSK command prompt will be displayed.

There are several commands to interact with the node. These are a couple of examples:

web3.eth.blockNumber: returns the local blockchain's best block number.

web3.eth.getBalance(<ACCOUNT ADDRESS>): returns the account balance

For more information about Web3 check the [documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API) 

## Docker

To build docker image, execute `docker build -t rsk-console .`
This image now can be run similary to the script:
```
docker run -it --rm rsk-console -server HOST:PORT
```

