"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

import XIcon from "@/components/icons/XIcon";

function NewLinkSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 text-black rounded-md cursor-pointer bg-neutral-100 px-7 hover:bg-neutral-300"
      >
        Add Link
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            ref={ref}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="absolute z-50 p-6 border shadow-lg rounded-xl right-2 bottom-2 top-2 border-neutral-700 bg-neutral-900 w-[420px]"
          >
            <button
              className="absolute p-2 rounded-lg cursor-pointer top-2 right-2 hover:bg-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              <XIcon />
            </button>
            <h2 className="mt-8 mb-4 text-xl font-semibold text-white">Add New Link</h2>

            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white" htmlFor="label">
                  Label
                </label>
                <input
                  className="w-full px-3 py-2 text-white rounded-md bg-neutral-800"
                  type="text"
                  id="label"
                  name="label"
                  placeholder="e.g., GitHub"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white" htmlFor="url">
                  URL
                </label>

                <input
                  className="w-full px-3 py-2 text-white rounded-md bg-neutral-800"
                  type="url"
                  id="url"
                  name="url"
                  placeholder="e.g., https://github.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-white" htmlFor="icon">
                  Icon
                </label>

                <input
                  className="w-full px-3 py-2 text-white rounded-md bg-neutral-800"
                  type="text"
                  id="icon"
                  name="icon"
                  placeholder="e.g., /path/to/icon.png"
                />
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  className="px-4 cursor-pointer text-neutral-300 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button className="py-1.5 text-black bg-white hover:bg-neutral-300 transition-colors cursor-pointer rounded-lg px-7">
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NewLinkSidebar;
