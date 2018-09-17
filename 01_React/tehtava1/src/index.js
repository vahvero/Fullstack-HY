import React from 'react'
import ReactDOM from 'react-dom'

// const App = () => {
//   const kurssi = 'Half Stack -sovelluskehitys'
//   const osa1 = 'Reactin perusteet'
//   const tehtavia1 = 10
//   const osa2 = 'Tiedonvälitys propseilla'
//   const tehtavia2 = 7
//   const osa3 = 'Komponenttien tila'
//   const tehtavia3 = 14

//   return (
//     <div>
//       <h1>{kurssi}</h1>
//       <p>{osa1} {tehtavia1}</p>
//       <p>{osa2} {tehtavia2}</p>
//       <p>{osa3} {tehtavia3}</p>
//       <p>yhteensä {tehtavia1 + tehtavia2 + tehtavia3} tehtävää</p>
//     </div>
//   )
// }

const Otsikko = (props) => {
    return(
        <div>
            <h1>
                {props.course}
            </h1>
        </div>
    )
}

const Sisalto = (props) => {
    return(
        <div>
            <p>{props.name} {props.excercises}</p>
        </div>
    )
}

const Yhteensa = (props) => {
    return(
        <div>
            <p>yhteensä {props.total} tehtävää</p>
        </div>
    )
}

const App = () => {

    const course = {
    name: 'Half Stack -sovelluskehitys',
    parts: [
        {
        name: 'Reactin perusteet',
        excercises: 10
        },
        {
        name: 'Tiedonvälitys propseilla',
        excercises: 7
        },
        {
        name: 'Komponenttien tila',
        excercises: 14
        }
    ]
    }
    

    return(
        <div>
            <Otsikko course={course.name} />
            {
                course.parts
                .map(
                    (a) => {
                        return <Sisalto name={a.name} excercises={a.excercises} /> 
                    }
                )
 
            }
            <Yhteensa total={course.parts.reduce(
                (a, b) => a + b.excercises, 0
            )}/>
        </div>
    )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)