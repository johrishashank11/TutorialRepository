import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../layout/DashboardLayout';

export const AppModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className={cn("w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all", maxWidth)}>
                <div className="flex justify-between items-center mb-5">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition">
                    <X size={20} />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
