import React from 'react'
import PocketBase from "pocketbase";
import { createNginxConf, generateRandomNumber } from '../utils/build-helpers';


const Card = (props) => {
    const user = props.user
    const project = props.project

    const id = user.id
    const projectId = project.id
    const link = project.link
    const subdomain = project.subdomain

    const pb = new PocketBase("https://pocketbase.techsapien.dev");


    // console.log(props)
    const cloneRepo = async () => {
        const res = await fetch(
            `/api/clone?link=${link}&id=${id}&projectId=${projectId}`
        );
        const data = await res.json();
        console.log(data);
    };
    const installDependencies = async () => {
        const res = await fetch(
            `/api/install?link=${link}&id=${id}&projectId=${projectId}`
        );
        const data = await res.json();
        console.log(data);
    };
    const buildDependencies = async () => {
        const res = await fetch(
            `/api/build?link=${link}&id=${id}&projectId=${projectId}`
        );

        const data = await res.json();
        console.log("build", data);
    };
    const startProject = async () => {
        const res = await fetch(
            `/api/start?link=${link}&id=${id}&projectId=${projectId}`
        );
        const data = await res.json();
        console.log(data);
    };
    const subd = async () => {
        const res = await fetch(
            `/api/subdomain?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}`
        );
        const data = await res.json();
        console.log(data);
    };

    const handleDelete = () => {
        const register = async () => {
            const deleted = await pb.collection("projects").delete(project.id)

            console.log("delete>>>", deleted);
        };

        register();
    };

    const createSubdomainEntry = () => {
        // create a new entry in subdomains
        const create = async () => {
            try {
                const created = await pb.collection("subdomains").create({ projectId, port, name: subdomain })
                console.log("create subdomain>>>", created);
            } catch (e) {
                console.log("ERROR CREATING SUBDOMAIN", e)
            }
        };

        // Generate a random port number
        const port = generateRandomNumber()
        // Check if the ports exists in DB
        const exists = async () => {
            try {
                const portExists = await pb.collection('subdomains').getFirstListItem(`port = ${port}`);
                console.log(portExists)
            } catch (e) {
                // if exists, generate again
                // else create a new entry in subdomains
                console.log("DOMAIN DOES NOT EXIST", e)
                create()
            }
        }
        exists()
    }


    return (
        <div><div className="card w-96 bg-base-100 shadow-xl relative">
            <span onClick={handleDelete} className='absolute top-0 right-0 btn btn-xs btn-error'>delete</span>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{props.project.title}</h2>
                <p>{props.project.description}</p>
                <p>link - {props.project.link}</p>
                <p>subdomain - {props.project.subdomain}</p>
                <div className="card-actions">
                    <button onClick={cloneRepo} className="btn btn-primary btn-xs">
                        CLONE
                    </button>
                    <button onClick={installDependencies} className="btn btn-primary btn-xs">
                        INSTALL
                    </button>
                    <button onClick={buildDependencies} className="btn btn-primary btn-xs">
                        BUILD
                    </button>
                    <button onClick={startProject} className="btn btn-accent btn-xs">
                        START
                    </button>
                    <button onClick={subd} className="btn btn-accent btn-xs">
                        SUBDOMAIN
                    </button>
                </div>
            </div>
        </div></div>
    )
}

export default Card