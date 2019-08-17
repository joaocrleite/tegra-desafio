
class CardScale extends React.Component {

    render(){

        const scale = this.props.scale;

        return (
            
            <div className="card card-scale">

                <div className="columns">

                  <div className="column company">
                    <p className="subtitle">Operado por</p>
                    <p className="title">{scale.company.name}</p>
                  </div>

                  <div className="column take-off">
                    <p className="subtitle">Saída</p>
                    <p className="title">{scale.take_off.human.time}</p>
                  </div>

                  <div className="column landing">
                    <p className="subtitle">Chegada</p>
                    <p className="title">{scale.landing.human.time}</p>
                  </div>

                  <div className="column duration">
                    <p className="subtitle">Duração</p>
                    <p className="title">1h 5m</p>
                  </div>

                </div>
              
              </div>
              
        );
    }


}

export default CardScale;