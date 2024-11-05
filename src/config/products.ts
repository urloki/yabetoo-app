export const getProductCategory = (locale: string) => {
  switch (locale) {
    case "fr":
      return productCategoryFr;
    default:
      return productCategory;
  }
};

export const productCategory = [
  {
    value: "1",
    label: "Ebook",
  },
  {
    value: "2",
    label: "Digital goods or services (excluding ebooks)",
  },
  {
    value: "3",
    label: "Software as a service (SaaS)",
  },
  {
    value: "4",
    label: "Clothing",
  },
  {
    value: "5",
    label: "Other",
  },
];

export const productCategoryFr = [
  {
    value: "1",
    label: "Ebook",
  },
  {
    value: "2",
    label: "Biens ou services numériques (à l'exclusion des ebooks)",
  },
  {
    value: "3",
    label: "Logiciel en tant que service (SaaS)",
  },
  {
    value: "4",
    label: "Vêtements",
  },
  {
    value: "5",
    label: "Autre",
  },
];
