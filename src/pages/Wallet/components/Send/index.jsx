import { Button, Form, Input, Select } from "antd";
const { Option } = Select;
import "./index.scss";
import { useCallback, useState, useEffect } from "react";
import { useThrottleFn } from "ahooks";
import { useGetUniverseStats, useSendAsset, useGetDecodeAddr } from "hooks/useHttpRequest";
import { to } from "await-to-js";
import { useParams } from "react-router-dom";
import EllipsisMiddle from "components/EllipsisMiddle";
const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 14
  }
};
export default () => {
  const [form] = Form.useForm();
  const { tokenList, loading } = useGetUniverseStats();
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const { execSendAsset, loading: sendLoading } = useSendAsset();
  const { execGetDecodeAddr, loading: decodeLoading } = useGetDecodeAddr();
  const [curSelectedAsset, setCurSelectedAsset] = useState(null);

  const { run: handleInvoiceChange } = useThrottleFn(
    async ({ target: { value } }) => {
      if (/^tap[a-z0-9]+$/.test(value)) {
        const [err, ret] = await to(execGetDecodeAddr({ addr: value }));
        if (ret && ret.code === 0) {
          setAmountWithdraw(ret.data.amount.low);
          form.setFieldValue("assetId", ret.data.asset_id);
          setCurSelectedAsset(tokenList.find((item) => item.assetId === ret.data.asset_id));
        }
      }
    },
    {
      wait: 500
    }
  );
  const onFinish = useCallback(
    async (values) => {
      const addr = values.invoice;
      if (addr) {
        const [err, ret] = await to(execSendAsset({ addrs: [addr] }));
        //console.log("🚀 ~ file: index.jsx:55 ~ onFinish ~ ret:", ret);
        if (err) {
          window._message.error(err.message);
        }
        if (!ret) {
          return;
        }
        if (ret?.code === 0) {
          window._message.success("Send Assets Success.");
        } else {
          window._message.error(ret.message);
        }
      }
    },
    [execSendAsset]
  );
  const params = useParams();
  useEffect(() => {
    if (params?.assetId) {
      form.setFieldValue("assetId", params?.assetId);
    }
  }, [form, params?.assetId]);
  return (
    <>
      <div className="nostr-asset-form">
        <h2 className="nostr-asset-form-title">Send Assets</h2>
        <Form
          className="nostr-asset-form-container"
          {...layout}
          form={form}
          autoComplete="off"
          name="sendForm"
          onFinish={onFinish}
          style={{
            maxWidth: 600
          }}
        >
          <Form.Item
            name="invoice"
            label="Invoice"
            rules={[
              {
                required: true
              }
            ]}
          >
            <TextArea placeholder="Please input the transaction description" rows={3} onChange={handleInvoiceChange} />
          </Form.Item>
          <Form.Item name="assetId" label="Currency">
            <span>{curSelectedAsset?.name}</span>
          </Form.Item>
          <Form.Item name="amt" extra={`balance ${curSelectedAsset?.amount || 0}`} label="Send Amount">
            <span>{amountWithdraw}</span>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={sendLoading}>
              Pay Invoice
            </Button>
          </Form.Item>
        </Form>
        <div className="nostr-asset-form-tip">
          <h3>Lightning Network Donation Address:</h3>
          <EllipsisMiddle suffixCount={58}>
            lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhxarfvenxg6tnva6hxap4xvqnfesu
          </EllipsisMiddle>
        </div>
      </div>
    </>
  );
};
