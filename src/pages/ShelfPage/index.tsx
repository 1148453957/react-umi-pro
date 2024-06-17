import { base_info } from '@/api/base';
import {
  getCommendNovelListInstead,
  getNovelList,
  saveNovelList,
} from '@/api/novel';
import coverErrorUrl from '@/assets/img/pages/cover_bg.webp';
import shelfCheckUrl from '@/assets/img/pages/shelf_check.webp';
import shelfEditUrl from '@/assets/img/pages/shelf_edit.webp';
import shelfUncheckUrl from '@/assets/img/pages/shelf_uncheck.webp';
import { sendRBI } from '@/engine_sdk';
import { history } from '@umijs/max';
import { Carousel, Image, message } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';
sendRBI('XWEB_CLICK', {
  name: 'page_bookshelf_show',
  container: Cookies.get('userId'),
  fromSource: 'h5',
});
const ShelfPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [swipeList, setSwipeList] = useState<any[]>([]);
  const [shelfList, setShelfList] = useState<any[]>([]);
  const containerRef = useRef(null);
  const listItemRefs = useRef<any>({});
  let observeList: any = null;

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
    getNovelList({ baseInfo: base_info })
      .then((res: any) => {
        if (res.code === 0) {
          observeList = new IntersectionObserver(
            function (entries: any) {
              entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                  sendRBI('XWEB_CLICK', {
                    name: 'bookshelf_book_show',
                    container: Cookies.get('userId'),
                    type: entry.target.id.split('_')[1],
                  });
                }
              });
            },
            {
              root: containerRef.current,
            },
          );
          setShelfList(res.data);
          setTimeout(() => {
            Object.values(listItemRefs.current).forEach((item: any) => {
              observeList.observe(item);
            });
          });
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

  /**点击跳转至登录页
   * 编辑模式，切换勾选
   */
  const turnToRead = (item: any, from: string) => {
    if (isEdit) {
      if (bookCheckList.includes(item.bookId)) {
        setBookCheckList(bookCheckList.filter((e) => e != item.bookId));
      } else {
        setBookCheckList([...bookCheckList, item.bookId]);
      }
    } else {
      if (from === 'recommend') {
        sendRBI('XWEB_CLICK', {
          name: 'bookshelf_top_click',
          container: Cookies.get('userId'),
          type: item.bookId,
        });
      } else {
        sendRBI('XWEB_CLICK', {
          name: 'bookshelf_book_click',
          container: Cookies.get('userId'),
          type: item.bookId,
        });
      }
      history.push('/ReadPage', { bkid: item.bookId });
    }
  };
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
      <div className="shelf_container" ref={containerRef}>
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
                <div
                  key={item.bookId}
                  className="swipeItem"
                  onClick={() => turnToRead(item, 'recommend')}
                >
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

            <div className="list_box">
              {shelfList.map((item: any, index: number) => (
                <div
                  ref={(element) =>
                    (listItemRefs.current[item.bookId] = element)
                  }
                  key={index}
                  className="list_item"
                  onClick={() => turnToRead(item, 'list')}
                  id={'book_' + item.bookId}
                >
                  <div className="item_img">
                    <div className="img_cover">
                      <Image
                        src={item.cover}
                        preview={false}
                        fallback={coverErrorUrl}
                      />
                    </div>

                    {item.currentReadingChapterId > 1 && (
                      <div className="img_title">
                        {item.currentReadingChapterId}章/{item.chaptersCount}章
                      </div>
                    )}
                    {isEdit && bookCheckList.includes(item.bookId) && (
                      <img src={shelfCheckUrl} className="check" alt="" />
                    )}
                    {isEdit && !bookCheckList.includes(item.bookId) && (
                      <img src={shelfUncheckUrl} className="check" alt="" />
                    )}
                  </div>
                  <div className="item_describe">
                    <div className="item_title">{item.title}</div>
                    <div className="item_author">{item.protagonist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelfPage;
