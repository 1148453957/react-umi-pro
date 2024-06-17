import { base_info } from '@/api/base';
import { getCommendNovelListInstead, saveNovelList } from '@/api/novel';
import coverErrorUrl from '@/assets/img/pages/cover_bg.webp';
import shelfEditUrl from '@/assets/img/pages/shelf_edit.webp';
import { sendRBI } from '@/engine_sdk';
import { Carousel, Image, message } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './index.less';

const ShelfPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [swipeList, setSwipeList] = useState<any[]>([]);
  useEffect(() => {
    getCommendNovelListInstead({ pageSize: 10, baseInfo: base_info })
      .then((res: any) => {
        if (res.code === 0) {
          setSwipeList(res.data.tagNovelInfos);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        messageApi.error(error);
      });
  }, []);
  const pageChange = (index: number) => {
    sendRBI('XWEB_CLICK', {
      name: 'bookshelf_top_show',
      container: Cookies.get('userId'),
      type: swipeList[index].bookId,
    });
  };

  const [isEdit, setIsEdit] = useState(false);
  const [bookCheckList, setBookCheckList] = useState<any[]>([]);
  const [shelfList, setShelfList] = useState<any[]>([]);
  const clearEdit = () => {
    setIsEdit(false);
    setBookCheckList([]);
  };
  /**编辑书架，点击删除按钮 */
  const deleteList = () => {
    if (bookCheckList.length > 0) {
      let bookIds: string[] = [];
      shelfList.forEach((item) => {
        if (!bookCheckList.includes(item.bookId)) {
          bookIds.push(item.bookId);
        }
      });

      saveNovelList({
        base_info: base_info,
        bookIds,
      })
        .then((res: any) => {
          if (res.code === 0) {
            setShelfList(
              shelfList.filter((item) => !bookCheckList.includes(item.bookId)),
            );
            clearEdit();
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {
          messageApi.error(error);
        });
    } else {
      clearEdit();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="shelf_container">
        <div className="shelf_content">
          <div className="content_top">
            <Carousel
              className="swipe_box"
              autoplay
              autoplaySpeed={3000}
              afterChange={pageChange}
              dots={{
                className: 'dot_item',
              }}
            >
              {swipeList.map((item: any) => (
                <div key={item.bookId} className="swipeItem">
                  <div className="swiper_image">
                    <Image
                      src={item.cover}
                      preview={false}
                      fallback={coverErrorUrl}
                    />
                  </div>
                  <div className="swiper_right">
                    <div className="swiper_text top">{item.title}</div>
                    <div className="swiper_text center">{item.briefIntro}</div>
                    <div className="swiper_text bottom">
                      {item.subCateName} <span></span> {item.readers}人阅读
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="content_list">
            <div className="list_title">
              <span>我的书架</span>
              {!isEdit ? (
                <div className="edit_box" onClick={() => setIsEdit(true)}>
                  <img src={shelfEditUrl} /> 编辑书架
                </div>
              ) : (
                <div className="edit_box">
                  <span className="edit_btn" onClick={clearEdit}>
                    完成
                  </span>
                  <span className="edit_line"></span>
                  <span className="edit_btn" onClick={deleteList}>
                    删除
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelfPage;
