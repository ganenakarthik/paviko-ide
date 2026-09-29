// Web Serial API Wrapper for Paviko Studio

export class SerialMonitor {
  private port: any = null;
  private reader: any = null;
  private keepReading = true;
  private onDataCallback: ((data: string) => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  async requestPort() {
    if (!('serial' in navigator)) {
      throw new Error("Web Serial API not supported in this browser. Please use Chrome or Edge.");
    }
    // @ts-ignore
    this.port = await navigator.serial.requestPort();
    
    // Listen for physical disconnects
    // @ts-ignore
    navigator.serial.addEventListener('disconnect', (e) => {
      if (e.target === this.port && this.onDisconnectCallback) {
        this.onDisconnectCallback();
        this.disconnect();
      }
    });
  }

  async connect(baudRate: number = 115200) {
    if (!this.port) throw new Error("No port selected");
    await this.port.open({ baudRate });
    this.keepReading = true;
    this.readLoop();
  }

  async disconnect() {
    this.keepReading = false;
    if (this.reader) {
      await this.reader.cancel();
    }
    if (this.port) {
      await this.port.close();
    }
    this.port = null;
  }

  onData(callback: (data: string) => void) {
    this.onDataCallback = callback;
  }

  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  private async readLoop() {
    while (this.port?.readable && this.keepReading) {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          if (this.onDataCallback && value) {
            this.onDataCallback(value);
          }
        }
      } catch (error) {
        console.error("Serial Read Error:", error);
      } finally {
        this.reader.releaseLock();
      }
    }
  }
}

export const serialManager = new SerialMonitor();
