'use client';

import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Transaction } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TransactionFlowProps {
  transaction: Transaction;
}

interface FlowNodeData {
  label: string;
  json: Record<string, any>;
  status?: string;
  type?: string;
}

interface FlowNode extends Node {
  data: FlowNodeData;
}

// Status color mapping (extracted from getStatusColor)
const getStatusColorConfig = (status?: string, type?: string) => {
  // Map node types to colors
  if (type === 'request' || type === 'validation') {
    return {
      bg: '#fef3c7', // amber-100
      text: '#92400e', // amber-800
      border: '#fbbf24', // amber-500
      stroke: '#fbbf24',
    };
  }
  if (type === 'idempotency' || type === 'balance') {
    return {
      bg: '#dbeafe', // blue-100
      text: '#1e40af', // blue-800
      border: '#60a5fa', // blue-400
      stroke: '#60a5fa',
    };
  }
  if (type === 'database') {
    return {
      bg: '#dcfce7', // emerald-100
      text: '#065f46', // emerald-800
      border: '#4ade80', // emerald-400
      stroke: '#4ade80',
    };
  }
  if (type === 'audit') {
    return {
      bg: '#e0e7ff', // indigo-100
      text: '#3730a3', // indigo-800
      border: '#818cf8', // indigo-400
      stroke: '#818cf8',
    };
  }

  // Use status-based colors
  switch (status) {
    case 'successful':
      return {
        bg: '#d1fae5', // emerald-100
        text: '#065f46', // emerald-800
        border: '#10b981', // emerald-500
        stroke: '#10b981',
      };
    case 'pending':
    case 'processing':
      return {
        bg: '#fef3c7', // amber-100
        text: '#92400e', // amber-800
        border: '#f59e0b', // amber-500
        stroke: '#f59e0b',
      };
    case 'failed':
      return {
        bg: '#fee2e2', // red-100
        text: '#991b1b', // red-800
        border: '#ef4444', // red-500
        stroke: '#ef4444',
      };
    case 'reversed':
      return {
        bg: '#f3f4f6', // gray-100
        text: '#1f2937', // gray-800
        border: '#6b7280', // gray-500
        stroke: '#6b7280',
      };
    default:
      return {
        bg: '#f3f4f6', // gray-100
        text: '#1f2937', // gray-800
        border: '#9ca3af', // gray-400
        stroke: '#9ca3af',
      };
  }
};

// Custom Node Component
function CustomFlowNode({ data }: { data: FlowNodeData }) {
  const [isJsonView, setIsJsonView] = useState(true);
  const colorConfig = getStatusColorConfig(data.status, data.type);

  return (
    <div
      className="bg-white border-2 rounded-lg shadow-sm"
      style={{
        borderColor: colorConfig.border,
        width: '280px',
        minHeight: 'fit-content',
      }}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id={`target-${data.label}`}
        style={{ background: colorConfig.border }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`source-${data.label}`}
        style={{ background: colorConfig.border }}
      />

      {/* Header */}
      <div
        className="px-4 py-3 rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: colorConfig.bg }}
      >
        <h3
          className="font-semibold text-sm"
          style={{ color: colorConfig.text }}
        >
          {data.label}
        </h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`toggle-${data.label}`}
            checked={isJsonView}
            onCheckedChange={(checked) => setIsJsonView(checked === true)}
            className="h-4 w-4"
          />
          <Label
            htmlFor={`toggle-${data.label}`}
            className="text-xs cursor-pointer"
            style={{ color: colorConfig.text }}
          >
            {isJsonView ? 'JSON' : 'Table'}
          </Label>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {isJsonView ? (
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words text-left">
            {JSON.stringify(data.json, null, 2)}
          </pre>
        ) : (
          <div className="space-y-0">
            {Object.entries(data.json).map(([key, value], index) => (
              <div
                key={key}
                className={`flex gap-2 text-xs px-2 py-1.5 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <span className="font-semibold text-gray-600 min-w-[100px]">
                  {key}:
                </span>
                <span className="text-gray-800 break-words">
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionFlow({ transaction }: TransactionFlowProps) {
  const nodes: FlowNode[] = useMemo(() => {
    const horizontalSpacing = 350;
    const verticalSpacing = 250;

    const nodes: FlowNode[] = [];

    // Initial Request Node
    nodes.push({
      id: 'request',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: 'Initial Request',
        type: 'request',
        json: {
          type: transaction.type,
          category: transaction.transaction_category,
          amount: transaction.amount,
          currency: transaction.currency,
          metadata: transaction.metadata,
        },
      },
    });

    // Validation Node
    nodes.push({
      id: 'validation',
      type: 'custom',
      position: { x: horizontalSpacing, y: 0 },
      data: {
        label: 'Validation',
        type: 'validation',
        json: {
          amount: `Valid: ${transaction.amount > 0}`,
          currency: `Valid: ${transaction.currency}`,
          type: `Valid: ${transaction.type}`,
          category: `Valid: ${transaction.transaction_category}`,
        },
      },
    });

    // Idempotency Check Node
    nodes.push({
      id: 'idempotency',
      type: 'custom',
      position: { x: horizontalSpacing * 2, y: 0 },
      data: {
        label: 'Idempotency Check',
        type: 'idempotency',
        json: {
          idempotency_key: transaction.idempotency_key || 'Generated',
          status: 'Checked',
          duplicate: transaction.idempotency_key ? 'No' : 'N/A',
        },
      },
    });

    // Balance Check Node (for debits)
    if (transaction.type === 'debit') {
      nodes.push({
        id: 'balance',
        type: 'custom',
        position: { x: horizontalSpacing * 3, y: 0 },
        data: {
          label: 'Balance Check',
          type: 'balance',
          json: {
            type: 'Debit',
            check: 'Sufficient funds verified',
            amount: transaction.amount,
            currency: transaction.currency,
          },
        },
      });
    }

    // Database Insert Node
    const dbInsertY = transaction.type === 'debit' ? verticalSpacing : 0;
    const dbInsertX =
      transaction.type === 'debit'
        ? horizontalSpacing * 3
        : horizontalSpacing * 2;
    nodes.push({
      id: 'database',
      type: 'custom',
      position: { x: dbInsertX, y: dbInsertY },
      data: {
        label: 'Database Insert',
        type: 'database',
        json: {
          transaction_id: transaction.transaction_id,
          wallet_id: transaction.wallet_id,
          status: 'pending',
          created_at: transaction.created_at,
        },
      },
    });

    // Status Update Nodes
    const statusUpdates = [
      { status: 'processing', label: 'Status: Processing' },
      { status: transaction.status, label: `Status: ${transaction.status}` },
    ];

    statusUpdates.forEach((update, index) => {
      nodes.push({
        id: `status-${index}`,
        type: 'custom',
        position: {
          x: dbInsertX + horizontalSpacing * (index + 1),
          y: dbInsertY,
        },
        data: {
          label: update.label,
          status: update.status,
          json: {
            status: update.status,
            updated_at: transaction.updated_at,
            transaction_id: transaction.transaction_id,
          },
        },
      });
    });

    // Audit Log Node
    const auditX = dbInsertX + horizontalSpacing * (statusUpdates.length + 1);
    nodes.push({
      id: 'audit',
      type: 'custom',
      position: { x: auditX, y: dbInsertY },
      data: {
        label: 'Audit Log',
        type: 'audit',
        json: {
          action: 'CREATE',
          entity_type: 'TRANSACTION',
          entity_id: transaction.id,
          timestamp: transaction.created_at,
        },
      },
    });

    return nodes;
  }, [transaction]);

  // Helper function to get node color
  const getNodeColor = useCallback(
    (nodeId: string): string => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return '#6b7280';
      const colorConfig = getStatusColorConfig(
        node.data.status,
        node.data.type
      );
      return colorConfig.stroke;
    },
    [nodes]
  );

  const edges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    // Request -> Validation
    edges.push({
      id: 'e1',
      source: 'request',
      target: 'validation',
      sourceHandle: 'source-Initial Request',
      targetHandle: 'target-Validation',
      label: 'Request Data',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: getNodeColor('request'), strokeWidth: 2 },
    });

    // Validation -> Idempotency
    edges.push({
      id: 'e2',
      source: 'validation',
      target: 'idempotency',
      sourceHandle: 'source-Validation',
      targetHandle: 'target-Idempotency Check',
      label: 'Validated',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: getNodeColor('validation'), strokeWidth: 2 },
    });

    // Idempotency -> Balance (if debit) or Database (if credit)
    if (transaction.type === 'debit') {
      edges.push({
        id: 'e3',
        source: 'idempotency',
        target: 'balance',
        sourceHandle: 'source-Idempotency Check',
        targetHandle: 'target-Balance Check',
        label: 'Idempotent',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: getNodeColor('idempotency'), strokeWidth: 2 },
      });
      edges.push({
        id: 'e4',
        source: 'balance',
        target: 'database',
        sourceHandle: 'source-Balance Check',
        targetHandle: 'target-Database Insert',
        label: 'Funds Available',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: getNodeColor('balance'), strokeWidth: 2 },
      });
    } else {
      edges.push({
        id: 'e3',
        source: 'idempotency',
        target: 'database',
        sourceHandle: 'source-Idempotency Check',
        targetHandle: 'target-Database Insert',
        label: 'Idempotent',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: getNodeColor('idempotency'), strokeWidth: 2 },
      });
    }

    // Database -> Status Updates
    edges.push({
      id: 'e5',
      source: 'database',
      target: 'status-0',
      sourceHandle: 'source-Database Insert',
      targetHandle: 'target-Status: Processing',
      label: 'Transaction Created',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: getNodeColor('database'), strokeWidth: 2 },
    });

    edges.push({
      id: 'e6',
      source: 'status-0',
      target: 'status-1',
      sourceHandle: 'source-Status: Processing',
      targetHandle: `target-Status: ${transaction.status}`,
      label: 'Status Updated',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: getNodeColor('status-0'), strokeWidth: 2 },
    });

    // Final Status -> Audit
    edges.push({
      id: 'e7',
      source: 'status-1',
      target: 'audit',
      sourceHandle: `source-Status: ${transaction.status}`,
      targetHandle: 'target-Audit Log',
      label: 'Logged',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: getNodeColor('status-1'), strokeWidth: 2 },
    });

    return edges;
  }, [transaction, nodes, getNodeColor]);

  const nodeTypes = {
    custom: CustomFlowNode,
  };

  // Early return if no nodes or edges
  if (!nodes.length || !edges.length) {
    return (
      <div className="w-full h-[500px] border rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No flow data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] border rounded-lg">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5, minZoom: 0.5 }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          panOnDrag={[1, 2]}
          panOnScroll={true}
          nodesDraggable={false}
          nodesConnectable={false}
          // elementsSelectable={false}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
