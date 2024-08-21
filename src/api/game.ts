import service from '@/utils/request';

export const beginGameReq = () => {
  return service<any>({
    url: '/game/begin',
    method: 'GET',
  });
};

export const endGameReq = (data: any) => {
  return service<any>({
    url: '/game/end',
    method: 'POST',
    data
  });
};
