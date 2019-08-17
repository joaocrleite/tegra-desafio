
import axios from 'axios';

class Person extends React.Component {

    state = {
        email: 'joaocrleite@gmail.com',
        usersCount: 0,
        users: []
    };

    constructor(props){
        super(props);

        // this.getUsers();

    }

    getUsers = () => {

        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res=>{

                this.setState({
                    usersCount :  res.data.length,
                    users: res.data
                });

            })
            .catch(err=>{
                console.log('err');
                console.log(err);
            });

    }

    render(){

        const users = this.state.users.map((user, key) =>
            <li key={user.id}>{user.name}</li>
        );

        return (
            <div>
                <p>
                    <button onClick={this.getUsers}>getUsers</button>
                </p>
                <p>
                    <b>Name: </b> {this.props.name}
                </p>
                <p>
                    <b>Email:</b> {this.state.email}
                </p>
                <p>
                    <b>Users:</b> {this.state.usersCount}
                </p>
                <ul>
                    {users}
                </ul>
            </div>
        );
    }


}

export default Person;