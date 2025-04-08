// performGaussSeidelIteration.ts
import { INode, IConnection } from "../context/NetworkContext";

export interface GaussSeidelResult {
  updatedConnections: IConnection[];
  updatedNodes: INode[];
  iteration: number;
  totalError: number;
  explanation: string;
}

export const performGaussSeidelIteration = (
  nodes: INode[],
  connections: IConnection[],
  currentIteration: number
): GaussSeidelResult => {
  // Para este exemplo simplificado, apenas incrementamos a iteração e simulamos uma redução no fluxo.
  const newIteration = currentIteration + 1;

  const updatedConnections: IConnection[] = connections.map((conn) => ({
    ...conn,
    currentFlow: conn.currentFlow * 0.95, // Simulação: reduzir fluxo levemente
  }));

  // Atualiza apenas o balanço; NÃO altera a posição armazenada
  const updatedNodes: INode[] = nodes.map((node) => ({
    ...node,
    currentBalance: Math.random() * 2 - 1, // Simulação: valores aleatórios para ilustração
  }));

  const totalError: number = updatedNodes.reduce(
    (acc, node) => acc + Math.abs(node.currentBalance),
    0
  );

  const explanation: string = `Iteração ${newIteration}: Ajustado fluxo nas conexões; erro total estimado: ${totalError.toFixed(
    4
  )}.`;

  return {
    updatedConnections,
    updatedNodes,
    iteration: newIteration,
    totalError,
    explanation,
  };
};
