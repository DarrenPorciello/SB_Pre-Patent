"use client";

import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import { useLanguage } from "./LanguageProvider";

export function UserMenu() {
  const { t } = useLanguage();
  const { isAdmin, login, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    setConfirmExit(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  const onIconClick = () => {
    if (isAdmin) {
      setConfirmExit((current) => !current);
      setOpen(false);
      return;
    }
    setConfirmExit(false);
    setOpen((current) => !current);
  };

  const confirmLogout = () => {
    logout();
    close();
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!login(username.trim(), password)) {
      setError(t.adminInvalid);
      return;
    }
    close();
  };

  return (
    <>
      {(open || confirmExit) && (
        <button
          type="button"
          aria-label={t.adminClose}
          className="fixed inset-0 z-40 cursor-default bg-scotia-ink/20"
          onClick={close}
        />
      )}
      {confirmExit && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-scotia-line bg-white p-5 shadow-lg">
          <h2 className="text-base font-semibold text-scotia-ink">{t.exitAdminTitle}</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={confirmLogout}
              className="w-full rounded-full bg-scotia-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
            >
              {t.exitAdminConfirm}
            </button>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-full border border-scotia-ink px-4 py-2.5 text-sm font-semibold text-scotia-ink hover:bg-scotia-mist"
            >
              {t.exitAdminStay}
            </button>
          </div>
        </div>
      )}
      {open && (
        <form
          onSubmit={onSubmit}
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-scotia-line bg-white p-5 shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-scotia-ink">{t.adminTitle}</h2>
            <button
              type="button"
              onClick={close}
              className="text-sm font-medium text-scotia-muted hover:text-scotia-ink"
            >
              {t.adminClose}
            </button>
          </div>
          <label className="mt-4 block text-sm font-medium text-scotia-ink">
            {t.adminUsername}
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-scotia-line bg-scotia-mist px-3 py-2 text-sm font-normal outline-none focus:border-scotia-ink"
            />
          </label>
          <label className="mt-3 block text-sm font-medium text-scotia-ink">
            {t.adminPassword}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-scotia-line bg-scotia-mist px-3 py-2 text-sm font-normal outline-none focus:border-scotia-ink"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-scotia-red">{error}</p> : null}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-scotia-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-scotia-red-dark"
          >
            {t.adminSignIn}
          </button>
        </form>
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
