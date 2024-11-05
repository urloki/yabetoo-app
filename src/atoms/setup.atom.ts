import { atom, useAtom } from "jotai";

interface ISetup {
  name: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  isSubmitting: boolean;
}

export const setupAtom = atom<ISetup>({
  name: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  isSubmitting: false,
});

export const useSetupAtom = () => {
  const [setup, setSetup] = useAtom(setupAtom);

  const updateSetup = (data: Record<string, string | boolean>) => {
    setSetup((prev) => ({ ...prev, ...data }));
  };

  return {
    setup,
    updateSetup,
  };
};
