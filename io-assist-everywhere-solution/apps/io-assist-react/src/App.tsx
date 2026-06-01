import { useMemo } from 'react'
import IOBrowser from '@interopio/browser'
import {
  IoAssist,
  type IoAssistDynamicConfig,
  type IoAssistStaticConfig,
} from '@interopio/io-assist-react'
import { IoIntelWorkingContextFactory } from '@interopio/working-context'
import IOWorkspaces from '@interopio/workspaces-api'
import './App.css'
import { startMCPWebServer } from './mcp'

const AGENT_SERVER_URL = 'http://localhost:4111'
const MCP_SANDBOX_PROXY_URL = 'https://iointel-demos-mcp-apps-proxy.interop.io'
const workingContextConfig = {
  schema: {
    selectedClient: {
      type: 'object',
      description: 'The ACME Banking client currently selected in the workspace.',
      source: {
        context: {
          location: { workspace: { target: 'my' } },
          path: 'selectedClient',
        },
      },
    },
  },
} as const

const createIOConnect: typeof IOBrowser = async (config) => {
  const io = await IOBrowser(config)

  await startMCPWebServer(io)

  return io
}

const staticConfig: IoAssistStaticConfig = {
  connectConfig: {
    browser: {
      factory: createIOConnect,
      config: {
        libraries: [IOWorkspaces],
        modals: {
          dialogs: {
            enabled: true,
          },
        },
      },
    },
  },
  defaultAgentName: 'io-agent',
  workingContext: {
    factory: IoIntelWorkingContextFactory,
    config: workingContextConfig,
  },
  aiWebConfig: {
    agentServer: {
      baseUrl: AGENT_SERVER_URL,
    },
    mcp: {
      clientsConfig: {
        enforceStrictCapabilities: false,
        capabilities: {
          extensions: {
            'io.modelcontextprotocol/ui': {
              mimeTypes: ['text/html;profile=mcp-app'],
            },
          },
        },
      },
      mcpApps: {
        sandboxProxyUrl: MCP_SANDBOX_PROXY_URL,
        displayMode: 'workspace',
      },
      ioIntel: {
        web: {
          enabled: true,
        },
      },
    },
  },
}

function App() {
  const dynamicConfig = useMemo<IoAssistDynamicConfig>(
    () => ({
      user: {
        id: 'acme-advisor',
        name: 'ACME Advisor',
      },
    }),
    [],
  )

  return (
    <main className="assist-shell">
      <IoAssist staticConfig={staticConfig} dynamicConfig={dynamicConfig} />
    </main>
  )
}

export default App
