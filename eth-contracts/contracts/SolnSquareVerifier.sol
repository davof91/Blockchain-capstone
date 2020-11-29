pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './SquareVerifier.sol';
import './ERC721Mintable.sol';

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions {
        uint256 index;
        address owner;
    }

    // TODO define an array of the above struct
    Solutions[] private solArray;

    // TODO define a mapping to store unique solutions submitted
    mapping( bytes32 => Solutions ) private solMapping;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address owner, bytes32 key);

    SquareVerifier public verifierContract;

    constructor(address verifierAddress) public {
        verifierContract = SquareVerifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolutions(uint256 index, address user, bytes32 key) internal{
        Solutions memory sol = Solutions({
            index: index,
            owner: user
        });

        solArray.push(sol);
        solMapping[key] = sol;
        emit SolutionAdded(index, user, key);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintCoin(address user, uint256 index, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public{
        // Hash proof for uniqueness.
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

        // make sure not used before
        require(solMapping[key].owner == address(0), "Solution should not have been used before.");
        
        // verify probably proof passes.
        bool proof = verifierContract.verifyTx(a,b,c,input);
        require(proof, "Proof should pass contract verifytc");

        // add solution
        addSolutions(index, user, key);

        super.mint(user, index);
    }
}






















  


























