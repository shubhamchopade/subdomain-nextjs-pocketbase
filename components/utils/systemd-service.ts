import { executeCommandChild } from "../../backend/node-multithreading";


export interface Service {
    projectId: string;
    port: string;
    userId: string;
    framework: string;
}

export const createService = async (name: string, service: Service) => {
    executeCommandChild(
        //  sudo systemctl start $(systemd-escape --template techsapien@.service "projectId port userId framework")
        `systemctl`, [`start`, `$(systemd-escape`, `--template`, `${name}@.service`, `"${service.projectId} ${service.port} ${service.userId} ${service.framework}"`]
    ).then((output: any) => {
        console.log("Service created - build success - project online", output.stdout, output.stderr)
    }).catch((err) => {
        console.log("Service create failed", err);
    }
    );
}

export const stopService = async (name: string, service: Service) => {
    executeCommandChild(
        //  sudo systemctl start $(systemd-escape --template techsapien@.service "projectId port userId framework")
        `systemctl`, [`stop`, `$(systemd-escape`, `--template`, `${name}@.service`, `"${service.projectId} ${service.port} ${service.userId} ${service.framework}"`]
    ).then((output: any) => {
        console.log("service stopped ", output.stdout, output.stderr)
    });
}

export const disableService = async (name: string, service: Service) => {
    executeCommandChild(
        //  sudo systemctl start $(systemd-escape --template techsapien@.service "projectId port userId framework")
        `systemctl`, [`disable`, `$(systemd-escape`, `--template`, `${name}@.service`, `"${service.projectId} ${service.port} ${service.userId} ${service.framework}"`]
    ).then((output: any) => {
        console.log("service disabled", output.stdout, output.stderr)
    });
}