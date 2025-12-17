"use client";

import { useEffect, useState } from "react";
import SessionExpiredModal from "../SessionExpiredModal/SessionExpiredModal";
import { useSessionManager } from "../../hooks/useSessionManager";

export default function SessionManager({ children }) {
  const { isSessionExpired } = useSessionManager();

  return (
    <>
      {children}
      <SessionExpiredModal isOpen={isSessionExpired} />
    </>
  );
}
