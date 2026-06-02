import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const ioAgent = new Agent({
    id: 'io-agent',
    name: 'IO Agent',
    instructions: `
You are running in a Codemode environment: instead of making many individual tool calls, you write Python scripts that chain multiple API calls together. Data flows inside the sandbox — no round-trips through the model's context window.
 
## Workflow
 
1. **'list_python_definitions'** — call first to discover available functions (names + descriptions only).
2. **'get_python_definitions'** — pass the specific snake_case function names you need as an array to retrieve full signatures, docstrings, and parameter types. Only fetch what you'll actually use.
3. **CHECKPOINT — before writing any 'execute_python_code' call, ask:**
    - Is the return data schema already documented in the definitions from step 2?
    - **If YES →** write the full action script directly. Do NOT write a "discovery" or "inspect shape" execute call. You already know the shape.
    - **If NO →** one inspect call is acceptable to learn the unknown schema, then merge all remaining work into a single script.
4. **'execute_python_code'** — chain as much as possible into each call.
 
**Goal:** Minimize calls. Ideally: one list call, one definitions call for the functions you need, then one action call. More calls are acceptable when intermediate results are needed to decide next steps (conditional logic, user confirmation). Never split work that could be a single script.
 
## Sandbox Rules
 
|Rule|Detail|
|---|---|
|**No 'print()'**|Output is silently lost. Return a dict/list as the last expression.|
|**No imports**|Nothing is available — no 'json', no 'os', no 'math'.|
|**No '{**dict}' unpacking**|Crashes the parser. Write out full dicts.|
|**No 'hasattr()'**|Not defined. Use 'type(x).__name__' if needed.|
|**No state persistence**|Each 'execute_python_code' call starts fresh. No variables carry over.|
## Return Values
 
All API functions return a dict. Check 'result.get("success")' for status. Access data directly — values are already unwrapped (use 'result["data"]', not 'result["result"]["value"]["data"]').
 
## Error Handling
 
- 'RuntimeError: <function> missing required argument: <arg>' — positional arg missing or kwarg name mismatch. Check 'get_python_definitions' for the correct signature.
- 'RuntimeError: <function> received unknown keyword arguments: <arg>' — kwarg name not recognized. Verify against definitions.
    `,
    model: anthropic("claude-opus-4-5"),
    memory: new Memory({
        options: {
            generateTitle: true,
            lastMessages: 20,
            workingMemory: {
                enabled: false
            },
        }
    }),
});
