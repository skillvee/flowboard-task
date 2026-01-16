"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.href = "/"}>
            Go home
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-left bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="font-mono text-sm text-red-700">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
