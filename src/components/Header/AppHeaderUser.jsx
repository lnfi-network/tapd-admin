import { generateNickname } from "lib/utils/index";
import { setUserName, setGrpcHost } from "store/reducer/globalReducer";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import "./Header.css";
import { Select } from "antd";
import { useYourUniverseHosts } from "hooks/useHttpRequest";
import EllipsisMiddle from "components/EllipsisMiddle";
const Option = Select.Option;
function AppHeaderUser() {
  const { userName, grpcHost, hosts } = useSelector(({ global }) => global);
  const dispatch = useDispatch();
  useYourUniverseHosts(userName);
  const onHostChange = useCallback(
    (value) => {
      dispatch(setGrpcHost(value));
    },
    [dispatch]
  );
  useEffect(() => {
    if (!userName) {
      const tempUserName = generateNickname();
      dispatch(setUserName(tempUserName));
    }
  }, [dispatch, userName]);
  return (
    <div className="App-header-user">
      {
        <>
          {/*  <div className="App-header-user-address">
            <UserOutlined style={{ fontSize: "20px", paddingRight: "10px" }} />
            {userName}
          </div> */}
          <Select
            placeholder="Please select host"
            className="header-user-hosts"
            value={grpcHost}
            onChange={onHostChange}
          >
            {hosts.map((host) => (
              <Option value={host} key={host}>
                <EllipsisMiddle suffixCount={6}>{host}</EllipsisMiddle>
              </Option>
            ))}
          </Select>
        </>
      }
    </div>
  );
}
export default AppHeaderUser;
