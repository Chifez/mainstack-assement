'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Transaction } from '@/lib/types';

interface TransactionFlowProps {
  transaction: Transaction;
}

interface FlowNode extends Node {
  data: {
    label: string;
    json: Record<string, any>;
  };
}

export function TransactionFlow({ transaction }: TransactionFlowProps) {
  const nodes: FlowNode[] = useMemo(() => {
    const nodeWidth = 280;
    const nodeHeight = 200;
    const horizontalSpacing = 350;
    const verticalSpacing = 250;

    const nodes: FlowNode[] = [];

    // Initial Request Node
    nodes.push({
      id: 'request',
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: 'Initial Request',
        json: {
          type: transaction.type,
          category: transaction.transaction_category,
          amount: transaction.amount,
          currency: transaction.currency,
          metadata: transaction.metadata,
        },
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        background: '#f9fafb',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
      },
    });

    // Validation Node
    nodes.push({
      id: 'validation',
      type: 'default',
      position: { x: horizontalSpacing, y: 0 },
      data: {
        label: 'Validation',
        json: {
          amount: `Valid: ${transaction.amount > 0}`,
          currency: `Valid: ${transaction.currency}`,
          type: `Valid: ${transaction.type}`,
          category: `Valid: ${transaction.transaction_category}`,
        },
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        background: '#fef3c7',
        border: '2px solid #fbbf24',
        borderRadius: '8px',
      },
    });

    // Idempotency Check Node
    nodes.push({
      id: 'idempotency',
      type: 'default',
      position: { x: horizontalSpacing * 2, y: 0 },
      data: {
        label: 'Idempotency Check',
        json: {
          idempotency_key: transaction.idempotency_key || 'Generated',
          status: 'Checked',
          duplicate: transaction.idempotency_key ? 'No' : 'N/A',
        },
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        background: '#dbeafe',
        border: '2px solid #60a5fa',
        borderRadius: '8px',
      },
    });

    // Balance Check Node (for debits)
    if (transaction.type === 'debit') {
      nodes.push({
        id: 'balance',
        type: 'default',
        position: { x: horizontalSpacing * 3, y: 0 },
        data: {
          label: 'Balance Check',
          json: {
            type: 'Debit',
            check: 'Sufficient funds verified',
            amount: transaction.amount,
            currency: transaction.currency,
          },
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
          background: '#fce7f3',
          border: '2px solid #f472b6',
          borderRadius: '8px',
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
      type: 'default',
      position: { x: dbInsertX, y: dbInsertY },
      data: {
        label: 'Database Insert',
        json: {
          transaction_id: transaction.transaction_id,
          wallet_id: transaction.wallet_id,
          status: 'pending',
          created_at: transaction.created_at,
        },
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        background: '#dcfce7',
        border: '2px solid #4ade80',
        borderRadius: '8px',
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
        type: 'default',
        position: {
          x: dbInsertX + horizontalSpacing * (index + 1),
          y: dbInsertY,
        },
        data: {
          label: update.label,
          json: {
            status: update.status,
            updated_at: transaction.updated_at,
            transaction_id: transaction.transaction_id,
          },
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
          background:
            update.status === 'successful'
              ? '#dcfce7'
              : update.status === 'failed'
              ? '#fee2e2'
              : '#fef3c7',
          border:
            update.status === 'successful'
              ? '2px solid #4ade80'
              : update.status === 'failed'
              ? '2px solid #f87171'
              : '2px solid #fbbf24',
          borderRadius: '8px',
        },
      });
    });

    // Audit Log Node
    const auditX =
      dbInsertX + horizontalSpacing * (statusUpdates.length + 1);
    nodes.push({
      id: 'audit',
      type: 'default',
      position: { x: auditX, y: dbInsertY },
      data: {
        label: 'Audit Log',
        json: {
          action: 'CREATE',
          entity_type: 'TRANSACTION',
          entity_id: transaction.id,
          timestamp: transaction.created_at,
        },
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        background: '#e0e7ff',
        border: '2px solid #818cf8',
        borderRadius: '8px',
      },
    });

    return nodes;
  }, [transaction]);

  const edges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    // Request -> Validation
    edges.push({
      id: 'e1',
      source: 'request',
      target: 'validation',
      label: 'Request Data',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    // Validation -> Idempotency
    edges.push({
      id: 'e2',
      source: 'validation',
      target: 'idempotency',
      label: 'Validated',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    // Idempotency -> Balance (if debit) or Database (if credit)
    if (transaction.type === 'debit') {
      edges.push({
        id: 'e3',
        source: 'idempotency',
        target: 'balance',
        label: 'Idempotent',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#6b7280', strokeWidth: 2 },
      });
      edges.push({
        id: 'e4',
        source: 'balance',
        target: 'database',
        label: 'Funds Available',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#6b7280', strokeWidth: 2 },
      });
    } else {
      edges.push({
        id: 'e3',
        source: 'idempotency',
        target: 'database',
        label: 'Idempotent',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#6b7280', strokeWidth: 2 },
      });
    }

    // Database -> Status Updates
    edges.push({
      id: 'e5',
      source: 'database',
      target: 'status-0',
      label: 'Transaction Created',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    edges.push({
      id: 'e6',
      source: 'status-0',
      target: 'status-1',
      label: 'Status Updated',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    // Final Status -> Audit
    edges.push({
      id: 'e7',
      source: 'status-1',
      target: 'audit',
      label: 'Logged',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    return edges;
  }, [transaction]);

  const nodeTypes = {
    default: ({ data }: { data: { label: string; json: Record<string, any> } }) => (
      <div className="px-4 py-3 h-full flex flex-col">
        <div className="font-semibold text-sm mb-2 text-gray-900 border-b pb-2">
          {data.label}
        </div>
        <div className="flex-1 overflow-auto">
          <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(data.json, null, 2)}
          </pre>
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-[500px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

