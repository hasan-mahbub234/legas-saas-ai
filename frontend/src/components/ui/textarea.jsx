"use client";

import React from "react";
import { forwardRef } from "react";

export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-4 py-3 border border-border/50 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
