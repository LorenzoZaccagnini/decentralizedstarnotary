import React from "react";
import StarIcon from "./star.svg";
import starNotaryClient from "../StarNotaryClient";

class StarCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            saleFor: props.star.price || 0
        };
    }

    async putStarForSale(e) {
        e.preventDefault();
        let tx = await starNotaryClient.putStarForSale(this.props.star.id, this.state.saleFor);
        this.props.waitForTransaction(tx);
        this.toggleForm();
    }

    async buyStar() {
        let { id, price } = this.props.star;
        let tx = await starNotaryClient.buyStar(id, price);
        this.props.waitForTransaction(tx);
    }

    renderStarInfo(star, isStarOwner) {
        return (
            <div className="star-card" >
                <div className="star-info">
                    <h2 className="star-info-heading">{star.name} </h2>
                    <h3>ID</h3>
                    <p>{star.id}</p>

                    <div className="star-story">
                        <h3>Story</h3>
                        <p>{star.story}</p>
                    </div>
                    <div className="star-coordinates">
                        <h3>Coordinates</h3>
                        <p>Dec: {star.dec}</p>
                        <p>Mag: {star.mag}</p>
                        <p>Cent: {star.cent}</p>
                    </div>
                    {isStarOwner ?
                        <button onClick={this.toggleForm.bind(this)} className="sell-button">Sell</button> :
                        star.price > 0 && <button onClick={this.buyStar.bind(this)} className="sell-button">Buy</button>
                    }
                </div>
            </div >
        );
    }

    onPriceChange(event) {
        let price = event.target.value;
        this.setState({ saleFor: price });
    }

    toggleForm() {
        this.setState((prevState) => ({ showForm: !prevState.showForm }))
    }


    renderSaleForm(star) {
        return (
            <div className="sell-form-div" onClick={this.toggleForm.bind(this)}>
                <form className="sell-star-form" onClick={(e) => e.stopPropagation()}>
                    <h4>Sell {star.name} (#{star.id}) ?</h4>
                    <label htmlFor="sale">
                        How much to sell for? <br />
                        Set 0 to remove from sale.
                    </label>
                    <input value={this.state.saleFor} onChange={this.onPriceChange.bind(this)} name="sale" id="sale" type="number" placeholder="0.003 (in ethers)"></input>
                    <button className="sell-button" onClick={this.putStarForSale.bind(this)}>Sell your Star!</button>
                </form>
            </div>
        );
    }

    render() {
        let { star } = this.props;
        return (
            <div style={{ maxWidth: "350px", minWidth: "300px" }}>

                {this.renderStarInfo(star, this.props.isStarOwner)}
                {this.state.showForm &&
                    this.renderSaleForm(star)
                }
            </div>
        );
    }
}

export default StarCard;
