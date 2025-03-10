// 定義事件介面
export type Event = {
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  summary: string;
  colorId?: string;
  extendedProperties: {
    shared: {
      phone: string;
      crowdSize: string;
      name: string;
      email: string;
      eventDescription: string;
    };
  };
};
