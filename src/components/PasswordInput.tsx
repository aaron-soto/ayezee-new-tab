"use client";

import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type PasswordInputProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;

  placeholder?: string;
  error?: string;
  className?: string; // wrapper div
  inputClassName?: string; // actual input
  buttonClassName?: string; // toggle button
  initiallyVisible?: boolean;
};

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      id = "password",
      name = "password",
      value,
      defaultValue,
      onChange,
      onBlur,
      autoComplete = "current-password",
      minLength = 8,
      maxLength = 100,
      disabled,
      required,
      placeholder,
      error,
      className = "",
      inputClassName = "",
      buttonClassName = "",
      initiallyVisible = false,
    },
    ref,
  ) => {
    const [show, setShow] = React.useState<boolean>(initiallyVisible);
    const describedBy = error ? `${id}-error` : undefined;

    return (
      <div className={className}>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            name={name}
            type={show ? "text" : "password"}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            placeholder={placeholder}
            className={cn(
              "!bg-surface w-full rounded-xl pr-10 text-base",
              inputClassName,
            )}
          />

          <motion.button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            onClick={() => setShow((s) => !s)}
            className={`absolute right-0 top-1/2 flex -translate-y-1/2 items-center px-4 py-3 ${buttonClassName}`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              duration: 10,
              stiffness: 1200,
              damping: 40,
              mass: 0.2,
            }}
          >
            <AnimatePresence initial={false} mode="wait">
              {show ? (
                <motion.svg
                  key="eye"
                  className="text-muted-foreground size-5"
                  viewBox="0 0 32 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    duration: 10,
                    stiffness: 1200,
                    damping: 40,
                    mass: 0.2,
                  }}
                >
                  <path
                    d="M3.13008 11.6495C5.121 6.58757 10.1346 3 16 3V0C8.82575 0 2.70238 4.39001 0.271219 10.5711L3.13008 11.6495ZM16 3C21.8654 3 26.879 6.58758 28.8698 11.6495L31.7288 10.5711C29.2975 4.39002 23.1742 0 16 0V3ZM28.8698 12.3505C26.879 17.4124 21.8654 21 16 21V24C23.1742 24 29.2975 19.6099 31.7288 13.4289L28.8698 12.3505ZM16 21C10.1346 21 5.121 17.4124 3.13008 12.3505L0.271219 13.4289C2.70238 19.6099 8.82575 24 16 24V21ZM28.8698 11.6495C28.9585 11.8748 28.9585 12.1252 28.8698 12.3505L31.7288 13.4289C32.0904 12.5094 32.0904 11.4906 31.7288 10.5711L28.8698 11.6495ZM0.271219 10.5711C-0.0904063 11.4906 -0.0904063 12.5094 0.271219 13.4289L3.13008 12.3505C3.04142 12.1252 3.04142 11.8748 3.13008 11.6495L0.271219 10.5711Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.2001 11.2C19.2001 9.43269 17.7674 7.99998 16.0001 7.99998C14.2328 7.99998 12.8001 9.43269 12.8001 11.2C12.8001 12.9673 14.2328 14.4 16.0001 14.4C17.7674 14.4 19.2001 12.9673 19.2001 11.2ZM22.4001 11.2C22.4001 14.7346 19.5347 17.6 16.0001 17.6C12.4655 17.6 9.6001 14.7346 9.6001 11.2C9.6001 7.66537 12.4655 4.8 16.0001 4.8C19.5347 4.8 22.4001 7.66537 22.4001 11.2Z"
                    fill="currentColor"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  key="eye-off"
                  className="text-muted-foreground size-5"
                  viewBox="0 0 32 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    duration: 10,
                    stiffness: 1200,
                    damping: 40,
                    mass: 0.2,
                  }}
                >
                  <path
                    d="M2.06873 0.442594C2.69357 -0.147531 3.70664 -0.147531 4.33148 0.442594L29.9315 24.6204C30.5563 25.2105 30.5563 26.1673 29.9315 26.7574C29.3066 27.3475 28.2936 27.3475 27.6687 26.7574L2.06873 2.57964C1.44389 1.98951 1.44389 1.03272 2.06873 0.442594Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.151 4.05599C4.03999 5.93984 1.60225 8.78706 0.271219 12.1711C-0.0904063 13.0906 -0.0904063 14.1094 0.271219 15.0289C2.70238 21.21 8.82575 25.6 16 25.6C19.71 25.6 23.1391 24.426 25.9219 22.4373L23.7233 20.2843C21.5195 21.7464 18.8611 22.6 16 22.6C10.1346 22.6 5.121 19.0125 3.13008 13.9506C3.04142 13.7253 3.04142 13.4748 3.13008 13.2495C4.30834 10.2537 6.54529 7.77438 9.39096 6.24947L7.151 4.05599ZM12.1392 8.94069C10.7564 10.0408 9.87282 11.7193 9.87282 13.6C9.87282 16.9137 12.616 19.6 16 19.6C17.9204 19.6 19.6347 18.7348 20.7581 17.3806L18.5682 15.2362C18.0215 16.0573 17.0755 16.6 16 16.6C14.308 16.6 12.9364 15.2569 12.9364 13.6C12.9364 12.5469 13.4906 11.6203 14.329 11.0851L12.1392 8.94069ZM22.0701 14.4228L15.1598 7.65594C15.4345 7.61906 15.715 7.60001 16 7.60001C19.3839 7.60001 22.1272 10.2863 22.1272 13.6C22.1272 13.8792 22.1077 14.1538 22.0701 14.4228ZM26.0605 18.3304C27.2645 17.0727 28.2256 15.5889 28.8698 13.9506C28.9585 13.7253 28.9585 13.4748 28.8698 13.2495C26.879 8.18759 21.8654 4.60001 16 4.60001C14.7872 4.60001 13.6107 4.7534 12.4899 5.0415L10.0545 2.65656C11.9031 1.9737 13.9068 1.60001 16 1.60001C23.1742 1.60001 29.2975 5.99003 31.7288 12.1711C32.0904 13.0906 32.0904 14.1094 31.7288 15.0289C30.9295 17.0611 29.731 18.8997 28.2274 20.4523L26.0605 18.3304Z"
                    fill="currentColor"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {error && (
          <div
            id={`${id}-error`}
            className="mt-2 rounded bg-red-400/30 p-3 text-sm text-red-500"
          >
            {error}
          </div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
