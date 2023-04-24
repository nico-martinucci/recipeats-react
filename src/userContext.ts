import { createContext } from "react";
import { IUser } from "./App";

const userContext = createContext<IUser | undefined>(undefined);

export default userContext;