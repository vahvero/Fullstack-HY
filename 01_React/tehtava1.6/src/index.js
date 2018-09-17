import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = () => {
    const heading = 'Anna palautetta';

    return(
        <div>
            <Header name={heading} />
            <Statistics />
        </div>
    )   
}

const Header = (props) => {

    return(
        <h1>{props.name}</h1>
    )
}

class Statistics extends React.Component {
    constructor() {
        super()
        const _names = ["hyvä", "neutraali", "huono"];
        const _buttons = _names.map(
            (idName) => {
                let props = {
                    name: idName,
                    callback: this.addOne
                }
                return(
                    <CounterButton name={idName} callback={props.callback}/>
                )
            }
        )
        let _counters = _names
            .map(
                (a) => {
                    return (
                        {
                            name: a,
                            value: 0
                        }
                        );
                }
            )


        this.state = {
            names: _names,
            buttons: _buttons,
            counters: _counters
        }
    }

    addOne = (name) => {
        return () => {
            // console.log(name);
            let _counters = this.state.counters;
            _counters.map(
                (elem) =>
                {
                    if(elem.name === name) {
                        // console.log('Hello');
                        elem.value++;
                    }
                }
            )
            this.setState({counters: _counters})
            // console.log(this.state.counters);
        }
    }

    render() {
        return(
        <div>
            <div>
                {
                    this.state.buttons.map(                    
                        (a) => {
                            return a;
                        }
                    )
                }
            </div>
            <Statistic counters={this.state.counters} />
        </div>
        )
    }    
}

const Statistic = ({counters}) => {
    // console.log(counters);
    let sum = 0;
    let posititive = 0;
    let len = 0;
    counters.map(
        (elem) => {
            if(elem.name === 'hyvä'){
                sum += elem.value;
                len += elem.value;
                posititive = elem.value;
            }
            else if (elem.name === 'huono') {
                sum -= elem.value;
                len += elem.value;
            }
            else if (elem.name === 'neutraali') {
                len += elem.value;
            }
        }
    )
    if(len <= 0) {
        return (
            <div>
                <h1>Statistiikka</h1>

                <p>ei yhtään palautetta annettu</p>
            </div>
        )
    }
    else {
        const mean = sum / len;
        const posPros = posititive / len * 100;

        return (
            <div>
            <h1>Statistiikka</h1>
            <table>
                {
                    counters
                    .map(
                            (a) => {
                                
                                return <tr><td>{a.name}</td><td>{a.value}</td></tr>
                            }
                        )
                }
                <tr>
                    <td>keskiarvo</td><td>{mean}</td>
                </tr>
                <tr><td>positiivisia</td><td>{posPros}%</td></tr>

            </table>
            </div>
        )
    }


}

const CounterButton = ({name, callback}) => {
    return (
        <button onClick={callback(name)}>{name}</button>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));