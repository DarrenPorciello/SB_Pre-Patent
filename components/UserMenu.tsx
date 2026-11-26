"use client";

import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import { useLanguage } from "./LanguageProvider";

export function UserMenu() {
  const { t } = useLanguage();
  const { isAdmin, enterAdmin, logout } = useAdmin();
  const [prompt, setPrompt] = useState<"none" | "enter" | "exit">("none");

  const close = () => setPrompt("none");

  const onIconClick = () => {
    setPrompt((current) => {
      if (isAdmin) return current === "exit" ? "none" : "exit";
      return current === "enter" ? "none" : "enter";
    });
  };

  const confirmEnter = () => {
    enterAdmin();
    close();
  };

  const confirmLogout = () => {
    logout();
    close();
  };

  const entering = prompt === "enter";

  return (
    <>
      {prompt !== "none" && (
        <button
          type="button"
          aria-label={t.adminClose}
          className="fixed inset-0 z-40 cursor-default bg-scotia-ink/20"
          onClick={close}
        />
      )}
      {prompt !== "none" && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-scotia-line bg-white p-5 shadow-lg">
          <h2 className="text-base font-semibold text-scotia-ink">
            {entering ? t.enterAdminTitle : t.exitAdminTitle}
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={entering ? confirmEnter : confirmLogout}
              className="w-full rounded-full bg-scotia-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
            >
              {entering ? t.enterAdminConfirm : t.exitAdminConfirm}
            </button>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-full border border-scotia-ink px-4 py-2.5 text-sm font-semibold text-scotia-ink hover:bg-scotia-mist"
            >
              {entering ? t.enterAdminCancel : t.exitAdminStay}
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onIconClick}
        aria-label={isAdmin ? t.returnToUser : t.openAdmin}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-scotia-line bg-white text-scotia-ink shadow-md hover:bg-scotia-mist"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z" />
        </svg>
      </button>
    </>
  );
}
