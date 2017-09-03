import * as React from 'react';

interface State {
  y: number | null;
}

export default function withScrollSpy<P, S>(calculateY: (y: number) => number) {
  return function(
    Component:
      | React.ComponentClass<P & State>
      | React.StatelessComponent<P & State>,
  ): React.ComponentClass<P> {
    return class WrappedComponent extends React.Component<P, State> {
      state = { y: null };

      componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
      }

      private handleScroll = () => {
        const { y: oldY } = this.state;
        const newY = calculateY(window.pageYOffset);

        if (oldY == null || oldY !== newY) {
          this.setState({ y: newY });
        }
      };

      render() {
        return (
          <div>
            <Component {...this.props} {...this.state} />
          </div>
        );
      }
    };
  };
}
