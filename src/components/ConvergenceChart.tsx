// ConvergenceChart.tsx
import React, { useContext } from 'react';
import { NetworkContext } from '../context/NetworkContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const ConvergenceChart: React.FC = () => {
  const { convergenceData } = useContext(NetworkContext);

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <Typography variant="h6" gutterBottom align="center">
        Gráfico de Convergência
      </Typography>
      <LineChart width={600} height={300} data={convergenceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="iteration" 
          label={{ value: 'Iteração', position: 'insideBottomRight', offset: 0 }}
        />
        <YAxis 
          label={{ value: 'Erro Total', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="error" stroke="#ff9900" activeDot={{ r: 8 }} />
      </LineChart>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        O gráfico mostra a evolução do erro total do sistema em cada iteração, ilustrando a convergência do método de Gauss-Seidel.
      </Typography>
    </Box>
  );
};

export default ConvergenceChart;
