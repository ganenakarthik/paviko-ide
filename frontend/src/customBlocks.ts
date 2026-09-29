import * as Blockly from 'blockly';

export function defineCustomBlocks() {
  Blockly.defineBlocksWithJsonArray([
    // --- GENERAL / BASE ESP32 BLOCKS ---
    {
      "type": "esp32_start",
      "message0": "⚡ when ESP32 starts",
      "nextStatement": null,
      "style": "pin_blocks",
      "tooltip": "Entry point for your ESP32 program"
    },
    {
      "type": "esp32_pin_setup",
      "message0": "⚡ set GPIO pin %1 as OUTPUT",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["18", "18"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "math_blocks"
    },
    {
      "type": "esp32_led_on",
      "message0": "☀️ turn LED ON • on pin %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "esp32_led_off",
      "message0": "🌙 turn LED OFF • on pin %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "esp32_wait",
      "message0": "🕒 wait %1 second(s)",
      "args0": [
        {
          "type": "field_number",
          "name": "SECONDS",
          "value": 1,
          "min": 0.1,
          "precision": 0.1
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    },

    // --- 🚨 LIGHTHOUSE PROJECT BLOCKS ---
    {
      "type": "lighthouse_setup",
      "message0": "🚨 Setup Lighthouse Beacon Lamp on Pin %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["Pin 2 (Main Beacon)", "2"], ["Pin 4 (Aux Flash)", "4"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "lighthouse_beacon_on",
      "message0": "☀️ Turn Lighthouse Beacon ON (Pin %1)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["Pin 2", "2"], ["Pin 4", "4"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "lighthouse_beacon_off",
      "message0": "🌙 Turn Lighthouse Beacon OFF (Pin %1)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["Pin 2", "2"], ["Pin 4", "4"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "lighthouse_set_brightness",
      "message0": "💡 Set Lighthouse Beacon Brightness %1 %%",
      "args0": [
        {
          "type": "field_number",
          "name": "BRIGHTNESS",
          "value": 100,
          "min": 0,
          "max": 100
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },

    // --- 🚂 ULTRASONIC TRAIN PROJECT BLOCKS ---
    {
      "type": "train_setup",
      "message0": "🚂 Setup Train Motor (Pin %1) & Radar (TRIG %2, ECHO %3)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "MOTOR_PIN",
          "options": [["Pin 12 (Motor)", "12"], ["Pin 14", "14"]]
        },
        {
          "type": "field_dropdown",
          "name": "TRIG_PIN",
          "options": [["Pin 4", "4"], ["Pin 2", "2"]]
        },
        {
          "type": "field_dropdown",
          "name": "ECHO_PIN",
          "options": [["Pin 5", "5"], ["Pin 18", "18"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "train_motor_move",
      "message0": "🚂 Drive Train %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "STATE",
          "options": [["FORWARD ⚡", "FORWARD"], ["BACKWARD ⏪", "BACKWARD"], ["STOP 🛑", "STOP"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "train_read_distance",
      "message0": "📡 Read Ultrasonic Radar Distance (cm)",
      "output": "Number",
      "style": "math_blocks"
    },
    {
      "type": "train_check_obstacle",
      "message0": "🛑 IF Obstacle Closer Than %1 cm THEN Stop Train",
      "args0": [
        {
          "type": "field_number",
          "name": "DISTANCE",
          "value": 20,
          "min": 5,
          "max": 100
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    },

    // --- 🚦 TRAFFIC LIGHT PROJECT BLOCKS ---
    {
      "type": "traffic_setup",
      "message0": "🚦 Setup Traffic Lights (RED: %1, YELLOW: %2, GREEN: %3)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "RED_PIN",
          "options": [["Pin 4", "4"], ["Pin 2", "2"]]
        },
        {
          "type": "field_dropdown",
          "name": "YELLOW_PIN",
          "options": [["Pin 2", "2"], ["Pin 4", "4"]]
        },
        {
          "type": "field_dropdown",
          "name": "GREEN_PIN",
          "options": [["Pin 5", "5"], ["Pin 13", "13"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "traffic_set_red",
      "message0": "🔴 Turn RED Light %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "STATE",
          "options": [["ON", "HIGH"], ["OFF", "LOW"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "traffic_set_yellow",
      "message0": "🟡 Turn YELLOW Light %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "STATE",
          "options": [["ON", "HIGH"], ["OFF", "LOW"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "traffic_set_green",
      "message0": "🟢 Turn GREEN Light %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "STATE",
          "options": [["ON", "HIGH"], ["OFF", "LOW"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },

    // --- 🤖 SERVO ARM PROJECT BLOCKS ---
    {
      "type": "servo_setup",
      "message0": "🤖 Setup Servo Arm Motor on Pin %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["Pin 13", "13"], ["Pin 18", "18"], ["Pin 14", "14"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "servo_set_angle",
      "message0": "🔄 Rotate Servo Arm to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "ANGLE",
          "value": 90,
          "min": 0,
          "max": 180,
          "precision": 1
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "servo_sweep",
      "message0": "🌊 Wave Servo Arm (Sweep 0° ↔ 180°)",
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    },

    // --- 🌡️ DHT11 WEATHER STATION PROJECT BLOCKS ---
    {
      "type": "dht11_setup",
      "message0": "🌡️ Setup DHT11 Temp & Humidity Sensor on Pin %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PIN",
          "options": [["Pin 4", "4"], ["Pin 15", "15"], ["Pin 13", "13"], ["Pin 27", "27"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "dht11_read_temp",
      "message0": "🌡️ Read Temperature (°C)",
      "output": "Number",
      "style": "math_blocks"
    },
    {
      "type": "dht11_read_humidity",
      "message0": "💧 Read Humidity (%)",
      "output": "Number",
      "style": "math_blocks"
    },
    {
      "type": "dht11_print_temp",
      "message0": "🌡️ Print Temperature (°C) to Serial Monitor",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "dht11_print_humidity",
      "message0": "💧 Print Humidity (%) to Serial Monitor",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "dht11_print_readings",
      "message0": "📺 Print DHT11 Temp & Humidity to Serial Monitor",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "dht11_alert_high_temp",
      "message0": "🔥 IF Temp > %1 °C THEN Turn Fan/Alarm ON (Pin %2)",
      "args0": [
        {
          "type": "field_number",
          "name": "TEMP_LIMIT",
          "value": 30,
          "min": 0,
          "max": 60
        },
        {
          "type": "field_dropdown",
          "name": "ALARM_PIN",
          "options": [["Pin 2", "2"], ["Pin 4", "4"], ["Pin 5", "5"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    }
  ]);
}
