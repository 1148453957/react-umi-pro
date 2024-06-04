import { useLocation } from '@umijs/max';

import React, { useEffect } from 'react';

const ReadPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('11111路由发生变化了:', location);
    // 这里你可以执行你想要在路由变化时执行的逻辑
  }, [location]);

  return <>123123123</>;
};

export default ReadPage;
