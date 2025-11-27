import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#66CC99"];

// Función para detectar si todas las estadísticas son 0
const isAllZero = (stats) => {
  return Object.values(stats).every((value) => value === 0);
};

function ConsultasDashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      const res = await fetch("http://localhost:8001/consultas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Error consultando estadísticas");
      }

      const json = await res.json();
      console.log("CONSULTAS RESPONSE:", json);
      setData(json);

    } catch (error) {
      toast.error("Error al obtener las consultas", {
        position: "bottom-right",
      });
    }
  };

  if (!data) return <p className="p-6 text-xl">Cargando estadísticas...</p>;

  const {
    get_project_status_stats,
    get_stages_status_stats,
    get_users_stats,
  } = data;

  const pieData = (stats) =>
    Object.entries(stats).map(([estado, porcentaje]) => ({
      name: estado,
      value: porcentaje,
    }));

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        📊 Dashboard de Reportes
      </h1>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* GRÁFICO DE PROYECTOS */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Proyectos por estado (%)
          </h2>

          {isAllZero(get_project_status_stats) ? (
            <p className="text-gray-500 text-lg">No hay proyectos cargados</p>
          ) : (
            <PieChart width={350} height={300}>
              <Pie
                dataKey="value"
                data={pieData(get_project_status_stats)}
                cx={170}
                cy={140}
                outerRadius={100}
                label
              >
                {pieData(get_project_status_stats).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          )}
        </div>

        {/* GRÁFICO DE ETAPAS */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Etapas por estado (%)
          </h2>

          {isAllZero(get_stages_status_stats) ? (
            <p className="text-gray-500 text-lg">No hay etapas cargadas</p>
          ) : (
            <PieChart width={350} height={300}>
              <Pie
                dataKey="value"
                data={pieData(get_stages_status_stats)}
                cx={170}
                cy={140}
                outerRadius={100}
                label
              >
                {pieData(get_stages_status_stats).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          )}
        </div>
      </div>

      {/* LISTAS DE USUARIOS */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Usuarios con proyectos
          </h2>
          <ul className="list-disc pl-6 text-lg">
            {get_users_stats.users_with_projects.length === 0 && (
              <p>No hay usuarios con proyectos</p>
            )}
            {get_users_stats.users_with_projects.map((u) => (
              <li key={u} className="mb-2">{u}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-700">
            Usuarios sin proyectos
          </h2>
          <ul className="list-disc pl-6 text-lg">
            {get_users_stats.users_without_projects.length === 0 && (
              <p>Todos los usuarios crearon proyectos</p>
            )}
            {get_users_stats.users_without_projects.map((u) => (
              <li key={u} className="mb-2">{u}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default ConsultasDashboard;
