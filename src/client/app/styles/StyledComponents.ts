import * as StyledComponents from 'styled-components';
import {
  ThemedStyledComponentsModule,
  ThemedStyledProps,
} from 'styled-components';

import ThemeInterface from './ThemeInterface';

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
>) as ThemedStyledComponentsModule<ThemeInterface>;

export type ThemedProps<P> = ThemedStyledProps<P, ThemeInterface>;

export { css, injectGlobal, keyframes, ThemeProvider, withTheme };
export default styled;
