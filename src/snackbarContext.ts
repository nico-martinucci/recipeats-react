import { createContext } from "react";
import { ISnackbarContent } from "./App";
// import { IUser } from "./App";

const snackbarContext = createContext((content: ISnackbarContent) => { });

export default snackbarContext;