import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <header className="bg-dark-secondary shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
        <a href="#" className="flex items-center">
          <img
            src="/images/logo-wide.png"
            alt="North South University"
            className="h-10 md:h-12"
          />
        </a>
      </div>
    </header>
  );
};

export default PageHeader;