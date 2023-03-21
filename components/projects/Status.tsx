import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const Status = (props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [status, setStatus] = React.useState({})
    const statusId = status?.id

    // const user = props.auth.user
    const projectId = props.project.id



    // get record id for this project status collection
    const getStatusId = async () => {
        try {
            const statusExists = await pb
                .collection("projectStatus")
                .getFullList({ projectId: projectId }, { $autoCancel: false })
            setStatus(statusExists[0])
            console.log(statusExists[0])
        } catch (e) {
            console.error("statusExists error");
        }
    };

    console.log(statusId)




    useEffect(() => {

        getStatusId()


        if (statusId) {

            pb.collection('projectStatus').subscribe(statusId, function (e) {
                console.log(e.record);
                setStatus(e.record)
            });
        }



    }, [statusId])





    return (
        <div>
            <div>{status.cloned && <p className="badge badge-warning">cloned</p>}</div>
            <div>{status.installed && <p className="badge badge-info">installed</p>}</div>
            <div>{status.built && <p className="badge badge-info">built</p>}</div>
            <div >{status.isOnline && <p className="badge badge-success">isOnline</p>}</div>
            <div>{status.stopped && <p className="badge badge-error">stopped</p>}</div>
        </div>

    )
}

export default Status