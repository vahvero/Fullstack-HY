
import React from 'react'

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

export const Kurssi = ({courses}) => {

    return(
        <div>
        {
            courses
            .map( 
                (course) => {
                return(
                    <div key={course.id}>
                        <Otsikko course={course.nimi} />
                        {
                            course.osat
                            .map(
                                (a) => {
                                    return <Sisalto name={a.nimi} excercises={a.tehtavia} key={a.id}/> 
                                }
                            )

                        }
                        <Yhteensa total=
                        {
                            course
                            .osat
                            .reduce(
                                    (a, b) => a + b.tehtavia, 0
                                )
                        }/>
                    </div>
                )
            

            })
        }
        </div>
    )
}