import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { memo } from 'react';
import { colors } from '../../utils/colors';
const SvgComponent = ({ focused }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} fill="none">
    <Path
      stroke={focused ? colors.primaryColor : '#B7B7B7'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.5 12.5c-2.21 1.333-5.792 1.333-8 0m11-6.29-5.333-4.148a2.666 2.666 0 0 0-3.274 0L2.559 6.21A2.665 2.665 0 0 0 1.53 8.315v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.2c0-.823-.38-1.6-1.03-2.105Z"
    />
  </Svg>
);
const HomeIcon = memo(SvgComponent);
export default HomeIcon;
