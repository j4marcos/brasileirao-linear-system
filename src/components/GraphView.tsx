// GraphView.tsx
import React, { useContext } from 'react';
import { NetworkContext } from '../context/NetworkContext';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'react-flow-renderer';
import { Box } from '@mui/material';

const GraphView: React.FC = () => {
  const { nodes, connections } = useContext(NetworkContext);

  // Mapeia os nós para o formato esperado pelo React Flow, usando a posição armazenada
  const flowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    data: {
      label: `${node.name} (${node.type})\nDemanda: ${node.demand}\nBalanço: ${node.currentBalance.toFixed(2)}`,
    },
    position: { x: node.position.x, y: node.position.y },
  }));

  const flowEdges = connections.map((conn, idx) => ({
    id: `edge-${idx}`,
    source: conn.from,
    target: conn.to,
    label: `Fluxo: ${conn.currentFlow.toFixed(2)}`,
    animated: true,
    style: { strokeWidth: Math.max(1, conn.currentFlow / 5) },
  }));

  return (
    <Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: '8px', mb: 2 }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges}>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default GraphView;
