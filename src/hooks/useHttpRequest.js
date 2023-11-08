import { useRequest } from "ahooks";
import { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setGrpcHost, setAllHosts, handleInitHost } from "store/reducer/globalReducer";
import { getAssetsList, getUniverseStats, getUniverseHost, createInvoice, sendAsset, getDecodeAddr, mintAsset, syncAsset, getUniverseInfo, setHost, getHosts } from "service/apis";
import { cloneDeep } from "lodash";
export const useGetAssetsList = (params = null) => {
  const { grpcHost } = useSelector(({ global }) => global);
  const { data, loading } = useRequest(() => getAssetsList(params), {
    refreshDeps: [grpcHost]
  });
  const tokenList = useMemo(() => {
    if (data?.data) {
      let mapAsset = data.data.map(item => ({
        assetId: item.asset_genesis.asset_id,
        amount: item.amount.low,
        name: item.asset_genesis.name,
        isSpent: item.is_spent
      }))
      let retAsset = []
      for (let i = 0; i < mapAsset.length; i++) {
        const item = mapAsset[i]
        const inRetAssetIndex = retAsset.findIndex(retItem => retItem.assetId === item.assetId)
        if (inRetAssetIndex === -1) {
          retAsset.push(item)
        } else {
          if (!retAsset[inRetAssetIndex].isSpent) {
            if (!item.isSpent) {
              retAsset[inRetAssetIndex].amount += item.amount
            }
          } else {
            retAsset[inRetAssetIndex].amount = item.amount
          }

        }
      }
      return retAsset;
    }
    return []
  }, [data?.data])
  return {
    loading,
    tokenList,
    data: data?.data || []
  };
};
export const useGetUniverseStats = (params = null) => {
  const { grpcHost } = useSelector(({ global }) => global);
  const { data, loading } = useRequest(() => getUniverseStats(params), {
    refreshDeps: [params, grpcHost]
  });
  const { tokenList: assetList } = useGetAssetsList()
  // console.log("🚀 ~ file: useHttpRequest.js:51 ~ useGetUniverseStats ~ assetList:", assetList)

  const combineAssetList = useMemo(() => {
    const cloneAsseetList = cloneDeep(assetList)
    let universeStatAssetList = []
    if (data?.data) {
      const filterdData = data.data.filter(item => item.asset !== null)
      universeStatAssetList = filterdData.map(item => {
        return {
          assetId: item.asset.asset_id,
          name: item.asset.asset_name,
          amount: 0,
          isSpent: false,
          genesisHeight: item.asset.genesis_height
        }
      })
    }
    for (let i = 0; i < universeStatAssetList.length; i++) {
      const curUniverseAsset = universeStatAssetList[i]
      const isInAssetListIndex = cloneAsseetList.findIndex(asset => asset.asset_id === curUniverseAsset.assetId)
      if (isInAssetListIndex > -1) {
        universeStatAssetList[i] = cloneAsseetList[isInAssetListIndex]
        cloneAsseetList.splice(isInAssetListIndex, 1);
      }
    }
    universeStatAssetList.push(...cloneAsseetList);
    universeStatAssetList.sort((a, b) => b.amount - a.amount)

    return universeStatAssetList

  }, [assetList, data?.data])

  return {
    loading,
    tokenList: combineAssetList,
    combineAssetList
  };
}

export const useGetUniverseHost = () => {
  const dispatch = useDispatch();

  const { data, loading, refresh } = useRequest(() => getUniverseHost());

  useEffect(() => {
    if (data?.data) {
      dispatch(setGrpcHost(data?.data?.host))
    }
  }, [data?.data, dispatch])
  return {
    loading,
    refresh,
    data: data?.data || []
  };
};
export const useGetUniverseInfo = () => {
  const { data, loading, runAsync: execGetUniverseInfo } = useRequest((params) => getUniverseInfo(params), {
    manual: true
  });
  return {
    execGetUniverseInfo,
    loading,
    numAssets: data?.data || []
  };
};

export const useGetDecodeAddr = () => {
  const { data, runAsync: execGetDecodeAddr, loading } = useRequest((params) => getDecodeAddr(params));
  return {
    loading,
    execGetDecodeAddr,
    data: data?.data || []
  };
};

export const useCreateInvoice = () => {
  const { data, runAsync: execCreateInvoice, loading } = useRequest((params) => createInvoice(params), {
    manual: true
  });
  return {
    execCreateInvoice,
    data,
    loading
  }
}

export const useSendAsset = () => {
  const { data, runAsync: execSendAsset, loading } = useRequest((params) => sendAsset(params), {
    manual: true
  });
  return {
    execSendAsset,
    data,
    loading
  }
}

export const useMintAsset = () => {
  const { runAsync: execMintAsset, loading } = useRequest((params) => mintAsset(params), {
    manual: true
  });
  return {
    execMintAsset,
    loading
  }
}
export const useSyncAsset = () => {
  const { runAsync: execSyncAsset, loading } = useRequest((params) => syncAsset(params), {
    manual: true
  });
  return {
    execSyncAsset,
    loading
  }
}
export const useSendHost = () => {
  const { data, runAsync: execSetting, loading } = useRequest((params) => setHost(params), {
    manual: true
  });
  return {
    execSetting,
    data,
    loading
  }
}
export const useYourUniverseHosts = (userName) => {
  const dispatch = useDispatch();
  const { data, loading, runAsync } = useRequest(() => getHosts(), {
    manual: true
  });
  const asyncCallback = useCallback(async () => {
    const ret = await runAsync();
    if (ret?.data?.length > 0) {
      dispatch(setAllHosts(ret.data))
      dispatch(handleInitHost(true))
    } else {
      dispatch(handleInitHost(false))
    }

  }, [dispatch, runAsync])

  useEffect(() => {
    if (userName) {
      asyncCallback();
    }
  }, [userName, asyncCallback])



  return {
    loading,
    refresh: asyncCallback,
    getUniverseHosts: runAsync,
    data: data?.data || []
  };
};