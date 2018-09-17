import React from 'react'
import ReactDOM from 'react-dom'

// const Hello = (props) => {
//     return(
//         <div>
//             <p>Hello {props.name} ur {props.age} old.</p>
//         </div>
//     )
// }

class Hello extends React.Component {

    render() {
        const {name, age} = this.props;
        const bornYear = () => new Date().getFullYear() - age;
        return (
            <div>
                <p>
                Hello {name}, you are {age}.
                You were born on the year {bornYear()}
                </p>
            </div>
        )
    }
}

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 1
        }
    

    setInterval( () => {
            this.setState({counter: this.state.counter + 1})
        }, 1000)
    }

    render() {
        return (
            <div>{this.state.counter}</div>
        )
    }
}

const buttonClick = () => {
    console.log("HEllo world");
}

const App = () => {
    console.log('Hello from komponentti')

    const now = new Date();
    const a = 10;
    const b = 20;

    return(
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a + b}</p>
      <div>
          <h1>Greetings</h1>
          <Hello name="Matti" age={43+2}/>
          <Hello name="Eino" age={b}/>
          <Hello name="Archibaldi" age={a}/>
          <Counter />
      </div>

      <button onClick={buttonClick}>Hello</button>
    </div>
    );

}

ReactDOM.render(<App />, document.getElementById('root'))