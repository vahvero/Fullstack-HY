import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {FilterInput} from './FilterInput';
import {CountryList} from './CountryList';

const FETCHURL = 'https://restcountries.eu/rest/v2/all';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      countries: [],
      filterString: '',
      filteringType: 'name'
    }
    this.filterOnChange = this.filterOnChange.bind(this);
    this.onClickCountryMethod = this.onClickCountryMethod.bind(this);
  }

  componentDidMount = () => {
    const promise = axios.get(FETCHURL);
    promise.then(
      (response) => {
        this.setState({
          countries: response.data
        })
      }
    )

  }

  filterOnChange = (event) => {
    this.setState(
      {
        filterString: event.target.value
      }
    )
  }

  onClickCountryMethod = (name) => {
    this.setState(
      {
        filterString: name
      }
    )
  }


  render() {
    return (
      <div>
        <h1>Filtteri</h1>
        <FilterInput onChangeMethod={this.filterOnChange} />

        <h1>Maat</h1>
        <CountryList filterString={this.state.filterString}
                     array={this.state.countries}
                     filteringFieldName={this.state.filteringType}
                     onClickMethod={this.onClickCountryMethod} />
      </div>
    ); 
}

}

export default App;
