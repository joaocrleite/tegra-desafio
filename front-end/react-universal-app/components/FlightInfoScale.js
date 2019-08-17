
import CardScale from './CardScale';
import CardWaiting from './CardWaiting';


class FlightInfoScale extends React.Component {

    render(){

        const scale = this.props.scale;
        const waiting = scale.waiting;

        return (
            
            <div className="scale">

                {waiting ? (<CardWaiting waiting={waiting} />) : ''}

                <CardScale scale={scale} />
            </div>
        );
    }


}

export default FlightInfoScale;