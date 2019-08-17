
class FlightInfoHeader extends React.Component {

    render(){

        const flight = this.props.flight;

        return (
            
            <div className="base-infos columns">
                <div className="date column">
                    <p className="title">IDA</p>
                    <p className="subtitle">{flight.take_off.human.date}</p>
                </div>
                <div className="from column">
                    <p className="title">{flight.from.slug}</p>
                    <p className="subtitle">{flight.from.city.name}</p>
                </div>
                <div className="to column">
                    <p className="title">{flight.to.slug}</p>
                    <p className="subtitle">{flight.to.city.name}</p>
                </div>
            </div>
        );
    }


}

export default FlightInfoHeader;