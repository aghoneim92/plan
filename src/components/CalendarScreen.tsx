import { Entypo } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StatusBar as RNStatusBar,
  useWindowDimensions,
} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import PlanItem from '../model/PlanItem';
import { theme } from '../../themes';
import CalendarView from './CalendarView';
import CurrentItem from './CurrentItem';
import { MainStackParamList } from './MainStack';
import { MAX_HEIGHT_DIFFERENCE } from './MAX_HEIGHT_DIFFERENCE';
import UpcomingItems from './UpcomingItems';
import useCurrentItem from '../hooks/useCurrentItem';
import useUpcomingItems from '../hooks/useUpcomingItems';
import { locale } from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { setDate } from 'date-fns';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${theme.background};
`;

const StyledSafeAreaView = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? RNStatusBar.currentHeight : 0}px;
`;

const Container = styled.View`
  align-items: flex-start;
`;

const MonthYearText = styled.Text`
  font-size: 24px;
  font-family: Poppins_700Bold;
  color: white;
  margin: 20px 30px;
`;

const StyledCalendarView = styled(CalendarView)``;

const PlanViewContainer = styled(Animated.View)`
  background-color: transparent;
  overflow: visible;
  flex: 1;
`;

const PlanView = styled(Animated.View)<{ centerVertically?: boolean }>`
  background-color: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 30px 20px 0;
  flex: 1;
  align-items: center;
  justify-content: ${props =>
    props.centerVertically ? 'center' : 'flex-start'};
`;

const AddButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${theme.background};
  align-items: center;
  justify-content: center;
`;

const NoItemsYetText = styled.Text`
  font-size: 16px;
  color: black;
  font-family: Poppins_400Regular;
`;

const monthYearFormat = new Intl.DateTimeFormat(locale, {
  month: 'long',
  year: 'numeric',
});

const TOP_HEIGHT = 40 * 7 + 20;

interface Props {
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

export default function CalendarScreen({ navigation }: Props) {
  const [date, setDateValue] = useState(new Date());
  const [heightDifference, setHeightDifference] = useState(0);
  const yRef = useRef(0);
  const { height } = useWindowDimensions();
  const bottomHeight = TOP_HEIGHT - height - 100;
  const currentItem = useCurrentItem();
  const upcomingItems = useUpcomingItems();
  const { t } = useTranslation();

  function move({
    nativeEvent: { velocityY, translationY },
  }: GestureEvent<PanGestureHandlerEventPayload>) {
    yRef.current = translationY;
    setHeightDifference(heightDifference => {
      const diff = heightDifference + 0.025 * velocityY;
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 0,
      });
      if (bottomHeight - diff > bottomHeight + MAX_HEIGHT_DIFFERENCE) {
        return -MAX_HEIGHT_DIFFERENCE;
      } else if (diff > 0) {
        return 0;
      }
      return diff;
    });
  }

  function handleGestureEnd() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 1000,
    });
    setHeightDifference(yRef.current < 0 ? -MAX_HEIGHT_DIFFERENCE : 0);
  }

  const handleEditItem = useCallback(
    (item: PlanItem) => {
      navigation.push('EditItem', item);
    },
    [navigation],
  );

  const handleAddItem = () =>
    navigation.push('AddItem', { date: date.getTime() });

  function handleSetDay(dayNumber: number) {
    setDateValue(date => setDate(date, dayNumber));
  }

  const noItems = !currentItem && !upcomingItems.length;

  return (
    <Wrapper>
      <StyledSafeAreaView>
        <Container>
          <MonthYearText>{monthYearFormat.format(date)}</MonthYearText>
          <StyledCalendarView
            date={date}
            heightDifference={heightDifference}
            style={{ height: TOP_HEIGHT + heightDifference }}
            setDay={handleSetDay}
          />
        </Container>
        <StatusBar style="light" />
      </StyledSafeAreaView>
      <PanGestureHandler onGestureEvent={move} onEnded={handleGestureEnd}>
        <PlanViewContainer>
          <PlanView centerVertically={noItems}>
            {noItems && <NoItemsYetText>{t('noItemsYet')}</NoItemsYetText>}
            {currentItem && (
              <CurrentItem
                item={currentItem}
                onEditItem={() => handleEditItem(currentItem)}
              />
            )}
            {upcomingItems.length > 0 && (
              <UpcomingItems
                items={upcomingItems}
                onEditItem={handleEditItem}
                onAddItem={handleAddItem}
              />
            )}
            <AddButton onPress={handleAddItem}>
              <Entypo name="plus" size={40} color="white" />
            </AddButton>
          </PlanView>
        </PlanViewContainer>
      </PanGestureHandler>
    </Wrapper>
  );
}
