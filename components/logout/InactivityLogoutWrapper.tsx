"use client";

import { useInactivityLogout } from "./InactivityLogout";
import React from "react";

interface InactivityLogoutWrapperProps {
  children: React.ReactNode;
}

const InactivityLogoutWrapper: React.FC<InactivityLogoutWrapperProps> = ({
  children,
}) => {
  useInactivityLogout();
  return <>{children}</>;
};

export default InactivityLogoutWrapper;
