import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlanItem from '../model/PlanItem';
import AddItem from './AddItem';
import CalendarScreen from './CalendarScreen';
import EditItem from './EditItem';

export type MainStackParamList = {
  Main: undefined;
  AddItem: { date: number };
  EditItem: PlanItem;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={CalendarScreen} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="EditItem" component={EditItem} />
    </Stack.Navigator>
  );
}
