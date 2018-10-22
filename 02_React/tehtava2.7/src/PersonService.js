import axios from 'axios';
import React from 'react';

// const FETCHURL = "http://localhost:3001/api";
// const FETCHURL = "/api";

const FETCHURL = "/api";

const getAll = () => {

    const promise = axios.get(FETCHURL + '/persons');
    const data = promise.then(
        (response) => {
            // console.log(response);
            return response.data;
        }
    )
    // console.log(promise);
    // console.log(data);
    return data;
}   

const postPerson = (personObject) => {
    const promise = axios.post(FETCHURL + '/persons',
        personObject
    )
    
    const data = promise.then(
        (response) => {
            return response.data;
        }
    )
    // console.log(data);
    return data;
}

const putPerson = (person, _number) => {
    return axios.put(FETCHURL + '/persons/' + person.id,
        {
            name: person.name,
            number: _number
        }
    ).then(
        response => {
            return response;
        }
    )
}

const deletePerson = (id) => {
    return axios.delete(FETCHURL + '/persons/' + id)
    .then(
        response => {
            // console.log(response)
            return response;
        }
    )
}

export default {getAll, postPerson, deletePerson, putPerson}