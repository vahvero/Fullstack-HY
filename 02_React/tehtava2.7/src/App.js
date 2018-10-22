import React from 'react';
import axios from 'axios';

import PersonService from './PersonService';
import {Number} from './Number';
import {InputElement} from './InputElement'
import {Notification} from './Notification';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filterString: '',
      error: null
    }


    this.handleClick = this.handleClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.filterPersons = this.filterPersons.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.fillPersons = this.fillPersons.bind(this);
  }

  componentDidMount = () => {

    this.fillPersons();
  }


  fillPersons = () => {

        PersonService.getAll().then((data) =>
            {
                this.setState({
                    persons: data
                })
            }
        )
    }

  handleClick = (event) => {
    event.preventDefault();
    if(this.state.persons.some( 
            (elem) => {
                return elem.name === this.state.newName; 
            }
        )
      )
    {
        const ok = window.confirm("Name already in list. Replace number?")

        if(ok) {
            PersonService.putPerson(
                this.state.persons.find((elem) => {
                    return elem.name === this.state.newName
                })
            , this.state.newNumber)
            .then(
                () => {
                    this.fillPersons();
                    this.setState({
                        error: 'Changed number of ' + this.state.newName
                    })
                }
            )
            .catch( () => {

                this.setState(
                    {
                        error: 'Operation failed.'
                    }
                )
                setTimeout(() => {
                    this.setState({
                        error: null
                    })
                }, 3000) 
            }
            );
        }
    }
    else 
    {

        PersonService.postPerson(
                {
                    name: this.state.newName,
                    number: this.state.newNumber
                }
            )
        .then( (data) => {
                // console.log(response);
                this.setState(
                    {
                        persons: [
                            ...this.state.persons, data
                        ],
                        newName: '',
                        newNumber: '',
                        error: this.state.newName + ' added.'
                    }
                );
                setTimeout(() => {
                    this.setState({
                        error: null
                    })
                }, 3000)
                }
            )
        .catch( () => {

            this.setState(
                {
                    error: 'Operation failed.'
                }
            )
            setTimeout(() => {
                this.setState({
                    error: null
                })
            }, 3000) 
        }
        )
    }
  }

  handleDelete = (id, name) => {
    const ok = window.confirm("Are you sure to delete " + name + "?");
    if(ok) {
        PersonService.deletePerson(id)
        .then( () => {
            this.setState({
                error: name + ' deleted.'
            })
            this.fillPersons();
            setTimeout(() => {
                this.setState({
                    error: null
                })
            }, 3000);
        }
    )
    .catch( () => {

        this.setState(
            {
                error: 'Operation failed.'
            }
        )
        setTimeout(() => {
            this.setState({
                error: null
            })
        }, 3000) 
    }
    )
}
  }

  filterPersons = (event) => {
    this.setState(
        {
            filterString: event.target.value
        }
    )
}

  handleNumberChange = (event) => {
      this.setState(
          {
              newNumber: event.target.value
          }
      )
  }

  handleNameChange = (event) => {
    // console.log(event.target.value)
    this.setState({
        newName: event.target.value
    })
    // console.log(this.state.persons)
  }


  render() {
    return (
      <div>
        <Notification message={this.state.error} />

        <h2>Puhelinluettelo</h2>
        
        <InputElement label={'Rajaa näytettäviä:'} value={this.state.filterString} onChange={this.filterPersons}/>

        <h3>Lisää numero</h3>
        <form onSubmit={this.handleClick}>
          <div>
            <InputElement label={'Nimi:'} value={this.state.newName} onChange={this.handleNameChange} />
        </div>
        <div>  
            <InputElement label={'Numero: '} value={this.state.newNumber} onChange={this.handleNumberChange} />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h2>Numerot</h2>
        {
            this.state.persons.map(
                (a) => {
                    if(a.name && a.name.includes(this.state.filterString)){
                        return <Number key={a.name} person={a} onClickMethod={this.handleDelete}/>
                    }
                    return null
                }
            )
        }
      </div>
    )
  }
}


export default App;