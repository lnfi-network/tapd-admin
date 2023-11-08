import { Button, Form, Input, Select, Radio, Space, Tabs } from "antd";
const { Option } = Select;
import { useCallback, useState } from "react";
import { useSyncAsset } from "hooks/useHttpRequest";
import { hostIp, hostDomain } from "lib/utils/index";
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};
export default () => {
  const [form] = Form.useForm();

  const { execSyncAsset, loading } = useSyncAsset();

  const onFinish = useCallback(
    async (values) => {
      const universeHost = values.universeHost;
      const syncMode = values.universeSyncMode;
      let targetArr = values.assetIds ? values.assetIds.split(";") : [];
      const syncTarget = targetArr.splice(0, targetArr.length - 1);
      try {
        const ret = await execSyncAsset({ universeHost, syncMode, syncTarget });
        if (ret && ret.code === 0) {
          window._message.success("Sync universe submitted successfully.");
        } else {
          window._message.error(ret.message);
        }
      } catch (e) {
        window._message.error(e.message);
      }
    },
    [execSyncAsset]
  );
  return (
    <>
      <Form
        className="nostr-asset-form-container"
        {...layout}
        form={form}
        autoComplete="off"
        initialValues={{ universeSyncMode: 0 }}
        name="settingForm"
        onFinish={onFinish}
        style={{
          maxWidth: 600
        }}
      >
        <Form.Item
          name="universeHost"
          label="Universe Host"
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value) {
                  if (hostIp.test(value) || hostDomain.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error(`Please input a valid host address.`));
                  }
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="universeSyncMode"
          label="Universe Sync Mode"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select>
            <Option value={0}>SYNC_ISSUANCE_ONLY</Option>
            <Option value={1}>SYNC_FULL</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="assetIds"
          label="Asset Ids"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value) {
                  if (/\S+\;$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Please enter the correct format."));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <TextArea placeholder="Please enter one or more assetIDs separated by ';'" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
