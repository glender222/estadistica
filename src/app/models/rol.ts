import { Estado } from "./estado";
import { UsuarioRol } from "./usuario-rol";
import { Privilegios } from "./privilegios";

export class Rol {
    idrol: number;
    nombre: string;
    estado: Estado;
    usuarioRoles: UsuarioRol[];
    privilegios: Privilegios[];

    constructor(idrol: number = 0, nombre: string = '', estado: Estado = new Estado(), usuarioRoles: UsuarioRol[] = [], privilegios: Privilegios[] = []) {
        this.idrol = idrol;
        this.nombre = nombre;
        this.estado = estado;
        this.usuarioRoles = usuarioRoles;
        this.privilegios = privilegios;
    }
}
