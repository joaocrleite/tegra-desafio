import axios from 'axios';
import Flight from './Flight';

class Results extends React.Component {

    state = {
      
    };

    render(){
       
        const flights = this.props.results.map((item, key) =>
            <Flight key={key} flight={item} /> 
        );

        return (
            <div id="results">
               <h2 className="title">Results</h2>
               <div className="flights">
                    {flights}
               </div>
            </div>
        );
    }


}

export default Results;