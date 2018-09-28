## Decentralized Star Notary Project
### Transaction, contract hashes are in hashes_document.md


This project is part of Blockchain developer nanodegree program from Udacity.
I have built a decentralized star notary service using
technologies like Ethereum, smart contracts, web3.js etc. in this project.

Try the live demo [here](https://blockchainstarsnotary.netlify.com/)

### Rinkeby test network details

***Contract Address***
0xacbcd50e6f4963097b30cbf91d68893b06a568e3

***Contract Hash***
0x5ff421fc3a55ad34dab08010a001f24493e3fa89724c5262c469b466ecd522c2
https://rinkeby.etherscan.io/tx/0x5ff421fc3a55ad34dab08010a001f24493e3fa89724c5262c469b466ecd522c2

***Star tokenId***
1538128951239

***New Star Transaction Hash***
0x652928cc43e58c396a5576e6e67098de811521701f7c4242481294fee6f7838a
https://rinkeby.etherscan.io/tx/0x652928cc43e58c396a5576e6e67098de811521701f7c4242481294fee6f7838a

***Another Star tokenId***
1538129398121

***Another Star Transaction Hash***
0x5304cfdcd4b2d9b749ee34c7626dd8ed98f24321756010e5c3f629f57887824f
https://rinkeby.etherscan.io/tx/0x5304cfdcd4b2d9b749ee34c7626dd8ed98f24321756010e5c3f629f57887824f

## Prerequisites/Dependencies

1. Install Node.js. [Check here](https://nodejs.org/en/download/)
2. Once you have node, then install truffle and parcel bundler as global dependencies.
    by running this command from the terminal
    ```
        npm install -g truffle
        npm install -g parcel-bundler
    ```
3. You need to have [MetaMask](https://metamask.io/) plugin installed on your browser.
4. Create/Login into your metamask account.
5. In metamask switch to `Rinkeby Test Network`.
6. Have some test ethers loaded into your account. You can do it from [here](https://www.rinkeby.io/#faucet)
7. Try the live demo [here](https://blockchainstarsnotary.netlify.com/)

## Running the project locally
1. Clone/Download this repository.
2. Browse to root folder of this project and run the following command.
```
npm install
```
3. This project is has two main folder
    1. `smart_contracts`: which has all the solidity/smart contracts stuff.
    2. `frontend`: frontend web app to interactor with deployed contract.

4. Start the web client by running the following command from the root folder.
    ```
    npm run start
    ```

5. Goto http://localhost:1234 in your browser and test the app.

6. To run the tests of the smart contracts, go to `smart_contracts` folder and run
    ```
    truffle test/StarNotaryTest.js
    ```
