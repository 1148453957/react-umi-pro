import { base_info } from '@/api/base';
import { login } from '@/api/login';
import anzhuoUrl from '@/assets/img/home/anzhuo.webp';
import refreshUrl from '@/assets/img/home/refresh_btn.webp';
import safriUrl from '@/assets/img/home/safri.webp';
import up_arrowUrl from '@/assets/img/home/up_arrow.webp';
import { isNature } from '@/assets/js/utils';
import { ge, sendRBI } from '@/engine_sdk';
import { history, useLocation } from '@umijs/max';
import { Spin } from 'antd';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import ta from 'thinkingdata-browser';
import './index.less';
const HomePage = () => {
  let openViewFlag = false;
  const [active, setActive] = useState('');
  let isInit = true;
  const [loginFail, setLoginFail] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const location = useLocation();
  // 如果是微信浏览器，就展示引导页，去其他浏览器查看

  let ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('micromessenger') !== -1) {
    openViewFlag = true;
  }
  const refresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    // 第一次进来时才登录，页面刷新的时候不需要重新登录
    if (Cookies.get('userId')) {
      // 第一次进页面
      setInitLoading(true);
      login({
        androidId: sessionStorage.getItem('onlyId'),
        clientId: sessionStorage.getItem('onlyId'),
      })
        .then(async (res: any) => {
          if (res.error_code == '0') {
            setLoginFail(false);
            Cookies.set('userId', res.data.supa_no);
            sendRBI('XWEB_OPERATION', {
              name: 'login',
              result: 'success',
              container: res.data.supa_no,
            });
            ta.userSet({ user_account_id: res.data.supa_no });

            try {
              const res1 = await ge.value.register({
                name: res.data.supa_no,
                version: base_info.versionCode,
                enable_sync_attribution: true,
              });

              ta.userSet({ user_register_time: new Date() });
              if (isNature(res1.click_company)) {
                ta.userSet({ user_is_origin: '1' });
              } else {
                ta.userSet({ user_is_origin: '0' });
              }
              sendRBI('XWEB_OPERATION', {
                name: 'current_user_attribution',
                text: res1.ad_params.advertiser_id + '',
                result: res1.click_company,
                container: res.data.supa_no,
              });
            } catch (err) {
              sendRBI('XWEB_OPERATION', {
                name: 'geFail',
              });
            }
            //   goodStore.getGoods()

            // 如果没有userid，还没有登录，阅读页在登录后跳入阅读页，其他页面统一回跳书架页
            if (sessionStorage.getItem('turnToReadPage')) {

              history.push('/ReadPage', {
                bkid: sessionStorage.getItem('turnToReadPage'),
              });
                sessionStorage.setItem('turnToReadPage', '');
            } else {
            history.push('/ShelfPage')
            }
            setTimeout(() => {
              setInitLoading(false);
            }, 500);
          } else {
            setLoginFail(true);

            sendRBI('XWEB_OPERATION', {
              name: 'login',
              result: 'failed',
              container: '',
            });
          }
        })
        .catch(() => {
          setLoginFail(true);
          sendRBI('XWEB_OPERATION', {
            name: 'login',
            result: 'failed',
            container: '',
          });
        });
    } else {
      // 页面刷新
      //  goodStore.getGoods()
    }
  }, []);
  useEffect(() => {
    console.log('路由发生变化了:', location);
    // 这里你可以执行你想要在路由变化时执行的逻辑

    if (isInit) {
      isInit = false;
    } else {
      setActive(location.pathname);
    }
  }, [location]);

  if (openViewFlag) {
    return (
      <div className="yindao_weixin">
        <div className="up_arrow">
          <img src={up_arrowUrl} alt="" />
        </div>
        <div className="desc">
          <p>1、点击右上角“...”</p>
          <p>
            2、iOS选择“在
            <img src={safriUrl} alt="" /> 中打开”
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;安卓选择“在
            <img src={anzhuoUrl} alt="" /> 中打开”
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loginFail && (
        <div className="fail_reset" onClick={refresh}>
          <img className="fail_reset_img" src={refreshUrl} alt="" />
        </div>
      )}
      {
        <div
          className={classnames({
            container_box: true,
            active: active,
          })}
        >
          {initLoading && <Spin tip="正在准备书籍..." fullscreen />}
        </div>
      }
      {/*  <Tabs defaultActiveKey="1" items={items}  />
      <Button type="primary">我的按钮</Button> */}
      {/* <div className={`container_box ${active ? 'active' : ''}}>1231</div> */}
    </>
  );
};

export default HomePage;
