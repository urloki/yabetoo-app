import { atom, useAtom } from "jotai";

export interface PersonalData {
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
  files: File[];
  identityType: string;
  idCardFront: File | undefined;
  idCardBack: File | undefined;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
  files: [],
  identityType: "identityCard",
  idCardFront: undefined,
  idCardBack: undefined,
});

export const useOnboardingAtom = () => {
  const [personalData, setPersonalData] = useAtom(personalDataAtom);

  const updatePersonalData = (data: any) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setPersonalData((prev: any) => ({ ...prev, ...data }));
  };

  return {
    personalData,
    updatePersonalData,
  };
};
