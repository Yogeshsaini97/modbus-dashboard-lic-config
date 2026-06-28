import { createContext, useContext } from "react";

const MachineContext = createContext(null);

export function useMachine() {

    return useContext(MachineContext);

}

export default MachineContext;