import { useEffect, useState } from 'react';
import './index.scss'
import { throttle } from '@/utils/common';

function BackTop({ scrollName }: { scrollName: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // 判断是否显示回到顶部按钮
  const toggleVisibility = () => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]
    if (layoutElement) {
      if (layoutElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false)
    }
  };

  // 滚动事件监听器
  useEffect(() => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]
    if (layoutElement) {
      layoutElement.addEventListener('scroll', throttle(toggleVisibility, 500))
    }
    return () => {
      layoutElement.removeEventListener('scroll', throttle(toggleVisibility, 500));
    };
  }, []);

  // 点击按钮回到顶部
  const scrollToTop = () => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]

    layoutElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return <div className='back-top' onClick={() => scrollToTop()} style={{ display: isVisible ? 'block' : 'none' }}>
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4666" width="24" height="24"><path d="M580.405461 213.560934l324.669474 324.694033c23.082718 23.055089 60.916395 23.210631 84.179214-0.051165 23.393803-23.420409 23.261797-60.943001 0.025583-84.153632L556.623825 21.36561c-12.208043-12.177344-28.520567-17.953907-44.62843-17.277502-16.10684-0.676405-32.422434 5.100158-44.614104 17.277502L34.725384 454.051193c-23.237237 23.210631-23.381523 60.733223 0.024559 84.153632 23.252587 23.25975 61.099566 23.106254 84.166935 0.051165l330.23626-330.263889 0 746.606249c0 36.116569 29.378098 65.36573 65.626673 65.36573 36.509519 0 65.62565-29.249161 65.62565-65.36573L580.405461 213.560934 580.405461 213.560934z" p-id="4667" fill="#f4ea2a"></path></svg>
  </div>
}

export default BackTop