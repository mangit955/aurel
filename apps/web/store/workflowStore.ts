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
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  canUndo: boolean;
  canRedo: boolean;
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
  deleteNode: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

const cloneSnapshot = (nodes: Node[], edges: Edge[]) => ({
  nodes: structuredClone(nodes),
  edges: structuredClone(edges),
});

const shouldTrackNodeChangeInHistory = (change: NodeChange) => {
  if (change.type === "select") return false;

  // During drag we get many position updates; track only the final drop update.
  if (change.type === "position" && "dragging" in change && change.dragging) {
    return false;
  }

  // If node resizing is used later, avoid per-frame history noise there as well.
  if (
    change.type === "dimensions" &&
    "resizing" in change &&
    change.resizing
  ) {
    return false;
  }

  return true;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,
  selectedNodeId: null,
  activeSettingsNodeId: null,
  initializeWorkflow: (nodes, edges) =>
    set({
      nodes,
      edges,
      selectedNodeId: null,
      activeSettingsNodeId: null,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
  setNodes: (nodes) =>
    set((state) => {
      if (nodes === state.nodes) return state;
      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        nodes,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),
  setEdges: (edges) =>
    set((state) => {
      if (edges === state.edges) return state;
      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        edges,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),
  onNodesChange: (changes) =>
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      const hasSelectionChange = changes.some(
        (change) => change.type === "select",
      );
      const hasStructuralChange = changes.some(shouldTrackNodeChangeInHistory);
      const selectedNodeId = hasSelectionChange
        ? (nextNodes.find((node) => node.selected)?.id ?? null)
        : state.selectedNodeId &&
            nextNodes.some((node) => node.id === state.selectedNodeId)
          ? state.selectedNodeId
          : null;

      if (!hasStructuralChange) {
        return { nodes: nextNodes, selectedNodeId };
      }

      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        nodes: nextNodes,
        selectedNodeId,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),
  onEdgesChange: (changes) =>
    set((state) => {
      const nextEdges = applyEdgeChanges(changes, state.edges);
      const hasStructuralChange = changes.some(
        (change) => change.type !== "select",
      );

      if (!hasStructuralChange) {
        return { edges: nextEdges };
      }

      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        edges: nextEdges,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),
  onConnect: (connection) =>
    set((state) => {
      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        edges: addEdge(connection, state.edges),
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setActiveSettingsNode: (id) => set({ activeSettingsNodeId: id }),

  updateNodeData: (id, data) =>
    set((state) => {
      const nextNodes = state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      );
      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      return {
        nodes: nextNodes,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),

  deleteNode: (id) =>
    set((state) => {
      const nextNodes = state.nodes.filter((node) => node.id !== id);
      const nextEdges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      );

      if (
        nextNodes.length === state.nodes.length &&
        nextEdges.length === state.edges.length
      ) {
        return state;
      }

      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];
      const selectedNodeId =
        state.selectedNodeId === id ? null : state.selectedNodeId;
      const activeSettingsNodeId =
        state.activeSettingsNodeId === id ? null : state.activeSettingsNodeId;

      return {
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId,
        activeSettingsNodeId,
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const past = state.past.slice(0, -1);
      const future = [
        cloneSnapshot(state.nodes, state.edges),
        ...state.future,
      ];

      return {
        nodes: previous.nodes,
        edges: previous.edges,
        past,
        future,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const future = state.future.slice(1);
      const past = [...state.past, cloneSnapshot(state.nodes, state.edges)];

      return {
        nodes: next.nodes,
        edges: next.edges,
        past,
        future,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      };
    }),
}));
