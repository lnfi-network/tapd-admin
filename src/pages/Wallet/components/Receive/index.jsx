import { Button, Form, Input, Select, QRCode, Spin } from "antd";
import { useEffect, useState, useRef, useMemo } from "react";
import debounce from "lodash/debounce";
const { Option } = Select;
import "./index.scss";
import { useCallback } from "react";
import { useThrottleFn } from "ahooks";
import { useGetUniverseStats, useCreateInvoice } from "hooks/useHttpRequest";
import EllipsisMiddle from "components/EllipsisMiddle";
import { useParams } from "react-router-dom";
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
    offset: 6,
    span: 18
  }
};
export default () => {
  const [form] = Form.useForm();
  const [assetParams, setAssetParams] = useState(null);
  const { tokenList, loading } = useGetUniverseStats(assetParams);
  const [encodedInvoice, setEncodedInvoice] = useState(null);
  const { execCreateInvoice, loading: createLoading } = useCreateInvoice();
  const { run: handleAmountOnChange } = useThrottleFn(
    ({ target: { value } }) => {
      if (!Number.isNaN(value) && value) {
        let splitValue = value.split(".");
        if (splitValue[1]?.length > 4) {
          splitValue[1] = splitValue[1].substring(0, 4);
        }
        const formatValue = splitValue.join(".");
        form.setFieldValue("amount", formatValue);
      }
    },
    {
      wait: 500
    }
  );
  const params = useParams();
  const debounceFetcher = useMemo(() => {
    const changeParams = (value) => {
      setAssetParams({ assetNameFilter: value });
    };
    return debounce(changeParams, 800);
  }, []);

  const onClear = useCallback(() => {
    setAssetParams({ assetNameFilter: "" });
  }, []);
  const memoTokenList = useMemo(() => {
    if (assetParams?.assetNameFilter) {
      const findToken = tokenList.filter((token) => token.name === assetParams?.assetNameFilter);
      if (findToken) {
        return findToken;
      }
      return [];
    }
    return tokenList;
  }, [assetParams?.assetNameFilter, tokenList]);
  const onFinish = useCallback(
    async (values) => {
      const ret = await execCreateInvoice(values);
      //console.log("🚀 ~ file: index.jsx:44 ~ onFinish ~ ret:", ret);
      if (ret?.code === 0) {
        window._message.success("Create invoice success.");
        setEncodedInvoice(ret.data.encoded);
      } else {
        window._message.error(ret?.message);
        setEncodedInvoice(null);
      }
    },
    [execCreateInvoice]
  );
  useEffect(() => {
    if (params?.assetId) {
      form.setFieldValue("assetId", params?.assetId);
    }
  }, [form, params?.assetId]);
  return (
    <>
      <div className="nostr-asset-form">
        <h2 className="nostr-asset-form-title">Receive Assets</h2>
        <Form
          className="nostr-asset-form-container"
          {...layout}
          form={form}
          autoComplete="off"
          name="receiveForm"
          onFinish={onFinish}
          style={{
            maxWidth: 600
          }}
        >
          <Form.Item
            name="assetId"
            label="Select Currency"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Select
              placeholder="Select a currency"
              allowClear
              showSearch
              loading={loading}
              filterOption={false}
              onSearch={debounceFetcher}
              onClear={onClear}
              /*  notFoundContent={loading ? <Spin size="small" /> : null} */
            >
              {memoTokenList.map((token) => (
                <Option key={token.assetId} value={token.assetId}>
                  {token.name}→{token.assetId}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amt"
            label="Amount"
            rules={[
              {
                required: true
              },
              () => ({
                validator(_, value) {
                  if (value) {
                    if (Number.isNaN(Number(value)) || Number(value) <= 0) {
                      return Promise.reject(new Error(`Please input receive amount.`));
                    }
                    /*  if (Number(value) > Number(erc20Balance)) {
                      return Promise.reject(new Error(t`Available Balance is not enough.`));
                    } */
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <Input placeholder="Please input the amount" onChange={handleAmountOnChange} />
          </Form.Item>

          {encodedInvoice && (
            <Form.Item label="Qrcode">
              <QRCode value={encodedInvoice} />
              <EllipsisMiddle suffixCount={10}>{encodedInvoice}</EllipsisMiddle>
            </Form.Item>
          )}

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={createLoading}>
              Create Invoice
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
