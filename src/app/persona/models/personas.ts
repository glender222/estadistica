export interface Personas {
  id?: number;
  nombre: string;
  apePat?: string;
  apeMat?: string;
  estado?: {
    id: number;
    nombre: string;
  };
}

export interface EstadisticasPersonas {
  estado: string;
  cantidad: number;
  time?: string; // Add this line
}
