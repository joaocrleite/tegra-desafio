import React from 'react'
// import Link from 'next/link'
// import Head from 'next/head'
import SearchBar from '../components/SearchBar'
import Results from '../components/Results'

import '../assets/scss/main.scss'


class Home extends React.Component {


  state = {
    results:[]
  };

  updateResults = (results) =>{
    this.setState({results});
  }


  render(){
    return (
      <main className="main">
        <h1 className="title has-text-centered">Decolar na Tegra</h1>

        <div className="container">

          <SearchBar updateResults={this.updateResults} />

          <Results results={this.state.results} />

        </div>

      </main>
    )
  }

}

// const Home = (props) => (
//   <main className="main">
//     <h1 className="title has-text-centered">Decolar na Tegra</h1>

//     <div className="container">

//       <SearchBar />

//       <Results />

//     </div>

//   </main>
// );

export default Home
