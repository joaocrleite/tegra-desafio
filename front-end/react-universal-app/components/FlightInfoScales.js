
import FlightInfoScale from './FlightInfoScale';

class FlightInfoScales extends React.Component {

    render(){

        const scales = this.props.scales.map((scale, key) =>
            <FlightInfoScale key={key} scale={scale} />
        );

        console.log(this.props.scales);

        return (
            
            <div className="card-content scales">
                {scales}
            </div>
        );
    }


}

export default FlightInfoScales;