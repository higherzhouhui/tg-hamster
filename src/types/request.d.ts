declare namespace GlobalRequest {
  interface Response<D> {
    code: number;
    data: D | any;
    msg?: string;
    err?: string;
  }
  export interface AxiosResponse extends Response<D> {
    data: Response;
    headers: any;
    request?: any;
    status: number;
    statusText: string;
    config: AxiosRequestConfig;
  }

  interface Request {}
}