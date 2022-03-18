import { ReactNode } from 'react';
import { Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../themes';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0}px;
  background-color: ${theme.background};
`;

export default StyledSafeAreaView;
