import FlightInfoHeader from './FlightInfoHeader';
import FlightInfoScales from './FlightInfoScales';

class FlightInfo extends React.Component {

    render(){

        const flight = this.props.flight;

        return (
            <div className="column card-info-side">
                <FlightInfoHeader flight={flight} />
                <FlightInfoScales scales={flight.scales} />
            </div>
        );
    }


}

export default FlightInfo;