import * as StyledComponents from 'styled-components';
import {
  ThemedStyledComponentsModule,
  ThemedStyledProps,
} from 'styled-components';

import Theme from './ThemeInterface';

type Color = 'primary' | 'default';

// FIXME: Workaround for styled-components@v2.0.1
// ref. https://github.com/styled-components/styled-components/issues/890#issuecomment-307261950
const {
  ThemeProvider,
  css,
  default: styled,
  injectGlobal,
  keyframes,
  withTheme,
} = (StyledComponents as ThemedStyledComponentsModule<
  any
>) as ThemedStyledComponentsModule<Theme>;

export type ThemedProps<P = {}> = ThemedStyledProps<P, Theme>;

export { css, injectGlobal, keyframes, ThemeProvider, withTheme, Theme, Color };
export default styled;
