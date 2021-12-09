const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../EthereumProject/build/projectFundFactory.json')
const compiledFund = require('../EthereumProject/build/ProjectFund.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{

    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas:'3000000' });

    await factory.methods.createProjectFund('100').send({
        from: accounts[0],
        gas: '3000000'
    });

    [ campaignAddress ] = await factory.methods.getDeployedProjectFund().call();
    campaign = await new web3.eth.Contract(
        compiledFund.abi,
        campaignAddress
    );

});

describe('Campaigns', ()=>{

    it('deploys a factory and campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('people can contribute and are approvers', async()=>{
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributer = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('requires minimum contribution', async()=>{
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false);
        } catch (error) {
            assert(error)
        }
    });

    it('allows manager to request ammount', async()=>{
        await campaign.methods
        .createRequest('purchase paints', '100', accounts[1]).send({
            from: accounts[0],
            gas: '3000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('purchase paints', request.description);
    });

    it('approves requests', async()=>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
        .createRequest('B', web3.utils.toWei('5', 'ether'), accounts[1])
        .send({
            from: accounts[0],
            gas: '3000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '3000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '3000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    })


});

