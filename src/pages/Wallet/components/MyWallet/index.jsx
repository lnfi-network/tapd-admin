import "./index.scss";
import WalletOverview from "./WalletOverview";
import AssetList from "./AssetList";
import { useGetUniverseStats } from "hooks/useHttpRequest";
export default () => {
  //const { numAssets } = useGetUniverseInfo();
  const { combineAssetList: assetList, loading } = useGetUniverseStats(null);
  return (
    <>
      <div className="my-wallet">
        <WalletOverview asssetCount={assetList.length} />
        <AssetList assetList={assetList} loading={loading} total={assetList.length || 0} />
      </div>
    </>
  );
};
