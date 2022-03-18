import { endOfDay } from 'date-fns';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MINUTES, useTime } from 'react-time-sync';
import PlanItem from '../model/PlanItem';

export default function useUpcomingItems() {
  const time = useTime({ unit: 30, interval: MINUTES });
  const [items, setItems] = useState<PlanItem[]>([]);

  useEffect(() => {
    const planItemsRef = collection(getFirestore(), 'plan-items');
    const end = endOfDay(time * 1000);
    const q = query(
      planItemsRef,
      where('uid', '==', getAuth().currentUser!.uid),
      where('startTime', '>', time * 1000),
      where('startTime', '<=', end.getTime()),
      orderBy('startTime'),
      limit(3),
    );

    return onSnapshot(
      q,
      snapshot => {
        setItems(snapshot.docs.map(doc => doc.data() as PlanItem));
      },
      console.error.bind(console),
    );
  }, [time]);

  return items;
}
