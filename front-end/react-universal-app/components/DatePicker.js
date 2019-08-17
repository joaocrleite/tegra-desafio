class DatePicker extends React.Component {

    render(){

        return (
            <div className="field">
                <label className="label">{this.props.label}</label>
                <div className="control">
                   <input type="date" className="input" onChange={this.props.selected} value="2019-02-12" />
                </div>
            </div>
        );
    }


}

export default DatePicker;