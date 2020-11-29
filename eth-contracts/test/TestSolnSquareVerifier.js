// Test if a new solution can be added for contract - SolnSquareVerifier
const solnVerifier = artifacts.require('SolnSquareVerifier')
const verifier = artifacts.require('Verifier')

const proof = require('../../zokrates/code/square/proof')

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
contract('TestSquareVerifier', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const token_one = 1;
    const token_two = 2;

    describe('Solution Square Verifier Testing', function () {
        beforeEach(async function () { 
            this.verifierContract = await verifier.new({from: account_one});
            this.solnContract = await solnVerifier.new(this.verifierContract.address, {from: account_one});
        })

        // Test verification with correct proof
        it('Minting token', async function () { 
            let minted = false;
            try{
                await this.solnContract.mintCoin(
                    account_two,
                    token_one,
                    proof.proof.a, 
                    proof.proof.b, 
                    proof.proof.c, 
                    proof.inputs,
                    {from: account_one }
                )
                minted = true;
            }
            catch(e){
                reason = e.message;
                console.log(reason);
            }
            
            assert.equal(minted, true, 'Should be minted');

            const tokens = await this.solnContract.balanceOf(account_two, {from: account_two})
            assert.equal(tokens, 1, 'Should be 1 token')

        })

        // Test not allowed same proof
        it('same proof not allowed', async function () { 
            let minted = false;
            try{
                await this.solnContract.mintCoin(
                    account_two,
                    token_one,
                    proof.proof.a, 
                    proof.proof.b, 
                    proof.proof.c, 
                    proof.inputs,
                    {from: account_one }
                )
                
                await this.solnContract.mintCoin(
                    account_two,
                    token_two,
                    proof.proof.a, 
                    proof.proof.b, 
                    proof.proof.c, 
                    proof.inputs,
                    {from: account_one }
                )

                minted = true;
            }
            catch(e){
                reason = e.message;
                //console.log(reason);
            }
            
            assert.equal(minted, false, 'Should not be minted');
            const tokens = await this.solnContract.balanceOf(account_two, {from: account_two})
            assert.equal(tokens, 1, 'Should be 1 token')

        })

        
    });
})

