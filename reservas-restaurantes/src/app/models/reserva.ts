export interface Reserva {
  id: string;

  fecha: string; 
  hora: string;    
  
  cantidadPersonas: number;

  restauranteId: string;
  zonaId: string;
  mesaId: string;

  nombreCliente: string;
  apellidoCliente: string;
  telefono: string;
}
