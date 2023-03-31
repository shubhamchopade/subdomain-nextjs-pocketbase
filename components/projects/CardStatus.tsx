import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const CardStatus = (props) => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const [status, setStatus] = React.useState(props?.status)
    const statusId = status?.id

    // console.log(props)
    useEffect(() => {
        try {
            if (statusId) {
                pb.collection('projectStatus').getOne(statusId).then((status) => {
                    setStatus(status)
                })
            }

        } catch (e) {
            console.error(e)
        }
    }, [statusId])


    return (
        <div>

            <div className='flex max-w-xl mx-auto'>
                <div>{status?.cloned && <p className="badge badge-info">cloned</p>}</div>
                <div>{status?.subdomain && <p className="badge badge-info">subdomain</p>}</div>
                <div>{status?.installed && <p className="badge badge-warning">installed</p>}</div>
                <div>{status?.built && <p className="badge badge-success">built</p>}</div>
                <div >{status?.isOnline && <p className="badge badge-success">isOnline</p>}</div>
                <div>{status?.stopped && <p className="badge badge-error">stopped</p>}</div>
            </div>
        </div>

    )
}

export default CardStatus