import SetTargetHostForm from "./SetTargetHostForm";

export default () => {
  /* const [radioType, setRadioType] = useState(2);

  const onSettingTapChange = useCallback(({ target: { value } }) => {
    setRadioType(Number(value));
  }, []); */

  return (
    <>
      <div className="nostr-asset-form">
        {/* <div className="nostr-asset-form-radio">
          <Radio.Group onChange={onSettingTapChange} defaultValue={radioType} size="middle" buttonStyle="solid">
            <Space>
              <Radio.Button value={2}>Setting Target Host</Radio.Button>
              <Radio.Button value={1} disabled={!hasInitHost}>
                Sync Universe
              </Radio.Button>
            </Space>
          </Radio.Group>
        </div> */}
        <h2 className="nostr-asset-form-title">Setting</h2>
        <SetTargetHostForm />
      </div>
    </>
  );
};
