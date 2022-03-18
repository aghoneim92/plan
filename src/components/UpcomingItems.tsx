import { View, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../themes';
import PlanItem from '../model/PlanItem';
import PlanItemCard from './PlanItemCard';

const Label = styled.Text`
  color: black;
  font-family: Poppins_700Bold;
  font-size: 16px;
  text-align: left;
`;

const Container = styled.TouchableOpacity`
  align-items: center;
  justify-content: ${props => (props.disabled ? 'flex-start' : 'center')};
  margin-top: 10px;
  height: 200px;
`;

const SeeMoreButton = styled.TouchableOpacity`
  margin-top: 10px;
  padding: 10px;
  background-color: ${theme.lightGray};
  width: 100%;
`;

const SeeMoreText = styled.Text`
  font-size: 16px;
  font-family: Poppins_400Regular;
  color: white;
  text-align: center;
`;

interface Props {
  style?: ViewStyle;
  items: PlanItem[];
  onAddItem(): void;
  onEditItem(item: PlanItem): void;
}

export default function UpcomingItems({
  style,
  items,
  onAddItem,
  onEditItem,
}: Props) {
  return (
    <View style={style}>
      <Label>مواعيدك القادمة</Label>
      <Container disabled={items.length > 0} onPress={onAddItem}>
        {items.length > 0 &&
          items
            .slice(0, 2)
            .map(item => (
              <PlanItemCard
                onEditItem={() => onEditItem(item)}
                key={item.id}
                item={item}
              />
            ))}
        {items.length === 3 && (
          <SeeMoreButton>
            <SeeMoreText>المزيد</SeeMoreText>
          </SeeMoreButton>
        )}
      </Container>
    </View>
  );
}
