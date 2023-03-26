import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'

type Props = {
    projectId: string,
    status: any
}

const Logger = (props: Props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [logs, setLogs] = React.useState(props?.status)
    const statusId = props?.status

    // console.log(props.logs.projectId)
    // useEffect(() => {
    //     const getStatusId = async () => {
    //         try {
    //             const projectLogs = await pb
    //                 .collection("projectStatus")
    //                 .getFullList({ projectId: props.projectId }, { $autoCancel: false })
    //             // console.log(projectLogs[0])
    //             setLogs(projectLogs[0])
    //             return projectLogs[0]
    //         } catch (e) {
    //             console.error("projectLogs error");
    //             return null
    //         }
    //     };
    //     getStatusId()
    // }, [statusId])

    useEffect(() => {
        try {
            if (statusId) {
                pb.collection('projectStatus').subscribe(statusId, function (e) {
                    // console.log(e.record);
                    setLogs(e.record)
                });
            }

        } catch (e) {
            console.error(e)
        }
    }, [statusId])


    return (
        <div className='prose card bg-base-300 p-4 max-w-xl mx-auto shadow text-xs overflow-x-auto'>
            {logs && <>
                <pre>{logs.logClone}</pre>
                <pre >{logs.logSubdomain}</pre>
                <pre >{logs.logInstall && JSON.parse(logs.logInstall)}</pre>
                <pre >{logs.logBuild && JSON.parse(logs.logBuild)}</pre>
                <pre >{logs.logStart}</pre></>}
        </div>
    )
}

export default Logger

function LogOutput({ logText }) {
    return (
        <pre dangerouslySetInnerHTML={{ __html: logText }}></pre>
    );
}