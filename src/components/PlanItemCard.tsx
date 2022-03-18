import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import PlanItem from '../model/PlanItem';
import { theme } from '../../themes';
import { locale } from 'expo-localization';

interface Props {
  item: PlanItem;
  style?: ViewStyle;
  onEditItem(): void;
}

const Container = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: ${theme.recoveryBlueTransparent};
  padding: 20px;
  width: 100%;
  margin: 10px 0;
`;

const Title = styled.Text`
  font-family: Poppins_700Bold;
  font-size: 16px;
  color: white;
  text-align: left;
`;

const TimeRange = styled.Text`
  font-family: Poppins_400Regular;
  font-size: 16px;
  color: white;
  text-align: left;
  margin-top: 10px;
`;

const format = new Intl.DateTimeFormat(locale, { timeStyle: 'short' });

export default function PlanItemCard({ item, style, onEditItem }: Props) {
  const { title, startTime, endTime } = item;
  return (
    <Container onPress={onEditItem} style={style}>
      <Title>{title}</Title>
      <TimeRange>
        {format.format(startTime)} - {format.format(endTime)}
      </TimeRange>
    </Container>
  );
}
