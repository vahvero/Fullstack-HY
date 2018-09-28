import React from 'react';

export const Number = ({person, onClickMethod}) => {
    return(
        <div>
            <p>{person.name} : {person.number}</p><button onClick={() => onClickMethod(person.id, person.name)}>Poista</button>
        </div>
    )
}