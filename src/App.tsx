
import { NetworkProvider } from './context/NetworkContext';
import NetworkEditor from './components/NetworkEditor';
import GraphView from './components/GraphView';
import IterationPanel from './components/IterationPanel';
import { Container, Typography } from '@mui/material';
import MatrixPanel from './components/MatrixPanel';

function App() {
  return (
    <NetworkProvider>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Simulador Interativo de Distribuição Logística – Método Gauss-Seidel
        </Typography>
        {/* O tema pode incluir o logo da Amazon e cores características */}
        <NetworkEditor />
        <GraphView />
        <IterationPanel />
        <MatrixPanel /> 
      </Container>
    </NetworkProvider>
  );
}

export default App;
