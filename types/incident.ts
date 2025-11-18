export type Incident = {
  id: number;
  fecha?: string;
  area: string;
  tipo_problema: string;
  criticidad: "Alta" | "Media" | "Baja";
  tiempo_paro_min: number;
  descripcion: string;
  categoria_causa?: string;
  accion_rapida?: string;
};
