# Social Marketing Platform

A comprehensive workflow automation platform for social media marketing, built with React and modern web technologies.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating marketing workflows
- **Multi-Platform Integration**: Support for Facebook, Instagram, Reddit, Telegram, and more
- **AI-Powered Content Generation**: ChatGPT integration for automated content creation
- **Data Flow Management**: Intelligent data flow between workflow nodes
- **Environment Management**: Secure credential and variable management
- **Real-time Execution**: Live workflow execution with status tracking

## Architecture

### Data Flow Architecture

The platform uses a **separation of concerns** approach for managing workflow data flow:

#### Business Logic Layer (Data Flow Connections)
```javascript
// Business logic connections - independent of visualization
const dataFlowConnections = [
  {
    id: 'conn_1_2',
    sourceNodeId: 'node-1',
    targetNodeId: 'node-2',
    label: 'Customer data to ad generation',
    condition: 'optional-condition',
    metadata: { priority: 'high' }
  }
];
```

#### Visualization Layer (React Flow Edges)
```javascript
// React Flow edges for visualization - transformed from business logic
const reactFlowEdges = [
  {
    id: 'conn_1_2',
    source: 'node-1',
    target: 'node-2',
    sourceHandle: 'right',
    targetHandle: 'left',
    markerEnd: { type: 'arrowclosed' },
    style: { stroke: '#2563eb', strokeWidth: 2 },
    data: {
      condition: 'optional-condition',
      label: 'Customer data to ad generation',
      metadata: { priority: 'high' }
    }
  }
];
```

#### Transformation Utilities

The platform provides utilities to transform between business logic and visualization:

```javascript
import { 
  dataFlowToReactFlowEdges, 
  reactFlowEdgesToDataFlow 
} from './utils/dataFlowTransformer';

// Convert business logic to visualization
const edges = dataFlowToReactFlowEdges(dataFlowConnections);

// Convert visualization back to business logic
const connections = reactFlowEdgesToDataFlow(reactFlowEdges);
```

### Benefits of This Architecture

1. **Separation of Concerns**: Business logic is independent of UI framework
2. **Framework Agnostic**: Data flow logic can be reused with different visualization libraries
3. **Better Testing**: Business logic can be tested independently
4. **Easier Maintenance**: Changes to visualization don't affect core logic
5. **Future-Proof**: Easy to switch visualization libraries or add new features

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── ui/              # Reusable UI components
│   └── workspace/       # Workflow-specific components
├── pages/               # Page components
├── services/            # Business logic and API services
├── stores/              # State management (Zustand)
├── utils/               # Utility functions
│   ├── dataFlowTransformer.js  # Data flow transformation utilities
│   └── variableParser.js       # Variable parsing and resolution
└── index.js
```

## Data Models

### Project Structure
```json
{
  "id": "project-uuid",
  "name": "Project Name",
  "description": "Project description",
  "status": "active|draft|paused",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T14:30:00Z",
  "nodes": [
    {
      "id": "node-uuid",
      "type": "facebook|instagram|reddit|http-request|chatgpt",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Node Label",
        "content": "Node content",
        "status": "pending|running|success|error"
      }
    }
  ],
  "dataFlowConnections": [
    {
      "id": "conn-uuid",
      "sourceNodeId": "source-node-id",
      "targetNodeId": "target-node-id",
      "label": "Connection label",
      "condition": "optional-condition",
      "metadata": {}
    }
  ]
}
```

### Data Flow Connection Model
```typescript
interface DataFlowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  condition?: string;
  metadata?: Record<string, any>;
}
```

### React Flow Edge Model
```typescript
interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  markerEnd?: object;
  style?: object;
  data?: {
    condition?: string;
    label?: string;
    metadata?: Record<string, any>;
  };
}
```

## Usage Examples

### Creating a New Data Flow Connection
```javascript
import { createDataFlowConnection } from './utils/dataFlowTransformer';

const newConnection = createDataFlowConnection(
  'source-node-id',
  'target-node-id',
  {
    label: 'Data flow from source to target',
    condition: 'source.status === "success"',
    metadata: { priority: 'high' }
  }
);
```

### Validating Data Flow Connections
```javascript
import { validateDataFlowConnections } from './utils/dataFlowTransformer';

const validation = validateDataFlowConnections(connections, nodes);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### Getting Node Connections
```javascript
import { getOutgoingConnections, getIncomingConnections } from './utils/dataFlowTransformer';

const outgoing = getOutgoingConnections(connections, 'node-id');
const incoming = getIncomingConnections(connections, 'node-id');
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

### Building for Production
```bash
npm run build
```

## Customization

### Adding New Node Types
1. Define node type in `NodePanel.js`
2. Add configuration fields in `NodeEditor.js`
3. Update `FlowNode.js` for visual representation
4. Implement execution logic in `ProjectWorkspace.js`

### Adding New Data Flow Features
1. Extend the `DataFlowConnection` interface
2. Update transformation utilities in `dataFlowTransformer.js`
3. Add validation logic if needed
4. Update store methods to handle new features

### Styling
- Modify `tailwind.config.js` for theme customization
- Update component styles in `src/index.css`
- Use CSS custom properties for dynamic theming

### State Management
- Extend stores in `src/stores/` for additional features
- Add new actions and selectors as needed
- Implement persistence for new data types

## Best Practices

### Code Organization
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Follow React best practices

### Data Flow Management
- Always use the transformation utilities for converting between formats
- Validate data flow connections before execution
- Keep business logic separate from visualization concerns
- Use meaningful labels and metadata for connections

### Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Optimize re-renders with useCallback and useMemo
- Lazy load components when possible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React and modern web technologies** 