import { useCallback } from 'react';
import { useRequest, request } from 'umi';

const useDomains = () => {
  const { data: MAIN_TREE_URL } = useRequest(
    'https://api.github.com/repos/draco-china/eth-domains/branches/main',
    {
      formatResult: (res) => res.commit.commit.tree.url,
    },
  );

  const { data: DOMIN_TREE_URL } = useRequest(MAIN_TREE_URL, {
    ready: !!MAIN_TREE_URL,
    formatResult: (res) =>
      res.tree.find((item: { path: string }) => item.path === 'domains').url,
  });

  const { data: JSON_TREE_URL } = useRequest(DOMIN_TREE_URL, {
    ready: !!DOMIN_TREE_URL,
    formatResult: (res) =>
      res.tree
        .filter(
          (item: { path: string }) =>
            item.path.indexOf('.json') > -1 &&
            item.path.indexOf('expiration') === -1,
        )
        .map((item: { url: string }) => item.url),
  });

  const getDomains = useCallback(
    async (params) => {
      if (JSON_TREE_URL === undefined) return { success: false };
      const promises = JSON_TREE_URL?.map(async (item: string) => {
        return await request(item).then((res) => {
          try {
            return JSON.parse(window.atob(res.content));
          } catch (error) {
            console.error(window.atob(res.content));
          }
        });
      });
      return await Promise.all(promises).then((res) => {
        let data = res.flat();
        /** 名称 */
        if (params.domain)
          data = data.filter(
            (item: { domain: string }) =>
              item.domain.indexOf(params.domain) > -1,
          );

        /** 类型 */
        if (params.type)
          data = data.filter((item: { domain: string | number }) => {
            const type = isNaN(Number(item.domain)) ? 'string' : 'number';
            return type === params.type;
          });

        /** 可注册 */
        if (params.status == 'available')
          data = data.filter((item: { money: string }) => Boolean(item.money));

        /** 不可注册 */
        if (params.status == 'unavailable')
          data = data.filter((item: { money: string }) => !Boolean(item.money));

        if (params.length)
          data = data.filter(
            (item: { domain: string }) =>
              item.domain.length === Number(params.length),
          );
        return {
          data,
          success: true,
        };
      });
    },
    [JSON_TREE_URL],
  );

  return {
    getDomains,
  };
};
export default useDomains;
