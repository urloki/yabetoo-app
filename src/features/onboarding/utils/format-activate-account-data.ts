import { PersonalData } from "@/src/atoms/onboarding.atom";
import { getPhoneData } from "@/components/phone-input";
import { format } from "@formkit/tempo";
import { getLocalTimeZone } from "@internationalized/date";
import { jsonToFormData } from "@/lib/json-to-form-data";

export const formatActivateAccountData = (
  personalData: PersonalData,
  values: any,
) => {
  const data = {
    businessType: {
      businessStructure: personalData.businessStructure,
      typeOfBusiness: personalData.typeOfBusiness.toString(),
    },
    payoutMethod: {
      phoneOperatorId: personalData.operatorId?.toString(),
      phoneNumber: getPhoneData(
        personalData.payoutPhoneNumber as string,
      ).phoneNumber?.split("+")[1] as string,
    },
    personalInfo: {
      address: personalData.address as string,
      dateOfBirth: format(
        // @ts-ignore
        personalData.dateOfBirth?.toDate(getLocalTimeZone()),
        "YYYY-MM-DD",
      ),
      email: personalData.email as string,
      firstName: personalData.firstname as string,
      lastName: personalData.lastname as string,
      phoneNumber: getPhoneData(
        personalData.phoneNumber as string,
      ).phoneNumber?.split("+")[1] as string,
    },
    businessInfo: {
      productDescription: personalData.productDescription as string,
      industry: personalData.industry as string,
      businessWebsite: personalData.businessWebsite as string,
      statementDescriptor: personalData.statementDescriptor as string,
      customerSupportPhoneNumber: getPhoneData(
        personalData.customerSupportPhoneNumber as string,
      ).phoneNumber?.split("+")[1] as string,
      showSupportPhoneNumber:
        personalData.showCustomerSupportPhoneNumber as boolean,
    },
    identityType: values.identityType,
    idCardFront: values.idCardFront,
    idCardBack: values.idCardBack,
    documents: values.files,
  };

  return jsonToFormData(data as never);
};
