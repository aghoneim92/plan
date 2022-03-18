import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useTime, MINUTES } from 'react-time-sync';
import PlanItem from '../model/PlanItem';

export default function useCurrentItem() {
  const time = useTime({ unit: 30, interval: MINUTES });
  const [item, setItem] = useState<PlanItem>();

  useEffect(() => {
    const coll = collection(getFirestore(), 'plan-items');
    const q = query(
      coll,
      where('uid', '==', getAuth().currentUser!.uid),
      where('startTime', '<=', time * 1000),
      orderBy('startTime', 'desc'),
      limit(1),
    );

    return onSnapshot(
      q,
      snapshot => {
        const found = snapshot.docs.find(
          doc => (doc.data() as PlanItem).endTime >= time * 1000,
        );
        setItem(found?.data() as PlanItem);
      },
      console.error.bind(console),
    );
  }, [time]);

  return item;
}
