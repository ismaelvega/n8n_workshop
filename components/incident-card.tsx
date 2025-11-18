import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Incident } from "@/types/incident";
import { AlertCircle, Clock, Wrench, Activity, ArrowRight } from "lucide-react";

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const getCriticalityColor = (criticidad: Incident["criticidad"]) => {
    switch (criticidad) {
      case "Alta":
        return "text-red-600 bg-red-50 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900";
      case "Media":
        return "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900";
      case "Baja":
        return "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900";
    }
  };

  const getBorderColor = (criticidad: Incident["criticidad"]) => {
    switch (criticidad) {
      case "Alta":
        return "border-l-red-500";
      case "Media":
        return "border-l-amber-500";
      case "Baja":
        return "border-l-blue-500";
      default:
        return "border-l-slate-300";
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden border-l-[6px] ${getBorderColor(
        incident.criticidad
      )} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Activity className="w-32 h-32 -mr-8 -mt-8" />
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10">
                {incident.area || "Área no especificada"}
              </span>
              {incident.fecha && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {incident.fecha}
                </span>
              )}
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 leading-tight">
              {incident.tipo_problema || "Problema sin identificar"}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={`${getCriticalityColor(
              incident.criticidad
            )} px-3 py-1 text-sm font-bold uppercase tracking-wide shadow-sm`}
          >
            {incident.criticidad || "N/A"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <AlertCircle className="w-4 h-4 text-slate-500" />
          <span>Tiempo de paro:</span>
          <span className="font-bold">{incident.tiempo_paro_min ?? 0} min</span>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {incident.descripcion || "Sin descripción disponible."}
        </p>

        <div className="grid gap-3 pt-2">
          <div className="flex gap-3 items-start">
            <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Causa Probable
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                {incident.categoria_causa || "Pendiente de análisis"}
              </p>
            </div>
          </div>

          <div className="group/action relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 p-4 transition-colors hover:border-blue-200 dark:hover:border-blue-800">
            <div className="flex gap-3">
              <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full text-blue-600 dark:text-blue-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Acción Recomendada
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {incident.accion_rapida || "Esperar instrucciones del supervisor."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
