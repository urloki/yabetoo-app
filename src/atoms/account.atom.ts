import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Account } from "@/src/shemas/account/account.schema";
import { OrganizationType } from "@/src/shemas/organization/organization.schema";

export const accountsAtom = atomWithStorage<Array<Account>>("accounts", []);
export const currentAccountAtom = atomWithStorage<Account | null>(
  "currentAccount",
  null,
);

export const organizationsAtom = atomWithStorage<Array<OrganizationType>>(
  "organizations",
  [],
);
export const currentOrganizationAtom = atomWithStorage<OrganizationType | null>(
  "currentOrganization",
  null,
);

export const useAccountAtom = () => {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom);

  const [organizations, setOrganizations] = useAtom(organizationsAtom);
  const [currentOrganization, setCurrentOrganization] = useAtom(
    currentOrganizationAtom,
  );

  const addAccount = (account: Account) => {
    setAccounts((accounts: Array<Account>) => [...accounts, account]);
  };

  return {
    accounts,
    currentAccount,
    addAccount,
    setCurrentAccount,
    setAccounts,
    organizations,
    currentOrganization,
    setCurrentOrganization,
    setOrganizations,
  };
};
