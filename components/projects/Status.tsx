import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';
import { motion, AnimatePresence } from "framer-motion"

// Fetch all the projects

const Status = (props) => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const [status, setStatus] = React.useState(props?.status)
    const statusId = status?.id

    // console.log(props)
    useEffect(() => {
        try {
            if (statusId) {
                pb.collection('projectStatus').subscribe(statusId, function (e) {
                    // console.log(e.record);
                    setStatus(e.record);
                    // liveStatus.setStatus(e.record);
                });
            }

        } catch (e) {
            console.error(e)
        }
    }, [statusId])


    return (
        <div>
            <AnimatePresence mode='popLayout'>
                <div className='flex max-w-xl mx-auto'>
                    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 100, opacity: 1 }} exit={{ opacity: 0 }}>{status.cloned && <p className="badge badge-info">cloned</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.subdomain && <p className="badge badge-info">subdomain</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.installed && <p className="badge badge-warning">installed</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.built && <p className="badge badge-success">built</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.isOnline && <p className="badge badge-success">isOnline</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.stopped && <p className="badge badge-error">stopped</p>}</motion.div>
                    <motion.div animate={{ x: 100 }} exit={{ opacity: 0 }}>{status.current && <p className="text-xs">{status.current}</p>}</motion.div>

                </div>

                <div className='prose card bg-base-300 p-4 max-w-xl mx-auto shadow text-xs overflow-x-auto'>
                    {status && <>
                        <pre>{status.logClone}</pre>
                        <pre >{status.logSubdomain}</pre>
                        <pre >{status.logInstall && JSON.parse(status.logInstall)}</pre>
                        <pre >{status.logBuild && JSON.parse(status.logBuild)}</pre>
                        <pre >{status.logStart}</pre></>}
                </div>
            </AnimatePresence>
        </div>

    )
}

export default Status