
import web3 from './web3';
import CampaignFactory from './build/projectFundFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x58225eE49AE2C9c6ef1F255444c7f1Be7Ca272A7'
);

export default instance;

