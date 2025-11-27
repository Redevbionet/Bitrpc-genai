export enum View {
  GENERATOR = 'GENERATOR',
  SIMULATOR = 'SIMULATOR',
  DOCS = 'DOCS',
  CHAT = 'CHAT'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface RpcMethod {
  name: string;
  description: string;
  category: string;
}

export interface GeneratedScript {
  code: string;
  explanation: string;
}