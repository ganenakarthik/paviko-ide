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

// --- 🚨 LIGHTHOUSE GENERATORS ---
CppGenerator.forBlock['lighthouse_setup'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `pinMode(${pin}, OUTPUT);\n`;
};

CppGenerator.forBlock['lighthouse_beacon_on'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `digitalWrite(${pin}, HIGH);\n`;
};

CppGenerator.forBlock['lighthouse_beacon_off'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `digitalWrite(${pin}, LOW);\n`;
};

CppGenerator.forBlock['lighthouse_set_brightness'] = function(block: Blockly.Block) {
  const brightness = block.getFieldValue('BRIGHTNESS');
  const pwm = Math.round((Number(brightness) / 100) * 255);
  return `analogWrite(2, ${pwm}); // Lighthouse brightness\n`;
};

// --- 🚂 ULTRASONIC TRAIN GENERATORS ---
CppGenerator.forBlock['train_setup'] = function(block: Blockly.Block) {
  const motor = block.getFieldValue('MOTOR_PIN');
  const trig = block.getFieldValue('TRIG_PIN');
  const echo = block.getFieldValue('ECHO_PIN');
  return `pinMode(${motor}, OUTPUT);\npinMode(${trig}, OUTPUT);\npinMode(${echo}, INPUT);\n`;
};

CppGenerator.forBlock['train_motor_move'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  const val = state === 'STOP' ? 'LOW' : 'HIGH';
  return `digitalWrite(12, ${val}); // Train Motor ${state}\n`;
};

CppGenerator.forBlock['train_read_distance'] = function() {
  // @ts-ignore
  return [`readUltrasonicDistance(4, 5)`, CppGenerator.ORDER_ATOMIC];
};

CppGenerator.forBlock['train_check_obstacle'] = function(block: Blockly.Block) {
  const dist = block.getFieldValue('DISTANCE');
  return `if (readUltrasonicDistance(4, 5) < ${dist}) {\n  digitalWrite(12, LOW); // Emergency Stop Train!\n}\n`;
};

// --- 🚦 TRAFFIC LIGHT GENERATORS ---
CppGenerator.forBlock['traffic_setup'] = function(block: Blockly.Block) {
  const red = block.getFieldValue('RED_PIN');
  const yellow = block.getFieldValue('YELLOW_PIN');
  const green = block.getFieldValue('GREEN_PIN');
  return `pinMode(${red}, OUTPUT);\npinMode(${yellow}, OUTPUT);\npinMode(${green}, OUTPUT);\n`;
};

CppGenerator.forBlock['traffic_set_red'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  return `digitalWrite(4, ${state}); // RED Light\n`;
};

CppGenerator.forBlock['traffic_set_yellow'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  return `digitalWrite(2, ${state}); // YELLOW Light\n`;
};

CppGenerator.forBlock['traffic_set_green'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  return `digitalWrite(5, ${state}); // GREEN Light\n`;
};

// --- 🤖 SERVO ARM GENERATORS ---
CppGenerator.forBlock['servo_setup'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `myServo.attach(${pin}); // Servo Arm Motor Setup\n`;
};

CppGenerator.forBlock['servo_set_angle'] = function(block: Blockly.Block) {
  const angle = block.getFieldValue('ANGLE');
  return `myServo.write(${angle}); // Rotate Servo Arm\n`;
};

CppGenerator.forBlock['servo_sweep'] = function() {
  return `for (int pos = 0; pos <= 180; pos += 10) {\n  myServo.write(pos);\n  delay(15);\n}\nfor (int pos = 180; pos >= 0; pos -= 10) {\n  myServo.write(pos);\n  delay(15);\n}\n`;
};

// --- 🌡️ DHT11 WEATHER STATION GENERATORS ---
CppGenerator.forBlock['dht11_setup'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `dht.begin(); // Setup DHT11 on Pin ${pin}\n`;
};

CppGenerator.forBlock['dht11_read_temp'] = function() {
  // @ts-ignore
  return [`dht.readTemperature()`, CppGenerator.ORDER_ATOMIC];
};

CppGenerator.forBlock['dht11_read_humidity'] = function() {
  // @ts-ignore
  return [`dht.readHumidity()`, CppGenerator.ORDER_ATOMIC];
};

CppGenerator.forBlock['dht11_print_temp'] = function() {
  return `float temp = dht.readTemperature();\nSerial.print("Temperature: "); Serial.print(temp); Serial.println(" °C");\n`;
};

CppGenerator.forBlock['dht11_print_humidity'] = function() {
  return `float hum = dht.readHumidity();\nSerial.print("Humidity: "); Serial.print(hum); Serial.println("%");\n`;
};

CppGenerator.forBlock['dht11_print_readings'] = function() {
  return `float temp = dht.readTemperature();\nfloat hum = dht.readHumidity();\nSerial.print("Temperature: "); Serial.print(temp); Serial.print(" °C | Humidity: "); Serial.print(hum); Serial.println("%");\n`;
};

CppGenerator.forBlock['dht11_alert_high_temp'] = function(block: Blockly.Block) {
  const limit = block.getFieldValue('TEMP_LIMIT');
  const pin = block.getFieldValue('ALARM_PIN');
  return `if (dht.readTemperature() > ${limit}) {\n  digitalWrite(${pin}, HIGH); // Overheat Alarm/Fan ON!\n} else {\n  digitalWrite(${pin}, LOW);\n}\n`;
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
  let dhtPin = '4';

  for (const block of blocks) {
    if (
      block.type === 'esp32_pin_setup' || 
      block.type === 'lighthouse_setup' || 
      block.type === 'train_setup' || 
      block.type === 'traffic_setup' || 
      block.type === 'servo_setup' ||
      block.type === 'dht11_setup'
    ) {
      // @ts-ignore
      const code = CppGenerator.blockToCode(block, true);
      if (typeof code === 'string') {
        setupCode += '  ' + code;
      }
    }
    if (block.type === 'servo_setup') servoInclude = true;
    if (block.type === 'dht11_setup') {
      dhtInclude = true;
      dhtPin = block.getFieldValue('PIN') || '4';
    }
  }

  // Generate main loop code starting from esp32_start
  let loopCode = '';
  const startBlock = workspace.getTopBlocks(true).find(b => b.type === 'esp32_start');
  if (startBlock) {
    let curr = startBlock.getNextBlock();
    while (curr) {
      if (
        curr.type !== 'esp32_pin_setup' && 
        curr.type !== 'lighthouse_setup' && 
        curr.type !== 'train_setup' && 
        curr.type !== 'traffic_setup' && 
        curr.type !== 'servo_setup' &&
        curr.type !== 'dht11_setup'
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
  if (servoInclude) includes += `#include <ESP32Servo.h>\nServo myServo;\n`;
  if (dhtInclude) includes += `#include "DHT.h"\n#define DHTPIN ${dhtPin}\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n`;
  if (includes) includes += `\n`;

  return `// Auto-generated by Paviko Studio
${includes}void setup() {
  Serial.begin(115200);
${setupCode}}

void loop() {
${loopCode}}
`;
}
