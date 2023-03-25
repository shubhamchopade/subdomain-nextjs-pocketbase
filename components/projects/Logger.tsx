import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'

type Props = {
    logs: {
        projectId: string,
        clone: string,
        install: string,
        build: string,
        start: string,
        status: any
    }
}

const Logger = (props: Props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [logs, setlLogs] = React.useState("")
    const statusId = props?.logs.status
    const [cloneLogs, setcloneLogs] = useState("")
    const [installLogs, setInstallLogs] = useState("")
    const [buildLogs, setBuildLogs] = useState("")
    const [startLogs, setStartLogs] = useState("")

    console.log(props.logs.projectId)
    useEffect(() => {
        const getStatusId = async () => {
            try {
                const projectLogs = await pb
                    .collection("projectStatus")
                    .getFullList({ projectId: props.logs.projectId }, { $autoCancel: false })
                // console.log(projectLogs[0])
                setlLogs(projectLogs[0])
                return projectLogs[0]
            } catch (e) {
                console.error("projectLogs error");
                return null
            }
        };
        getStatusId()
    }, [statusId])

    // console.log(statusId)
    useEffect(() => {

        if (statusId?.logBuild) {
            // console.log(JSON.parse(logs.logBuild))
            setBuildLogs(JSON.parse(statusId.logBuild))
        }

        if (statusId?.logClone) {
            // console.log(JSON.parse(logs.logClone))
            setcloneLogs(JSON.parse(statusId.logClone))
        }

        if (statusId?.logInstall) {
            // console.log(JSON.parse(logs.logInstall))
            setInstallLogs(JSON.parse(statusId.logInstall))
        }

        if (statusId?.logStart) {
            // console.log(JSON.parse(logs.logStart))
            setStartLogs(JSON.parse(statusId.logStart))
        }

    }, [])
    // console.log(installLogs)
    return (
        <div className='prose card bg-base-200 p-4 max-w-xl shadow text-xs absolute z-10 top-50 h-44 overflow-y-auto overflow-x-auto'>
            {/* <p>sadasdf</p> */}
            {logs && <>
                <pre>{logs.logClone && JSON.parse(logs.logClone)}</pre>
                <pre >{logs.logInstall && JSON.parse(logs.logInstall)}</pre>
                <pre >{logs.logBuild && JSON.parse(logs.logBuild)}</pre>
                <pre >{logs.logStart}</pre></>}
            <p>{installLogs}</p>
            <p>{buildLogs}</p>
            {/* <p>{logs.logClone}</p>
            <p>{logs.logInstall}</p>
            <p>{logs.logBuild}</p>
            <p>{logs.logStart}</p> */}
        </div>
    )
}

export default Logger

function LogOutput({ logText }) {
    return (
        <pre dangerouslySetInnerHTML={{ __html: logText }}></pre>
    );
}