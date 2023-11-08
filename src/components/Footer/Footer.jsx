import "./Footer.scss";
import logoImg from "img/logo_nostr.png";
export default function Footer({}) {
  return (
    <div className="Footer">
      <div className="Footer-right">
        Powered By <img src={logoImg} />
      </div>
    </div>
  );
}
