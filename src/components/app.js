import ReactDOM from "react-dom";
import React from 'react';
import { Signer } from '@waves/signer';
import { ProviderCloud } from '@waves.exchange/provider-cloud'
import { ProviderWeb } from '@waves.exchange/provider-web';
import regeneratorRuntime from "regenerator-runtime";

let node_url = "https://nodes.wavesnodes.com"


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "None",
            publicKey: "None",
            error: "None",
            recipient: "",
            duckling_id: "",
            ducklings_list: []
        };
        this.authFuncKeeper = this.authFuncKeeper.bind(this);
        this.authFuncSigner = this.authFuncSigner.bind(this);
        this.authFuncSignerSeed = this.authFuncSignerSeed.bind(this);
        this.getDucklings = this.getDucklings.bind(this);
        this.sendDuckling = this.sendDuckling.bind(this);
        this.saveRecValue = this.saveRecValue.bind(this);
    }

    async getDucklings(addr) {
        this.state.ducklings_list = []
        var res = []
        var url = node_url + "/assets/nft/" + addr + "/limit/1000";
        const resp = await fetch(node_url + "/assets/nft/" + addr + "/limit/1000")
        var ducl_list = await resp.json()
        ducl_list.forEach(element => {
            let nam = element['name']
            let id = element['assetId']
            // var dd = id + " : " + nam
            var dd = [id, nam]
            this.state.ducklings_list.push(dd)
            // console.log(res)
        });
        return res
    }

    async authFuncKeeper() {
        const authData = {data: "Auth on my site"};
        if(WavesKeeper) {
            var auth = await WavesKeeper.auth( authData );
            await this.getDucklings(auth.address);
            this.setState(state => ({
                address: auth.address,
                publicKey: auth.publicKey
            }))
            // .then(auth => {
            //     console.log(auth);
            //     await this.getDucklings(auth.address);
            //     this.setState(state => ({
            //         address: auth.address,
            //         publicKey: auth.publicKey
            //     }))
            // }).catch(error => {
            //     console.log(error);
            //     this.setState(state => ({
            //         error: error.message
            //     }))
            // })
        } else {
            alert("To Auth WavesKeeper should be installed");
        }
    }

    async authFuncSigner() {
        const signer = new Signer();
        signer.setProvider(new ProviderCloud());
        const user = await signer.login();
        console.log(user);
        if(user != null) {
            await this.getDucklings(user.address);
            this.setState(state => ({
                address: user.address,
                publicKey: user.publicKey
            }))
        }
    }

    async authFuncSignerSeed() {
        const signer = new Signer();
        signer.setProvider(new ProviderWeb());
        const user = await signer.login();
        console.log(user);
        if(user != null) {
            await this.getDucklings(user.address);
            this.setState(state => ({
                address: user.address,
                publicKey: user.publicKey,
                signer: signer
            }));
            
            console.warn(this.state.ducklings_list)
        }

    }

    async sendDuckling() {
        console.log(this.state.signer);
        const jj = await this.state.signer.getBalance();
        this.state.signer.get
        console.log(jj);
        console.log(this.state.recipient);
        this.state.signer.transfer({
            recipient: this.state.recipient,
            assetId: this.state.duckling_id,
            amount: 1
        }).broadcast().then(resp => console.log(resp)).catch(err => console.log(err));
    }

    saveRecValue(evt) {
        this.setState(state => ({
            recipient: evt.target.value
        }))
    }

    saveIdValue(evt) {
        this.setState(state => ({
            duckling_id: evt.target.value
        }))
    }

    render() {
        return (
            <div>
                <div className="container text-center d-flex justify-content-around">
                    <input className="btn btn-primary" type="submit" value="Auth with Keeper" onClick={this.authFuncKeeper}/>
                    <input className="btn btn-primary" type="submit" value="Auth with Signer by Email" onClick={this.authFuncSigner}/>
                    <input className="btn btn-primary" type="submit" value="Auth with Signer by Seed" onClick={this.authFuncSignerSeed}/>
                </div>
                <div className="container">
                <ul className="list-group">
                    <li className="list-group-item">RESULTS:</li>
                    <li className="list-group-item">ADDRESS: {this.state.address}</li>
                    <li className="list-group-item">PUBLICKEY: {this.state.publicKey}</li>
                    <li className="list-group-item">ERROR: {this.state.error}</li>
                    <li className="list-group-item">DUCKLINGS: {this.state.ducklings_list.map(el => <p>{"ID: " + el[0]} <a href={'https://wavesducks.com/duckling/' + el[0]} target="_blank">{el[1]}</a></p>)}</li>
                </ul>
                </div>
                <hr/>
                <div className="container">
                <div className="input-group">
                    <div className="input-group-prepend">
                    <button className="btn btn-secondary" disabled>Duckling ID: </button>
                    </div>
                    <input className="form-control" type="text" placeholder="Paste Duckling ID" value={this.state.duckling_id} onChange={evt => this.saveIdValue(evt)}/>
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                    <button className="btn btn-secondary" disabled>Address: </button>
                    </div>
                    <input className="form-control" type="text" placeholder="Paste Destination Address" value={this.state.recipient} onChange={evt => this.saveRecValue(evt)}/>
                </div>
                <button className="btn btn-primary" type="submit" onClick={this.sendDuckling}>Send Duckling</button>
                <ul className="container list-group">
                    <div>My Addresses:</div>
                    <li>Address1: 3PAr...</li>
                    <li>Address2: 3PTZa...</li>
                    <li>Address1: 3PAr...</li>
                    <li>Address2: 3PTZa...</li>
                </ul>
                </div>
            </div>
        )
    }
}

const app = document.getElementById('app');
if(app) {
    ReactDOM.render(<App/>, app);
}