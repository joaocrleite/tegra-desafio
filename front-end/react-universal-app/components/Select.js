class Select extends React.Component {

    render(){

        const options = this.props.data.map((item, key) =>
            <option key={item.id} value={item.id}>{item.name}</option>
        );

        return (
            <div className="field">
               <label className="label">{this.props.label}</label>
               <div className="control">
                    <div className="select is-fullwidth">
                        <select onChange={this.props.selected}>
                            <option value="">Selecione</option>
                            {options}
                        </select>
                    </div>
                </div>
            </div>
        );
    }


}

export default Select;