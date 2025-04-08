// IterationPanel.tsx
import React, { useContext, useState } from 'react';
import { NetworkContext } from '../context/NetworkContext';
import { Box, Button, Typography } from '@mui/material';

const IterationPanel: React.FC = () => {
  const { iterationData, runNextIteration, resetIterations } = useContext(NetworkContext);

  const handleNext = () => {
    runNextIteration();
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Iteração: {iterationData.currentIteration}
      </Typography>
      <Typography variant="body1">
        Erro Total: {iterationData.totalError.toFixed(4)}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {iterationData.explanation}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleNext} sx={{ mr: 2 }}>
          Avançar Iteração
        </Button>
        <Button variant="outlined" onClick={resetIterations}>
          Resetar
        </Button>
      </Box>
    </Box>
  );
};

export default IterationPanel;
