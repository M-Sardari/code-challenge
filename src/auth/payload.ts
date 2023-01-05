import {RoleEnum} from "./role/role.enum";

export class Payload {
    id: number;
    username: string;
    permissions: RoleEnum
}
