import React from "react"

const Persons = ({ name, number, deletePerson }) => {
    return (
        <div>
            <p key={name}>{name} {number}
                <button onClick={deletePerson}>delete</button>
            </p>
        </div>
    )
}

export default Persons