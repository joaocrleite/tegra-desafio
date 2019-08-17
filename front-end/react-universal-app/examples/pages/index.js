import React from 'react'
// import Link from 'next/link'
import Head from 'next/head'
import Person from '../components/Person'

import '../assets/scss/main.scss'

const Home = (props) => (
  <div>
    <h1>Título</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, voluptatem!</p>
    <p><b>Name:</b> {props.name}</p>
    <hr/>

    <Person name={props.name} />

    
  </div>
);

Home.getInitialProps = async function(){

  return {
    name : 'João Carlos'
  };
}

export default Home
