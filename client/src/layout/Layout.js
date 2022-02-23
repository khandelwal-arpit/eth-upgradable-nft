// components
import Menu from "../components/Layout/Menu";
import Footer from "../components/Layout/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
