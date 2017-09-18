import { ThemeInterface } from '../styles';

const Theme: ThemeInterface = {
  shared: {
    fontSize: '1.6rem',
    marginBottom: '1.6rem',
  },
  block: {
    padding: '16px',
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
    danger: {
      color: '#ea1212',
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
    danger: {
      background: '#ea1212',
      color: '#f8f8ff',
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
