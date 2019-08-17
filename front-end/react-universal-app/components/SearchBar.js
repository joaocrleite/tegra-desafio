import axios from 'axios';

import Card from './Card';
import Columns from './Columns';
import Column from './Column';

import Select from './Select';
import DatePicker from './DatePicker';

class SearchBar extends React.Component {

    state = {
        airports:[],
        from : null,
        to: null,
        when: '2019-02-12',
        // results: []
    };

    constructor(props){
        super(props);
        this.getAirports();
    }

    getAirports = () =>{
        axios
        .get('http://laravel.tegra.com.la/airports')
        .then(res=>{
           this.setState({
               airports : res.data.data
           });
        })  
        .catch(err=>{

        });
    }

    updateFrom = (e) =>{
        var from = e.target.value;
        this.setState({from});
    }

    updateTo = (e) =>{
        var to = e.target.value;
        this.setState({to});
    }

    updateWhen = (e) =>{
        var when = e.target.value;
        this.setState({when});
    }


    send = () =>{

        var params = {
            from: this.state.from,
            to: this.state.to,
            date: this.state.when
        };

        axios
          .get("http://laravel.tegra.com.la/search", { params })
          .then(res => {

            var rawResults = res.data.sorted;

            var results = this.resolveResults(rawResults);

            // this.setState({results});

            this.props.updateResults(results);

          })
          .catch(err => {
            console.log(err);
          });
    }

    resolveResults = (rawResults) => {
        var flights = [];
  
        for (var i = 0; i < rawResults.length; i++) {
          var rawRow = rawResults[i];
          var rawScales = rawRow.scales;
  
          var take_off = this.resolveDate(rawRow.take_off_at);
          var landing = this.resolveDate(rawRow.landing_at);
  
          var flight = {
            from: rawRow.from,
            to: rawRow.to,
            take_off,
            landing,
            totalAmount: 0.0,
            scales: []
          };
  
          var previewLanding = null;
  
          for (var y = 0; y < rawScales.length; y++) {
            var scaleRow = rawScales[y];
  
            var take_off = this.resolveDate(scaleRow.take_off_at);
            var landing = this.resolveDate(scaleRow.landing_at);
  
            var waiting = null;
  
            if(previewLanding){
  
              waiting = this.resolveWaiting(scaleRow.from, previewLanding, take_off);
  
            }
  
            previewLanding = landing;
  
            var scale = {
              from: scaleRow.from,
              to: scaleRow.to,
              take_off,
              landing,
              amount: parseFloat(scaleRow.amount).toFixed(2),
              company: scaleRow.company,
              waiting,
            };
  
            flight.totalAmount += scale.amount;
  
            flight.scales.push(scale);
          }
  
          flight.totalAmount = parseFloat(flight.totalAmount).toFixed(2);
  
          flights.push(flight);
        }
  
        return flights;
      }

      dateUnparse = (rawDate) => {
        var parts = rawDate.split(" ");
  
        var dates = parts[0];
        var times = parts[1];
  
        var datesParts = dates.split("-");
        var timesParts = times.split(":");
  
        return new Date(
          datesParts[0],
          datesParts[1] - 1,
          datesParts[2],
          timesParts[0],
          timesParts[1],
          timesParts[2]
        );
      }
  
      dateHuman = (date) => {
        var now = new Date();
  
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month.toString();
        }
  
        var day = date.getDate();
        if (day < 10) {
          day = "0" + day.toString();
        }
  
        var hours = date.getHours();
        if (hours < 10) {
          hours = "0" + hours.toString();
        }
  
        var minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes.toString();
        }
  
        return {
          time: hours + ":" + minutes,
          date: day + "/" + month + "/" + year
        };
      }
  
      resolveDate = (rawDate) => {
        var original = rawDate;
        var date = this.dateUnparse(original);
        var human = this.dateHuman(date);
  
        return { original, date, human };
      }
  
      resolveWaiting = (flight, preview, next) => {
  
        var seconds = (next.date.getTime() - preview.date.getTime()) / 1000;
  
        var minutes = seconds / 60;
  
        var hours = Math.floor(minutes / 60);
        var minutes = minutes % 60;
  
        var waiting = {
          city : flight.city,
          hours,
          minutes
        };
  
  
        return waiting;
      }

    render(){

        return (
            <div id="search-bar">
               <h2 className="title">Search Bar</h2>

                <Card>
                    <Columns>
                        <Column>
                            <Select label="Origem:" data={this.state.airports} selected={this.updateFrom}/>
                        </Column>
                        <Column>
                            <Select label="Destino:" data={this.state.airports} selected={this.updateTo}/>
                        </Column>
                        <Column>
                            <DatePicker label="Quando:" selected={this.updateWhen} />
                        </Column>
                        <Column>
                            <button className="button is-primary button-search is-fullwidth" onClick={this.send}>Procurar</button>
                        </Column>
                    </Columns>
                </Card>

            </div>
        );
    }


}

export default SearchBar;