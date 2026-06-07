import IOBrowser from '@interopio/browser'
import type { IoIntelMCPWeb } from '@interopio/mcp-web'

type IOConnectAPI = Awaited<ReturnType<typeof IOBrowser>>

const MCP_SERVER_METHOD_NAME = 'io.mcp.web.server'
const GET_CLIENTS_METHOD = 'getClients'
const GET_CLIENTS_TOOL = 'get_clients'

const isIOConnectDesktop = (): boolean => Boolean((window as any).glue42gd || (window as any).iodesktop)

const getMCPWebServerConfig = (): IoIntelMCPWeb.Server.Config => ({
  licenseKey: import.meta.env.VITE_IO_INTELLIGENCE_LICENSE_KEY,
  mcpCoreServer: {
    tools: {
      static: {
        methods: [
          {
            availability: 'constant',
            name: GET_CLIENTS_TOOL,
            config: {
              title: 'Get Clients',
              description: 'Returns the list of ACME Banking clients available in the platform.',
              inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false,
              },
              outputSchema: {
                type: 'object',
                properties: {
                  clients: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        portfolioId: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        segment: { type: 'string' },
                        advisor: { type: 'string' },
                        riskProfile: { type: 'string' },
                      },
                      required: [
                        'id',
                        'portfolioId',
                        'firstName',
                        'lastName',
                        'segment',
                        'advisor',
                        'riskProfile',
                      ],
                    },
                  },
                },
                required: ['clients'],
              },
            },
            interop: {
              methodName: GET_CLIENTS_METHOD,
            },
          },
        ],
      },
    },
  },
})

export const startMCPWebServer = async (io: IOConnectAPI): Promise<void> => {
  if (isIOConnectDesktop()) {
    console.info('MCP Web server is hosted by the io.Connect Desktop service app.')
    return
  }

  const hasMCPWebServer = io.interop.methods().some((method) => method.name === MCP_SERVER_METHOD_NAME)

  if (hasMCPWebServer) {
    console.info('MCP Web server is already available.')
    return
  }

  const { ServerFactory } = await import('@interopio/mcp-web')

  await ServerFactory(io, getMCPWebServerConfig())

  console.log('MCP Web server started in io.Assist')
}
