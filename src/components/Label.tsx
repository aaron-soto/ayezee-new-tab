import React from "react";

function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-sm font-medium text-neutral-300 ${className}`}
    >
      {children}
    </label>
  );
}

export default Label;
