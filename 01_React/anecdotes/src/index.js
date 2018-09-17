import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      votes: Array(this.props.anecdotes.length).fill(0),
      maxVotes: 0
    }
  }

  pickRandom = () => {
    const ind = Math.floor(Math.random() * Math.floor(this.props.anecdotes.length));
    this.setState({
        selected: ind
      }
    )
  }
  vote = () => {
      let _votes = this.state.votes;
      _votes[this.state.selected]++;
      const _maxVotes = getIndexOfMaxVotes(_votes);
      this.setState({
        votes: _votes,
        maxVotes: _maxVotes
      }
      )
  }

  render() {
    return (
      <div>
        <p>{this.props.anecdotes[this.state.selected]}</p>
        <p>{this.state.votes[this.state.selected]}</p>
        <RandomizeButton name="Vote" callback={this.vote} />
        <RandomizeButton name="Randomize" callback={this.pickRandom}/>
        <h1>Anecdote with most votes</h1>
        <AnecdoteWithMostVotes anecdote={this.props.anecdotes[this.state.maxVotes]} 
        votes={this.state.votes[this.state.maxVotes]} />
      </div>
    )
  }
}

const AnecdoteWithMostVotes = ({anecdote, votes}) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const getIndexOfMaxVotes = (arr) => {
  let index = 0;
  let maxVotes = 0;
  for(let i=0;i<arr.length;++i){
    if(arr[i] > maxVotes){
      index = i;
      maxVotes = arr[i];
    }
  }
  return index;
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const RandomizeButton = ({name, callback}) => {
    return(
      <div>
        <button onClick={callback}>{name}</button>
      </div>
    )
}
ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)