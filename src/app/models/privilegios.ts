import { Estado } from "./estado";
import { Rol } from "./rol";

export class Privilegios {
    idprivilegios: number;
    tipos: string;
    estado: Estado;
    roles: Rol[];

    constructor(idprivilegios: number = 0, tipos: string = '', estado: Estado = new Estado(), roles: Rol[] = []) {
        this.idprivilegios = idprivilegios;
        this.tipos = tipos;
        this.estado = estado;
        this.roles = roles;
    }
}
