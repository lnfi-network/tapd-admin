import { Button, Form, Input, Select, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setGrpcHost } from "store/reducer/globalReducer";
import { useCallback, useState } from "react";
import { useSendHost, useGetUniverseInfo, useYourUniverseHosts } from "hooks/useHttpRequest";
import { hostIp, hostDomain } from "lib/utils/index";

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
  const [fileListMacaroon, setFileListMacaroon] = useState([]);
  const [fileListCert, setFileListCert] = useState([]);
  const { execGetUniverseInfo } = useGetUniverseInfo();
  const { execSetting, loading } = useSendHost();
  const [enableTest, setEnableTest] = useState(false);
  const { refresh } = useYourUniverseHosts();
  const dispatch = useDispatch();
  const macarnoonProps = {
    multiple: false,
    accept: ".macaroon",
    showUploadList: true,
    fileList: fileListMacaroon,
    onRemove: (file) => {
      const index = fileListMacaroon.indexOf(file);
      const newFileList = fileListMacaroon.slice();
      newFileList.splice(index, 1);
      setFileListMacaroon(newFileList);
    },
    beforeUpload(file) {
      const isLt20K = file.size / 1024 < 20;
      if (!isLt20K) {
        window._message.error("File must smaller than 20KB!");
        return Upload.LIST_IGNORE;
      }
      setFileListMacaroon([file]);
      return false;
    }
  };
  const certProps = {
    multiple: false,
    accept: ".cert",
    showUploadList: true,
    fileList: fileListCert,
    onRemove: (file) => {
      const index = fileListCert.indexOf(file);
      const newFileList = fileListCert.slice();
      newFileList.splice(index, 1);
      setFileListCert(newFileList);
    },
    beforeUpload(file) {
      const isLt20K = file.size / 1024 < 20;
      if (!isLt20K) {
        window._message.error("File must smaller than 20KB!");
        return Upload.LIST_IGNORE;
      }
      setFileListCert([file]);
      return false;
    }
  };
  const onHostChange = useCallback(({ target: { value } }) => {
    setEnableTest(false);
  }, []);
  const onTestConnection = useCallback(async () => {
    try {
      const grpc = form.getFieldValue("universeHost");
      const ret = await execGetUniverseInfo({ grpc });
      if (ret.code === 0) {
        window._message.success("Connectivity test successful.");
      } else {
        window._message.error("Connectivity test Failure.");
      }
    } catch (e) {
      window._message.error(e.message);
    }
  }, [execGetUniverseInfo, form]);
  const onFinish = useCallback(
    async (values) => {
      const formData = new FormData();
      formData.append("universeHost", values.universeHost);
      formData.append("file", values.macaroonFile.file);
      formData.append("file", values.certFile?.file || "");
      try {
        const ret = await execSetting(formData);
        if (ret?.code === 0) {
          window._message.success("Setting Target Host Success.");
          dispatch(setGrpcHost(values.universeHost));
          setEnableTest(true);
        } else {
          window._message.error("Setting Target Host Failure.");
        }
      } catch (err) {
        window._message.error(err.message);
      } finally {
        refresh();
      }
    },
    [dispatch, execSetting, refresh]
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
        <Form.Item label="Target Host" required>
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
                name="universeHost"
                noStyle
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
                <Input placeholder="" onChange={onHostChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary" disabled={!enableTest} onClick={onTestConnection}>
                Test Connectivity
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="macaroonFile"
          label="MaCaroon File"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Upload {...macarnoonProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="certFile"
          label="Cert File"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (hostIp.test(getFieldValue("universeHost"))) {
                  if (!value) {
                    return Promise.reject(new Error(`Please upload a certificate`));
                  } else {
                    return Promise.resolve();
                  }
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Upload {...certProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
