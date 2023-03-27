import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const Status = (props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [status, setStatus] = React.useState(props?.status)
    const statusId = status?.id

    // console.log(props)
    useEffect(() => {
        try {
            if (statusId) {
                pb.collection('projectStatus').subscribe(statusId, function (e) {
                    // console.log(e.record);
                    setStatus(e.record)
                });
            }

        } catch (e) {
            console.error(e)
        }
    }, [statusId])


    return (
        <div>

            <div className='flex max-w-xl mx-auto'>
                <div>{status.cloned && <p className="badge badge-info">cloned</p>}</div>
                <div>{status.subdomain && <p className="badge badge-info">subdomain</p>}</div>
                <div>{status.installed && <p className="badge badge-warning">installed</p>}</div>
                <div>{status.built && <p className="badge badge-success">built</p>}</div>
                <div >{status.isOnline && <p className="badge badge-success">isOnline</p>}</div>
                <div>{status.stopped && <p className="badge badge-error">stopped</p>}</div>
            </div>

            <div className='prose card bg-base-300 p-4 max-w-xl mx-auto shadow text-xs overflow-x-auto'>
                {status && <>
                    <pre>{status.logClone}</pre>
                    <pre >{status.logSubdomain}</pre>
                    <pre >{status.logInstall && JSON.parse(status.logInstall)}</pre>
                    <pre >{status.logBuild && JSON.parse(status.logBuild)}</pre>
                    <pre >{status.logStart}</pre></>}
            </div>
        </div>

    )
}

export default Status