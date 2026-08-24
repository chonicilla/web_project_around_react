import "../../blocks/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; {year} Around The U.S.</p>
    </footer>
  );
}
