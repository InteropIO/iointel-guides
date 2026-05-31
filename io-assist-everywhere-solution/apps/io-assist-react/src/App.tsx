import { useMemo } from 'react'
import IOBrowser from '@interopio/browser'
import {
  IoAssist,
  type IoAssistDynamicConfig,
  type IoAssistStaticConfig,
} from '@interopio/io-assist-react'
import './App.css'

const AGENT_SERVER_URL = 'http://localhost:4111'

const staticConfig: IoAssistStaticConfig = {
  connectConfig: {
    browser: {
      factory: IOBrowser,
      config: {
        modals: {
          dialogs: {
            enabled: true,
          },
        },
      },
    },
  },
  defaultAgentName: 'io-agent',
  aiWebConfig: {
    agentServer: {
      baseUrl: AGENT_SERVER_URL,
    },
    mcp: {
      clientsConfig: {
        enforceStrictCapabilities: false,
        capabilities: {},
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
