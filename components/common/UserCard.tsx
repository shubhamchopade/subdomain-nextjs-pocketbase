import React from 'react'

const UserCard = (props) => {
    return (
        <div><div className="card card-compact w-52 mx-auto bg-base-200 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{props.email}</h2>
                <p>{props.email}</p>

            </div>
        </div></div>
    )
}

export default UserCard