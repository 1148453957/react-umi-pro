import { appId, base_info } from '@/api/base';
import { chapterSave, getNovelDetail } from '@/api/novel';
import { relationTask } from '@/api/task';
import { encryptData } from '@/assets/js/utils';
import { ge, sendRBI } from '@/engine_sdk';
import { useSearchParams } from '@umijs/max';
import { message } from 'antd';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
let db: any;
const ReadPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const containerRef = useRef(null);

  let [searchParams] = useSearchParams();
  let bookId = searchParams.get('bkid')!;
  const [initLoading, setInitLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterTitle, setChapterTitle] = useState('');
  /**整本书是否已经买断了 */
  const [isHas, setIsHas] = useState(0);
  /**往上滚要读的章节id */
  let chapterIdTop = 'min';
  /**往下滚要读的章节id，接下来要去读的,还没有加载的*/

  let chapterIdBottom = 'min';
  /**当前的章节id，可能加载了10-20章的书，但是又回滚到了第15章 */

  const [chapterIdCurrent, setChapterIdCurrent] = useState(1);
  /**不知道为啥，这个监听函数会在observe刚加上对象的时候就触发
   * 初始加载的时候，加载前后三章
   * 所以会先滚上去显示前一章，之后再滚回来，这次显示是不应该记录的
   * 之后的正常滚动加载上一章，是肯定露出来的，需要记录
   * 假如当前章是 2，加载 123，先显示2然后显示1再自动滚到了2
   * 所以初始加载的时候，跳过1的那次触发 */

  let oldChapterIdTop: any, observeList: any;
  /**正在读的章节，可能跨章所以是数组
   * 用于记录滚动位置和30分钟的阅读上报 */
  let chapterReadingArr: number[] = [],
    /**记录已经阅读过的章节，用于打点上报 */
    chapterAlreadyReadArr: Set<string> = new Set(),
    /**记录翻了多少页 */
    pageAlreadyReadCount = 0;

  /**只有真正的读到了才接口上报，不然不上报 */
  let chapterSaveSet = new Set();
  let continueReadingTaskDone = false;
  /**成就任务，连续阅读,每天上报一次
   * 中断了要传参表示中断，并重新开始， */

  /**任务上报 */
  function relationTaskFn(relation: string, content?: any) {
    return relationTask({
      p: encryptData(base_info),
      m: 'FqnbXeWN8ugtp4JxWIvuXIGdWQI2T2a%2BhpyfuzhpXJLtoqj2KjQNSzDQhNxaNsG0ta8o9Y9hAqJFNT425CAQ%2FpCWIqisi7tXFBbWorVLDm9f5toYh1oU25SZQtYOiMRTzSDLAwK58G0%3D',
      version: '1.0',
      appId: +appId,
      token: uuidv4(),
      relation,
      content,
    });
  }
  async function continueReadingTask() {
    continueReadingTaskDone = true;
    let continuous_reading_10: string[] = [],
      addDate = dayjs(new Date()).format('YYYY/MM/DD');

    if (localStorage.getItem(Cookies.get('userId') + 'continuous_reading_10')) {
      let arr = JSON.parse(
        localStorage.getItem(Cookies.get('userId') + 'continuous_reading_10')!,
      );

      if (arr && Array.isArray(arr)) {
        continuous_reading_10 = arr;
      }
    }
    // 阅读中断了的话，要重新开始
    if (!continuous_reading_10.includes(addDate)) {
      if (continuous_reading_10.length === 0) {
        // 加入第一条数据

        await relationTaskFn('continuous_reading_10');

        continuous_reading_10.push(addDate);
        localStorage.setItem(
          Cookies.get('userId') + 'continuous_reading_10',
          JSON.stringify(continuous_reading_10),
        );
      } else {
        // 判断新增的时间和上次的时间，是不是只差一天

        if (
          new Date(dayjs(new Date()).format('YYYY/MM/DD')).getTime() -
            new Date(continuous_reading_10.at(-1) as string).getTime() ===
          24 * 60 * 60 * 1000
        ) {
          // 只差一天
          await relationTaskFn('continuous_reading_10');

          continuous_reading_10.push(addDate);
          localStorage.setItem(
            Cookies.get('userId') + 'continuous_reading_10',
            JSON.stringify(continuous_reading_10),
          );
        } else {
          // 断开了,要重置
          await relationTaskFn('continuous_reading_10', {
            answerResult: false,
          });
          continuous_reading_10 = [addDate];
          localStorage.setItem(
            Cookies.get('userId') + 'continuous_reading_10',
            JSON.stringify(continuous_reading_10),
          );
        }
      }
    }
  }
  let multipleBooksTaskDone = false;

  /**成就任务，阅读多本书 */
  async function multipleBooksTask() {
    multipleBooksTaskDone = true;
    let reading_multiple_books_3: string[] = [];
    if (
      localStorage.getItem(Cookies.get('userId') + 'reading_multiple_books_3')
    ) {
      let arr = JSON.parse(
        localStorage.getItem(
          Cookies.get('userId') + 'reading_multiple_books_3',
        )!,
      );

      if (arr && Array.isArray(arr)) {
        reading_multiple_books_3 = arr;
      }
    }

    if (
      reading_multiple_books_3.length < 3 &&
      !reading_multiple_books_3.includes(bookId)
    ) {
      await relationTaskFn('reading_multiple_books_3');

      reading_multiple_books_3.push(bookId);

      localStorage.setItem(
        Cookies.get('userId') + 'reading_multiple_books_3',
        JSON.stringify(reading_multiple_books_3),
      );
    }
  }
  /** 区分读上一章还是下一章,读下一章是push，读上一章是unshift
   * 获取单章小说的章节内容
   * 第一次根据url请求对应的txt文件，存在indexdb
   * 后续都从indexdb读取, */
  async function getNovelContentItem(type: string) {
    return new Promise<void>((resolve, reject) => {
      let item;
      if (type === 'before') {
        if (chapterIdTop == 'min') {
          // 已经加载了第一章，不做任何操作
          resolve();
          return;
        }

        item = chapters.filter((e: any) => e.chapterId == chapterIdTop)[0];
      } else {
        if (chapterIdBottom == 'max') {
          // 已经加载到了最后一章
          sendRBI('XWEB_SHOW', {
            name: 'behind_download_show',
            container: Cookies.get('userId'),
            type: bookId,
          });
          resolve();

          return;
        }

        item = chapters.filter((e: any) => e.chapterId == chapterIdBottom)[0];
      }
      // 整本书买断、免费、已购买、直接请求，
      // 没买的时候，只显示第一页

      try {
        getContent(resolve, reject, type, item);
      } catch (error) {
        updateContent(resolve, type, item, ['当前章节内容加载出错']);
      }
      setInitLoading(false);

      if (isHas == 0 && item.status == 1 && item.isPay == 0) {
        BuyContent(type, item);
      }
    });
  }
  const getData = async () => {
    let {
      data: { code, data, message },
    } = await getNovelDetail({
      baseInfo: base_info,
      bookId,
      version: 0,
    }).catch((error) => {
      if (error.message.includes('timeout')) {
        return { data: { code: 'timeout', message: '请求超时，请稍候重试' } };
      } else {
        return { data: { code: 'error', message: '未知错误，请稍候重试' } };
      }
    });

    if (code != 0) {
      messageApi.error(message);
      setInitLoading(false);
      return;
    } else {
      setBookInfo(data);
      data.chapters.sort((a: any, b: any) => a.chapterId - b.chapterId);
      setChapters(data.chapters);
      setIsHas(data.isHas);
      chapterIdTop = 'min';
      chapterIdBottom = chapters[0].chapterId || 'max';

      if (
        localStorage.getItem(bookId + 'Version') &&
        localStorage.getItem(bookId + 'Version') != data.version
      ) {
        // 获取事务
        let transaction = db.transaction(['novelContent'], 'readwrite'),
          // 获取集合
          dbStore = transaction.objectStore('novelContent');
        // 版本不一致，就清空数据库，重新请求接口
        dbStore.clear();
      }
      localStorage.setItem(bookId + 'Version', data.version);
      let scrollTop = 0,
        index = 0;

      if (
        localStorage.getItem(
          Cookies.get('userId') + 'NovelScrollTopWith' + bookId,
        )
      ) {
        // 滚动后会记录滚动轴位置，并恢复上次的定位
        let obj = JSON.parse(
          localStorage.getItem(
            Cookies.get('userId') + 'NovelScrollTopWith' + bookId,
          )!,
        );
        scrollTop = +obj.scrollTop;
        setChapterIdCurrent(+obj.chapterId);
        index = chapters.findIndex((e: any) => e.chapterId == obj.chapterId);

        if (index == -1) {
          index = 0;
        }

        chapterIdTop = chapters[index - 1]?.chapterId || 'min';
        chapterIdBottom = chapters[index].chapterId;
      }

      oldChapterIdTop = chapterIdTop;

      sendRBI('XWEB_CLICK', {
        name: 'reader_enter_exit_page',
        type: bookId,
        from: chapterIdCurrent,
        style: 1,
        container: chapters[index].status + 1,
        position: Cookies.get('userId'),
      });

      const scrollId = bookId + '_' + chapterIdCurrent;

      observeList = new IntersectionObserver(
        function (entries: any) {
          // 好像是因为操作了dom的原因？所以entries不是所有的监听元素，而是哪个监听元素触发了出现或者消失
          for (const entry of entries) {
            let chapterId = entry.target.id.split('_')[1];

            if (entry.isIntersecting) {
              if (oldChapterIdTop != 'min' && oldChapterIdTop == chapterId) {
                continue;
              }

              chapterReadingArr.push(+chapterId);
              chapterAlreadyReadArr.add(chapterId);

              const item = chapters.filter(
                (e: any) => e.chapterId == chapterId,
              )[0];
              // 阅读记录，显示出来的时候，才进行的操作
              if (!chapterSaveSet.has(chapterId)) {
                chapterSaveSet.add(chapterId);
                chapterSave({
                  bookId,
                  baseInfo: base_info,
                  chapterId: item.chapterId,
                });

                sendRBI('XWEB_SHOW', {
                  name: 'chapter' + item.chapterId,
                  container: Cookies.get('userId'),
                  type: bookId,
                });

                ge.track('Chapter' + item.chapterId, {});
              }
              //章节属于特别关注的章节
              if (item.chapterIsInterest) {
                sendRBI('XWEB_CLICK', {
                  name: 'Huichuan',
                  type: bookId,
                  text: chapterId,
                  position: Cookies.get('userId'),
                });
              }
              if (isHas != 0 || item.status != 1 || item.isPay != 0) {
                if (!continueReadingTaskDone) {
                  continueReadingTask();
                }
                if (!multipleBooksTaskDone) {
                  multipleBooksTask();
                }
              }
            } else {
              chapterReadingArr = chapterReadingArr.filter(
                (e) => e != chapterId,
              );
            }
          }

          if (chapterReadingArr.length == 0) {
            // 不知道为啥，在离开页面的时候，还会触发监听
            return;
          }
          chapterReadingArr.sort((a, b) => a - b);

          setChapterTitle(
            chapters.filter((e: any) => e.chapterId == chapterReadingArr[0])[0]
              .chapterTitle,
          );
          setChapterIdCurrent(chapterReadingArr[0]);

          if (chapterReadingArr.length > 1) {
            sendRBI('XWEB_CLICK', {
              name: 'reader_chapter_complete',
              type: bookId,
              from: chapterReadingArr[0],
              position: Cookies.get('userId'),
            });
          }
        },
        {
          root: containerRef.current,
        },
      );

      await getNovelContentItem('after');
      await getNovelContentItem('before');
      await getNovelContentItem('after');
      setInitLoading(false);

      /*   setTimeout(() => {
        const element = contentItemRef.filter(
          (item: any) => item.id == scrollId,
        )[0];
        containerRef.scrollTo({
          top: scrollTop + +element?.offsetTop,
        });
        setTimeout(() => {
          startLogScroll = true;
        }, 10);

        readingStartTime = Date.now();
        readingStartScroll = containerRef.scrollTop;
        initObserverTop();
        initObserverBottom();
        thirtyMinutesTask();

        checkShelf();
      }); */
    }
  };

  useEffect(() => {
    sendRBI('XWEB_CLICK', {
      name: 'reader_page_show',
      position: Cookies.get('userId'),
      type: bookId,
    });

    sendRBI('XWEB_SHOW', {
      name: 'home_page',
      container: Cookies.get('userId'),
      type: bookId,
    });
    ge.track('Home_Page', {});

    let dbRequest = indexedDB.open('novelLandingNew', 10);

    //请求中的版本号和当前数据库的版本号相同,触发onsuccess
    dbRequest.onsuccess = function (event) {
      console.log('数据库连接成功');
      db = (event.target as any).result;
    };
    //请求中的版本号和当前数据库的版本号不同,触发onupgradeneeded
    // 相当于第一次建表的时候，才会触发
    // 后续新增表，更改版本才触发
    dbRequest.onupgradeneeded = function (event) {
      db = (event.target as any).result;

      db.createObjectStore('novelContent', {
        autoIncrement: true,
        keyPath: 'url',
      });
      console.log('数据库建表成功');
    };
    dbRequest.onerror = function () {
      messageApi.error('数据库建立失败失败失败失败失败失败失败');
    };
    getData();
  }, []); // 空的依赖数组意味着这个 effect 只会在组件挂载时运行一次

  return (
    <>
      {contextHolder}
      123123123
      <div className="shelf_container" ref={containerRef}></div>
    </>
  );
};

export default ReadPage;
