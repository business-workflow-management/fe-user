# Social Media Marketing Platform

A comprehensive ReactJS-based platform for creating and managing social media marketing workflows. This application allows marketing teams to design, execute, and monitor automated social media campaigns across multiple platforms.

## Features

### 🔐 Authentication
- **Login/Register System**: Mock authentication with persistent sessions
- **User Management**: User profiles and settings
- **Session Management**: Automatic token handling and storage

### 📊 Project Management
- **Project Dashboard**: Overview of all marketing campaigns
- **Project Creation**: Easy project setup with templates
- **Status Tracking**: Monitor project status (Draft, Active, Paused)
- **Search & Filter**: Find projects quickly with advanced filtering

### 🎨 Visual Workflow Editor
- **Drag & Drop Interface**: Intuitive node-based workflow design
- **Multiple Node Types**: Support for various social media platforms
- **Real-time Preview**: See workflow changes instantly
- **Connection Management**: Link nodes to create execution flows

### 📱 Supported Platforms
- **Facebook**: Post creation and scheduling
- **Instagram**: Story and feed posts
- **Reddit**: Subreddit posting
- **HTTP Requests**: API integrations and webhooks
- **ChatGPT**: AI-powered content generation

### ⚡ Workflow Execution
- **Live Execution**: Run workflows with real-time status updates
- **Step-by-step Animation**: Visual feedback during execution
- **Error Handling**: Graceful error management and recovery
- **Execution History**: Track all workflow runs and results

### 🛠️ Advanced Features
- **Undo/Redo**: Full history management for workflow changes
- **Copy/Paste**: Duplicate nodes and workflows
- **Conditional Logic**: Pause/stop workflows based on conditions
- **Data Persistence**: All data stored in JSON format
- **Export/Import**: Share workflows between projects

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library

### State Management
- **Zustand**: Lightweight state management with persistence
- **React Query**: Server state management and caching

### UI Components
- **Custom Component Library**: Reusable UI components
- **Modal System**: Flexible dialog management
- **Form Handling**: Comprehensive form validation
- **Toast Notifications**: User feedback system

### Development Tools
- **Create React App**: Zero-configuration build setup
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   └── Modal.js
│   ├── layout/             # Layout components
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   └── Sidebar.js
│   └── workspace/          # Workspace components
│       ├── FlowNode.js
│       ├── NodePanel.js
│       └── NodeEditor.js
├── pages/
│   ├── auth/               # Authentication pages
│   │   ├── Login.js
│   │   └── Register.js
│   ├── projects/           # Project management
│   │   └── ProjectManagement.js
│   └── workspace/          # Workflow editor
│       └── ProjectWorkspace.js
├── stores/                 # State management
│   ├── authStore.js
│   └── projectStore.js
├── App.js                  # Main application component
└── index.js               # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-marketing-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## Usage Guide

### 1. Authentication
- Use any email and password to login (mock authentication)
- Register new accounts with name, email, and password
- Sessions persist across browser restarts

### 2. Project Management
- Create new projects with name and description
- View all projects in a grid layout
- Filter projects by status (Draft, Active, Paused)
- Search projects by name or description

### 3. Workflow Design
- **Add Nodes**: Click or drag components from the left panel
- **Configure Nodes**: Select nodes to edit their properties
- **Connect Nodes**: Create execution flows between nodes
- **Test Workflows**: Run workflows to see execution in action

### 4. Node Types

#### Facebook Node
- Post content creation
- Scheduled publishing
- Immediate posting option

#### Instagram Node
- Story and feed posts
- Image URL integration
- Content customization

#### Reddit Node
- Subreddit targeting
- Post title and content
- Community-specific posting

#### HTTP Request Node
- REST API integration
- Multiple HTTP methods
- Custom headers and body
- Webhook support

#### ChatGPT Node
- AI content generation
- Multiple model selection
- Token and temperature control
- Custom prompts

### 5. Workflow Execution
- Click "Run Workflow" to start execution
- Watch real-time status updates
- View execution history
- Stop execution at any time

## Data Structure

### Project JSON Format
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
  "edges": [
    {
      "id": "edge-uuid",
      "source": "source-node-id",
      "target": "target-node-id",
      "type": "default"
    }
  ]
}
```

### Execution History Format
```json
{
  "executionId": "exec-uuid",
  "projectId": "project-uuid",
  "timestamp": "2024-01-20T14:30:00Z",
  "status": "success|partial|error",
  "results": [
    {
      "nodeId": "node-uuid",
      "result": {
        "success": true,
        "data": {
          "message": "Execution result",
          "response": { "status": 200, "data": {} }
        }
      }
    }
  ]
}
```

## Customization

### Adding New Node Types
1. Define node type in `NodePanel.js`
2. Add configuration fields in `NodeEditor.js`
3. Update `FlowNode.js` for visual representation
4. Implement execution logic in `ProjectWorkspace.js`

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

### Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Optimize re-renders with useCallback and useMemo
- Lazy load components when appropriate

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Future Enhancements

### Planned Features
- **Real API Integration**: Connect to actual social media APIs
- **Advanced Analytics**: Detailed execution metrics and insights
- **Team Collaboration**: Multi-user project editing
- **Template Library**: Pre-built workflow templates
- **Mobile Support**: Responsive design for mobile devices
- **Real-time Collaboration**: Live editing with multiple users

### Technical Improvements
- **TypeScript Migration**: Add type safety
- **Testing Suite**: Comprehensive unit and integration tests
- **Performance Optimization**: Virtual scrolling for large workflows
- **Offline Support**: Workflow editing without internet
- **Plugin System**: Extensible node type architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React and modern web technologies** 