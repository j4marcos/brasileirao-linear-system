// NetworkEditor.tsx
import React, { useContext, useState } from "react";
import {
  NetworkContext,
  INetworkContext,
  INode,
} from "../context/NetworkContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface NodeData {
  name: string;
  type: string;
  demand: number;
  capacity: number;
}

interface ConnectionData {
  from: string;
  to: string;
  capacity: number;
  initialFlow: number;
}

const NetworkEditor: React.FC = () => {
  // Obtenha o contexto já tipado
  const context = useContext(NetworkContext) as INetworkContext;
  const { addNode, addConnection, nodes } = context;

  const [nodeData, setNodeData] = useState<NodeData>({
    name: "",
    type: "",
    demand: 0,
    capacity: 0,
  });
  const [connectionData, setConnectionData] = useState<ConnectionData>({
    from: "",
    to: "",
    capacity: 0,
    initialFlow: 0,
  });

  const handleAddNode = () => {
    // Verifica se os inputs são válidos antes de chamar addNode
    if (!nodeData.name.trim() || !nodeData.type.trim()) {
      alert("Nome e Tipo são obrigatórios.");
      return;
    }
    if (nodeData.demand < 0 || nodeData.capacity < 0) {
      alert("Demanda e capacidade devem ser não-negativos.");
      return;
    }
    addNode({ ...nodeData, id: crypto.randomUUID() });
    setNodeData({ name: "", type: "", demand: 0, capacity: 0 });
  };

  const handleAddConnection = () => {
    if (!connectionData.from || !connectionData.to) {
      alert("Selecione nós válidos para 'De' e 'Para'.");
      return;
    }
    if (connectionData.from === connectionData.to) {
      alert("A conexão não pode ser entre o mesmo nó.");
      return;
    }
    if (connectionData.capacity <= 0) {
      alert("A capacidade deve ser um número positivo.");
      return;
    }
    addConnection({ ...connectionData, id: crypto.randomUUID() });
    setConnectionData({ from: "", to: "", capacity: 0, initialFlow: 0 });
  };

  const handleSelectFrom = (e: SelectChangeEvent<string>) => {
    setConnectionData({ ...connectionData, from: e.target.value });
  };

  const handleSelectTo = (e: SelectChangeEvent<string>) => {
    setConnectionData({ ...connectionData, to: e.target.value });
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px", mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Adicionar Nó
      </Typography>
      <TextField
        size="small"
        label="Nome"
        value={nodeData.name}
        onChange={(e) => setNodeData({ ...nodeData, name: e.target.value })}
        sx={{ mr: 2, mb: 2 }}
      />
      <FormControl sx={{ mr: 2, mb: 2, minWidth: 200 }}>
        <InputLabel id="node-type-label">Tipo</InputLabel>
        <Select
          size="small"
          labelId="node-type-label"
          value={nodeData.type}
          onChange={(e) =>
            setNodeData({ ...nodeData, type: e.target.value })
          }
          label="Tipo"
        >
          <MenuItem value="Fábrica">Fábrica</MenuItem>
          <MenuItem value="Centro">Centro</MenuItem>
          <MenuItem value="Loja">Loja</MenuItem>
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Demanda (se aplicável)"
        type="number"
        value={nodeData.demand}
        onChange={(e) =>
          setNodeData({ ...nodeData, demand: parseFloat(e.target.value) || 0 })
        }
        sx={{ mr: 2, mb: 2 }}
      />
      <TextField
        size="small"
        label="Capacidade de Envio (se aplicável)"
        type="number"
        value={nodeData.capacity}
        onChange={(e) =>
          setNodeData({
            ...nodeData,
            capacity: parseFloat(e.target.value) || 0,
          })
        }
        sx={{ mr: 2, mb: 2 }}
      />
      <Button
        size="small"
        variant="contained"
        onClick={handleAddNode}
        sx={{ mb: 3 }}
      >
        Adicionar Nó
      </Button>

      <Typography variant="h6" gutterBottom>
        Adicionar Conexão
      </Typography>
      <FormControl sx={{ mr: 2, mb: 2, minWidth: 120 }}>
        <InputLabel id="select-from-label">De</InputLabel>
        <Select
          size="small"
          labelId="select-from-label"
          value={connectionData.from}
          label="De"
          onChange={handleSelectFrom}
        >
          {nodes.map((node: INode) => (
            <MenuItem key={node.id} value={node.id}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ mr: 2, mb: 2, minWidth: 120 }}>
        <InputLabel id="select-to-label">Para</InputLabel>
        <Select
          size="small"
          labelId="select-to-label"
          value={connectionData.to}
          label="Para"
          onChange={handleSelectTo}
        >
          {nodes.map((node: INode) => (
            <MenuItem key={node.id} value={node.id}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Capacidade"
        type="number"
        value={connectionData.capacity}
        onChange={(e) =>
          setConnectionData({
            ...connectionData,
            capacity: parseFloat(e.target.value) || 0,
          })
        }
        sx={{ mr: 2, mb: 2 }}
      />
      <TextField
        size="small"
        label="Fluxo Inicial"
        type="number"
        value={connectionData.initialFlow}
        onChange={(e) =>
          setConnectionData({
            ...connectionData,
            initialFlow: parseFloat(e.target.value) || 0,
          })
        }
        sx={{ mr: 2, mb: 2 }}
      />
      <Button variant="contained" onClick={handleAddConnection}>
        Adicionar Conexão
      </Button>
    </Box>
  );
};

export default NetworkEditor;
