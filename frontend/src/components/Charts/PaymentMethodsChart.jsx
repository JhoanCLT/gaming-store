import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PaymentMethodsChart = ({ data }) => {
  const chartData = data?.paymentMethods || [];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  const renderLabel = ({ name, percent }) => {
    return `${name} (${(percent * 100).toFixed(1)}%)`;
  };

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Métodos de Pago</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="method"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, 'Ventas']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;