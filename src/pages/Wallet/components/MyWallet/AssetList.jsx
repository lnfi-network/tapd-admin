import { useCallback, useState } from "react";
import { Radio, Space, List } from "antd";
import AssetItem from "./AssetItem";

export default function AssetList({ total, assetList, loading }) {
  const pageSize = 10;
  //const [queryParams, setQueryParams] = useState({ offset: 0, limit: pageSize });

  return (
    <>
      <div className="nostr-container nostr-container-assets">
        <div className="nostr-assets">
          <div className="nostr-assets-actions">
            <Radio.Group defaultValue="currency" size="middle" buttonStyle="solid">
              <Space>
                <Radio.Button value="currency">Currencies</Radio.Button>
                <Radio.Button value="nft" disabled>
                  NFT(Coming soon)
                </Radio.Button>
              </Space>
            </Radio.Group>
          </div>
          <div className="nostr-assets-lists">
            <List
              pagination={{
                position: "bottom",
                align: "center",
                pageSize: pageSize,
                showSizeChanger: false,
                total: total
              }}
              loading={loading}
              dataSource={assetList}
              renderItem={(item, index) => <AssetItem key={item?.assetId} item={item} />}
            />
          </div>
        </div>
      </div>
    </>
  );
}
