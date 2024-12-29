import { ReactElement } from 'react';

declare module 'styled-components' {
  export interface StyledComponent<T, S, O = never, A = never> {
    (props: O): ReactElement;
  }
}

declare module 'framer-motion' {
  export interface ForwardRefComponent<T, P> {
    (props: P): ReactElement;
  }
} 