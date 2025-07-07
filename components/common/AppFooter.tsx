import React from "react";

function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09C382] text-xs text-center py-4 mt-10">
      <p>&copy; {currentYear} AI Doctor Talk. All rights reserved.</p>
    </footer>
  );
}

export default AppFooter;
