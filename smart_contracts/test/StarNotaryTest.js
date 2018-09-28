const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

    let defaultAccout = accounts[0];
    let otherAccount = accounts[1];

    let defaultStar = {
        name: "My Star",
        story: "Story of my star",
        dec: "dec",
        mag: "mag",
        cent: "cent"
    }
    let defaultTokenId = 1;

    beforeEach(async function () {
        this.contract = await StarNotary.new({ from: accounts[0] });
        await this.contract.createStar(
            defaultStar.name,
            defaultStar.story,
            defaultStar.dec,
            defaultStar.mag,
            defaultStar.cent,
            defaultTokenId,
            { from: defaultAccout }
        );
    });

    describe('createStar', () => {
        it('can create a star and get its name', async function () {
            const addedStar = await this.contract.tokenIdToStarInfo(defaultTokenId);
            assert(addedStar[0] == defaultStar.name);
        });

        it("adding stars with same coordinates should throw an error", async function () {
            try {
                await this.contract.createStar(
                    defaultStar.name,
                    defaultStar.story,
                    defaultStar.dec,
                    defaultStar.mag,
                    defaultStar.cent,
                    defaultTokenId + 1,
                    { from: defaultAccout }
                );
                assert(false); // should not get here
            } catch (e) {
                assert(true);
            }
        });

        it("adding stars with same tokenId, but different dec, mag, cent should throw an error", async function () {
            try {
                await this.contract.createStar(
                    defaultStar.name,
                    defaultStar.story,
                    defaultStar.dec + "random",
                    defaultStar.mag,
                    defaultStar.cent,
                    defaultTokenId,
                    { from: defaultAccout }
                );
                assert(false); // should not get here
            } catch (e) {
                assert(true);
            }
        });
    });

    describe('tokenIdToStarInfo', () => {
        it("should get the star info of the given token id", async function() {
            let result = await this.contract.tokenIdToStarInfo(defaultTokenId);
            assert(result[0] == defaultStar.name);
            assert(result[1] == defaultStar.story);
            assert(result[2] == defaultStar.dec);
            assert(result[3] == defaultStar.mag);
            assert(result[4] == defaultStar.cent);
        });
    });

    describe('checkIfStarExist', () => {
        it('it should return true for existing star', async function () {
            const shouldExist = await this.contract.checkIfStarExist(defaultStar.dec, defaultStar.mag, defaultStar.cent, { from: defaultAccout });
            assert(shouldExist == true);
        });
        it('it should return false for non-existing star', async function () {
            const shouldBeFalse = await this.contract.checkIfStarExist(defaultStar.dec, defaultStar.cent, defaultStar.mag);
            assert(shouldBeFalse == false);
        })
    });

    describe('putStarUpForSale', () => {
        let price = web3.toWei(0.003);
        it("should put star for sale", async function () {
            await this.contract.putStarUpForSale(defaultTokenId, price);
            let result = await this.contract.starsForSale(defaultTokenId);
            assert(Number(result) == price);
        });

        it("should throw an error when trying to put star for sale by non-owner", async function () {
            try {
                await this.contract.putStarUpForSale(defaultTokenId, price, { from: otherAccount });
                assert(false); // should not get here
            } catch (e) {
                assert(true);
            }
        });
    });

    describe('buyStar', () => {
        let price = web3.toWei(0.003);


        it("should be able to buy a star", async function () {
            await this.contract.putStarUpForSale(defaultTokenId, price, { from: defaultAccout });
            await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: price, gasPrice: 0 });
            assert(await this.contract.ownerOf(defaultTokenId) == otherAccount);
        });

        it("star should no longer be on sale after buying it", async function () {
            await this.contract.putStarUpForSale(defaultTokenId, price, { from: defaultAccout });
            await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: price, gasPrice: 0 });
            assert(await this.contract.starsForSale(defaultTokenId) == 0);
        });

        it("account balance should increase by star price for previous star owner", async function () {
            let oldBalance = web3.eth.getBalance(defaultAccout);
            await this.contract.putStarUpForSale(defaultTokenId, price, { from: defaultAccout, gasPrice: 0 });
            await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: price, gasPrice: 0 });
            let newBalance = web3.eth.getBalance(defaultAccout);
            assert(Number(newBalance.sub(oldBalance)) == price);
        });

        it("account balance should decrease by star price for new star owner", async function () {
            let oldBalance = web3.eth.getBalance(otherAccount);
            await this.contract.putStarUpForSale(defaultTokenId, price, { from: defaultAccout, gasPrice: 0 });
            await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: price, gasPrice: 0 });
            let newBalance = web3.eth.getBalance(otherAccount);
            assert(Number(oldBalance.sub(newBalance)) == price);
        });

        it("overpaid amount would get back to buyer", async function () {
            let oldBalance = web3.eth.getBalance(otherAccount);
            await this.contract.putStarUpForSale(defaultTokenId, price, { from: defaultAccout, gasPrice: 0 });
            await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: web3.toWei(0.005), gasPrice: 0 });
            let newBalance = web3.eth.getBalance(otherAccount);
            assert(Number(oldBalance.sub(newBalance)) == price);
        });

        it("underpaid transaction should throw an error", async function () {
            try {
                await this.contract.putStarUpForSale(defaultTokenId, web3.toWei(0.005), { from: defaultAccout, gasPrice: 0 });
                await this.contract.buyStar(defaultTokenId, { from: otherAccount, value: price, gasPrice: 0 });
                assert(false); // should not get here
            } catch (e) {
                assert(true);
            }
        });
    });

    describe('starsForSale' , () => {
        it("should get price of the star in sale by tokenId" , async function() {
            await this.contract.putStarUpForSale(defaultTokenId,web3.toWei(0.005));
            const price = await this.contract.starsForSale(defaultTokenId);
            assert( Number(price) == web3.toWei(0.005));
        });

        it("should return 0 for the star which is not in sale" , async function() {
            const price = await this.contract.starsForSale(defaultTokenId+1);
            assert(0 == price);
        });
    });
});