import ThemeInterface from '../styles/ThemeInterface';

const Theme: ThemeInterface = {
  shared: {
    fontSize: '1.6rem',
    marginBottom: '1.6rem',
  },
  navBar: {
    default: {
      color: '#c8cfef',
      heightPx: 44,
      compactHeightPx: 32,
    },
  },
  dropDown: {
    default: {
      color: '#111',
    },
  },
  timeLabel: {
    fontSize: '1.2rem',
  },
  icon: {
    primary: {
      color: '#112ca5',
    },
    default: {
      color: '#666',
    },
  },
  button: {
    primary: {
      background: '#112ca5',
      color: '#111111',
    },
    default: {
      background: '#666',
      color: '#e8f8ff',
    },
  },
  goButton: {
    space: '0.8rem',
  },
};

export default Theme;
