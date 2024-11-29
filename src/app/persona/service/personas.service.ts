import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Personas, EstadisticasPersonas } from "../models/personas";

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private apiUrl = 'http://localhost:8080/api/persona';

  constructor(private http: HttpClient) {}

  getPersonas(): Observable<Personas[]> {
    return this.http.get<Personas[]>(this.apiUrl);
  }

  getEstadisticas(): Observable<EstadisticasPersonas[]> {
    return this.getPersonas().pipe(
      map(personas => {
        const estadoCount = new Map<string, number>();
        personas.forEach(persona => {
          const estado = persona.estado?.nombre || 'Sin Estado';
          estadoCount.set(estado, (estadoCount.get(estado) || 0) + 1);
        });
        
        return Array.from(estadoCount.entries()).map(([estado, cantidad]) => ({
          estado,
          cantidad
        }));
      })
    );
  }
}