"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncidentCard } from "@/components/incident-card";
import { Incident } from "@/types/incident";
import { AlertCircle, Database, Loader2 } from "lucide-react";

const EXAMPLE_WEBHOOK_URL = "https://n8n.example.com/webhook/incidents";

const EXAMPLE_DATA: Incident[] = [
  {
    id: 1,
    area: "Producción",
    tipo_problema: "Paro máquina",
    tiempo_paro_min: 45,
    descripcion: "Paro en línea 1 por falla en banda transportadora",
    criticidad: "Alta",
    categoria_causa: "Máquina",
    accion_rapida:
      "Acción rápida: Revisar y reemplazar banda o rodillos dañados; reanudar línea tras prueba funcional.",
  },
  {
    id: 3,
    area: "Logística",
    tipo_problema: "Falta de material",
    tiempo_paro_min: 60,
    descripcion: "Orden detenida por falta de tarimas en área de embarque",
    criticidad: "Alta",
    categoria_causa: "Materiales",
    accion_rapida:
      "Traer tarimas del almacén alterno y asignar responsable para reposición inmediata.",
  },
];

export default function Home() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criticalityFilter, setCriticalityFilter] = useState<string>("Todos");
  const [areaFilter, setAreaFilter] = useState<string>("Todas");

  const handleFetchIncidents = async (url: string) => {
    if (!url.trim()) {
      setError("Por favor, ingresa una URL de webhook válida");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error al obtener datos: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Handle both single object and array responses
      const incidentsData = Array.isArray(data) ? data : [data];

      setIncidents(incidentsData);
      setCriticalityFilter("Todos");
      setAreaFilter("Todas");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al obtener las incidencias"
      );
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = () => {
    setWebhookUrl(EXAMPLE_WEBHOOK_URL);
    setIncidents(EXAMPLE_DATA);
    setCriticalityFilter("Todos");
    setAreaFilter("Todas");
    setError(null);
  };

  // Get unique areas from incidents
  const uniqueAreas = useMemo(() => {
    const areas = new Set(incidents.map((inc) => inc.area));
    return Array.from(areas).sort();
  }, [incidents]);

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    let filtered = [...incidents];

    // Filter by criticality
    if (criticalityFilter !== "Todos") {
      filtered = filtered.filter((inc) => inc.criticidad === criticalityFilter);
    }

    // Filter by area
    if (areaFilter !== "Todas") {
      filtered = filtered.filter((inc) => inc.area === areaFilter);
    }

    // Sort by tiempo_paro_min descending
    filtered.sort((a, b) => b.tiempo_paro_min - a.tiempo_paro_min);

    return filtered;
  }, [incidents, criticalityFilter, areaFilter]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pb-24 pt-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            Workshop Industrial
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Incidencias Críticas
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Monitorización inteligente de planta conectada a n8n. Visualiza y
            gestiona alertas de producción en tiempo real.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Webhook URL Input */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Webhook URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                placeholder="https://tu-n8n-instance.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 h-11"
                disabled={isLoading}
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => handleFetchIncidents(webhookUrl)}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Consultar Incidencias
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleUseExample}
                  disabled={isLoading}
                  className="h-11 px-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Probar Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 animate-in fade-in slide-in-from-top-2"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">{error}</p>
              {webhookUrl.toLowerCase().includes("test") && (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900/50">
                  <p className="font-semibold text-sm">
                    ¿Usando URL de prueba?
                  </p>
                  <p className="text-sm opacity-90">
                    Asegúrate de presionar{" "}
                    <strong>"Execute workflow from Webhook"</strong> en n8n antes de
                    consultar.
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        {incidents.length > 0 && !isLoading && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="w-full sm:w-48">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Criticidad
                </label>
                <Select
                  value={criticalityFilter}
                  onValueChange={setCriticalityFilter}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800">
                    <SelectValue placeholder="Seleccionar criticidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Área
                </label>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="bg-white dark:bg-slate-800">
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 pb-2">
              {filteredIncidents.length} incidencias encontradas
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="relative inline-flex">
              <div className="w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping absolute inset-0"></div>
              <div className="w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-pulse absolute inset-0 delay-75"></div>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
            </div>
            <p className="text-slate-500 mt-4 font-medium">Analizando datos...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && incidents.length > 0 && (
          <>
            {filteredIncidents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards">
                {filteredIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500">
                  No se encontraron incidencias con los filtros seleccionados
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && incidents.length === 0 && !error && webhookUrl && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
              Sin datos
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">
              No se encontraron incidencias críticas para esta URL. Verifica que
              el webhook esté activo.
            </p>
            {webhookUrl.toLowerCase().includes("test") && (
              <div className="mt-4 mx-auto max-w-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">💡 Sugerencia</p>
                <p>
                  Si estás usando el modo de prueba, revisa si presionaste{" "}
                  <strong>"Test Webhook"</strong> en n8n.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
