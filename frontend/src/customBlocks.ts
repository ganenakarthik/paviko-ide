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

    // --- 🚗 STEERING PROJECT BLOCKS ---
    {
      "type": "steering_setup",
      "message0": "🚗 Setup Steering Servo (Pin %1) & Motor (Pin %2)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "SERVO_PIN",
          "options": [["Pin 13", "13"], ["Pin 18", "18"]]
        },
        {
          "type": "field_dropdown",
          "name": "MOTOR_PIN",
          "options": [["Pin 12", "12"], ["Pin 14", "14"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "steering_set_angle",
      "message0": "🔄 Turn Steering Wheel to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "ANGLE",
          "value": 90,
          "min": 0,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "steering_drive_motor",
      "message0": "🏎️ Drive Steering Motor %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "STATE",
          "options": [["FORWARD ⚡", "FORWARD"], ["REVERSE ⏪", "REVERSE"], ["STOP 🛑", "STOP"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "steering_brake",
      "message0": "🛑 Emergency Brake Steering System",
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    },

    // --- 🤖 PAVIBOT CUBE COMPANION BLOCKS ---
    {
      "type": "pavibot_setup",
      "message0": "🤖 Setup Pavibot OLED Display (SDA %1, SCL %2)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "SDA_PIN",
          "options": [["Pin 21", "21"], ["Pin 4", "4"]]
        },
        {
          "type": "field_dropdown",
          "name": "SCL_PIN",
          "options": [["Pin 22", "22"], ["Pin 5", "5"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "pavibot_set_expression",
      "message0": "👁️ Display Eye Expression %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "EXPRESSION",
          "options": [
            ["HAPPY 😀", "HAPPY"],
            ["ANGRY 😠", "ANGRY"],
            ["BLINK 👁️", "BLINK"],
            ["SLEEP 😴", "SLEEP"],
            ["CHEERFUL 🌟", "CHEERFUL"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "pavibot_show_menu",
      "message0": "📋 Display Menu Mode %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "MODE",
          "options": [
            ["EMO MODE", "EMO MODE"],
            ["TEMP MODE", "TEMP MODE"],
            ["GAME", "GAME"],
            ["STOPWATCH", "STOPWATCH"],
            ["TORCH", "TORCH"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    },
    {
      "type": "pavibot_show_temp_hum",
      "message0": "🌡️ Show Temp & Humidity on Pavibot OLED",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "pavibot_run_stopwatch",
      "message0": "⏱️ Run Pavibot Stopwatch Timer",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "pavibot_set_torch",
      "message0": "💡 Turn Pavibot OLED Torch %1",
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

    // --- 📡 ULTRASONIC RADAR (HC-SR04) BLOCKS ---
    {
      "type": "radar_setup",
      "message0": "📡 Setup HC-SR04 Radar (TRIG Pin %1, ECHO Pin %2)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TRIG_PIN",
          "options": [["Pin 5", "5"], ["Pin 4", "4"], ["Pin 2", "2"]]
        },
        {
          "type": "field_dropdown",
          "name": "ECHO_PIN",
          "options": [["Pin 18", "18"], ["Pin 19", "19"], ["Pin 12", "12"]]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "pin_blocks"
    },
    {
      "type": "radar_print_distance",
      "message0": "📡 Measure & Print Radar Distance (cm) to Serial",
      "previousStatement": null,
      "nextStatement": null,
      "style": "timing_blocks"
    },
    {
      "type": "radar_check_obstacle",
      "message0": "🛑 Check Obstacle Alert if Distance < %1 cm",
      "args0": [
        {
          "type": "field_number",
          "name": "THRESHOLD",
          "value": 20,
          "min": 2,
          "max": 400
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "logic_blocks"
    }
  ]);
}
