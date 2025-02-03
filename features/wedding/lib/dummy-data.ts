import type { WeddingDetails, Guest, Group } from '../types';

export const dummyWeddingDetails: WeddingDetails = {
  id: 'wedding-1',
  brideName: "Ana Petrović",
  groomName: "Marko Jovanović",
  venue: {
    name: "Hotel Grand",
    address: "Bulevar oslobođenja 1",
    hall: "Kristalna dvorana"
  },
  date: "2024-08-15",
  pricePerPerson: 5000
};

export const dummyGroups: Group[] = [
  {
    id: "g1",
    name: "Uža porodica",
    side: "bride"
  },
  {
    id: "g2",
    name: "Prijatelji",
    side: "bride"
  },
  {
    id: "g3",
    name: "Uža porodica",
    side: "groom"
  },
  {
    id: "g4",
    name: "Kolege",
    side: "groom"
  },
  {
    id: "g5",
    name: "Rodbina",
    side: "bride"
  },
  {
    id: "g6",
    name: "Rodbina",
    side: "groom"
  },
  {
    id: "g7",
    name: "Fakultet",
    side: "bride"
  },
  {
    id: "g8",
    name: "Komšije",
    side: "groom"
  }
];

export const dummyGuests: Guest[] = [
  // Mladina strana - Uža porodica (g1)
  {
    id: "1",
    firstName: "Milica",
    lastName: "Petrović",
    phone: "0641234567",
    attendance: "yes",
    side: "bride",
    groupId: "g1",
    gift: {
      type: "money",
      amount: 50000
    },
    notes: "Majka mlade",
    companions: [
      {
        id: "c1",
        firstName: "Petar",
        lastName: "Petrović",
        isAdult: true
      }
    ]
  },
  {
    id: "2",
    firstName: "Dragana",
    lastName: "Petrović",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g1",
    gift: {
      type: "money",
      amount: 30000
    },
    notes: "Tetka mlade",
    companions: [
      {
        id: "c2",
        firstName: "Milan",
        lastName: "Petrović",
        isAdult: true
      }
    ]
  },
  {
    id: "3",
    firstName: "Jelena",
    lastName: "Petrović",
    phone: "0631234567",
    attendance: "yes",
    side: "bride",
    groupId: "g1",
    notes: "Sestra mlade",
    companions: []
  },

  // Mladina strana - Prijatelji (g2)
  {
    id: "4",
    firstName: "Jana",
    lastName: "Đorđević",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g2",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c3",
        firstName: "Stefan",
        lastName: "Đorđević",
        isAdult: true
      }
    ]
  },
  {
    id: "5",
    firstName: "Tamara",
    lastName: "Nikolić",
    phone: "0631234567",
    attendance: "pending",
    side: "bride",
    groupId: "g2",
    companions: []
  },

  // Mladina strana - Rodbina (g5)
  {
    id: "6",
    firstName: "Zoran",
    lastName: "Petrović",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g5",
    gift: {
      type: "other",
      description: "Set posuđa"
    },
    companions: [
      {
        id: "c4",
        firstName: "Svetlana",
        lastName: "Petrović",
        isAdult: true
      },
      {
        id: "c5",
        firstName: "Marko",
        lastName: "Petrović",
        isAdult: false
      }
    ]
  },
  {
    id: "7",
    firstName: "Goran",
    lastName: "Petrović",
    phone: "0631234567",
    attendance: "no",
    side: "bride",
    groupId: "g5",
    notes: "Ne može zbog službenog puta",
    companions: []
  },

  // Mladina strana - Fakultet (g7)
  {
    id: "8",
    firstName: "Ivana",
    lastName: "Marković",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g7",
    gift: {
      type: "money",
      amount: 15000
    },
    companions: [
      {
        id: "c6",
        firstName: "Miloš",
        lastName: "Marković",
        isAdult: true
      }
    ]
  },
  {
    id: "9",
    firstName: "Jovana",
    lastName: "Simić",
    phone: "0631234567",
    attendance: "pending",
    side: "bride",
    groupId: "g7",
    companions: []
  },

  // Mladoženjina strana - Uža porodica (g3)
  {
    id: "10",
    firstName: "Dragan",
    lastName: "Jovanović",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: "g3",
    gift: {
      type: "money",
      amount: 100000
    },
    notes: "Otac mladoženje",
    companions: [
      {
        id: "c7",
        firstName: "Vesna",
        lastName: "Jovanović",
        isAdult: true
      }
    ]
  },
  {
    id: "11",
    firstName: "Milan",
    lastName: "Jovanović",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g3",
    gift: {
      type: "money",
      amount: 40000
    },
    notes: "Brat mladoženje",
    companions: [
      {
        id: "c8",
        firstName: "Ana",
        lastName: "Jovanović",
        isAdult: true
      },
      {
        id: "c9",
        firstName: "Nikola",
        lastName: "Jovanović",
        isAdult: false
      }
    ]
  },

  // Mladoženjina strana - Kolege (g4)
  {
    id: "12",
    firstName: "Nikola",
    lastName: "Stanković",
    phone: "0647894561",
    attendance: "pending",
    side: "groom",
    groupId: "g4",
    companions: []
  },
  {
    id: "13",
    firstName: "Marija",
    lastName: "Pavlović",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g4",
    gift: {
      type: "money",
      amount: 25000
    },
    companions: [
      {
        id: "c10",
        firstName: "Dejan",
        lastName: "Pavlović",
        isAdult: true
      }
    ]
  },

  // Mladoženjina strana - Rodbina (g6)
  {
    id: "14",
    firstName: "Miroslav",
    lastName: "Jovanović",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: "g6",
    gift: {
      type: "other",
      description: "Set vina"
    },
    companions: [
      {
        id: "c11",
        firstName: "Jelena",
        lastName: "Jovanović",
        isAdult: true
      }
    ]
  },
  {
    id: "15",
    firstName: "Branko",
    lastName: "Jovanović",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g6",
    gift: {
      type: "money",
      amount: 35000
    },
    companions: [
      {
        id: "c12",
        firstName: "Milica",
        lastName: "Jovanović",
        isAdult: true
      },
      {
        id: "c13",
        firstName: "Sara",
        lastName: "Jovanović",
        isAdult: false
      }
    ]
  },

  // Mladoženjina strana - Komšije (g8)
  {
    id: "16",
    firstName: "Branko",
    lastName: "Đurić",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: "g8",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c14",
        firstName: "Milena",
        lastName: "Đurić",
        isAdult: true
      }
    ]
  },
  {
    id: "17",
    firstName: "Igor",
    lastName: "Kovačević",
    phone: "0631234567",
    attendance: "pending",
    side: "groom",
    groupId: "g8",
    companions: []
  },

  // Dodatni gosti - Mladina strana - Prijatelji (g2)
  {
    id: "18",
    firstName: "Nina",
    lastName: "Stojanović",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g2",
    gift: {
      type: "money",
      amount: 15000
    },
    companions: [
      {
        id: "c15",
        firstName: "Marko",
        lastName: "Stojanović",
        isAdult: true
      }
    ]
  },
  {
    id: "19",
    firstName: "Ana",
    lastName: "Popović",
    phone: "0631234567",
    attendance: "yes",
    side: "bride",
    groupId: "g2",
    companions: []
  },

  // Dodatni gosti - Mladina strana - Rodbina (g5)
  {
    id: "20",
    firstName: "Dušan",
    lastName: "Petrović",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g5",
    gift: {
      type: "money",
      amount: 25000
    },
    companions: [
      {
        id: "c16",
        firstName: "Teodora",
        lastName: "Petrović",
        isAdult: true
      }
    ]
  },

  // Dodatni gosti - Mladoženjina strana - Kolege (g4)
  {
    id: "21",
    firstName: "Stefan",
    lastName: "Ilić",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g4",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c17",
        firstName: "Maja",
        lastName: "Ilić",
        isAdult: true
      }
    ]
  },
  {
    id: "22",
    firstName: "Aleksandar",
    lastName: "Todorović",
    phone: "0647894561",
    attendance: "pending",
    side: "groom",
    groupId: "g4",
    companions: []
  },

  // Dodatni gosti - Mladoženjina strana - Rodbina (g6)
  {
    id: "23",
    firstName: "Vladimir",
    lastName: "Jovanović",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g6",
    gift: {
      type: "other",
      description: "Set čaša"
    },
    companions: [
      {
        id: "c18",
        firstName: "Marina",
        lastName: "Jovanović",
        isAdult: true
      },
      {
        id: "c19",
        firstName: "Lena",
        lastName: "Jovanović",
        isAdult: false
      }
    ]
  },

  // Dodatni gosti - Mladina strana - Fakultet (g7)
  {
    id: "24",
    firstName: "Milica",
    lastName: "Đorđević",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g7",
    gift: {
      type: "money",
      amount: 15000
    },
    companions: [
      {
        id: "c20",
        firstName: "Luka",
        lastName: "Đorđević",
        isAdult: true
      }
    ]
  },

  // Negrupisani gosti - Mladina strana
  {
    id: "25",
    firstName: "Marina",
    lastName: "Kovačević",
    phone: "0631234567",
    attendance: "yes",
    side: "bride",
    groupId: null,
    gift: {
      type: "money",
      amount: 10000
    },
    companions: [
      {
        id: "c21",
        firstName: "Ana",
        lastName: "Kovačević",
        isAdult: false
      }
    ]
  },
  {
    id: "26",
    firstName: "Elena",
    lastName: "Radić",
    phone: "0647894561",
    attendance: "pending",
    side: "bride",
    groupId: null,
    companions: []
  },

  // Negrupisani gosti - Mladoženjina strana
  {
    id: "27",
    firstName: "Aleksandar",
    lastName: "Popović",
    phone: "0631234567",
    attendance: "no",
    side: "groom",
    groupId: null,
    notes: "Ne može zbog puta",
    companions: []
  },
  {
    id: "28",
    firstName: "Lazar",
    lastName: "Marković",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: null,
    gift: {
      type: "money",
      amount: 15000
    },
    companions: [
      {
        id: "c22",
        firstName: "Sara",
        lastName: "Marković",
        isAdult: true
      }
    ]
  },

  // Dodatni gosti za postojeće grupe
  {
    id: "29",
    firstName: "Filip",
    lastName: "Janković",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g4",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c23",
        firstName: "Mila",
        lastName: "Janković",
        isAdult: true
      }
    ]
  },
  {
    id: "30",
    firstName: "Teodora",
    lastName: "Lazić",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g2",
    companions: []
  },

  // Poslednji set gostiju
  {
    id: "31",
    firstName: "David",
    lastName: "Stanković",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g8",
    gift: {
      type: "money",
      amount: 25000
    },
    companions: [
      {
        id: "c24",
        firstName: "Ana",
        lastName: "Stanković",
        isAdult: true
      },
      {
        id: "c25",
        firstName: "Luka",
        lastName: "Stanković",
        isAdult: false
      }
    ]
  },
  {
    id: "32",
    firstName: "Sofija",
    lastName: "Nikolić",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g7",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c26",
        firstName: "Marko",
        lastName: "Nikolić",
        isAdult: true
      }
    ]
  },
  {
    id: "33",
    firstName: "Vuk",
    lastName: "Đurić",
    phone: "0631234567",
    attendance: "yes",
    side: "groom",
    groupId: "g6",
    gift: {
      type: "other",
      description: "Set vina"
    },
    companions: []
  },
  {
    id: "34",
    firstName: "Mia",
    lastName: "Petrović",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g5",
    gift: {
      type: "money",
      amount: 30000
    },
    companions: [
      {
        id: "c27",
        firstName: "Luka",
        lastName: "Petrović",
        isAdult: true
      }
    ]
  },
  {
    id: "35",
    firstName: "Ognjen",
    lastName: "Jovanović",
    phone: "0631234567",
    attendance: "pending",
    side: "groom",
    groupId: "g4",
    companions: []
  },
  {
    id: "36",
    firstName: "Sara",
    lastName: "Ilić",
    phone: "0647894561",
    attendance: "yes",
    side: "bride",
    groupId: "g2",
    gift: {
      type: "money",
      amount: 15000
    },
    companions: [
      {
        id: "c28",
        firstName: "Nikola",
        lastName: "Ilić",
        isAdult: true
      }
    ]
  },
  {
    id: "37",
    firstName: "Lena",
    lastName: "Marković",
    phone: "0631234567",
    attendance: "yes",
    side: "bride",
    groupId: "g7",
    companions: []
  },
  {
    id: "38",
    firstName: "Mateja",
    lastName: "Kovač",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: "g8",
    gift: {
      type: "money",
      amount: 20000
    },
    companions: [
      {
        id: "c29",
        firstName: "Nina",
        lastName: "Kovač",
        isAdult: true
      }
    ]
  },
  {
    id: "39",
    firstName: "Katarina",
    lastName: "Petrović",
    phone: "0631234567",
    attendance: "yes",
    side: "bride",
    groupId: "g5",
    gift: {
      type: "other",
      description: "Set peškira"
    },
    companions: [
      {
        id: "c30",
        firstName: "Stefan",
        lastName: "Petrović",
        isAdult: true
      }
    ]
  },
  {
    id: "40",
    firstName: "Nemanja",
    lastName: "Jovanović",
    phone: "0647894561",
    attendance: "yes",
    side: "groom",
    groupId: "g6",
    gift: {
      type: "money",
      amount: 25000
    },
    companions: [
      {
        id: "c31",
        firstName: "Jelena",
        lastName: "Jovanović",
        isAdult: true
      },
      {
        id: "c32",
        firstName: "Mila",
        lastName: "Jovanović",
        isAdult: false
      }
    ]
  }
];