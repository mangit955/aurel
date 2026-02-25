// apps/web/store/workflowStore.ts
import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  initializeWorkflow: (nodes: Node[], edges: Edge[]) => void;
  activeSettingsNodeId: string | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  setActiveSettingsNode: (id: string | null) => void;
  updateNodeData: (id: string, data: any) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  activeSettingsNodeId: null,
  initializeWorkflow: (nodes, edges) =>
    set({ nodes, edges, selectedNodeId: null, activeSettingsNodeId: null }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) =>
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      const hasSelectionChange = changes.some(
        (change) => change.type === "select",
      );
      const selectedNodeId = hasSelectionChange
        ? (nextNodes.find((node) => node.selected)?.id ?? null)
        : state.selectedNodeId &&
            nextNodes.some((node) => node.id === state.selectedNodeId)
          ? state.selectedNodeId
          : null;
      return { nodes: nextNodes, selectedNodeId };
    }),
  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),
  selectNode: (id) => set({ selectedNodeId: id }),
  setActiveSettingsNode: (id) => set({ activeSettingsNodeId: id }),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    })),
}));
