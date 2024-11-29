import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolPrivilegios } from '../models/rol-privilegios'; // Asegúrate de que este modelo exista

@Injectable({
  providedIn: 'root'
})
export class RolPrivilegiosService {
  private apiUrl = 'http://localhost:8080/api/rol-privilegios'; // Cambia la URL según sea necesario

  constructor(private http: HttpClient) { }

  getRolPrivilegios(): Observable<RolPrivilegios[]> {
    return this.http.get<RolPrivilegios[]>(this.apiUrl);
  }

  getRolPrivilegioById(id: number): Observable<RolPrivilegios> {
    return this.http.get<RolPrivilegios>(`${this.apiUrl}/${id}`);
  }

  updateRolPrivilegio(rolPrivilegio: RolPrivilegios, id: number): Observable<RolPrivilegios> {
    return this.http.put<RolPrivilegios>(`${this.apiUrl}/${id}`, rolPrivilegio);
  }

  deleteRolPrivilegio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createRolPrivilegio(rolPrivilegio: RolPrivilegios): Observable<RolPrivilegios> {
    return this.http.post<RolPrivilegios>(this.apiUrl, rolPrivilegio);
  }
}
