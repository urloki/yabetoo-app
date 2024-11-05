"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import BlurText from "@/components/ui/blur-text";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getAccountSecret} from "@/src/actions/auth/get-account-secret.action";

const ApiKey = () => {
  const { currentAccount } = useAccountAtom();

  const pk = currentAccount?.isLive
    ? currentAccount?.pkLive
    : currentAccount?.pkTest;

  const fetchText = async () => {
    const secret = await getAccountSecret(currentAccount?.id as string);
    return secret.secretValue;
  };

  return (
    <div>
      <div className="rounded border">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="text-3xl font-bold ">API keys</h3>
          </div>
          <div>
            <span>Learn more about API Authentication</span>
          </div>
        </div>
        <div className="px-5 py-2">
          <span>Viewing test API keys. Toggle to view live keys.</span>
        </div>
      </div>

      <div className="mt-5 rounded border">
        <div className="border-b p-5">
          <div>
            <h3 className="text-xl font-bold">Standard keys</h3>
          </div>
          <div>
            <span>These keys will allow you to authenticate API requests.</span>
          </div>
        </div>
        <div className="grid grid-cols-3 grid-rows-2">
          <span className="self-center border-b px-5 py-2">Name</span>
          <span className="self-center border-b px-5 py-2">Token</span>
          <span className="self-center border-b px-5 py-2" />

          <div className="border-b px-5 py-2">Account ID</div>
          <div className="border-b px-5 py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    navigator.clipboard
                      .writeText(currentAccount?.id as string)
                      .then(() => {
                        toast.info("Copied to clipboard");
                      });
                  }}
                  className="break-words"
                >
                  <span className="break-words">{currentAccount?.id}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="border-b px-5 py-2" />

          <div className="border-b px-5 py-2">Publishable key</div>
          <div className="border-b px-5 py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    navigator.clipboard.writeText(pk as string).then(() => {
                      toast.info("Copied to clipboard");
                    });
                  }}
                  className="break-words"
                >
                  <span className="break-words">{pk}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="border-b px-5 py-2" />

          <span className="px-5 py-2">Secret key</span>
          <div className="w-full px-5 py-2">
            <BlurText fetchText={fetchText} />
          </div>
          <span className="px-5 py-2" />
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
