import service from '@/utils/request';

export const loginReq = (data: any) => {
  return service<any>({
    url: '/user/login',
    method: 'POST',
    data,
  });
};

export const updateUserReq = (data: any) => {
  return service<any>({
    url: '/user/update',
    method: 'POST',
    data,
  });
};
export const getMyScoreHistoryReq = (params: any) => {
  return service<any>({
    url: '/user/getMyScoreHistory',
    method: 'GET',
    params,
  });
};
export const getUserListReq = (params: any) => {
  return service<any>({
    url: '/user/list',
    method: 'GET',
    params,
  });
};

export const getSubUserListReq = (params: any) => {
  return service<any>({
    url: '/user/subList',
    method: 'GET',
    params,
  });
};

export const getUserInfoReq = (params: any) => {
  return service<any>({
    url: '/user/userInfo',
    method: 'GET',
    params,
  });
};

export const userCheckReq = () => {
  return service<any>({
    url: '/user/check',
    method: 'POST',
  });
};


export const bindWalletReq = (data: any) => {
  return service<any>({
    url: '/user/bindWallet',
    method: 'POST',
    data,
  });
};