import './index.scss'
import LOGO from '@/assets/logo.jpg'
export default function () {
  return <div className='begin-wrapper'>
    <img src={LOGO} alt="logo" />
    <span>Who are you dawg?</span>
  </div>
}