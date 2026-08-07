import ClientNav from "./ClientNav";

function ClientLayout({ children }) {
  return (
    <div>
      <ClientNav />
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </div>
    </div>
  );
}

export default ClientLayout;
