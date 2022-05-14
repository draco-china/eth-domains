import { RequestConfig } from 'umi';

export const request: RequestConfig = {
  headers: {
    Authorization: window.atob(
      'dG9rZW4gZ2hwX0Z6Z2NIbVJGV2lKNzQyOW5jUXBla1FuTlZVZ3NHVTNRTjFCMA==',
    ),
  },
};
