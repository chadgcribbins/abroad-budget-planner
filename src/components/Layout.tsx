import React from 'react';

const Header = () => {
  return <header className="p-4 bg-gray-200">Header Placeholder</header>;
};

const Footer = () => {
  return <footer className="p-4 bg-gray-200 text-center">Footer Placeholder</footer>;
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout; 