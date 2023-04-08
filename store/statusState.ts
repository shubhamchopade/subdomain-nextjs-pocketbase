import { create } from "zustand";

export const useStatusState = create((set) => ({
  status: {
    id: "14cfyx7ge91qfmt",
    status: "asdadsasd",
    cloned: false,
    installed: false,
    built: false,
    stopped: false,
    isOnline: false,
    timeElapsed: 0,
    logClone: "",
    logSubdomain: "",
    logInstall: "",
    logBuild: "",
  },
  setStatus: (status: any) => set({ status }),
}));
