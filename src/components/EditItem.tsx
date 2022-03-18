import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getHours, isBefore, setHours, setMinutes } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../themes';
import { MainStackParamList } from './MainStack';
import StyledSafeAreaView from './StyledSafeAreaView';
import Title from './Title';

const StyledTouchableOpacity = styled.TouchableOpacity`
  padding: 5px;
  margin-right: auto;
`;

const Container = styled.View`
  flex: 1;
  padding: 5px 30px;
`;

const TitleInputWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const TitleInput = styled.TextInput`
  font-size: 20px;
  font-family: Poppins_400Regular;
  padding: 10px 0;
  margin-top: 10px;
  color: white;
  border-bottom-color: ${theme.lightGray};
  border-bottom-width: 1px;
  text-align: right;
  flex: 1;
`;

const DateValue = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: white;
  font-family: Poppins_400Regular;
  text-align: left;
`;

const TimeRow = styled.View`
  flex-direction: row;
  margin-top: 20px;
  align-items: center;
`;

const TimePicker = styled(DateTimePicker)`
  min-width: 80px;
  color: white;
`;

const Dash = styled.Text`
  font-size: 16px;
  color: white;
  font-family: Poppins_400Regular;
  text-align: center;
`;

const AddButton = styled.TouchableOpacity`
  margin-top: 40px;
`;

const StyledLinearGradient = styled(LinearGradient)<{ disabled: boolean }>`
  border-radius: 15px;
  padding: 15px 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const DeleteButton = styled.TouchableOpacity`
  margin-top: 20px;
  border-radius: 15px;
  padding: 15px 0;
  background-color: #f95b5b;
`;

const AddButtonText = styled.Text`
  font-size: 16px;
  color: white;
  font-family: Poppins_400Regular;
  text-align: center;
`;

const StyledMaterialIcon = styled(MaterialIcons)`
  position: absolute;
  right: 0;
  bottom: 7px;
`;

const StyledMaterialCommunityIcon = styled(MaterialCommunityIcons)`
  position: absolute;
  right: 0;
  bottom: 7px;
`;

interface Props {
  navigation: NativeStackNavigationProp<MainStackParamList>;
  route: RouteProp<MainStackParamList, 'EditItem'>;
}

const format = new Intl.DateTimeFormat('ar', {
  weekday: 'long',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default function EditItem({ navigation, route }: Props) {
  const item = route.params!;
  const [startTime, setStartTime] = useState(new Date(item.startTime));
  const [endTime, setEndTime] = useState(new Date(item.endTime));
  const [title, setTitle] = useState(item.title);

  function handleStartTimeChange(_event: any, date?: Date) {
    if (date) {
      setStartTime(date);
      if (getHours(date) >= getHours(endTime)) {
        setEndTime(setHours(endTime, getHours(date) + 1));
      }
    }
  }

  function handleEndTimeChange(_event: any, date?: Date) {
    if (date) {
      setEndTime(date);
    }
  }

  async function save() {
    try {
      const collectionReference = collection(getFirestore(), 'plan-items');
      const document = doc(collectionReference, item.id);
      await updateDoc(document, {
        uid: getAuth().currentUser!.uid,
        title,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
      });
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem() {
    try {
      const document = doc(getFirestore(), 'plan-items', item.id);
      await deleteDoc(document);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  }

  const canSave = isBefore(startTime, endTime) && !!title;
  const isMosharka = title.includes('مشاركة');
  const isGroup = title.includes('جروب');

  return (
    <StyledSafeAreaView>
      <StyledTouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Feather name="chevron-right" color="white" size={30} />
      </StyledTouchableOpacity>
      <Container>
        <Title>تعديل المعاد</Title>
        <DateValue>{format.format(startTime)}</DateValue>
        <TitleInputWrapper>
          <TitleInput
            placeholder="عنوان"
            placeholderTextColor="rgb(200,200,200)"
            value={title}
            onChangeText={setTitle}
            underlineColorAndroid={theme.lightGray}
          />
          {isMosharka ? (
            <StyledMaterialIcon name="group" size={30} color="white" />
          ) : isGroup ? (
            <StyledMaterialCommunityIcon
              name="account-group"
              size={30}
              color="white"
            />
          ) : undefined}
        </TitleInputWrapper>
        <TimeRow>
          <TimePicker
            value={startTime}
            onChange={handleStartTimeChange}
            mode="time"
            themeVariant="dark"
            locale="ar"
          />
          <Dash> - </Dash>
          <TimePicker
            value={endTime}
            onChange={handleEndTimeChange}
            mode="time"
            themeVariant="dark"
            locale="ar"
          />
        </TimeRow>
        <AddButton disabled={!canSave} onPress={save}>
          <StyledLinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[theme.recoveryLightBlue, theme.recoveryBlue]}
            disabled={!canSave}
          >
            <AddButtonText>احفط</AddButtonText>
          </StyledLinearGradient>
        </AddButton>
        <DeleteButton onPress={deleteItem}>
          <AddButtonText>امسح</AddButtonText>
        </DeleteButton>
      </Container>
    </StyledSafeAreaView>
  );
}
