var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const token_one = 1;
    const token_two = 2;
    const contractOneURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1';
    const contractTwoURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2';

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, token_one, {from: account_one})
        
            await this.contract.mint(account_three, token_two, {from: account_one})
            
        })

        it('should return total supply', async function () { 
            const tokens = await this.contract.totalSupply({from: account_three })
            assert.equal(tokens, 2, 'Should be 2 tokems')
        
        })

        it('should get token balance', async function () { 
            const tokens = await this.contract.balanceOf(account_two, {from: account_two})
            assert.equal(tokens, 1, 'Should be 1 token')
        
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenOneURI = await this.contract.tokenURI(token_one)
            const tokenTwoURI = await this.contract.tokenURI(token_two)
            assert.equal(tokenOneURI, contractOneURI, 'URI doesnt match');
            assert.equal(tokenTwoURI, contractTwoURI, 'URI doesnt match');
        })

        it('should transfer token from one owner to another', async function () { 
            // Making sure a user cant transfer a token that they dont own.
            try{
                await this.contract.transferFrom(account_two, account_three, token_one, {from: account_three})
            }
            catch(e) {
                reason = e.message.split("eason given: ")[1].split("\n")[0];
                assert.equal(reason, "Sender should own token.", 'Should have reverted and errored on token ownership');
            }
            
            await this.contract.transferFrom(account_two, account_three, token_one, {from: account_two})

            const checkOwner = await this.contract.ownerOf(token_one, {from: account_three})
            
            assert.equal(checkOwner, account_three, 'Transfer didnt work');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try{
                await this.contract.mint(account_two, token_one, {from: account_two})
            }
            catch(e){
                reason = e.message.split("eason given: ")[1].split("\n")[0];
                assert.equal(reason, "Not an owner.", 'Should have reverted and errored on contract ownership');
            }
        })

        it('should return contract owner', async function () { 
            const contractOwner = await this.contract.getOwner()
            assert.equal(contractOwner, account_one, 'Account is not the owner')
        
        })

    });
})