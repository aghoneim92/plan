import {
  eachDayOfInterval,
  endOfMonth,
  getDate,
  getDay,
  setDay,
  startOfMonth,
} from 'date-fns';
import { locale } from 'expo-localization';
import { ReactElement, useEffect, useRef } from 'react';
import { Easing, useWindowDimensions, ViewStyle, Animated } from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { theme } from '../../themes';
import { MAX_HEIGHT_DIFFERENCE } from './MAX_HEIGHT_DIFFERENCE';

const Container = styled.View`
  background-color: ${theme.background};
  overflow: hidden;
  width: 100%;
`;

const PADDING_HORIZONTAL = 20;
const DAY_CONTAINER_HEIGHT = 40;

const DayContainer = styled(Animated.View)<{
  selected: boolean;
  left: number;
  top: number;
  width: number;
  zIndex: number;
  circular: boolean;
}>`
  position: absolute;
  top: ${props => props.top}px;
  bottom: ${props => props.top + DAY_CONTAINER_HEIGHT}px;
  left: ${props => props.left}px;
  z-index: ${props => props.zIndex};
  width: ${props => props.width}px;
  height: ${DAY_CONTAINER_HEIGHT}px;
  align-items: center;
  justify-content: center;
`;

const Circle = styled(Animated.View)<{
  selected: boolean;
  left: number;
  top: number;
  width: number;
  zIndex: number;
  circular: boolean;
  expanded: boolean;
}>`
  position: absolute;
  top: ${props => (props.expanded ? props.top - 40 : props.top)}px;
  left: ${props => props.left}px;
  z-index: ${props => props.zIndex};
  width: ${props => props.width}px;
  height: ${props =>
    props.expanded ? DAY_CONTAINER_HEIGHT * 2 : DAY_CONTAINER_HEIGHT}px;
  border-radius: ${props =>
    props.circular ? (props.width + DAY_CONTAINER_HEIGHT) / 4 : 0}px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? 'rgb(109, 111, 115)' : theme.background};
`;

const DayLabel = styled.Text`
  font-size: 16px;
  color: white;
  font-family: Poppins_400Regular;
`;

interface Props {
  date: Date;
  style?: ViewStyle;
  heightDifference: number;
  setDay(dayNumber: number): void;
}

const weekdayFormat = new Intl.DateTimeFormat(locale, {
  weekday: locale.includes('ar') ? 'long' : 'narrow',
});
const numberFormat = new Intl.NumberFormat(locale);

const weekdays = Array(7)
  .fill(0)
  .map((_, index) => {
    const date = setDay(new Date(), index);
    return weekdayFormat.format(date);
  });

export default function CalendarView({
  date,
  style,
  heightDifference,
  setDay,
}: Props) {
  const dimensions = useWindowDimensions();
  const selectedMonthDay = getDate(date);
  const selectedWeekDay = getDay(date);
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const opacityRef = useRef(new Animated.Value(1));

  useEffect(() => {
    const newOpacity = 1 - Math.abs(heightDifference) / MAX_HEIGHT_DIFFERENCE;
    Animated.timing(opacityRef.current, {
      toValue: newOpacity,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [heightDifference]);

  const dates = eachDayOfInterval({ start, end });
  const selectedWeekRowMonthDays = dates
    .filter(date => {
      const monthDay = getDate(date);
      if (
        monthDay >= selectedMonthDay - selectedWeekDay &&
        monthDay <= selectedMonthDay + (6 - selectedWeekDay)
      ) {
        return true;
      }
    })
    .map(getDate);
  const [firstDay] = dates;
  const firstWeekday = getDay(firstDay);

  const elements: ReactElement[] = [];

  let i = 0;
  for (let row = 0; row < 7; row++) {
    for (let column = 0; column < 7; column++) {
      let label: string;
      let isCurrentDay = false;
      let isCurrentDayRow = false;
      let dayNumber = 0;
      if (row === 0) {
        label = weekdays[column];
      } else if (row === 1) {
        if (column < firstWeekday) {
          label = '';
        } else {
          const day = dates[i++];
          dayNumber = getDate(day);
          isCurrentDay = dayNumber === selectedMonthDay;
          isCurrentDayRow = selectedWeekRowMonthDays.includes(dayNumber);
          label = isNaN(dayNumber) ? '' : numberFormat.format(dayNumber);
        }
      } else {
        const day = dates[i++];
        dayNumber = getDate(day);
        isCurrentDay = dayNumber === selectedMonthDay;
        isCurrentDayRow = selectedWeekRowMonthDays.includes(dayNumber);
        label = isNaN(dayNumber) ? '' : numberFormat.format(dayNumber);
      }

      let top: number;
      const width = (dimensions.width - PADDING_HORIZONTAL * 2) / 7;
      top = row * DAY_CONTAINER_HEIGHT + (row === 0 ? 0 : heightDifference);
      if (top < DAY_CONTAINER_HEIGHT && isCurrentDayRow) {
        top = DAY_CONTAINER_HEIGHT;
      }
      const left = width * column;
      if (isCurrentDay) {
        elements.push(
          <Circle
            top={top}
            left={left + PADDING_HORIZONTAL}
            expanded={-heightDifference === MAX_HEIGHT_DIFFERENCE}
            width={width}
            style={{
              opacity: row === 0 || isCurrentDayRow ? 1 : opacityRef.current,
            }}
            zIndex={row === 0 || isCurrentDayRow ? 1 : 0}
            key={column + row * 7 + 100}
            selected={isCurrentDay}
            circular={row > 0}
          />,
        );
      }
      elements.push(
        <DayContainer
          top={top}
          left={left + PADDING_HORIZONTAL}
          width={width}
          style={{
            opacity: row === 0 || isCurrentDayRow ? 1 : opacityRef.current,
          }}
          zIndex={row === 0 ? 2 : isCurrentDayRow ? 1 : 0}
          key={column + row * 7}
          selected={false}
          circular={row > 0}
        >
          <TouchableOpacity
            style={{
              width: width,
              height: DAY_CONTAINER_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={
              (-heightDifference !== MAX_HEIGHT_DIFFERENCE && row === 0) ||
              isCurrentDay
            }
            onPress={() => setDay(dayNumber)}
          >
            <DayLabel>{label}</DayLabel>
          </TouchableOpacity>
        </DayContainer>,
      );
    }
  }

  return <Container style={style}>{elements}</Container>;
}
