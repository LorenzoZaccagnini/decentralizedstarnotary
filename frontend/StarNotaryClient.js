import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";
import Web3 from 'web3';
const STAR_PROPS_NAMES = Object.assign({}, ["name", "story", "dec", "mag", "cent"]);

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

class StarNotaryClient {
    constructor() {
        let contract = web3.eth.contract(CONTRACT_ABI);
        this.contract = contract.at(CONTRACT_ADDRESS);
    }

    getAccounts() {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts((error, accounts) => {
                if (error) reject(error);
                else resolve(accounts);
            });
        });
    }

    createStar(name, story, dec, mag, cent, tokenId) {
        let address = web3.eth.accounts[0];
        return new Promise((resolve, reject) => {
            this.contract.createStar(name, story, dec, mag, cent, tokenId, { from: address }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }

    onStarCreated(cb) {
        this.contract.Transfer(null, { address: web3.eth.accounts[0] }, cb);
    }

    putStarForSale(id, price) {
        let address = web3.eth.accounts[0];
        return new Promise((resolve, reject) => {
            this.contract.putStarUpForSale(id, web3.toWei(price), { from: address }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }

    getTransactionReceipt(txHash) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(txHash, (error, result) => {
                if (error) reject(error)
                else resolve(result);
            });
        });
    }

    getStarInfoByTokenId(tokenId) {
        return new Promise((resolve, reject) => {
            this.contract.tokenIdToStarInfo(tokenId, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }

    getStarsInfo(filterIndexedValues = {}, filter = { fromBlock: 0, toBlock: "latest" }) {
        return new Promise((resolve, reject) => {
            try {
                let event = this.contract.Transfer(filterIndexedValues, filter);
                event.get(async (error, events) => {
                    if (error) reject(error);
                    else {
                        let starsInfo = [];
                        let idsAdded = {};
                        events = events.reverse();
                        for (let event of events) {
                            let id = Number(event.args._tokenId);
                            if (idsAdded[id]) continue;
                            let star = await this.getStarInfoByTokenId(id);
                            let starPrice = await this.starsForSale(id);
                            let owner = await this.ownerOf(id);
                            let starObj = star.reduce((obj, starProperty, index) => {
                                obj[STAR_PROPS_NAMES[index]] = starProperty;
                                return obj;
                            }, { id, owner, price: Number(web3.fromWei(starPrice, "ether")) });
                            starsInfo.push(starObj);
                            idsAdded[id] = true;
                        }
                        console.log(starsInfo.length);
                        resolve(starsInfo);
                    }
                });
            } catch (e) {
                reject("Something went wrong while getting the transfer events");
            }
        });
    }
    async getAllStarsOfOwner() {
        let address = web3.eth.accounts[0];
        let stars = await this.getStarsInfo({ _to: address });
        stars = stars.filter((star => {
            return star.owner == address
        }));
        return stars;
    }

    starsForSale(tokenId) {
        return new Promise((resolve, reject) => {
            this.contract.starsForSale(tokenId, (error, result) => {
                if (error) reject(error);
                else {
                    resolve(result);
                }
            });
        });
    }

    ownerOf(tokenId) {
        return new Promise((resolve, reject) => {
            this.contract.ownerOf(tokenId, (error, result) => {
                if (error) reject(error);
                else {
                    resolve(result);
                }
            });
        });
    }

    getAllStarsInBlockChain() {
        return this.getStarsInfo();
    }

    buyStar(tokenId, price) {
        let priceInWei = web3.toWei(price);
        let address = web3.eth.accounts[0];
        return new Promise((resolve, reject) => {
            this.contract.buyStar(tokenId, { from: address, value: priceInWei }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }
}

export default new StarNotaryClient();
