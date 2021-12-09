import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../componenets/layout';
import Campaign from '../../EthereumProject/campaign';
import web3 from '../../EthereumProject/web3';
import ContributeForm from '../../componenets/contributeForm';
import {Link} from '../../routes';

class CampaignShow extends Component{

    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return{
            address: props.query.address,
            minimumContribution: summary[0],
            requestCount: summary[1],
            balance: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards(){

        const {
            minimumContribution,
            requestCount,
            balance,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'Manager created this request to withdraw money',
                style: {overflowWrap: 'break-word'}
            },

            {
                header: minimumContribution,
                meta: 'Minimun Contribution in Wei',
                description: 'you must contribute this much wei to contribute',
            },

            {
                header: requestCount,
                meta: 'Number of requests',
                description: 'request to withdraw money from the contract, request should be approved by approvers'
            },

            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign'
            },

            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much this campaign has left to spend'
            }
        ];

        return <Card.Group items={items}/>;
    }

    render(){
        return(
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>

                    <Grid.Row>

                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                    </Grid.Row>
                    
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid>
                        <Grid.Column width={7}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid>

                </Grid>
                
            </Layout>
        )
    }
}

export default CampaignShow;

