import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRol } from '../models/usuario-rol'; // Asegúrate de que este modelo exista

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {
  private apiUrl = 'http://localhost:8080/api/usuariorol'; // Cambia la URL según sea necesario

  constructor(private http: HttpClient) { }

  getUsuarioRoles(): Observable<UsuarioRol[]> {
    return this.http.get<UsuarioRol[]>(this.apiUrl);
  }

  getUsuarioRolById(id: number): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${this.apiUrl}/${id}`);
  }

  updateUsuarioRol(usuarioRol: UsuarioRol, id: number): Observable<UsuarioRol> {
    return this.http.put<UsuarioRol>(`${this.apiUrl}/${id}`, usuarioRol);
  }

  deleteUsuarioRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(this.apiUrl, usuarioRol);
  }
}
