import React from "react";
import NoAccount from "./NoAccount";
import NoWeb3Support from "./NoWeb3Support";
import starNotaryClient from "../StarNotaryClient";
import DAppClient from "./DAppClient";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            accounts: []
        }
    }

    async getAndSetAccountsToState() {
        let acc = await starNotaryClient.getAccounts();
        if (acc.length >= 1) this.setState(() => ({ accounts: acc }));
    }
    async componentDidMount() {
        this.getAndSetAccountsToState();
        this.timerId = setInterval(this.getAndSetAccountsToState.bind(this), 3000);
    }

    render() {
        const { web3 } = window;
        if (!web3) return <NoWeb3Support />;
        else if (this.state.accounts.length < 1) return <NoAccount />;
        else return <DAppClient accounts={this.state.accounts}/>

    }

    componentWillUnmount() {
        if (this.timerId) clearInterval(this.timerId);
    }
}

export default App;