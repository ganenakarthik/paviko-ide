import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { defineCustomBlocks } from '../../customBlocks';
import { generateCpp } from '../../customGenerator';
import { PavikoTheme } from '../../blocklyTheme';
import { useEditorStore } from '../../store';
import { soundManager } from '../../utils/sound';
import styles from './BlocklyCanvas.module.css';
import { useParams } from 'react-router-dom';

defineCustomBlocks();

export function getProjectToolboxXml(templateName: string): string {
  if (templateName === 'lighthouse') {
    return `
<xml id="toolbox" style="display: none">
  <category name="🚨 Lighthouse Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="lighthouse_setup"></block>
  </category>
  <category name="☀️ Beacon Controls" colour="#88b1f2">
    <block type="lighthouse_beacon_on"></block>
    <block type="lighthouse_beacon_off"></block>
    <block type="lighthouse_set_brightness"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
  }

  if (templateName === 'train') {
    return `
<xml id="toolbox" style="display: none">
  <category name="🚂 Train Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="train_setup"></block>
  </category>
  <category name="⚡ Motor & Radar" colour="#b18eed">
    <block type="train_motor_move"></block>
    <block type="train_read_distance"></block>
    <block type="train_check_obstacle"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
  }

  if (templateName === 'traffic') {
    return `
<xml id="toolbox" style="display: none">
  <category name="🚦 Traffic Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="traffic_setup"></block>
  </category>
  <category name="🚦 Lights Signal" colour="#e74c3c">
    <block type="traffic_set_red"></block>
    <block type="traffic_set_yellow"></block>
    <block type="traffic_set_green"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
  }

  if (templateName === 'servo') {
    return `
<xml id="toolbox" style="display: none">
  <category name="🤖 Servo Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="servo_setup"></block>
  </category>
  <category name="🔄 Servo Controls" colour="#b18eed">
    <block type="servo_set_angle"></block>
    <block type="servo_sweep"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
  }

  if (templateName === 'weather') {
    return `
<xml id="toolbox" style="display: none">
  <category name="🌡️ Weather Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="dht11_setup"></block>
  </category>
  <category name="💧 Sensors & Readings" colour="#88b1f2">
    <block type="dht11_read_temp"></block>
    <block type="dht11_read_humidity"></block>
    <block type="dht11_print_temp"></block>
    <block type="dht11_print_humidity"></block>
    <block type="dht11_print_readings"></block>
    <block type="dht11_alert_high_temp"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
  }

  return `
<xml id="toolbox" style="display: none">
  <category name="⚡ GPIO & Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="esp32_pin_setup"></block>
  </category>
  <category name="☀️ Output (LEDs)" colour="#88b1f2">
    <block type="esp32_led_on"></block>
    <block type="esp32_led_off"></block>
  </category>
  <category name="🕒 Timing & Loops" colour="#f1c40f">
    <block type="esp32_wait"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>`;
}

export function getProjectConnectedXml(templateName: string): string {
  if (templateName === 'lighthouse') {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="lighthouse_setup"><field name="PIN">2</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="lighthouse_beacon_on"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="lighthouse_beacon_off"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'train') {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="train_setup"><field name="MOTOR_PIN">12</field><field name="TRIG_PIN">4</field><field name="ECHO_PIN">5</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="train_motor_move"><field name="STATE">FORWARD</field><next><block type="train_check_obstacle"><field name="DISTANCE">20</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'traffic') {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="traffic_setup"><field name="RED_PIN">4</field><field name="YELLOW_PIN">2</field><field name="GREEN_PIN">5</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="traffic_set_red"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="traffic_set_red"><field name="STATE">LOW</field><next><block type="traffic_set_yellow"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="traffic_set_yellow"><field name="STATE">LOW</field><next><block type="traffic_set_green"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="traffic_set_green"><field name="STATE">LOW</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'servo') {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="servo_setup"><field name="PIN">13</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="servo_set_angle"><field name="ANGLE">0</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="servo_set_angle"><field name="ANGLE">180</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'weather') {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="dht11_setup"><field name="PIN">4</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="dht11_print_readings"><next><block type="dht11_alert_high_temp"><field name="TEMP_LIMIT">30</field><field name="ALARM_PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">2</field></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="esp32_pin_setup"><field name="PIN">2</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="esp32_led_on"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="esp32_led_off"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
}

export default function BlocklyCanvas() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const { id } = useParams<{ id: string }>();
  const { activeTemplate, loadProject, saveProject, triggerPaviReaction } = useEditorStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [missionText, setMissionText] = useState<string>('👈 STEP 1: Drag "⚡ when ESP32 starts" from the glowing Candy Tray!');

  const handleAutoBuildWorkingBlocks = () => {
    if (!workspaceRef.current) return;
    const template = useEditorStore.getState().activeTemplate;
    const connectedXml = getProjectConnectedXml(template);

    workspaceRef.current.clear();
    const dom = Blockly.utils.xml.textToDom(connectedXml);
    Blockly.Xml.domToWorkspace(dom, workspaceRef.current);

    const code = generateCpp(workspaceRef.current);
    useEditorStore.setState({ generatedCode: code });
    saveProject(workspaceRef.current);

    soundManager.playPop();
    triggerPaviReaction('yes');
    setMissionText(`⚡ 100% Working Block Stack Auto-Attached for ${template.toUpperCase()}!`);
  };

  // Helper to determine next target block & update toolbox glow
  const evaluateNextBlockGuidance = (workspace: Blockly.WorkspaceSvg, template: string) => {
    const topBlocks = workspace.getTopBlocks(true);
    const startBlock = topBlocks.find(b => b.type === 'esp32_start');

    if (!startBlock) {
      applyToolboxBlockGlow(workspace, 'esp32_start');
      setMissionText('👈 STEP 1: Drag "⚡ when ESP32 starts" from the glowing Candy Tray!');
      useEditorStore.getState().setCurrentHint('toolbox');
      return;
    }

    let currentBlock: Blockly.Block | null = startBlock.getNextBlock();
    let hasSetup = false;
    let hasAction = false;

    const setupTypes = ['lighthouse_setup', 'train_setup', 'traffic_setup', 'servo_setup', 'dht11_setup', 'esp32_pin_setup'];
    const actionTypes = [
      'lighthouse_beacon_on', 'lighthouse_beacon_off', 'lighthouse_set_brightness',
      'train_motor_move', 'train_check_obstacle',
      'traffic_set_red', 'traffic_set_yellow', 'traffic_set_green',
      'servo_set_angle', 'servo_sweep',
      'dht11_print_readings', 'dht11_alert_high_temp',
      'esp32_led_on', 'esp32_led_off', 'controls_repeat_ext'
    ];

    while (currentBlock) {
      if (setupTypes.includes(currentBlock.type)) hasSetup = true;
      if (actionTypes.includes(currentBlock.type)) hasAction = true;
      currentBlock = currentBlock.getNextBlock();
    }

    if (!hasSetup) {
      const defaultSetup = 
        template === 'lighthouse' ? 'lighthouse_setup' :
        template === 'train' ? 'train_setup' :
        template === 'traffic' ? 'traffic_setup' :
        template === 'servo' ? 'servo_setup' :
        template === 'weather' ? 'dht11_setup' : 'esp32_pin_setup';

      applyToolboxBlockGlow(workspace, defaultSetup);
      setMissionText('✨ STEP 2: Connect your Setup block right under "when ESP32 starts"!');
      useEditorStore.getState().setCurrentHint('toolbox');
      return;
    }

    if (!hasAction) {
      const defaultAction = 
        template === 'lighthouse' ? 'lighthouse_beacon_on' :
        template === 'train' ? 'train_motor_move' :
        template === 'traffic' ? 'traffic_set_red' :
        template === 'servo' ? 'servo_set_angle' :
        template === 'weather' ? 'dht11_print_readings' : 'esp32_led_on';

      applyToolboxBlockGlow(workspace, defaultAction);
      setMissionText('🌟 STEP 3: Awesome! Now attach your Action block to run the kit!');
      useEditorStore.getState().setCurrentHint('toolbox');
      return;
    }

    // Step 4: Code complete
    applyToolboxBlockGlow(workspace, null);
    setMissionText('⚡ STEP 4: Code structure ready! Click glowing "Flash to Kit" button below!');
    useEditorStore.getState().setCurrentHint('flash');
  };

  const applyToolboxBlockGlow = (workspace: Blockly.WorkspaceSvg, targetType: string | null) => {
    try {
      // @ts-ignore
      const flyout = workspace.getFlyout();
      if (!flyout) return;
      const flyoutWs = flyout.getWorkspace();
      if (!flyoutWs) return;

      // Clear previous glows
      flyoutWs.getAllBlocks(false).forEach(b => {
        const root = (b as any).getSvgRoot ? (b as any).getSvgRoot() : null;
        if (root) root.classList.remove('blocklyNextBlockGlow');
      });

      // Add glow to next target block
      if (targetType) {
        const targetBlocks = flyoutWs.getBlocksByType(targetType);
        targetBlocks.forEach(b => {
          const root = (b as any).getSvgRoot ? (b as any).getSvgRoot() : null;
          if (root) root.classList.add('blocklyNextBlockGlow');
        });
      }
    } catch (e) {
      // Ignore flyout DOM errors
    }
  };

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Read template URL query parameter if present
    const searchParams = new URLSearchParams(window.location.search);
    const templateParam = (searchParams.get('template') || '').toLowerCase();

    let initialTemplate: 'lighthouse' | 'train' | 'traffic' | 'servo' | 'weather' | 'custom' = useEditorStore.getState().activeTemplate;

    if (templateParam.includes('train') || templateParam.includes('car')) initialTemplate = 'train';
    else if (templateParam.includes('traffic')) initialTemplate = 'traffic';
    else if (templateParam.includes('servo')) initialTemplate = 'servo';
    else if (templateParam.includes('weather') || templateParam.includes('temp') || templateParam.includes('dht')) initialTemplate = 'weather';
    else if (templateParam.includes('lighthouse')) initialTemplate = 'lighthouse';

    useEditorStore.setState({ activeTemplate: initialTemplate });

    const initialXml = getProjectToolboxXml(initialTemplate);

    // Inject Blockly with initial template XML
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: initialXml,
      theme: PavikoTheme,
      renderer: 'geras',
      grid: {
        spacing: 24,
        length: 3,
        colour: '#d6c9b8',
        snap: true
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: false
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });

    // Store workspace reference globally for simulator access
    (window as any).BlocklyWorkspace = workspaceRef.current;

    // Load Project if ID exists
    if (id) {
      loadProject(id, workspaceRef.current).then(() => {
        if (workspaceRef.current) {
          const currentTmpl = useEditorStore.getState().activeTemplate;
          workspaceRef.current.updateToolbox(getProjectToolboxXml(currentTmpl));
          evaluateNextBlockGuidance(workspaceRef.current, currentTmpl);
          const code = generateCpp(workspaceRef.current);
          useEditorStore.setState({ generatedCode: code });
        }
      });
    } else {
      evaluateNextBlockGuidance(workspaceRef.current, initialTemplate);
      if (workspaceRef.current) {
        const code = generateCpp(workspaceRef.current);
        useEditorStore.setState({ generatedCode: code });
      }
    }

    // Handle code generation and auto-save on change
    workspaceRef.current.addChangeListener((e) => {
      if (e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_CREATE) {
        // @ts-ignore
        if (e.type === Blockly.Events.BLOCK_MOVE && !e.newParentId && !e.newCoordinate) return;
        soundManager.playPop();
        triggerPaviReaction('yes');
      }

      if (e.type === Blockly.Events.BLOCK_DELETE) {
        triggerPaviReaction('no');
      }

      if (
        e.type === Blockly.Events.BLOCK_MOVE ||
        e.type === Blockly.Events.BLOCK_DELETE ||
        e.type === Blockly.Events.BLOCK_CHANGE ||
        e.type === Blockly.Events.BLOCK_CREATE
      ) {
        if (workspaceRef.current) {
          // Generate Code
          const code = generateCpp(workspaceRef.current);
          useEditorStore.setState({ generatedCode: code });

          // Debounce auto-save
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
            if (workspaceRef.current) {
              saveProject(workspaceRef.current);
            }
          }, 1000);

          // Evaluate next block guidance & glowing target
          const currentTmpl = useEditorStore.getState().activeTemplate;
          evaluateNextBlockGuidance(workspaceRef.current, currentTmpl);
        }
      }
    });

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.blocklyToolboxDiv')) {
        useEditorStore.getState().triggerPaviReaction('look_left');
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.blocklyToolboxDiv') && !(e.relatedTarget as HTMLElement)?.closest('.blocklyToolboxDiv')) {
        useEditorStore.getState().triggerPaviReaction(null);
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [id, loadProject, saveProject]);

  // Dynamically update toolbox XML when activeTemplate changes
  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.updateToolbox(getProjectToolboxXml(activeTemplate));
      evaluateNextBlockGuidance(workspaceRef.current, activeTemplate);
    }
  }, [activeTemplate]);

  // Handle Toolbox Hint Glow
  useEffect(() => {
    const toolboxElement = document.querySelector('.blocklyToolboxDiv');
    if (toolboxElement) {
      if (useEditorStore.getState().currentHint === 'toolbox') {
        toolboxElement.classList.add('hintGlow');
      } else {
        toolboxElement.classList.remove('hintGlow');
      }
    }
  });

  const { currentHint } = useEditorStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles.workspace}>
        <div className={styles.workspaceHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={styles.workspaceTitle}>✨ Blockly Editor</span>
            
            <select
              value={activeTemplate}
              onChange={(e) => {
                const selected = e.target.value as any;
                useEditorStore.setState({ activeTemplate: selected });
                if (workspaceRef.current) {
                  workspaceRef.current.updateToolbox(getProjectToolboxXml(selected));
                  const connectedXml = getProjectConnectedXml(selected);
                  workspaceRef.current.clear();
                  const dom = Blockly.utils.xml.textToDom(connectedXml);
                  Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
                  const code = generateCpp(workspaceRef.current);
                  useEditorStore.setState({ generatedCode: code });
                  saveProject(workspaceRef.current);
                  soundManager.playPop();
                  triggerPaviReaction('yes');
                  setMissionText(`⚡ Switched to ${selected.toUpperCase()} Project! 100% Working Blocks Loaded!`);
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: '2px solid #7D0A26',
                background: '#FFF0F3',
                color: '#7D0A26',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(125,10,38,0.15)'
              }}
            >
              <option value="lighthouse">🚨 Project: Blinking Lighthouse</option>
              <option value="train">🚂 Project: Obstacle Train</option>
              <option value="traffic">🚦 Project: City Traffic Light</option>
              <option value="servo">🤖 Project: Robotic Servo Arm</option>
              <option value="weather">🌡️ Project: DHT11 Weather Station</option>
              <option value="custom">⚡ Project: General ESP32 GPIO</option>
            </select>
          </div>
          
          {/* GAME TUTORIAL MISSION BANNER */}
          <div style={{
            background: currentHint === 'toolbox' ? '#FFF0F0' : currentHint === 'flash' ? '#E8F8F0' : '#FDF0FF',
            color: currentHint === 'toolbox' ? '#C0392B' : currentHint === 'flash' ? '#27AE60' : '#8E44AD',
            padding: '6px 16px',
            borderRadius: '100px',
            border: `2px solid ${currentHint === 'toolbox' ? '#E74C3C' : currentHint === 'flash' ? '#2ECC71' : '#9B59B6'}`,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            {missionText}
          </div>

          <button
            onClick={handleAutoBuildWorkingBlocks}
            title="Auto-Attach 100% Correct & Working Blocks for this project"
            style={{
              background: 'linear-gradient(135deg, #FF9F43 0%, #FF5252 100%)',
              color: '#FFF',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '100px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,82,82,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ⚡ Auto-Attach Working Blocks
          </button>

          <span className={styles.workspaceHint}>Drag & Drop components</span>
        </div>
        <div className={styles.dottedCanvas}>
          <div ref={blocklyDiv} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
