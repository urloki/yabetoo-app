import { atom, useAtom } from "jotai";

interface PersonalData {
  countryId: string | undefined;
  typeOfBusiness: string;
  businessStructure: string | undefined;
  operatorId: string | undefined;
  payoutPhoneNumber: string | undefined;
  currentStep: number;
  firstname: string;
  lastname: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  dateOfBirth: string | undefined;
  address: string | undefined;
  industry: string | undefined;
  businessDescription: string | undefined;
  businessWebsite: string | undefined;
  statementDescriptor: string | undefined;
  customerSupportPhoneNumber: string | undefined;
  productDescription: string | undefined;
  showCustomerSupportPhoneNumber: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  uploadedFiles: any[];
  isLoading: boolean;
}

// @ts-ignore
export const personalDataAtom = atom<PersonalData>({
  typeOfBusiness: "1",
  currentStep: 0,
  businessStructure: undefined,
  countryId: undefined,
  firstname: undefined,
  lastname: undefined,
  email: undefined,
  phoneNumber: undefined,
  dateOfBirth: undefined,
  address: undefined,
  industry: undefined,
  businessDescription: undefined,
  businessWebsite: undefined,
  statementDescriptor: undefined,
  customerSupportPhoneNumber: undefined,
  productDescription: undefined,
  uploadedFiles: [],
  isLoading: false,
});

export const useOnboardingAtom = () => {
  const [personalData, setPersonalData] = useAtom(personalDataAtom);

  const updatePersonalData = (
    data: Record<string, string | number | undefined | boolean>,
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setPersonalData((prev: any) => ({ ...prev, ...data }));
  };

  return {
    personalData,
    updatePersonalData,
  };
};
