import { Button, Form, Input, Select, Radio, Space, Col, Row, Upload, InputNumber } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import { useCallback, useState } from "react";

import { useMintAsset } from "hooks/useHttpRequest";

const { Dragger } = Upload;
export default () => {
  const [form] = Form.useForm();

  const { loading: mintLoading, execMintAsset } = useMintAsset();
  const [fileName, setFileName] = useState("");
  const [assetMeta, setAssetMeta] = useState();
  const props = {
    name: "file",
    multiple: false,
    showUploadList: true,
    customRequest(info) {
      const file = info.file;
      if (file) {
        setFileName(file.name);
        const originFile = file;
        let reader = new FileReader();
        reader.onload = function () {
          const arrayBuffer = this.result;
          setAssetMeta(arrayBuffer);
        };
        reader.readAsArrayBuffer(originFile);
      } else {
        setFileName("");
        setAssetMeta(null);
      }
    },
    showUploadList: false,
    beforeUpload(file) {
      const isJSON = file.type === "application/json";
      if (!isJSON) {
        window._message.error("You can only upload JSON file!");
        return Upload.LIST_IGNORE;
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        window._message.error("Image must smaller than 1MB!");
        return Upload.LIST_IGNORE;
      }

      return isJSON && isLt1M;
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    }
  };

  const onFinish = useCallback(
    async (values) => {
      //console.log("values", values);
      const { assetType, amount, name } = values;
      const postData = {
        assetType,
        amount,
        name,
        assetMeta: assetMeta
      };
      try {
        const ret = await execMintAsset({ ...postData });
        if (ret.code === 0) {
          window._message.success(`Mint Asset ${name} Success.`);
        } else {
          window._message.error(`${ret.message}`);
        }
      } catch (e) {
        window._message.error(`Mint Asset ${name} Error:${e.message}`);
      }
    },
    [assetMeta, execMintAsset]
  );
  return (
    <>
      <div className="nostr-asset-container">
        <div className="nostr-asset-form">
          <h2 className="nostr-asset-form-title">Mint Assets</h2>
          <Form
            className="nostr-asset-form-container"
            layout="vertical"
            form={form}
            autoComplete="off"
            name="mintForm"
            initialValues={{ assetType: 0 }}
            onFinish={onFinish}
            style={{
              maxWidth: 600
            }}
          >
            <Form.Item
              name="assetType"
              label="What would you like to mint"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Radio.Group size="middle" buttonStyle="solid">
                <Space>
                  <Radio.Button value={0}>Token</Radio.Button>
                  <Radio.Button value={1} disabled>
                    NFT
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="name"
              label="Token Name"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input placeholder="Please input the token name" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Total Supply"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={1} controls={false} />
            </Form.Item>
            {/*  <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <TextArea
                placeholder="Please input the transaction description"
                rows={3}
                onChange={handleInvoiceChange}
              />
            </Form.Item> */}
            <Form.Item label="Token File" extra={fileName}>
              <Form.Item name="file" noStyle>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click to this area to upload</p>
                </Dragger>
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" loading={mintLoading}>
                Confirm to Mint
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
