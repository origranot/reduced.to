interface IProduceOptions {
  stationName: string;
  producerName: string;
  message: any;
}

export class MemphisServiceMock {
  private stations: Map<string, any[]>;

  constructor() {
    this.stations = new Map();
  }

  produce(options: IProduceOptions) {
    const { stationName, producerName, message } = options;
    if (this.stations.has(stationName)) {
      const queue = this.stations.get(stationName);
      queue?.push({ producerName, message });
    }
  }
}
