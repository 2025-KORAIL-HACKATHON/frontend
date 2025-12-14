"use client";

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string; // ex) max-w-[420px]
}

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-[420px]",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-start justify-center">
      {/* overlay */}
      <button
        type="button"
        aria-label="close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* modal body */}
      <div
        className={`relative mt-16 w-full ${maxWidth} rounded-3xl bg-white p-6 shadow-xl`}
      >
        {children}
      </div>
    </div>
  );
}
