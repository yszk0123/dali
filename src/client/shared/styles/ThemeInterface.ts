export default interface ThemeInterface {
  shared: {
    fontSize: string;
    marginBottom: string;
  };
  navBar: {
    default: {
      color: string;
      heightPx: number;
      compactHeightPx: number;
    };
  };
  dropDown: {
    default: {
      color: string;
    };
  };
  timeLabel: {
    fontSize: string;
  };
  icon: {
    primary: {
      color: string;
    };
    default: {
      color: string;
    };
  };
  button: {
    primary: {
      background: string;
      color: string;
    };
    default: {
      background: string;
      color: string;
    };
  };
  goButton: {
    space: string;
  };
};
