import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Privilegios } from '../models/privilegios';

@Injectable({
  providedIn: 'root'
})
export class PrivilegiosService {
  private apiUrl = 'http://localhost:8080/api/privilegios';

  constructor(private http: HttpClient) { }

  getPrivilegios(): Observable<Privilegios[]> {
    return this.http.get<Privilegios[]>(this.apiUrl);
  }

  getPrivilegioById(id: number): Observable<Privilegios> {
    return this.http.get<Privilegios>(`${this.apiUrl}/${id}`);
  }

  updatePrivilegio(privilegio: Privilegios, id: number): Observable<Privilegios> {
    return this.http.put<Privilegios>(`${this.apiUrl}/${id}`, privilegio);
  }

  deletePrivilegio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createPrivilegio(privilegio: Privilegios): Observable<Privilegios> {
    return this.http.post<Privilegios>(this.apiUrl, privilegio);
  }
}
