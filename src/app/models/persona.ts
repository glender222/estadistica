import { Estado } from "./estado";
import { Usuario } from "./usuario";

export class Persona {
    idpersona?: number;
    id: number;
    nombre: string;
    apepat: string;
    apemat: string;
    correo: string;
    telefono: string;
    dni: string;
    estado: Estado;
    usuarios: Usuario[];

    constructor(id: number=0, nombre: string ='', apepat: string='', apemat: string = '', correo: string='', 
        telefono: string='', dni: string='', estado: Estado = new Estado(), usuarios: Usuario[] = []){
        this.id = id;
        this.nombre = nombre;
        this.apepat = apepat;
        this.apemat = apemat;
        this.correo = correo;
        this.telefono = telefono;
        this.dni = dni;
        this.estado = estado;
        this.usuarios = usuarios;
    }
}
