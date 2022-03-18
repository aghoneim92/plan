import { useTranslation } from 'react-i18next';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import PlanItem from '../model/PlanItem';
import PlanItemCard from './PlanItemCard';

interface Props {
  style?: ViewStyle;
  item: PlanItem;
  onEditItem(): void;
}

const CurrentItemText = styled.Text`
  font-family: Poppins_400Regular;
  color: black;
  font-size: 16px;
`;

export default function CurrentItem({ item, style, onEditItem }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <CurrentItemText>{t('currentItem')}</CurrentItemText>
      <PlanItemCard onEditItem={() => onEditItem()} style={style} item={item} />
    </>
  );
}
