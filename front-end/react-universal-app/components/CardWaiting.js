
class CardWaiting extends React.Component {

    render(){

        const waiting = this.props.waiting;

        return (
            
            <div className="card card-scale-waiting">
                <p>
                    <span>
                        <b-icon icon="clock" size="is-small"></b-icon>
                    </span>
                    <span>
                        Espera de
                        <b className="scale-waiting-time">
                        <span v-if="scale.waiting.hours > 0">{waiting.hours}h</span>
                        <span v-if="scale.waiting.minutes > 0">{waiting.minutes}m</span>
                        </b> em
                        <b className="scale-waiting-city">{waiting.city.name}</b>
                        (Troca de avião)
                    </span>
                </p>
            </div>
        );
    }


}

export default CardWaiting;