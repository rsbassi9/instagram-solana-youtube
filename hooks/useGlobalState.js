import { useContext } from "react";

import { GlobalContext } from "../state/global";

// Turn our context into a hook that can be used in the app
export const useGlobalState = () => {
  return useContext(GlobalContext);
};
