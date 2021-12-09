const util = require('util');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/projectFundFactory.json');



let provider = new HDWalletProvider(
    'cute dumb infant endless riot like zero rich cluster jar coin gate',
    'https://rinkeby.infura.io/v3/daf2ac3c93d5408f8ae10fe67c9e9bca'
  );
  
  
  
  const web3 = new Web3(provider);
  
  let accounts;
  let result;
  
  const deploy = async () => {
  
      accounts = await web3.eth.getAccounts();
  
      
  
      console.log('Attempting to deploy from account ', accounts[1] );
  
      result = await new web3.eth.Contract(compiledFactory.abi)
          .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
          .send({from: accounts[1], gas: '10000000', gasPrice: '2000000000'});
          
      console.log('contract deployed to', result.options.address);
    
  
};
  
deploy();


//newly created campaign factory  0x58225eE49AE2C9c6ef1F255444c7f1Be7Ca272A7

