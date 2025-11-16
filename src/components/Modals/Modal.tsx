'use client';

import { Dialog, DialogBackdrop, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import React, { Fragment } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  ariaLabel?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  ariaLabel = 'Modal',
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
        onClose={() => {
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
        aria-label={ariaLabel}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop
            onClick={() => closeOnOverlayClick && onClose()}
            className="fixed inset-0 z-40 min-w-2/5 cursor-pointer bg-black/40 backdrop-blur-sm"
          />
        </Transition.Child>
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <div
            className={`relative z-50 inline-block w-full ${sizeClasses[size]} my-8 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all dark:bg-slate-900`}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-slate-900 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                )}
              </div>

              <div className="flex items-start">
                <button
                  aria-label="Close modal"
                  className="cursor-pointer rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={onClose}
                  type="button"
                >
                  <Icon
                    icon="ic:round-close"
                    className="h-5 w-5 text-slate-700 dark:text-slate-300"
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 max-h-[65vh] overflow-auto pr-2">
              {children}
            </div>

            {footer !== undefined
              ? (
                  <div className="mt-6 flex items-center justify-end gap-3">
                    {footer}
                  </div>
                )
              : null}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
