import logo from "../../images/logo.svg";
import "../../blocks/header.css";
import "../../blocks/page.css";

function Header() {
  return (
    <header className="header">
      <img
        src={logo}
        alt="Around the U.S. Logo"
        className="logo header__logo"
      />
      <h1 className="header__hidden-h1">Around The U.S.</h1>
    </header>
  );
}

export default Header;
