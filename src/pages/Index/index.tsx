import './index.scss';
import '@/trackers'
import { FC, useEffect, useState } from 'react';
import Begin from '@/components/Begin';
import Home from '@/components/Home';
import NewUser from '@/components/NewUser';
import EventBus from '@/utils/eventBus';
import { useSelector } from 'react-redux';


export const IndexPage: FC = () => {
  const eventBus = EventBus.getInstance();
  const [step, setStep] = useState(1)
  const [newUserStep, setNewUserStep] = useState(0)
  const userInfo = useSelector((state: any) => state.user.info);

  useEffect(() => {
    if (userInfo.is_New) {
      setStep(2)
    } else {
      setStep(0)
    }
  }, [])

  useEffect(() => {
    const onMessage = (index: number) => {
      setStep(index)
      if (index == 2) {
        setNewUserStep(2)
      }
    }
    eventBus.addListener('updateStep', onMessage)
  }, [])
  return (
    <div>
      {
        step == 1 ? <Begin /> : step == 2 ? <NewUser cStep={newUserStep} /> : <Home />
      }
    </div>
  )
}

export default IndexPage
