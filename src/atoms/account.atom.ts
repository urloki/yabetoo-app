import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import {Account} from "@/src/shemas/account/account.schema";

export const accountsAtom = atomWithStorage<Array<Account>>("accounts", []);
export const currentAccountAtom = atomWithStorage<Account | null>(
  "currentAccount",
  null,
);

export const useAccountAtom = () => {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom);

  const addAccount = (account: Account) => {
    setAccounts((accounts: Array<Account>) => [...accounts, account]);
  };

  return {
    accounts,
    currentAccount,
    addAccount,
    setCurrentAccount,
    setAccounts,
  };
};
