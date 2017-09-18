export type Color = 'primary' | 'danger' | 'default';

export default interface ThemeInterface {
  shared: {
    fontSize: string;
    marginBottom: string;
  };
  block: {
    padding: string;
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
  icon: Record<
    Color,
    {
      color: string;
    }
  >;
  button: Record<
    Color,
    {
      background: string;
      color: string;
    }
  >;
  goButton: {
    space: string;
  };
};
