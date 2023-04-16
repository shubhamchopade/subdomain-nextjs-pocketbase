import React, { useEffect, useState } from "react";
import { getRepos } from "../utils/build-helpers";
import PocketBase from "pocketbase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useStore } from "../../store/store";

const LinkCard = (props) => {
  const [repos, setRepos] = useState([]);
  const router = useRouter();
  const { name, link, size, stars, forks } = props;
  const setLoading = useStore((state) => state.setLoading);

  const handleCreateProject = (name, link) => {
    const auth = localStorage.getItem("pocketbase_auth");
    const json = JSON.parse(auth);
    const userId = json?.model?.id;
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const createProject = async () => {
      const cleanedSubdomainName = name.toLowerCase();
      if (userId)
        try {
          setLoading(true, 20);
          // Create project
          const projectCreated = await pb.collection("projects").create({
            subdomain: cleanedSubdomainName,
            title: name,
            description: name,
            link,
            userId,
          });
          setLoading(true, 60);
          if (projectCreated.id) {
            // Create project status
            const projectStatus = await pb.collection("projectStatus").create(
              {
                projectId: projectCreated.id,
                cloned: false,
                installed: false,
                built: false,
                isOnline: false,
                stopped: false,
                current: "init",
              },
              {
                projectId: projectCreated.id,
              }
            );
            setLoading(true, 70);

            // Create project metrics
            const projectMetrics = await pb.collection("deployMetrics").create(
              {
                projectId: projectCreated.id,
                timeInstall: 0,
                timeBuild: 0,
              },
              {
                projectId: projectCreated.id,
              }
            );

            // Update project with status and metric id
            await pb.collection("projects").update(projectCreated.id, {
              metricId: projectMetrics.id,
              statusId: projectStatus.id,
            });
            setLoading(true, 80);

            // Clone repo
            const cloneRes = await fetch(
              `/api/clone?link=${link}&id=${userId}&projectId=${projectCreated.id}&statusId=${projectStatus.id}`
            );
            setLoading(true, 99);

            if (cloneRes.status == 200) {
              router.push(
                `/projects/create/secrets?projectId=${projectCreated.id}&statusId=${projectStatus.id}&name=${cleanedSubdomainName}&id=${userId}&metricId=${projectMetrics.id}`
              );
              setLoading(false, 99);
            }

            console.log(cloneRes);
            if (cloneRes.status == 400) {
              toast.error("Unsupported framework");
              setLoading(false, 99);
            }
          }
        } catch (error) {
          toast.error(
            "Failed to create project, a project with the same name already exists"
          );
          console.log(error);
          setLoading(false, 99);
        }
    };

    createProject();
  };

  const sizeMb = (size / 1024) * 2;
  const sizeGreaterThan50 = sizeMb > 50;

  return (
    <div
      className={`card bg-base-300 shadow-md py-2 ${
        sizeMb > 50 ? "cursor-not-allowed" : "hover:ring-2"
      } `}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md ml-4">{name}</p>
          <div className="flex items-center ml-4 mt-2">
            <div className="flex justify-center items-center text-xs">
              <StarIcon /> <span>{stars}</span>
            </div>

            <div className="flex justify-center items-center text-xs ml-2">
              <ForkIcon /> <span>{forks}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mr-2">
          <button
            onClick={() => handleCreateProject(name, link)}
            disabled={sizeMb > 50}
            className={`btn btn-xs mt-2 mr-2`}
          >
            import
          </button>
          <span className="text-xs">{sizeMb.toFixed(2)} MB</span>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;

const StarIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-base-content"
      d="M7.49995 10.7938L10.0937 12.3625C10.5687 12.65 11.15 12.225 11.025 11.6875L10.3375 8.73751L12.6312 6.75001C13.05 6.38751 12.825 5.70001 12.275 5.65626L9.2562 5.40001L8.07495 2.61251C7.86245 2.10626 7.13745 2.10626 6.92495 2.61251L5.7437 5.39376L2.72495 5.65001C2.17495 5.69376 1.94995 6.38126 2.3687 6.74376L4.66245 8.73126L3.97495 11.6813C3.84995 12.2188 4.4312 12.6438 4.9062 12.3563L7.49995 10.7938Z"
    />
  </svg>
);

const ForkIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-base-content"
      d="M13.75 3.12498C13.7514 2.78091 13.6581 2.44308 13.4804 2.14849C13.3026 1.85389 13.0472 1.61389 12.7421 1.45477C12.4371 1.29565 12.0941 1.22354 11.7508 1.24635C11.4074 1.26915 11.077 1.38598 10.7957 1.58405C10.5143 1.78212 10.2929 2.05379 10.1556 2.36931C10.0184 2.68482 9.97062 3.03202 10.0175 3.37289C10.0644 3.71375 10.2043 4.03513 10.4216 4.30184C10.639 4.56854 10.9256 4.77029 11.25 4.88499V6.87499H3.75V4.88499C4.16701 4.73755 4.51848 4.44744 4.74227 4.06594C4.96607 3.68443 5.0478 3.23609 4.973 2.80015C4.89821 2.36422 4.67171 1.96876 4.33354 1.68367C3.99537 1.39858 3.56731 1.24222 3.125 1.24222C2.6827 1.24222 2.25463 1.39858 1.91647 1.68367C1.5783 1.96876 1.3518 2.36422 1.27701 2.80015C1.20221 3.23609 1.28394 3.68443 1.50773 4.06594C1.73153 4.44744 2.083 4.73755 2.5 4.88499V6.87499C2.5 7.20651 2.6317 7.52445 2.86612 7.75887C3.10054 7.99329 3.41848 8.12499 3.75 8.12499H6.875V10.74C6.458 10.8874 6.10653 11.1775 5.88273 11.559C5.65894 11.9405 5.57721 12.3889 5.65201 12.8248C5.7268 13.2608 5.9533 13.6562 6.29147 13.9413C6.62963 14.2264 7.0577 14.3828 7.5 14.3828C7.94231 14.3828 8.37037 14.2264 8.70854 13.9413C9.04671 13.6562 9.27321 13.2608 9.348 12.8248C9.4228 12.3889 9.34107 11.9405 9.11727 11.559C8.89348 11.1775 8.54201 10.8874 8.125 10.74V8.12499H11.25C11.5815 8.12499 11.8995 7.99329 12.1339 7.75887C12.3683 7.52445 12.5 7.20651 12.5 6.87499V4.88499C12.8648 4.75689 13.1809 4.51885 13.4047 4.20365C13.6286 3.88845 13.7492 3.51159 13.75 3.12498Z"
    />
  </svg>
);
