
class FlightPrice extends React.Component {

    render(){

        const flight = this.props.flight;

        return (
            
            <div className="column card-price-side">
                <div className="price-label">
                    <p className="title">Preço final</p>
                    <p className="subtitle">Tudo incluído!</p>
                </div>
                <div className="price-total">R$ {flight.totalAmount}</div>
                <button className="button is-success is-fullwidth" disabled>Selecionar</button>
            </div>
        );
    }


}

export default FlightPrice;