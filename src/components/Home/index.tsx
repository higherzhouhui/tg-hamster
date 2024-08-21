import EventBus from "@/utils/eventBus";
import './index.scss'
import { useEffect, useState } from "react";
import starIcon from '@/assets/h-star.png'
import checkIcon from '@/assets/h-right.png'
import friendsIcon from '@/assets/h-friends.png'
import gameIcon from '@/assets/game.png'
import taskIcon from '@/assets/task.png'
import walletIcon from '@/assets/wallet.png'
import { Button, Swiper, Toast } from "antd-mobile";
import { judgeIsCheckIn } from '@/utils/common'
import { useDispatch, useSelector } from "react-redux";
import { getUserInfoReq, userCheckReq, bindWalletReq } from "@/api/common";
import { initUtils } from '@telegram-apps/sdk-react';
import { setUserInfoAction } from "@/redux/slices/userSlice";
import LogoIcon from '@/assets/logo.jpg'
import { TonConnectButton, useTonConnectModal, useTonWallet } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

export default function () {
  const userInfo = useSelector((state: any) => state.user.info);
  return <main>
    <Home userInfo={userInfo} />
  </main>
}

function Home({ userInfo }: { userInfo: any }) {
  const eventBus = EventBus.getInstance()
  const utils = initUtils();
  const [loading, setLoading] = useState(false)
  const wallet = useTonWallet()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleToScore = async () => {
    eventBus.emit('updateStep', 2)
  }
  const handleCheckIn = async () => {
    if (judgeIsCheckIn(userInfo?.check_date)) {
      return
    }
    setLoading(true)
    const res = await userCheckReq()
    if (res.code == 0) {
      Toast.show({
        icon: 'success',
        content: 'Congratulations check-in successful',
        duration: 3000,
      })
      dispatch(setUserInfoAction(res.data))
    }
    setLoading(false)
  }

  const handlePlayGame = () => {
    if (userInfo?.playGameTimes > 0) {
      navigate('/emjoyGame')
    } else {
      Toast.show({
        content: 'The number of times today has been used up',
        duration: 3000,
      })
    }
  }
  useEffect(() => {
    if (wallet?.account) {
      bindWalletReq({ wallet: wallet?.account?.address }).then(res => {
        dispatch(setUserInfoAction(res.data))
      })
    }
  }, [wallet])
  return <div className="home fadeIn">
    <div className="top" onClick={() => handleToScore()}>
      <div className="top-inner">
        {videoIcon}
        <span>Your Score</span>
      </div>
    </div>
    <div className="logo">
      <img src={LogoIcon} alt="logo" style={{ width: '30vw', objectFit: 'contain' }} />
      <Button className="sign" onClick={() => handleCheckIn()} size="small" loading={loading}>
        {judgeIsCheckIn(userInfo?.check_date) ? 'checked' : 'Check In'}
      </Button>
    </div>
    <div className="score">
      {userInfo?.score?.toLocaleString()}
      <div style={{ fontSize: '1.5rem', opacity: 0.8, lineHeight: '24px' }}>Hamsters</div>
    </div>
    <div className="wallet">
      {/* <Button color="default" style={{ width: '100%', borderRadius: '10px', fontWeight: 'bold' }} onClick={() => handleConnect()}>

        {
          wallet?.account ? formatWalletAddress(wallet?.account?.publicKey) :
            <div className="connect">
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4695" width="20" height="20"><path d="M128 341.333333C55.466667 341.333333 0 285.866667 0 213.333333s55.466667-128 128-128c25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 170.666667 128 170.666667C102.4 170.666667 85.333333 187.733333 85.333333 213.333333s17.066667 42.666667 42.666667 42.666667c25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 341.333333 128 341.333333z" p-id="4696" fill="#2c2c2c"></path><path d="M128 938.666667c-72.533333 0-128-55.466667-128-128 0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667c0 25.6 17.066667 42.666667 42.666667 42.666667 25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 938.666667 128 938.666667z" p-id="4697" fill="#2c2c2c"></path><path d="M981.333333 938.666667 128 938.666667c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667l810.666667 0L938.666667 341.333333 128 341.333333C102.4 341.333333 85.333333 324.266667 85.333333 298.666667s17.066667-42.666667 42.666667-42.666667l853.333333 0c25.6 0 42.666667 17.066667 42.666667 42.666667l0 597.333333C1024 921.6 1006.933333 938.666667 981.333333 938.666667z" p-id="4698" fill="#2c2c2c"></path><path d="M896 341.333333c-25.6 0-42.666667-17.066667-42.666667-42.666667L853.333333 170.666667 128 170.666667C102.4 170.666667 85.333333 153.6 85.333333 128s17.066667-42.666667 42.666667-42.666667l768 0c25.6 0 42.666667 17.066667 42.666667 42.666667l0 170.666667C938.666667 324.266667 921.6 341.333333 896 341.333333z" p-id="4699" fill="#2c2c2c"></path><path d="M42.666667 853.333333c-25.6 0-42.666667-17.066667-42.666667-42.666667L0 213.333333c0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667l0 597.333333C85.333333 836.266667 68.266667 853.333333 42.666667 853.333333z" p-id="4700" fill="#2c2c2c"></path><path d="M768 597.333333m-85.333333 0a2 2 0 1 0 170.666667 0 2 2 0 1 0-170.666667 0Z" p-id="4701" fill="#2c2c2c"></path></svg>
              Connect Wallet
            </div>
        }
      </Button> */}
      <TonConnectButton className="connect-btn" />
    </div>
    <div className="wrapper">
      <Swiper autoplay loop>
        <Swiper.Item key={1}>
          <div className="community">
            <div className="Hamsters-com">Hamster COMMUNITY</div>
            <div className="home-tg">Home for Telegram OGs</div>
            <div className="join-btn" onClick={() => {
              utils.openTelegramLink('https://t.me/hamstermemedapp')
            }}>Join 💰</div>
            <div className="heart">💖</div>
          </div>
        </Swiper.Item>
        <Swiper.Item key={2}>
          <div className="community">
            <div className="Hamsters-com">FOLOW US ON X.COM</div>
            <div className="home-tg">stay updated with the latest news</div>
            <div className="join-btn" onClick={() => {
              window.open('https://x.com/Hamster_meme_')
            }}>Follow 🐹</div>
            <div className="heart">💥</div>
          </div>
        </Swiper.Item>
      </Swiper>
      {/* <div onClick={() => handlePlayGame()} className="earn-more">
        <span>Play Game</span>
        <span>
          {userInfo?.playGameTimes}
        </span>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2129" width="16" height="16"><path d="M934.24704 556.56l57.296 57.304c43.488 43.488 31.64 116.648-23.392 144.16l-470.752 235.376-4.272 4.272c-35.096 35.096-92.208 35.096-127.304 0l-42.424-42.424-0.008-0.008-0.016-0.008-84.856-84.864a30.016 30.016 0 0 1 0-42.432 29.984 29.984 0 0 0 0-42.432 29.984 29.984 0 0 0-42.432 0 30.016 30.016 0 0 1-42.432 0L68.78304 700.632 26.34304 658.2c-35.096-35.096-35.096-92.208 0-127.304L530.91104 26.32c35.104-35.096 92.208-35.096 127.304 0l127.312 127.312a30 30 0 0 1 0 42.432 30.04 30.04 0 0 0 0 42.432 30.04 30.04 0 0 0 42.432 0 30 30 0 0 1 42.432 0l127.312 127.304c35.096 35.104 35.096 92.208 0 127.304l-63.456 63.456zM657.27104 365.4a30 30 0 0 1 0 42.432l-24.64 24.64c9.28 18.72 13.24 41.456 11.056 66.584a30 30 0 1 1-59.784-5.2c2.136-24.584-5.16-42.656-20.032-49.584a30.112 30.112 0 0 0-33.904 6 30.04 30.04 0 0 0 0 42.432 89.416 89.416 0 0 1 26.368 63.648c0 24.04-9.36 46.648-26.368 63.648a89.856 89.856 0 0 1-102.448 17.584l-24.856 24.856a30 30 0 1 1-42.432-42.432l24.712-24.72c-7.32-14.72-11.408-31.928-11.704-50.792a30 30 0 0 1 29.52-30.48h0.488a30 30 0 0 1 29.992 29.536c0.32 20.336 8.264 35.144 21.784 40.616 11.2 4.544 23.96 1.952 32.504-6.592a29.808 29.808 0 0 0 8.8-21.224c0-8.008-3.128-15.544-8.8-21.216-35.096-35.096-35.096-92.208 0-127.304a90.312 90.312 0 0 1 101.688-17.952c0.264 0.12 0.504 0.248 0.768 0.376l24.848-24.856a30 30 0 0 1 42.44 0z m-206.576 589.84l504.568-504.56a30.04 30.04 0 0 0 0-42.44l-21.216-21.216-63.648 63.648a30 30 0 1 1-42.44-42.432l63.656-63.648-46.048-46.048c-32.784 15.696-74.256 10.608-102.48-17.608-28.256-28.256-33.28-69.744-17.608-102.48l-46.04-46.048-63.656 63.656a30 30 0 1 1-42.432-42.432l63.648-63.656-21.216-21.216a30.04 30.04 0 0 0-42.432 0L68.78304 573.328a30.04 30.04 0 0 0 0 42.44l21.216 21.216 63.656-63.656a30 30 0 1 1 42.432 42.432l-63.656 63.656 46.04 46.04c32.784-15.696 74.264-10.608 102.48 17.616 28.24 28.24 33.304 69.712 17.616 102.48l46.04 46.04 63.656-63.656a30 30 0 1 1 42.432 42.44l-63.648 63.648 21.216 21.216a30.04 30.04 0 0 0 42.432 0z m490.624-250.88c18.328-9.176 22.296-33.56 7.792-48.064l-57.304-57.296-260.216 260.216 309.728-154.864zM785.92704 492.696a30 30 0 0 1 0 42.432L701.06304 620.008a30 30 0 1 1-42.432-42.44l84.864-84.864a30 30 0 0 1 42.432 0zM616.19104 662.44a30 30 0 0 1 0 42.44L531.31904 789.744a30 30 0 1 1-42.432-42.432l84.872-84.872a30 30 0 0 1 42.432 0zM531.31904 238.096a30 30 0 0 1 0 42.432L446.44704 365.4A30 30 0 1 1 404.02304 322.96l84.872-84.864a30 30 0 0 1 42.432 0zM361.58304 407.832a30 30 0 0 1 0 42.432l-84.872 84.88a30 30 0 1 1-42.432-42.44L319.14304 407.84a30 30 0 0 1 42.44 0z" fill="#000000" p-id="2130"></path></svg>
      </div> */}
      <div className="reward">
        Your rewards
      </div>
      <div className="list">
        <div className="left">
          <div className="img-wrapper"><img src={starIcon} alt="star" /></div>
          <span>Account Age</span></div>
        <div className="right">+{userInfo?.account_age_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
      </div>
      {
        userInfo?.invite_friends_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={friendsIcon} alt="star" /></div>
            <span>Invited Friends</span></div>
          <div className="right">+{userInfo?.invite_friends_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo?.game_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={gameIcon} alt="star" /></div>
            <span>Play Game</span></div>
          <div className="right">{userInfo.game_score > 0 ? `+${userInfo.game_score}` : userInfo.game_score}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo?.check_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={taskIcon} alt="star" /></div>
            <span>Daily Check-in</span></div>
          <div className="right">+{userInfo.check_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo?.bind_wallet_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={walletIcon} alt="star" /></div>
            <span>Connect Wallet</span></div>
          <div className="right">+{userInfo.bind_wallet_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      <div className="list">
        <div className="left">
          <div className="img-wrapper"><img src={checkIcon} alt="star" /></div>
          <span>Telegram Premium</span></div>
        <div className="right">{userInfo?.telegram_premium ? `+${userInfo?.telegram_premium}` : 0}&nbsp;<span className="unit">Hamsters</span></div>
      </div>
    </div>
  </div>
}


var videoIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22188" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M509.866667 32C245.333333 32 32 247.466667 32 512s213.333333 480 477.866667 480c264.533333 0 477.866667-215.466667 477.866666-480S774.4 32 509.866667 32z m0 896C281.6 928 96 742.4 96 512S281.6 96 509.866667 96 923.733333 281.6 923.733333 512s-185.6 416-413.866666 416z" fill="#ffffff" p-id="22189"></path><path d="M433.066667 354.133333c-6.4-4.266667-17.066667 0-17.066667 10.666667V661.333333c0 8.533333 8.533333 14.933333 17.066667 10.666667l234.666666-149.333333c6.4-4.266667 6.4-14.933333 0-19.2l-234.666666-149.333334z" fill="#ffffff" p-id="22190"></path></svg>

