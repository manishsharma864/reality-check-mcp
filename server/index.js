const express = require('express');
const cors = require('cors');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { toolHandlers } = require('./mcpTools');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Express API Routes implementation (wraps MCP tools internally as requested)
app.post('/api/analyze', async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) return res.status(400).json({ error: 'Idea is required' });
        const result = await toolHandlers.analyze_idea(idea);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/break', async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) return res.status(400).json({ error: 'Idea is required' });
        const result = await toolHandlers.break_idea(idea);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/improve', async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) return res.status(400).json({ error: 'Idea is required' });
        const result = await toolHandlers.improve_idea(idea);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/roast', async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) return res.status(400).json({ error: 'Idea is required' });
        const result = await toolHandlers.roast_idea(idea);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Setup MCP Server for standard connections
const mcpServer = new Server({
    name: 'RealityCheck Server',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {}
    }
});

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'analyze_idea',
                description: 'Analyze an idea and get a viability score, risks, and summary.',
                inputSchema: {
                    type: 'object',
                    properties: { idea: { type: 'string' } },
                    required: ['idea']
                }
            },
            {
                name: 'break_idea',
                description: 'Critique an idea to find failure reasons and edge cases.',
                inputSchema: {
                    type: 'object',
                    properties: { idea: { type: 'string' } },
                    required: ['idea']
                }
            },
            {
                name: 'improve_idea',
                description: 'Suggest improvements, monetization, and roadmap for an idea.',
                inputSchema: {
                    type: 'object',
                    properties: { idea: { type: 'string' } },
                    required: ['idea']
                }
            },
            {
                name: 'roast_idea',
                description: 'Roast a startup idea.',
                inputSchema: {
                    type: 'object',
                    properties: { idea: { type: 'string' } },
                    required: ['idea']
                }
            }
        ]
    };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (!args || !args.idea) {
        throw new Error('Idea argument is required');
    }

    let result;
    switch (name) {
        case 'analyze_idea':
            result = await toolHandlers.analyze_idea(args.idea);
            break;
        case 'break_idea':
            result = await toolHandlers.break_idea(args.idea);
            break;
        case 'improve_idea':
            result = await toolHandlers.improve_idea(args.idea);
            break;
        case 'roast_idea':
            result = await toolHandlers.roast_idea(args.idea);
            break;
        default:
            throw new Error(`Tool \${name} not found`);
    }
    
    return {
        content: [{ type: 'text', text: JSON.stringify(result) }]
    };
});

let transport;

app.get('/mcp/sse', async (req, res) => {
    transport = new SSEServerTransport('/mcp/messages', res);
    await mcpServer.connect(transport);
});

app.post('/mcp/messages', async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No active SSE connection');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('MCP Server endpoints available at /mcp/sse and /mcp/messages');
});
