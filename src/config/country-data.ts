const countryData = {
  country: [
    {
      label: "Congo",
      value: "congo",
      format: "242 ## ### ####",
      code: "cg",
      currency: "xaf",
    },
    {
      label: "France",
      value: "france",
      format: "+33 # ## ## ## ##",
      code: "fr",
      currency: "eur",
    },
    /*{
            id: "2",
            label: "Niger",
            value: "niger",
            format: "+227 ### ### ##",
            code: "NE",
            currency: "XOF",
        },
        {
            id: "3",
            label: "DR Congo",
            value: "drcongo",
            format: "+222 ### ## ##",
            code: "CD",
            currency: "CDF",
        },*/
  ],
  operator: {
    congo: [
      {
        label: "MTN",
        value: "mtn",
        path: "congo/mtn/pay",
      },
      {
        label: "Airtel",
        value: "airtel",
        path: "congo/airtel/pay",
      },
    ],
    niger: [
      {
        label: "Airtel",
        value: "airtel",
        path: "airtel/pay",
      },
    ],
    drcongo: [
      {
        label: "Airtel",
        value: "airtel",
        path: "airtel/pay",
      },
    ],
  },
};

export default countryData;
