import { base_info } from '@/api/base';
import { getVideoList } from '@/api/novel';
import coverErrorUrl from '@/assets/img/pages/cover_bg.webp';
import { history, useLocation } from '@umijs/max';
import { Image, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';

const VideoPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(true);
  const [videoList, setVideoList] = useState([]);
  const location = useLocation();
  console.log(11111, location);

  useEffect(() => {
    getVideoList({
      baseInfo: base_info,
      pageNum: 1,
      pageSize: 999,
    }).then((res: any) => {
      setLoading(false);
      if (res.code === 0) {
        setVideoList(res.data.list);
      } else {
        messageApi.error(res.message);
      }
    });
  }, []);

  function turnToPlay(item: any) {
    // history.push('/PlayPage?query=' + item.bookId + '&url=' + encodeURIComponent(item.url) );
    history.push(
      { pathname: '/PlayPage' },
      { bkid: item.bookId, url: item.url },
    );
  }
  return (
    <>
      {contextHolder}

      <div className="content">
        <div className="mine-top"></div>
        <div className="list_container">
          {loading && <Spin tip="加载中..." fullscreen />}
          {!loading && (
            <div className="list_box">
              {videoList.map((item: any, index: number) => (
                <div
                  key={index}
                  className="list_item"
                  onClick={() => turnToPlay(item)}
                >
                  <div className="img_cover">
                    <Image
                      src={item.coverUrl}
                      preview={false}
                      fallback={coverErrorUrl}
                    />
                  </div>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoPage;
