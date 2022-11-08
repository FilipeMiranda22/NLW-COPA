declare module 'react-country-flag' {
  import * as React from 'react';
  export interface ReactCountryFlagProps {
    code: string;
  }
  export default class ReactCountryFlag extends React.Component<ReactCountryFlagProps, any> {}
}
