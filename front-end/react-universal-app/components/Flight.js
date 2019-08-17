
import FlightInfo from './FlightInfo';
import FlightPrice from './FlightPrice';


class Flight extends React.Component {

    render(){

        const flight = this.props.flight;

        return (
            <div className="card card-flight">
                <div className="columns">
                    <FlightInfo flight={flight} />
                    <FlightPrice flight={flight} />
                </div>
            </div>
        );
    }


}

export default Flight;