import { Persona } from "./persona";
import { UsuarioRol } from "./usuario-rol";

export class Usuario {
    idusuario: number;
    nombre: string;
    contrasena: string;
    persona: Persona;
    usuarioRoles: UsuarioRol[];

    constructor(idusuario: number = 0, nombre: string = '', contrasena: string = '', persona: Persona = new Persona(), usuarioRoles: UsuarioRol[] = []) {
        this.idusuario = idusuario;
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.persona = persona;
        this.usuarioRoles = usuarioRoles;
    }
}
