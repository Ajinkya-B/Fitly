import { ClientManager } from './clientManager';
import { setClientManager } from './orchestrator';
import { EquipmentServer } from '../mcp-servers/equipment/main';
import { ExerciseServer } from '../mcp-servers/exercise/main';
import { MuscleServer } from '../mcp-servers/muscle/main';
import { FitnessServer } from '../mcp-servers/fitness/main';
import { MCPServer } from './types';

const servers: Record<string, new () => MCPServer> = {
  equipment: EquipmentServer,
  exercise: ExerciseServer,
  muscle: MuscleServer,
  fitness: FitnessServer,
};

export async function bootstrap() {
  const clientManager = new ClientManager();

  for (const [name, ServerClass] of Object.entries(servers)) {
    const instance: MCPServer = new ServerClass();
    await clientManager.registerServer(name, instance);
    console.log(`✅ Registered server: ${name}`);
  }

  setClientManager(clientManager);
  console.log('✅ All MCP servers registered, tools ready for orchestration.');
}
