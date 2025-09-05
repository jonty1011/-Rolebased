    export interface User{
        userId?:string;
        userName?:string;
        email?:string;
        roles?:string[];
    }


    declare global {
        namespace Express{
            interface Request{
                currUser:User
            }
        }
    }