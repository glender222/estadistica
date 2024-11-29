import { Persona } from "./persona";
import { Privilegios } from "./privilegios";
import { Rol } from "./rol";

export class Estado {
    idestado: number;
    nombre: string;
    privilegios: Privilegios [];
    roles: Rol[];
    personas: Persona[];

    constructor(
        idestado: number = 0,
        nombre: string = '',
        privilegios: Privilegios[] = [],
        roles: Rol[] = [],
        personas: Persona[] = []
    ) {
        this.idestado = idestado;
        this.nombre = nombre;
        this.privilegios = privilegios;
        this.roles = roles;
        this.personas = personas;
    }
}
