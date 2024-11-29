import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { EstadisticasUsuario } from "../models/usuario-estadisticas";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "../../models/usuario";

@Injectable({
  providedIn: 'root'
})
export class UsuariossService {
  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  updateUsuario(usuario: Usuario, id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  getEstadisticas(): Observable<EstadisticasUsuario[]> {
    return this.getUsuarios().pipe(
      map(usuarios => {
        const personaCount = new Map<string, number>();
        usuarios.forEach(usuario => {
          const personaNombre = usuario.persona?.nombre || 'Sin Persona';
          personaCount.set(personaNombre, (personaCount.get(personaNombre) || 0) + 1);
        });

        return Array.from(personaCount.entries()).map(([nombrePersona, cantidad], index) => {
          const fecha = new Date(2024, 0, index + 1).toISOString().split('T')[0];
          return {
            nombrePersona,
            cantidad,
            time: fecha
          };
        });
      })
    );
  }
}
