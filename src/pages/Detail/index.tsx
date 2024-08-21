import { InfiniteScroll, List } from 'antd-mobile'
import './index.scss'
import { useEffect, useState } from 'react'
import { getMyScoreHistoryReq, getSubUserListReq } from '@/api/common'
import { useLocation } from 'react-router-dom'
import { stringToColor } from '@/utils/common'
import moment from 'moment'
import BackTop from '@/components/BackTop'

function FrensDetailPage() {
  const [list, setList] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const myLocation = useLocation()
  const [isMyself, setIsMyself] = useState(false)

  const getList = async (mySelf: boolean) => {
    let res: any
    if (mySelf) {
      res = await getMyScoreHistoryReq({ page })
    } else {
      res = await getSubUserListReq({ page })
    }
    setPage((page => page + 1))
    return res.data.rows
  }
  const getType = (type: string) => {
    if (type == 'register') {
      type = 'Inviting'
    }
    if (type == 'sign') {
      type = 'Checking In'
    }
    if (type == 'play_game_reward_parent') {
      type = 'Drop Game'
    }
    if (type == 'play_game_reward') {
      type = 'Drop Game'
    }
    if (type == 'harvest_farming') {
      type = 'Farming'
    }
    if (type == 'share_playGame') {
      type = 'Share Game'
    }
    return type
  }
  async function loadMore() {
    const search = myLocation.search
    let isMyself = false
    if (search) {
      if (search.includes('myself')) {
        isMyself = true
      }
    }


    const append = await getList(isMyself)
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setList(append)
    } else {
      setList((val: any) => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  useEffect(() => {
    const search = myLocation.search
    if (search) {
      const _total = search.replace('?total=', '') as any
      if (_total) {
        setTotal(_total)
      }
      if (search.includes('myself')) {
        setIsMyself(true)
      } else {
        setIsMyself(false)
      }
    }

  }, [])

  return <div className="frens-detail-page">
    <div className="frens-title">
      {
        isMyself ? <span>My Scores</span> : <span>{total}&nbsp;frens</span>
      }
    </div>
    <List>
      {
        list.map((item: any, index: number) => {
          return <List.Item key={index}>
            <div className='frens-list'>
              <div className='frens-detail-left'>
                <div className='score'>+&nbsp;{item.score.toLocaleString()}</div>
                <div className='frens-detail-time'>{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div className='frens-detail-right'>
                <div className='by-user'>
                  by<div className="user-icon" style={{ background: stringToColor(item.from_username) }}>
                    {item.from_username.slice(0, 2)}
                  </div>
                  <div className='frens-detail-name'>{item.from_username}</div>

                </div>
                <div className='type'>{getType(item.type)}</div>
              </div>
            </div>
          </List.Item>
        })
      }
    </List>
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    <BackTop scrollName={'content'} />

  </div>
}

export default FrensDetailPage