import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductsChart = ({ data }) => {
  const chartData = data?.productsByCategory || [];

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Productos por Categoría</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Cantidad']} />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="#8b5cf6" 
              name="Productos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductsChart;