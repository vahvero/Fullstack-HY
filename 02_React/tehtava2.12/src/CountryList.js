import React from 'react';

export const CountryList = ({filterString, array, filteringFieldName, onClickMethod}) => {

    const filteredArray = filterArray(array, filterString, filteringFieldName);

    if(filteredArray.length === 1){
        return(
            <div>
                <SingleCountry elem={filteredArray[0]} />
            </div>
        )
    }

    else if(filteredArray.length < 10){
    return(
        <div>
            {
                filteredArray.map(
                    (a) => {
                        return <Country key={a.name} elem={a} onClickMethod={onClickMethod} />
                    }
                )
            }
        </div>


    )}
    else {
        return(
        <div>
            <p>Too many matches, spesify another filter</p>
        </div>
        )
    }

}


const filterArray = (array, filterString, fieldName) => {
    const filteredArray = array.filter(
        (elem) => {
            return elem[fieldName].toUpperCase().includes(filterString.toUpperCase())
        })
      
      return filteredArray;
  }

const Country = ({elem, onClickMethod}) => {
    return(
        <div onClick= {() => {onClickMethod(elem.name)} }>
            <p>{elem.name}</p>
        </div>
    )
}

const SingleCountry = ({elem}) => {
    return(
        <div>
            <h2>{elem.name} : {elem.nativeName}</h2>
            <p>Population: {elem.population}</p>
            <p>Capital: {elem.capital}</p>
                <img src={elem.flag} alt="Country flag" />
            
        </div>
    )
}