import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => {
  // Transformar datos para el gráfico
  const chartData = data?.salesByDate || [];

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Tendencia de Ventas</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Ventas']}
              labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString('es-ES')}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#6366f1" 
              strokeWidth={2}
              name="Total Ventas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;