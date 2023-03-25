import React from 'react'

type Props = {
    logs: {
        clone: string,
        install: string,
        build: string,
        start: string
    }
}

const Logger = (props: Props) => {
    console.log(props)
    return (
        <div className=''>
            <h1>asdasdas</h1>
            <p>{props.logs.clone}</p>
            <p>{props.logs.install}</p>
            <p>{props.logs.build}</p>
            <p>{props.logs.start}</p>
        </div>
    )
}

export default Logger