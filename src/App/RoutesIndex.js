//import PageNotFound from "pages/PageNotFound/PageNotFound";
import { Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, Redirect } from "react-router-dom";
import TaprootWallet from "pages/Wallet/index";

const PCRoute = () => {
  return (
    <>
      <Suspense
        fallback={
          <div style={{ height: "100%", textAlign: "center" }}>
            <Spin />
          </div>
        }
      >
        <Switch>
          <Route exact path="/">
            <Redirect to="/wallet" />
          </Route>
          <Route path="/wallet">
            <TaprootWallet />
          </Route>
          <Route path="*">
            <Redirect to="/wallet" />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

export default function RoutesIndex() {
  return <><PCRoute /></>;
}
