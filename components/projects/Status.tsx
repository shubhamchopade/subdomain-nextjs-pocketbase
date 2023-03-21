import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const Status = (props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [status, setStatus] = React.useState({})

    // const user = props.auth.user

    useEffect(() => {
        pb.collection('projectStatus').subscribe('*', function (e) {
            console.log(e.record);
            setStatus(e.record)
        });
    }, [])


    useEffect(() => {
        const getStatus = async () => {

        }
        getStatus()
    }, [])

    console.log(status)

    return (
        <div>
            <div>{status.cloned && <p className="badge badge-warning">cloned</p>}</div>
            <div>{status.installed && <p className="badge badge-info">installed</p>}</div>
            <div >{status.isOnline && <p className="badge badge-success">isOnline</p>}</div>
            <div>{status.stopped && <p className="badge badge-error">stopped</p>}</div>
        </div>

    )
}

export default Status