const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//___________________________________________________________________________________
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts");
const fileNames = fs.readdirSync(contractPath);

const compilerInput = {
    language: "Solidity",
    sources: fileNames.reduce((input, fileName) => {
      const filePath = path.resolve(contractPath, fileName);
      const source = fs.readFileSync(filePath, "utf8");
      return { ...input, [fileName]: { content: source } };
    }, {}),
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

// Compile All contracts
const compiled = JSON.parse(solc.compile(JSON.stringify(compilerInput)));

fs.ensureDirSync(buildPath);

fileNames.map((fileName) => {
  const contracts = Object.keys(compiled.contracts[fileName]);
  contracts.map((contract) => {
    fs.outputJsonSync(
      path.resolve(buildPath, contract + ".json"),
      compiled.contracts[fileName][contract]
    );
  });
});

//____________________________________________________________________________________












// const buildPath = path.resolve(__dirname, 'build');
// fs.removeSync(buildPath);

// const fundRaiserPath = path.resolve(__dirname, 'contracts', 'ProjectFund.sol');
// const source = fs.readFileSync(fundRaiserPath, 'utf-8');





// var input = {
//     language: 'Solidity',
//     sources: {
//         'ProjectFund.sol' : {
//             content: source
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': [ '*' ]
//             }
//         }
//     }
// }; 

// const output = JSON.parse(solc.compile(JSON.stringify(input)));

// if(output.errors) {
//     output.errors.forEach(err => {
//         console.log(err.formattedMessage);
//     });
// } else {
//     const contracts = output.contracts["ProjectFund.sol"];
//     for (let contractName in contracts) {
//         const contract = contracts[contractName];
//         fs.writeFileSync(path.resolve(buildPath, `${contractName}.json`), JSON.stringify(contract.abi, null, 2), 'utf8');
//     }
// }




// fs.ensureDirSync(buildPath);

// for(let contract in output){
//     fs.outputJSONSync(
//         path.resolve(buildPath, contract + '.json'),
//         output[contract]
//     );
// }

