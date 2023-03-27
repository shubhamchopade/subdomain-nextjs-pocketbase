import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { generateRandomNumber } from "../utils/build-helpers";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Status from "./Status";
import Logger from "./Logger";
import Modal from "../common/Modal";
import Link from "next/link";

const Card = (props) => {
    const project = props.project;
    const router = useRouter()
    const id = props.userId;
    const projectId = project.id;
    const link = project.link;
    const subdomain = project.subdomain;
    // const [isLoading, setIsLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [framework, setFramework] = useState(props?.project.framework)
    const [cloneLogs, setcloneLogs] = useState("")
    const [installLogs, setInstallLogs] = useState("")
    const [buildLogs, setBuildLogs] = useState("")
    const [startLogs, setStartLogs] = useState("")
    const [showLogs, setShowLogs] = useState(false)

    const pb = new PocketBase("https://pocketbase.techsapien.dev");

    // get id for this project status collection
    useEffect(() => {
        const getStatusId = async () => {
            try {
                const statusExists = await pb
                    .collection("projectStatus")
                    .getFullList({ projectId: projectId }, { $autoCancel: false })
                // console.log(statusExists[0])
                setStatus(statusExists[0])
                return statusExists[0]
            } catch (e) {
                console.error("statusExists error");
                return null
            }
        };
        getStatusId()
    }, [])

    // Get the framework
    const getFramework = async () => {
        const res = await fetch(
            `/api/framework?link=${link}&id=${id}&projectId=${projectId}`
        );
        const data = await res.json();
        return data
    }

    return (
        <div className="relative">
            <div className={`card max-w-xl bg-base-200 shadow-xl relative m-4 ${isLoading && "animate-pulse"}`}>
                <span className="uppercase text-xs font-bold">{framework}</span>
                <div className="card-body">
                    <Link href={`${projectId}?framework=${framework}&userId=${id}`} className="card-title">{props.project.title}</Link>
                    <p>{props.project.description}</p>
                    {status && <Status status={status} />}
                    <div className="h-5">
                        {isLoading && <progress className="progress progress-primary w-56"></progress>}
                    </div>
                    <a href={`https://${props.project.subdomain}.techsapien.dev`} className="link my-2 ml-auto">{props.project.subdomain}.techsapien.dev</a>
                </div>
            </div>
        </div>
    );
};

export default Card;
