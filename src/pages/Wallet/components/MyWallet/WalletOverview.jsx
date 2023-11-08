import EllipsisMiddle from "components/EllipsisMiddle";
import { useSelector } from "react-redux";
export default function WalletOverview({ asssetCount = 0 }) {
  const { grpcHost } = useSelector(({ global }) => global);
  return (
    <>
      <div className="nostr-container">
        <div className="my-assets">
          <div className="my-assets-title">
            <span className="my-assets-title__text">My Universe Host</span>
            <span className="my-assets-title__value">
              {grpcHost ? <EllipsisMiddle suffixEnable={false}>{grpcHost}</EllipsisMiddle> : "--"}
            </span>
          </div>
          <div className="my-assets-title">
            <span className="my-assets-title__text">Assets in the Universe</span>
            <span className="my-assets-title__value">{asssetCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}
