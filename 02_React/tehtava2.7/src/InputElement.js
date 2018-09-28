import React from 'react';


export const InputElement = ({label, value, onChange}) => {
    return(<div>
            <p>{label}</p><input value={value} onChange={onChange} />
        </div>
    )
}