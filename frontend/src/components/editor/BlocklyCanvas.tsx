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
  if (templateName === 'steering' || templateName.includes('steering')) {
    return `
<xml id="toolbox" style="display: none">
  <category name="🚗 Steering Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="steering_setup"></block>
  </category>
  <category name="🏎️ Driving & Angle" colour="#b18eed">
    <block type="steering_set_angle"></block>
    <block type="steering_drive_motor"></block>
    <block type="steering_brake"></block>
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

  if (templateName === 'pavibot' || templateName.includes('pavibot') || templateName.includes('groot') || templateName.includes('bot')) {
    return `
<xml id="toolbox" style="display: none">
  <category name="🤖 Pavibot OLED Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="pavibot_setup"></block>
  </category>
  <category name="👁️ Eyes & Expressions" colour="#88b1f2">
    <block type="pavibot_set_expression"></block>
    <block type="pavibot_show_menu"></block>
    <block type="pavibot_show_temp_hum"></block>
    <block type="pavibot_run_stopwatch"></block>
    <block type="pavibot_set_torch"></block>
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

  if (templateName === 'radar' || templateName.includes('radar') || templateName.includes('sonar') || templateName.includes('ultrasonic')) {
    return `
<xml id="toolbox" style="display: none">
  <category name="📡 Radar Setup" colour="#58d68d">
    <block type="esp32_start"></block>
    <block type="radar_setup"></block>
  </category>
  <category name="📡 Pulse & Distance" colour="#88b1f2">
    <block type="radar_print_distance"></block>
    <block type="radar_check_obstacle"></block>
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
  if (templateName === 'steering' || templateName.includes('steering')) {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="steering_setup"><field name="SERVO_PIN">13</field><field name="MOTOR_PIN">12</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="steering_set_angle"><field name="ANGLE">90</field><next><block type="steering_drive_motor"><field name="STATE">FORWARD</field><next><block type="esp32_wait"><field name="SECONDS">2</field><next><block type="steering_set_angle"><field name="ANGLE">45</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="steering_set_angle"><field name="ANGLE">135</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'pavibot' || templateName.includes('pavibot') || templateName.includes('groot') || templateName.includes('bot')) {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="pavibot_setup"><field name="SDA_PIN">21</field><field name="SCL_PIN">22</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="pavibot_set_expression"><field name="EXPRESSION">HAPPY</field><next><block type="esp32_wait"><field name="SECONDS">2</field><next><block type="pavibot_show_temp_hum"><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="pavibot_set_expression"><field name="EXPRESSION">BLINK</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  if (templateName === 'radar' || templateName.includes('radar') || templateName.includes('sonar') || templateName.includes('ultrasonic')) {
    return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="radar_setup"><field name="TRIG_PIN">5</field><field name="ECHO_PIN">18</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="radar_print_distance"><next><block type="radar_check_obstacle"><field name="THRESHOLD">20</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
  }
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="esp32_pin_setup"><field name="PIN">2</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="esp32_led_on"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="esp32_led_off"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;
}

export default function BlocklyCanvas() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const { id } = useParams<{ id: string }>();
  const { activeTemplate, loadProject, saveProject, triggerPaviReaction } = useEditorStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [missionText, setMissionText] = useState<string>('👈 STEP 1: Drag "⚡ when ESP32 starts" onto the canvas!');

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
    setMissionText(`⚡ 100% Working Block Stack Auto-Attached!`);
  };

  // Helper to determine next target block & update toolbox glow
  const evaluateNextBlockGuidance = (workspace: Blockly.WorkspaceSvg, template: string) => {
    const topBlocks = workspace.getTopBlocks(true);
    const startBlock = topBlocks.find(b => b.type === 'esp32_start');

    if (!startBlock) {
      applyToolboxBlockGlow(workspace, 'esp32_start');
      setMissionText('👈 STEP 1: Drag "⚡ when ESP32 starts" onto the canvas!');
      useEditorStore.getState().setCurrentHint('toolbox');
      return;
    }

    let currentBlock: Blockly.Block | null = startBlock.getNextBlock();
    let hasSetup = false;
    let hasAction = false;

    const setupTypes = ['steering_setup', 'pavibot_setup', 'radar_setup', 'esp32_pin_setup'];
    const actionTypes = [
      'steering_set_angle', 'steering_drive_motor', 'steering_brake',
      'pavibot_set_expression', 'pavibot_show_menu', 'pavibot_show_temp_hum',
      'pavibot_run_stopwatch', 'pavibot_set_torch',
      'radar_print_distance', 'radar_check_obstacle',
      'esp32_led_on', 'esp32_led_off', 'controls_repeat_ext'
    ];

    while (currentBlock) {
      if (setupTypes.includes(currentBlock.type)) hasSetup = true;
      if (actionTypes.includes(currentBlock.type)) hasAction = true;
      currentBlock = currentBlock.getNextBlock();
    }

    if (!hasSetup) {
      const defaultSetup = 
        template === 'steering' ? 'steering_setup' :
        template === 'pavibot' ? 'pavibot_setup' :
        template === 'radar' ? 'radar_setup' : 'esp32_pin_setup';

      applyToolboxBlockGlow(workspace, defaultSetup);
      setMissionText('✨ STEP 2: Connect your Setup block right under "when ESP32 starts"!');
      useEditorStore.getState().setCurrentHint('toolbox');
      return;
    }

    if (!hasAction) {
      const defaultAction = 
        template === 'steering' ? 'steering_set_angle' :
        template === 'pavibot' ? 'pavibot_set_expression' :
        template === 'radar' ? 'radar_print_distance' : 'esp32_led_on';

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

    const searchParams = new URLSearchParams(window.location.search);
    const templateParam = (searchParams.get('template') || '').toLowerCase();

    let initialTemplate: 'steering' | 'pavibot' | 'radar' | 'custom' = useEditorStore.getState().activeTemplate;

    if (templateParam.includes('steering') || templateParam.includes('wheel')) initialTemplate = 'steering';
    else if (templateParam.includes('pavibot') || templateParam.includes('bot') || templateParam.includes('groot')) initialTemplate = 'pavibot';
    else if (templateParam.includes('radar') || templateParam.includes('sonar') || templateParam.includes('ultrasonic')) initialTemplate = 'radar';

    useEditorStore.setState({ activeTemplate: initialTemplate });

    const initialXml = getProjectToolboxXml(initialTemplate);

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

    (window as any).BlocklyWorkspace = workspaceRef.current;

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
          const code = generateCpp(workspaceRef.current);
          useEditorStore.setState({ generatedCode: code });

          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
            if (workspaceRef.current) {
              saveProject(workspaceRef.current);
            }
          }, 1000);

          const currentTmpl = useEditorStore.getState().activeTemplate;
          evaluateNextBlockGuidance(workspaceRef.current, currentTmpl);
        }
      }
    });

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [id, loadProject, saveProject]);

  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.updateToolbox(getProjectToolboxXml(activeTemplate));
      evaluateNextBlockGuidance(workspaceRef.current, activeTemplate);
    }
  }, [activeTemplate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.workspaceCard}>
        
        {/* 1. PAVIBOT MASCOT TUTORIAL SPEECH BUBBLE BANNER (CLEAN & FULL WIDTH, NO BUTTON COLLISION!) */}
        <div className={styles.mascotBanner}>
          <div className={styles.mascotAvatarBox}>
            <span className={styles.mascotIcon}>🤖</span>
          </div>
          <div className={styles.speechBubble}>
            <span className={styles.bubbleText}>{missionText}</span>
          </div>
        </div>

        {/* 2. WORKSPACE HEADER (CLEAN TITLE, AUTO-ATTACH BUTTON, & HINT TEXT — NO DUPLICATE DROPDOWNS!) */}
        <div className={styles.workspaceHeader}>
          <div className={styles.headerLeftGroup}>
            <span className={styles.workspaceTitle}>✨ Blockly Editor</span>

            <button
              onClick={handleAutoBuildWorkingBlocks}
              className={`clayBtn ${styles.autoAttachBtn}`}
              title="Auto-Attach 100% Correct & Working Blocks for this project"
            >
              ⚡ Auto-Attach Blocks
            </button>
          </div>

          <span className={styles.workspaceHint}>Drag & drop blocks onto canvas</span>
        </div>

        {/* 3. DOTTED CANVAS WORK SURFACE */}
        <div className={styles.dottedCanvas}>
          <div ref={blocklyDiv} style={{ width: '100%', height: '100%' }} />
        </div>

      </div>
    </div>
  );
}
