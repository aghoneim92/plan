import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { SimpleAnimation } from 'react-native-simple-animations';
import { useTime, MINUTES } from 'react-time-sync';
import styled from 'styled-components/native';
import Container from './Container';
import CurrentItem from './CurrentItem';
import { MainStackParamList } from './MainStack';
import StyledSafeAreaView from './StyledSafeAreaView';
import Title from './Title';
import { Entypo } from '@expo/vector-icons';
import UpcomingItems from './UpcomingItems';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../themes';
import PlanItem from '../model/PlanItem';

const TextColumn = styled.View``;

const GreetingText = styled.Text`
  font-size: 20px;
  font-family: Poppins_700Bold;
  color: white;
  margin: 10px 0 20px;
  text-align: left;
`;

const IMAGE_HEIGHT = 150;

const Image = styled.Image`
  height: ${IMAGE_HEIGHT}px;
  margin: 20px 0;
  flex: 1;
`;

const StyledCurrentItem = styled(CurrentItem)`
  margin-top: 20px;
`;

const StyledUpcomingItems = styled(UpcomingItems)`
  margin-top: 20px;
`;

const PlusButton = styled.TouchableOpacity``;

const StyledLinearGradient = styled(LinearGradient)`
  border-radius: 30px;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const monthYearFormat = new Intl.DateTimeFormat('ar', {
  weekday: 'long',
  month: 'long',
  year: 'numeric',
  day: 'numeric',
});

interface Props {
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

const GOOD_MORNING = 'صباح الخير';
const GOOD_EVENING = 'مساء الخير';

export default function MainScreen({ navigation }: Props) {
  const time = useTime({ unit: 1, interval: MINUTES });

  const timeOfDay = format(time * 1000, 'B', { locale: ar });
  // TODO: customize saba7 w masa2 el 5eer w moon w sun based on particular time of day not just am/pm
  const greetingText = timeOfDay.includes('صباح') ? GOOD_MORNING : GOOD_EVENING;

  const onAddItem = useCallback(() => {
    navigation.push('AddItem', { date: time * 1000 });
  }, [navigation, time]);

  const onEditItem = useCallback(
    (item: PlanItem) => {
      navigation.push('EditItem', item);
    },
    [navigation],
  );

  return (
    <StyledSafeAreaView>
      <Container>
        <SimpleAnimation
          delay={500}
          duration={1000}
          fade
          movementType="slide"
          direction="down"
          distance={10}
          style={{ flexDirection: 'row' }}
        >
          <TextColumn>
            <Title>{monthYearFormat.format(time * 1000)}</Title>
            <GreetingText>{greetingText}!</GreetingText>
          </TextColumn>
          <Image
            source={
              timeOfDay.includes('المساء') || timeOfDay.includes('الليل')
                ? require('../assets/moon.png')
                : require('../assets/sun.png')
            }
            height={IMAGE_HEIGHT}
            resizeMode="contain"
          />
        </SimpleAnimation>
        <SimpleAnimation
          delay={1000}
          duration={1000}
          fade
          movementType="slide"
          direction="up"
          distance={10}
        >
          <StyledCurrentItem onEditItem={onEditItem} />
          <StyledUpcomingItems onEditItem={onEditItem} onAddItem={onAddItem} />
        </SimpleAnimation>
        <SimpleAnimation
          delay={1000}
          duration={1000}
          fade
          movementType="slide"
          direction="up"
          distance={20}
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <PlusButton onPress={onAddItem}>
            <StyledLinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={[theme.recoveryLightBlue, theme.recoveryBlue]}
            >
              <Entypo name="plus" size={40} color="white" />
            </StyledLinearGradient>
          </PlusButton>
        </SimpleAnimation>
      </Container>
      <StatusBar style="light" />
    </StyledSafeAreaView>
  );
}
