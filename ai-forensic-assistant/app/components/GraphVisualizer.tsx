"use client";
import React, { useState } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 50 },
    data: { label: "Suspect: Rajesh" },
    style: {
      backgroundColor: "#ef4444",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px",
      border: "none",
    },
  },
  {
    id: "2",
    position: { x: 80, y: 180 },
    data: { label: "Phone: 9876543210" },
    style: {
      backgroundColor: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
    },
  },
  {
    id: "3",
    position: { x: 400, y: 180 },
    data: { label: "Location: Delhi Hotel" },
    style: {
      backgroundColor: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #10b981",
      borderRadius: "8px",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", label: "OWNS", animated: true },
  { id: "e1-3", source: "1", target: "3", label: "VISITED ON 14th", animated: true },
];

export default function GraphVisualizer() {
  const [nodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);

  return (
    <div className="h-full w-full bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
      <div className="p-3 bg-gray-800 text-white font-semibold rounded-t-lg border-b border-gray-700">
        Live Evidence Network (GraphRAG)
      </div>
      <div className="flex-1 w-full">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#333" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}