import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  BREAKPOINT_SIZE_XS,
  BREAKPOINT_SIZE_SM,
  BREAKPOINT_SIZE_MD,
  BREAKPOINT_SIZE_LG,
  BREAKPOINT_SIZE_XL,
} from '../../../utils/breakpoints/constants';
import { BreakpointSize } from '../../../utils/breakpoints/types';

export interface WithScreenSize {
  screenSize: BreakpointSize;
}

const withScreenSize = (WrappedComponent: any) => {
  return (props: IDictionary) => {
    let screenSize: BreakpointSize = BREAKPOINT_SIZE_XL;
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.only(BREAKPOINT_SIZE_XS));
    const isSM = useMediaQuery(theme.breakpoints.only(BREAKPOINT_SIZE_SM));
    const isMD = useMediaQuery(theme.breakpoints.only(BREAKPOINT_SIZE_MD));
    const isLG = useMediaQuery(theme.breakpoints.only(BREAKPOINT_SIZE_LG));

    if (isXS) {
      screenSize = BREAKPOINT_SIZE_XS;
    } else if (isSM) {
      screenSize = BREAKPOINT_SIZE_SM;
    } else if (isMD) {
      screenSize = BREAKPOINT_SIZE_MD;
    } else if (isLG) {
      screenSize = BREAKPOINT_SIZE_LG;
    }

    return <WrappedComponent {...props} screenSize={screenSize} />;
  };
};

export { withScreenSize };
