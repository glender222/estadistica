import { Rol } from "./rol";
import { Privilegios } from "./privilegios";

export class RolPrivilegios {
    id: number;
    rol: Rol;
    privilegios: Privilegios;

    constructor(id: number = 0, rol: Rol = new Rol(), privilegios: Privilegios = new Privilegios()) {
        this.id = id;
        this.rol = rol;
        this.privilegios = privilegios;
    }
}
