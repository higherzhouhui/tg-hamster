import { getUserListReq, getUserInfoReq } from '@/api/common'
import { setUserInfoAction } from '@/redux/slices/userSlice'
import { formatNumber, stringToColor } from '@/utils/common'
import { List, InfiniteScroll } from 'antd-mobile'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import No1 from '@/assets/NO.1.png'
import No2 from '@/assets/NO.2.png'
import No3 from '@/assets/NO.3.png'
import './index.scss'
import BackTop from '@/components/BackTop'
import { useNavigate } from 'react-router-dom'

export default function LeaderBoardPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const [total, setTotal] = useState('10.00M')
  const [holderList, setHolderList] = useState<any[]>([])
  const [rank, setRank] = useState(1)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  async function loadMore() {
    const append = await getList()
    if (append?.code == 0) {
      if (page == 1) {
        if (append?.length < 20) {
          setHasMore(false)
        }
        setHolderList(append)
      } else {
        setHolderList(val => [...val, ...append])
        setHasMore(append?.length > 0)
      }
    }
  }
  const getList = async () => {
    const res = await getUserListReq({ page })
    setTotal(formatNumber(res.data.count))
    setPage((page => page + 1))
    setRank(res.data.rank)
    return res.data.rows
  }

  useEffect(() => {
    getUserInfoReq({}).then(res => {
      if (res.code == 0) {
        dispatch(setUserInfoAction(res.data.userInfo))
      }
    })
  }, [])

  return <div className="LeaderBoard fadeIn">
    <div className="title">Telegram Wall of Fame</div>
    <div className="myself" onClick={() => navigate('/detail?myself=true')}>
      <div className="left">
        <div className="icon" style={{ background: stringToColor(userInfo?.username) }}>
          {userInfo?.username?.slice(0, 2)}
        </div>
        <div className="name-score-warpper">
          <div className="name">{userInfo?.username}</div>
          <div className="name-score">{userInfo?.score?.toLocaleString()}&nbsp;Hamsters</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src={No1} alt="no1" /> : rank == 2 ? <img src={No2} alt="no2" /> : rank == 3 ? <img src={No3} alt="no3" /> : `#${rank}`
        }
      </div>
    </div>
    {/* <Button color="primary" style={{ margin: '1rem 0', width: '100%', fontWeight: 'bold' }}>
      <img src={bIcon} alt="star" width={16} height={16} style={{ marginRight: '1rem' }} />
      Boost score
    </Button> */}
    <div className="holders">
      <div className="holder-title">{total}&nbsp;holders</div>
      <List>
        {
          holderList.map((item, index) => {
            return <List.Item key={index}>
              <ListItem {...{ ...item, rank: index + 1 }} />
            </List.Item>
          })
        }
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  </div>

  function ListItem({ username, score, rank }: { username: string, score: number, rank: number }) {
    return <div className="holders-item">
      <div className="holders-left">
        <div className="icon" style={{ background: stringToColor(username) }}>
          {
            username.slice(0, 2)
          }
        </div>
        <div className="name-score-wrapper">
          <div className="name">{username}</div>
          <div className="name-score">{score.toLocaleString()}&nbsp;Hamsters</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src={No1} alt="no1" /> : rank == 2 ? <img src={No2} alt="no2" /> : rank == 3 ? <img src={No3} alt="no3" /> : `#${rank}`
        }
      </div>
      <BackTop scrollName='content' />
    </div>
  }
}