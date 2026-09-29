import * as Blockly from 'blockly';
import 'blockly/javascript';

export const CppGenerator = new Blockly.Generator('C++');

// --- GENERAL / BASE ESP32 GENERATORS ---
CppGenerator.forBlock['esp32_start'] = function() {
  return '';
};

CppGenerator.forBlock['esp32_pin_setup'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `pinMode(${pin}, OUTPUT);\n`;
};

CppGenerator.forBlock['esp32_led_on'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `digitalWrite(${pin}, HIGH);\n`;
};

CppGenerator.forBlock['esp32_led_off'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `digitalWrite(${pin}, LOW);\n`;
};

CppGenerator.forBlock['esp32_wait'] = function(block: Blockly.Block) {
  const seconds = block.getFieldValue('SECONDS');
  return `delay(${Number(seconds) * 1000});\n`;
};

// --- 🚗 STEERING GENERATORS ---
CppGenerator.forBlock['steering_setup'] = function(block: Blockly.Block) {
  const servoPin = block.getFieldValue('SERVO_PIN');
  const motorPin = block.getFieldValue('MOTOR_PIN');
  return `steeringServo.attach(${servoPin});\npinMode(${motorPin}, OUTPUT);\n`;
};

CppGenerator.forBlock['steering_set_angle'] = function(block: Blockly.Block) {
  const angle = block.getFieldValue('ANGLE');
  return `steeringServo.write(${angle}); // Set Steering Wheel Angle\n`;
};

CppGenerator.forBlock['steering_drive_motor'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  const val = state === 'STOP' ? 'LOW' : 'HIGH';
  return `digitalWrite(12, ${val}); // Steering Motor ${state}\n`;
};

CppGenerator.forBlock['steering_brake'] = function() {
  return `digitalWrite(12, LOW); // Emergency Brake\nsteeringServo.write(90);\n`;
};

// --- 🤖 PAVIBOT OLED COMPANION GENERATORS ---
CppGenerator.forBlock['pavibot_setup'] = function() {
  return `display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\ndisplay.clearDisplay();\ndisplay.setTextColor(SSD1306_WHITE);\n`;
};

CppGenerator.forBlock['pavibot_set_expression'] = function(block: Blockly.Block) {
  const expr = block.getFieldValue('EXPRESSION');
  return `drawPavibotExpression("${expr}"); // OLED Eye Expression\n`;
};

CppGenerator.forBlock['pavibot_show_menu'] = function(block: Blockly.Block) {
  const mode = block.getFieldValue('MODE');
  return `drawPavibotMenu("${mode}"); // OLED Menu Selection\n`;
};

CppGenerator.forBlock['pavibot_show_temp_hum'] = function() {
  return `float t = dht.readTemperature(); float h = dht.readHumidity();\ndisplay.clearDisplay(); display.setCursor(0,10);\ndisplay.print("Tem:"); display.print(t); display.println("C");\ndisplay.print("Hum:"); display.print(h); display.println("%");\ndisplay.display();\n`;
};

CppGenerator.forBlock['pavibot_run_stopwatch'] = function() {
  return `runPavibotStopwatch(); // OLED Stopwatch Timer\n`;
};

CppGenerator.forBlock['pavibot_set_torch'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  return `digitalWrite(2, ${state}); // Pavibot Torch Light\n`;
};

// --- 📡 ULTRASONIC RADAR (HC-SR04) GENERATORS ---
CppGenerator.forBlock['radar_setup'] = function(block: Blockly.Block) {
  const trig = block.getFieldValue('TRIG_PIN') || '5';
  const echo = block.getFieldValue('ECHO_PIN') || '18';
  return `pinMode(${trig}, OUTPUT); // TRIG\n  pinMode(${echo}, INPUT); // ECHO\n`;
};

CppGenerator.forBlock['radar_print_distance'] = function(block: Blockly.Block) {
  return `digitalWrite(5, LOW);\n  delayMicroseconds(2);\n  digitalWrite(5, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(5, LOW);\n  long duration = pulseIn(18, HIGH);\n  float distance = duration * 0.0343 / 2;\n  Serial.print("Distance: ");\n  Serial.print(distance);\n  Serial.println(" cm");\n`;
};

CppGenerator.forBlock['radar_check_obstacle'] = function(block: Blockly.Block) {
  const threshold = block.getFieldValue('THRESHOLD') || '20';
  return `digitalWrite(5, LOW);\n  delayMicroseconds(2);\n  digitalWrite(5, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(5, LOW);\n  long duration = pulseIn(18, HIGH);\n  float distance = duration * 0.0343 / 2;\n  if (distance < ${threshold}) {\n    Serial.println("🛑 OBSTACLE ALERT!");\n  }\n`;
};

// --- STANDARD BLOCKLY CONTROLS ---
CppGenerator.forBlock['controls_repeat_ext'] = function(block: Blockly.Block) {
  let repeats = '10';
  if (block.getInputTargetBlock('TIMES')) {
    // @ts-ignore
    repeats = CppGenerator.valueToCode(block, 'TIMES', CppGenerator.ORDER_NONE) || '10';
  }
  // @ts-ignore
  let branch = CppGenerator.statementToCode(block, 'DO');
  // @ts-ignore
  branch = CppGenerator.prefixLines(branch, '  ');
  let loopVar = Blockly.utils.idGenerator.genUid();
  return `for (int count_${loopVar} = 0; count_${loopVar} < ${repeats}; count_${loopVar}++) {\n${branch}}\n`;
};

CppGenerator.forBlock['math_number'] = function(block: Blockly.Block) {
  const code = String(block.getFieldValue('NUM'));
  // @ts-ignore
  return [code, CppGenerator.ORDER_ATOMIC];
};

export function generateCpp(workspace: Blockly.WorkspaceSvg) {
  if (!workspace) return '';
  const blocks = workspace.getAllBlocks(false);
  let setupCode = '';
  let servoInclude = false;
  let dhtInclude = false;
  let oledInclude = false;

  for (const block of blocks) {
    if (
      block.type === 'esp32_pin_setup' || 
      block.type === 'steering_setup' || 
      block.type === 'pavibot_setup' ||
      block.type === 'radar_setup' ||
      block.type === 'dht11_setup'
    ) {
      // @ts-ignore
      const code = CppGenerator.blockToCode(block, true);
      if (typeof code === 'string') {
        setupCode += '  ' + code;
      }
    }
    if (block.type === 'steering_setup' || block.type === 'servo_setup') servoInclude = true;
    if (block.type === 'dht11_setup' || block.type === 'pavibot_show_temp_hum') dhtInclude = true;
    if (block.type === 'pavibot_setup' || block.type === 'pavibot_set_expression') oledInclude = true;
  }

  // Generate main loop code starting from esp32_start
  let loopCode = '';
  const startBlock = workspace.getTopBlocks(true).find(b => b.type === 'esp32_start');
  if (startBlock) {
    let curr = startBlock.getNextBlock();
    while (curr) {
      if (
        curr.type !== 'esp32_pin_setup' && 
        curr.type !== 'steering_setup' && 
        curr.type !== 'pavibot_setup' &&
        curr.type !== 'radar_setup'
      ) {
        // @ts-ignore
        const code = CppGenerator.blockToCode(curr, true);
        if (typeof code === 'string') {
          loopCode += code;
        }
      }
      curr = curr.getNextBlock();
    }
  } else {
    // If no start block, fallback to workspace code
    // @ts-ignore
    loopCode = CppGenerator.workspaceToCode(workspace);
  }

  let includes = '';
  if (servoInclude) includes += `#include <ESP32Servo.h>\nServo steeringServo;\n`;
  if (dhtInclude) includes += `#include "DHT.h"\n#define DHTPIN 4\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n`;
  if (oledInclude) includes += `#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\n`;
  if (includes) includes += `\n`;

  return `// Auto-generated by Paviko Studio
${includes}void setup() {
  Serial.begin(115200);
${setupCode}}

void loop() {
${loopCode}}
`;
}
