import { atom, useAtom } from "jotai";

export const withdrawIdAtom = atom<string>("");

export const useWithdrawAtom = () => {
  const [withdrawId, setWithdrawId] = useAtom(withdrawIdAtom);

  return {
    withdrawId,
    setWithdrawId,
  };
};
