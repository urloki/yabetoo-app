"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export default function BlurText({
  fetchText,
}: {
  fetchText: () => Promise<string>;
}) {
  const [isBlurred, setIsBlurred] = useState(true);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isBlurred && !text) {
      setIsLoading(true);
      fetchText()
        .then((fetchedText) => {
          setText(fetchedText);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isBlurred, text, fetchText]);

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.info("Copied to clipboard");
    });
  };

  return (
    <div className="relative inline-block w-full">
      {!isBlurred && text ? (
        <span
          onClick={copyToClipboard}
          onKeyUp={copyToClipboard}
          className="transition-filter inline-block w-full"
        >
          {text}
        </span>
      ) : (
        <span className="inline-block w-full blur-md">
          This is a secret message that will be revealed when you click the
          icon.
        </span>
      )}

      <Button
        variant={"secondary"}
        size={"sm"}
        onClick={toggleBlur}
        className={cn(
          isBlurred &&
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          !isBlurred && "mt-2",
        )}
      >
        <span>{isBlurred ? "Reveal" : "Hide"} secret key</span>
        {isLoading && <Icons.spinner className="ml-3" />}
      </Button>
    </div>
  );
}
