export interface EstadisticasUsuario {
  nombrePersona: string;
  cantidad: number;
  time: string;  // Aseguramos que time es requerido
}

export interface DatosGrafico {
  time: string;
  value: number;
}

export interface EstadisticasGenerales {
  totalUsuarios: number;
  usuariosPorPersona: Map<string, number>;
}
