import { create } from 'zustand';
import { soundManager } from '../utils/sound';
import { getProjectToolboxXml } from '../components/editor/BlocklyCanvas';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

interface EditorState {
  // Project
  projectId: string | null;
  projectName: string;
  activeTemplate: 'lighthouse' | 'train' | 'traffic' | 'servo' | 'weather' | 'custom';
  setActiveTemplate: (template: 'lighthouse' | 'train' | 'traffic' | 'servo' | 'weather' | 'custom') => void;
  loadProject: (id: string, workspace: any) => Promise<void>;
  saveProject: (workspace: any) => Promise<void>;
  
  // Code Generation
  generatedCode: string;
  setGeneratedCode: (code: string) => void;

  // Hardware Status
  isHardwareConnected: boolean;
  setIsHardwareConnected: (status: boolean) => void;

  // Compilation & Terminal
  terminalLogs: string[];
  addTerminalLog: (log: string, type?: 'success' | 'error' | 'info') => void;
  clearTerminal: () => void;
  isCompiling: boolean;
  compileCode: () => Promise<void>;

  // AI Pavi (Character Only)
  paviReaction: 'yes' | 'no' | 'error' | 'sleep' | 'look_left' | 'flip' | null;
  triggerPaviReaction: (type?: 'yes' | 'no' | 'error' | 'sleep' | 'look_left' | 'flip' | null) => void;

  // Context-Aware Hints
  currentHint: 'toolbox' | 'flash' | 'sim' | 'error' | null;
  setCurrentHint: (hint: 'toolbox' | 'flash' | 'sim' | 'error' | null) => void;

  // Hardware Live Telemetry
  hardwareTemp: number | null;
  hardwareHumidity: number | null;
  hardwareDistance: number | null;
  hardwareServoAngle: number | null;
  hardwareSignalState: string | null;
  setHardwareTelemetry: (data: Partial<{
    hardwareTemp: number | null;
    hardwareHumidity: number | null;
    hardwareDistance: number | null;
    hardwareServoAngle: number | null;
    hardwareSignalState: string | null;
  }>) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const useEditorStore = create<EditorState>((set, get) => ({
  // --- PROJECT ---
  projectId: null,
  projectName: 'Untitled Project',
  activeTemplate: 'lighthouse',
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  loadProject: async (id, workspace) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      
      let template: 'lighthouse' | 'train' | 'traffic' | 'servo' | 'weather' | 'custom' = 'custom';
      const xmlStr = data.block_xml || '';
      const lowerName = (data.name || '').toLowerCase();

      if (xmlStr.includes('train_setup') || xmlStr.includes('train_motor') || lowerName.includes('train') || lowerName.includes('car')) {
        template = 'train';
      } else if (xmlStr.includes('traffic_setup') || xmlStr.includes('traffic_set') || lowerName.includes('traffic')) {
        template = 'traffic';
      } else if (xmlStr.includes('servo_setup') || xmlStr.includes('servo_set') || lowerName.includes('servo')) {
        template = 'servo';
      } else if (xmlStr.includes('dht11_setup') || xmlStr.includes('dht11_read') || lowerName.includes('weather') || lowerName.includes('temp') || lowerName.includes('dht')) {
        template = 'weather';
      } else if (xmlStr.includes('lighthouse_setup') || xmlStr.includes('lighthouse_beacon') || lowerName.includes('lighthouse')) {
        template = 'lighthouse';
      }

      set({ projectId: data.id, projectName: data.name, generatedCode: data.code || '', activeTemplate: template });

      if (data.block_xml && workspace) {
        // @ts-ignore
        const Blockly = await import('blockly');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(data.block_xml), workspace);
        workspace.updateToolbox(getProjectToolboxXml(template));
      }
    } catch (e) {
      console.error("Failed to load project", e);
    }
  },
  saveProject: async (workspace) => {
    const { projectId, projectName, generatedCode } = get();
    if (!projectId || !workspace) return;
    try {
      // @ts-ignore
      const Blockly = await import('blockly');
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      
      await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          block_xml: xmlText,
          code: generatedCode,
          hardware_target: 'esp32'
        })
      });
    } catch (e) {
      console.error("Failed to save project", e);
    }
  },

  // --- CODE GEN & HARDWARE ---
  generatedCode: '',
  setGeneratedCode: (code) => set({ generatedCode: code }),
  isHardwareConnected: false,
  setIsHardwareConnected: (status) => {
    if (status) soundManager.playSuccess();
    set({ isHardwareConnected: status });
  },

  // --- TERMINAL & COMPILE ---
  terminalLogs: ['[System] Terminal ready.'],
  addTerminalLog: (log, type = 'info') => {
    const coloredLog = type === 'error' ? `[Error] ${log}` : type === 'success' ? `[Success] ${log}` : `[System] ${log}`;
    if (type === 'error') soundManager.playError();
    if (type === 'success') soundManager.playSuccess();
    set((state) => ({ terminalLogs: [...state.terminalLogs, coloredLog] }));
  },
  clearTerminal: () => set({ terminalLogs: ['[System] Terminal cleared.'] }),
  isCompiling: false,
  compileCode: async () => {
    set({ isCompiling: true });
    get().addTerminalLog('Sending code to compiler...', 'info');
    try {
      const res = await fetch(`${API_BASE}/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: get().generatedCode, target: 'esp32' })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playSuccess();
        get().addTerminalLog(data.message, 'success');
        set({ currentHint: 'flash' });
      } else {
        soundManager.playError();
        get().triggerPaviReaction('error');
        get().addTerminalLog(data.message, 'error');
        set({ currentHint: 'error' });
      }
    } catch (e) {
      soundManager.playError();
      get().triggerPaviReaction('error');
      get().addTerminalLog('Failed to connect to compiler API.', 'error');
      set({ currentHint: 'error' });
    } finally {
      set({ isCompiling: false });
    }
  },

  // --- AI PAVI ---
  paviReaction: null as 'yes' | 'no' | 'error' | 'sleep' | 'look_left' | 'flip' | null,
  triggerPaviReaction: (type: 'yes' | 'no' | 'error' | 'sleep' | 'look_left' | 'flip' | null = 'yes') => {
    set({ paviReaction: type });
    if (type === 'yes') soundManager.playPop();
    if (type === 'no' || type === 'error') soundManager.playError();

    if (type === 'yes' || type === 'no' || type === 'error' || type === 'flip') {
      setTimeout(() => {
        if (get().paviReaction === type) set({ paviReaction: null });
      }, type === 'error' ? 6000 : 1200);
    }
  },

  // --- CONTEXT HINTS ---
  currentHint: null,
  setCurrentHint: (hint) => set({ currentHint: hint }),

  // --- HARDWARE LIVE TELEMETRY ---
  hardwareTemp: null,
  hardwareHumidity: null,
  hardwareDistance: null,
  hardwareServoAngle: null,
  hardwareSignalState: null,
  setHardwareTelemetry: (data) => set((state) => ({ ...state, ...data })),
}));
