# @openassistant/agent-builder

> Visual workflow builder for composing OpenAssistant tools into agents with React Flow.

## Features

- 📦 Automatically imports every tool that ships with OpenAssistant (plots, geoda, duckdb, osm, places, …) and makes them available as drag-and-drop nodes.
- 🧱 Provides custom metadata nodes (name, description, result, error) so you can describe the agent contract right on the canvas.
- 🕸️ Uses [React Flow](https://reactflow.dev/) to let you draw DAGs that represent the execution graph for the experimental AI SDK v5 `Agent` class.
- 🧾 Generates a rich JSON schema (tools, metadata, adjacency, topological order, zod-powered parameter schemas) with a single `Create Agent` click.
- 🎨 Modern Tailwind-based UI with search, grouping, and real-time schema preview.

## Installation

```bash
yarn add @openassistant/agent-builder
# or
npm install @openassistant/agent-builder
```

This package ships as an ES module + CommonJS bundle and expects `react`, `react-dom`, and `reactflow` as peer dependencies.

## Quick start

```tsx
import { AgentBuilder, defaultToolRegistry } from '@openassistant/agent-builder';
import '@openassistant/agent-builder/dist/index.css';

export function BuilderExample() {
  return (
    <div className="h-screen">
      <AgentBuilder
        tools={defaultToolRegistry}
        onCreateAgent={(schema) => {
          // Persist the schema or hydrate an Agent instance.
          console.log(schema);
        }}
      />
    </div>
  );
}
```

By default the builder loads every OpenAssistant tool it can find. You can limit or extend the catalog by passing your own `tools` prop (array of `AgentBuilderTool`).

## JSON schema

Click **Create Agent** to produce a schema shaped like:

```json
{
  "agent": {
    "name": "Spatial Analyst Agent",
    "description": "Runs Moran scatterplot after DuckDB query",
    "result": "GeoJSON feature collection",
    "error": "Surface upstream DuckDB errors"
  },
  "workflow": {
    "order": ["meta_agentName_ab1", "tool_duckdb_1", "tool_moran_2"],
    "edges": [{ "id": "e1", "source": "tool_duckdb_1", "target": "tool_moran_2" }],
    "adjacency": { "tool_duckdb_1": ["tool_moran_2"] }
  },
  "tools": [
    {
      "nodeId": "tool_duckdb_1",
      "name": "duckdbQuery",
      "description": "Run SQL queries against DuckDB",
      "parametersSchema": { "...": "zod-based JSON schema" }
    }
  ],
  "customNodes": [
    { "nodeId": "meta_agentName_ab1", "type": "agentName", "value": "Spatial Analyst Agent" }
  ]
}
```

You can feed this JSON directly into downstream orchestration layers to instantiate the AI SDK Agent or to persist/share templates.

## Customization tips

- `customNodes`: provide your own metadata node definitions (label, description, placeholder).
- `initialNodes` / `initialEdges`: hydrate the canvas from a previously saved schema.
- Use `buildAgentSchema(nodes, edges)` if you need to generate the schema outside of the built-in button.

## License

MIT – see the root repository for details.
