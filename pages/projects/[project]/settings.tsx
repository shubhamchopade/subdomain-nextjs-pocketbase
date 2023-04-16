import React from "react";
import Subdomain from "../../../components/projects/Subdomain";
import SecretsCard from "../../../components/projects/SecretsCard";
import Link from "next/link";
import { GetServerSideProps } from "next";
import PocketBase from "pocketbase";
import { useStore } from "../../../store/store";
import { useRouter } from "next/router";

const Settings = (props) => {
  const projectId = props.projectId;
  const data = JSON.parse(props.data);
  const router = useRouter();
  const [loading, setLoading] = useStore((state) => [
    state.loading,
    state.setLoading,
  ]);

  const {
    subdomain,
    link,
    port,
    id,
    framework,
    trackingId,
    title: name,
    statusId,
    metricId,
  } = data;

  // Delete project
  const handleDelete = async () => {
    setLoading(true, 70);
    const dangerouslyDeleteProject = async () => {
      const res = await fetch(
        `/api/delete?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}&framework=${framework}&statusId=${statusId}&trackingId=${trackingId}`
      );
      const data = await res.json();
      if (data) {
        setLoading(false, 100);
        router.push("/projects");
      }
    };
    const stoppedProject = await dangerouslyDeleteProject();
    console.log("stoppedProject", stoppedProject);
  };
  return (
    <main className="container mx-auto">
      <div className="breadcrumbs">
        <ul>
          <li>
            <Link href={"/projects"}>projects</Link>
          </li>
          <li>
            <Link href={`/projects/${projectId}`}>{name}</Link>
          </li>
          <li>settings</li>
        </ul>
      </div>
      <div className="max-w-xl mx-auto">
        <Subdomain {...data} />
        <SecretsCard {...data} />
        <button
          onClick={handleDelete}
          className="btn btn-outline btn-error w-full"
        >
          Delete this project
        </button>
      </div>
    </main>
  );
};

export default Settings;

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const projectId = context.params?.project;

  try {
    // Get project data
    const records = await pb.collection("projects").getOne(projectId, {
      expand: "statusId,metricId",
    });
    const data = JSON.stringify(records);
    return {
      props: {
        data,
        projectId,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: null,
    };
  }
};
