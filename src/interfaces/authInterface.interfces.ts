export interface User{
    userId?:string;
    userName?:string;
    email?:string;
    roleName?:string;
}


declare global {
    namespace Express{
        interface Request{
            currUser:User
        }
    }
}