const sha256Hash = new sjcl.hash.sha256();
const zeroesToMatch = 4;
const templateBlockNode = document.querySelector('#new-block')

class Block {
    constructor(node, number = 0, hashOfPreviousBlock, nonce = 0) {
        if (node.hidden) {
            this.node = node.cloneNode(true);
            this.node.id = '';
            this.node.hidden = false;
        } else this.node = node;

        this.hashOfPreviousBlock = hashOfPreviousBlock;
        this.nonce = nonce;
        this.number = number;
        this.dataInputField = this.node.querySelector('.block--data');
        this.hashTextField = this.node.querySelector('.this-block .block--hash-value');
        if (this.hashOfPreviousBlock)
            this.previousHashTextField = this.node.querySelector('.previous-block .block--hash-value');
        this.mineButton = this.node.querySelector('.block--mine-button');
        this.nonceField = this.node.querySelector('.block--nonce input');
        this.numberPlaceholder = this.node.querySelector('.block-number span');
        this.numberPlaceholder.textContent = number;
        this.addNextBlockButton = this.node.querySelector('.add-new-block-button button');
        this.addNextBlockButtonDiv = this.node.querySelector('.add-new-block-button');
        this.linkIconDiv = this.node.querySelector('.link-icon');
        
        Block._zeroesToMatch = zeroesToMatch;
        this.getData();
        this.getHash();
        this.postBlockInfo();
        this.mineButton.onclick = () => {this.mine()};
        this.dataInputField.addEventListener('input', () => {
            this.getData();
            this.getHash();
            this.postBlockInfo();
        });
        this.nonceField.addEventListener('input', () => {
            this.nonce = Number(this.nonceField.value);
            this.getData();
            this.getHash();
            this.postBlockInfo();
        });
        this.parentChain;
        this.addNextBlockButton.onclick = () => {
            this.parentChain.addNewBlock().node.scrollIntoView({behavior: 'smooth'});
        }
    }

    getData() {
        this.data = this.dataInputField.value;
    }
    
    static hashFromObject(object) {
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(JSON.stringify(object)));
    }

    getHash() {
        const fullData = {data: this.data, hashOfPreviousBlock: this.hashOfPreviousBlock, nonce: this.nonce, number: this.number};
        return this._lastHash = Block.hashFromObject(fullData);
    }

    static _hashMatch(hash) {
        return hash.match(new RegExp(`^0\{${Block._zeroesToMatch}\}`));
    }

    hashMatch() {
        return Block._hashMatch(this._lastHash);
    }

    proofOfWork(flagToChange = false) {
        let searchNonce = - 1;
        let hash;
        do {
            searchNonce++;
            const fullData = {data: this.data, hashOfPreviousBlock: this.hashOfPreviousBlock, nonce: searchNonce, number: this.number};
            hash = Block.hashFromObject(fullData);
        } while (!Block._hashMatch(hash));
        if (flagToChange) {
            this.nonce = searchNonce;
            this._lastHash = hash;
        }
        return searchNonce;
    }

    postBlockInfo() {
        this.hashTextField.textContent = this._lastHash;
        this.nonceField.value = this.nonce;
        const hashTextFieldClasses = this.hashTextField.classList;

        if (this.hashOfPreviousBlock) this.previousHashTextField.textContent = this.hashOfPreviousBlock;

        if (this.hashMatch()) {
            hashTextFieldClasses.remove('block--hash--pow--false');
            hashTextFieldClasses.add('block--hash--pow--true');
        } else {
            hashTextFieldClasses.remove('block--hash--pow--true');
            hashTextFieldClasses.add('block--hash--pow--false');
        }

        if (this.parentChain && this.parentChain.length - 1 > this.number) {
            const nextBlock = this.parentChain.chain[this.number + 1];
            nextBlock.hashOfPreviousBlock = this._lastHash;
            nextBlock.getHash();
            nextBlock.postBlockInfo();
        }
    }

    mine() {
        this.proofOfWork(true);
        this.postBlockInfo();
    }
}

class BlockChain {
    constructor() {
        this.chain = [];
        BlockChain._templateBlockNode = templateBlockNode;
    }

    get length(){
        return this.chain.length;
    }

    addGivenBlock(block) {
        this.chain.push(block);
        if (!document.contains(block.node)) {
            this.chain[this.length - 2].node.parentNode.appendChild(block.node);
        }
        block.parentChain = this;
        if (block.number > 0) {
            const previousBlock = this.chain[block.number - 1];
            previousBlock.addNextBlockButtonDiv.hidden = true;
            previousBlock.linkIconDiv.hidden = false;
        }
        return block;
    }

    addNewBlock() {
        const newBlock = new Block(BlockChain._templateBlockNode, this.length, this.chain[this.length - 1].getHash());
        this.addGivenBlock(newBlock);
        return newBlock;
    }
}

const genesisBlockNode = document.querySelector('#genesis-block');
const genesisBlock = new Block(genesisBlockNode)
console.log();
const mainChain = new BlockChain();

mainChain.addGivenBlock(genesisBlock);
// mainChain.addNewBlock();



// console.log(genesisBlock.getHash());
// let newNonce = genesisBlock.proofOfWork();
// console.log(newNonce);
// genesisBlock.nonce = newNonce;
// console.log(genesisBlock.getHash()); 