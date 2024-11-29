import { Usuario } from "./usuario";
import { Rol } from "./rol";

export class UsuarioRol {
    id: number;
    usuario: Usuario;
    rol: Rol;

    constructor(id: number = 0, usuario: Usuario = new Usuario(), rol: Rol = new Rol()) {
        this.id = id;
        this.usuario = usuario;
        this.rol = rol;
    }
}
