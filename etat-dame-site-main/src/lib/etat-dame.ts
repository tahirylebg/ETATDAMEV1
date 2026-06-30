import brunchImg from "@/assets/brunch.jpg";
import cocktailImg from "@/assets/cocktail.jpg";
import heroImg from "@/assets/hero-brunch.jpg";
import interiorImg from "@/assets/interior.jpg";
import avocadoToastImg from "@/assets/menu-photos/avocado-toast.jpg";
import cocktailBlueImg from "@/assets/menu-photos/cocktail-blue.jpg";
import eggDeluxeImg from "@/assets/menu-photos/egg-deluxe.jpg";
import eggRollImg from "@/assets/menu-photos/egg-roll.jpg";
import latteImg from "@/assets/menu-photos/latte.jpg";
import matchaLatteImg from "@/assets/menu-photos/matcha-latte.jpg";
import pancakeSaleImg from "@/assets/menu-photos/pancake-sale.jpg";
import pancakeSucreImg from "@/assets/menu-photos/pancake-sucre.jpg";
import shawarmaImg from "@/assets/menu-photos/shawarma.jpg";
import yaourtBowlImg from "@/assets/menu-photos/yaourt-bowl.jpg";
import placeStoryImg from "@/assets/story/place-story.jpg";
import tapasImg from "@/assets/tapas.jpg";

export const PHONE = "+33666339242";
export const PHONE_DISPLAY = "06 66 33 92 42";
export const EMAIL = "etatdame.contact@gmail.com";
export const ADDRESS = "12 Rue Littré, 30000 Nîmes";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=12+Rue+Littr%C3%A9+30000+N%C3%AEmes";
export const INSTAGRAM_HANDLE = "@Etatdame_Brunch";
export const INSTAGRAM_URL = "https://www.instagram.com/Etatdame_Brunch/";
export const SITE_URL = "https://etatdame.fr";
export const RESERVATION_URL = "https://www.sumupbookings.com/etatdame";
export const STORY_VIDEO_URL = "/media/etat-dame-story.mov";
export const STORY_POSTER_URL = "/media/etat-dame-story-poster.jpg";

export const images = {
  brunch: brunchImg,
  cocktail: cocktailImg,
  cocktailBlue: cocktailBlueImg,
  avocadoToast: avocadoToastImg,
  eggDeluxe: eggDeluxeImg,
  eggRoll: eggRollImg,
  hero: heroImg,
  interior: interiorImg,
  latte: latteImg,
  matchaLatte: matchaLatteImg,
  pancakeSale: pancakeSaleImg,
  pancakeSucre: pancakeSucreImg,
  placeStory: placeStoryImg,
  shawarma: shawarmaImg,
  tapas: tapasImg,
  yaourtBowl: yaourtBowlImg,
};

export type BaseItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  detail: string;
  image: string;
  mood: string;
};

export type ExtraItem = {
  id: string;
  name: string;
  price: number;
  note?: string;
};

export type MenuItem = {
  name: string;
  price: string;
  description?: string;
};

export type DigitalMenuItem = {
  name: string;
  price: string;
  note?: string;
  vegetarian?: boolean;
};

export type DigitalMenuGroup = {
  title: string;
  items: DigitalMenuItem[];
  composition?: string;
  choiceLabel?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  note?: string;
  compact?: boolean;
};

export const bases: BaseItem[] = [
  {
    id: "egg-deluxe",
    name: "Egg'n Deluxe",
    price: 1500,
    description:
      "Pain burger au levain, guacamole maison, cream cheese maison, oeuf au plat, micro-pousses de poireaux et salade de roquette.",
    detail: "La base la plus généreuse pour un brunch salé complet.",
    image: eggDeluxeImg,
    mood: "crémeux, brioché, très brunch",
  },
  {
    id: "pancake-sale",
    name: "Pancake salé",
    price: 1500,
    description:
      "Pancakes moelleux, oeufs brouillés, sauce fromagère maison, mélange de sirop d'érable.",
    detail: "Le choix doux-salé qui donne une vraie personnalité à l'assiette.",
    image: heroImg,
    mood: "moelleux, généreux, réconfortant",
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    price: 1400,
    description: "Pain toasté, guacamole maison, oeuf, micro-pousses et salade de roquette.",
    detail: "Frais, généreux, facile à twister avec une garniture.",
    image: avocadoToastImg,
    mood: "frais, vert, acidulé",
  },
];

export const garnitures: ExtraItem[] = [
  { id: "aubergine", name: "Aubergine confite", price: 0, note: "sans viande" },
  { id: "falafels", name: "Falafels", price: 100, note: "sans viande" },
  { id: "bacon", name: "Bacon", price: 100 },
  { id: "saumon", name: "Saumon gravlax", price: 200 },
  { id: "poulet", name: "Poulet mariné", price: 300 },
  { id: "boeuf", name: "Effiloché de boeuf", price: 300, note: "selon disponibilité" },
  { id: "stracciatella", name: "Stracciatella", price: 300 },
];

export const gourmandises: MenuItem[] = [
  {
    name: "Shawarma",
    price: "19€",
    description:
      "Pain maison, légumes marinés, sauce maison. Viande au choix: poulet mariné ou effiloché de boeuf selon disponibilité.",
  },
  {
    name: "Pancake sucré",
    price: "15€",
    description:
      "Sirop d'érable et beurre salé, mangue rôtie, crème Bueno, Nutella banane ou autres recettes de la carte.",
  },
  {
    name: "Yaourt bowl",
    price: "13€",
    description: "Fruits du moment, amandes, noix et miel, avec une version crème de Bueno.",
  },
  {
    name: "Cake perdu",
    price: "12€",
    description:
      "Marbré maison façon pain perdu, yaourt brassé, caramel beurre salé et amandes torréfiées.",
  },
  {
    name: "Cookie",
    price: "5€",
    description: "Big cookie garni de crème de pistache ou de caramel beurre salé.",
  },
];

export const supplements: MenuItem[] = [
  { name: "Oeuf supplémentaire", price: "2€" },
  { name: "Avocat", price: "2€" },
  { name: "Fromage", price: "1,50€" },
  { name: "Sirop d'érable", price: "1€" },
  { name: "Pain sans gluten", price: "1,50€" },
];

export const boissons: MenuItem[] = [
  { name: "Café / Allongé", price: "2,50€" },
  { name: "Cappuccino / Latte", price: "4€" },
  { name: "Thé / Infusion", price: "3,50€" },
  { name: "Jus pressé", price: "4,50€" },
  { name: "Matcha Latte", price: "5€" },
];

export const foodMenu: DigitalMenuGroup[] = [
  {
    title: "Egg'n Deluxe",
    composition:
      "Pain burger au levain, guacamole maison, cream cheese maison, oeuf au plat, micro-pousses de poireaux et salade de roquette.",
    choiceLabel: "Garniture au choix",
    image: eggDeluxeImg,
    imageAlt: "Egg'n Deluxe avec pain au levain, oeuf, saumon gravlax et micro-pousses",
    imagePosition: "50% 56%",
    items: [
      { name: "Aubergine confite", price: "15€", vegetarian: true },
      { name: "Falafels", price: "16€", vegetarian: true },
      { name: "Bacon", price: "16€" },
      { name: "Saumon gravlax", price: "17€" },
      { name: "Poulet mariné", price: "18€" },
    ],
  },
  {
    title: "Egg Roll",
    composition: "Roll aux oeufs, ciboulette, micro-pousses et salade.",
    choiceLabel: "Version au choix",
    image: eggRollImg,
    imageAlt: "Egg roll servi avec bacon croustillant et micro-pousses",
    imagePosition: "50% 56%",
    items: [
      { name: "Nature", price: "12€", vegetarian: true },
      { name: "Bacon", price: "16€" },
      { name: "Effiloché de boeuf", price: "18€", note: "Selon disponibilité." },
    ],
  },
  {
    title: "Yaourt Bowl",
    composition: "Yaourt bowl accompagné de fruits du moment, d'amandes et de noix.",
    choiceLabel: "Topping au choix",
    image: yaourtBowlImg,
    imageAlt: "Yaourt bowl coloré avec fruits, coulis et cocktails signature",
    imagePosition: "50% 63%",
    items: [
      {
        name: "Classic",
        price: "12€",
        note: "Fruits du moment, amandes, noix et miel.",
      },
      {
        name: "Crème de Bueno",
        price: "13€",
        note: "Fruits du moment, crème de Bueno, Kinder Bueno, amandes et noix.",
      },
      { name: "Crème de pistache", price: "16€" },
    ],
  },
  {
    title: "Pancake salé",
    composition:
      "Pancakes moelleux, oeufs brouillés, sauce fromagère maison, mélange de sirop d'érable.",
    choiceLabel: "Garniture au choix",
    image: pancakeSaleImg,
    imageAlt: "Pancake salé servi avec garniture brunch",
    imagePosition: "50% 58%",
    items: [
      { name: "Saumon gravlax", price: "17€" },
      { name: "Bacon fumé", price: "17€" },
      { name: "Effiloché de boeuf", price: "19€", note: "Selon disponibilité." },
    ],
  },
  {
    title: "Pancake sucré",
    composition: "Pancakes moelleux, garniture sucrée au choix.",
    choiceLabel: "Garniture au choix",
    image: pancakeSucreImg,
    imageAlt: "Pancakes et brunch sucré ÉTAT DAME",
    imagePosition: "50% 56%",
    items: [
      {
        name: "Caramel beurre salé",
        price: "15€",
        note: "Sirop d'érable et beurre salé.",
      },
      {
        name: "Nutella banane",
        price: "15€",
        note: "Nutella, amandes torréfiées et banane.",
      },
      { name: "Fruits rouges", price: "15€" },
      {
        name: "Mangue rôtie",
        price: "16€",
        note: "Yaourt, mangue rôtie à la cannelle, amandes torréfiées et coulis de mangue 100 %.",
      },
      {
        name: "Crème Bueno",
        price: "16€",
        note: "Crème de Bueno, amandes, fraises, coulis de mûre et morceaux de Kinder Bueno.",
      },
      { name: "Crème pistache", price: "17€" },
    ],
  },
  {
    title: "Cookie",
    composition: "Big cookie maison garni au choix.",
    choiceLabel: "Garniture au choix",
    items: [
      {
        name: "Caramel beurre salé",
        price: "5€",
        note: "Généreusement garni de caramel beurre salé.",
      },
      {
        name: "Crème de pistache",
        price: "5€",
        note: "Généreusement garni de crème de pistache.",
      },
    ],
  },
  {
    title: "Avocado Toast",
    composition: "Pain toasté, guacamole maison, oeuf, micro-pousses et salade de roquette.",
    choiceLabel: "Garniture au choix",
    image: avocadoToastImg,
    imageAlt: "Avocado toast au guacamole maison sur pain toasté",
    imagePosition: "50% 64%",
    items: [
      { name: "Aubergine confite", price: "14€", vegetarian: true },
      { name: "Falafels", price: "15€", vegetarian: true },
      { name: "Bacon", price: "16€" },
      { name: "Saumon gravlax", price: "17€" },
      { name: "Poulet mariné", price: "17€" },
      { name: "Effiloché de boeuf", price: "18€", note: "Selon disponibilité." },
      { name: "Straciatella", price: "19€", vegetarian: true },
    ],
  },
  {
    title: "Shawarma",
    composition: "Pain maison, légumes marinés, sauce maison.",
    choiceLabel: "Viande au choix",
    image: shawarmaImg,
    imageAlt: "Shawarma maison avec légumes marinés et micro-pousses",
    imagePosition: "50% 42%",
    items: [
      { name: "Poulet mariné", price: "19€" },
      { name: "Effiloché de boeuf", price: "21€", note: "Selon disponibilité." },
    ],
  },
  {
    title: "Cake perdu",
    composition:
      "Marbré maison façon pain perdu, yaourt brassé, caramel beurre salé et amandes torréfiées.",
    items: [{ name: "Amandes et caramel", price: "12€" }],
  },
  {
    title: "Suppléments",
    compact: true,
    items: [
      { name: "Sirop d'érable", price: "3€" },
      { name: "Nutella", price: "3€" },
    ],
  },
];

export const drinkMenu: DigitalMenuGroup[] = [
  {
    title: "Limonade",
    items: [
      { name: "Citron vert", price: "5€" },
      { name: "Orange sanguine", price: "6€" },
      { name: "Maté citron", price: "7€" },
      { name: "Passion", price: "7€" },
      { name: "Gingembre", price: "5€" },
    ],
  },
  {
    title: "Café",
    items: [
      { name: "Court", price: "3€" },
      { name: "Long", price: "4€" },
    ],
  },
  {
    title: "Thé",
    items: [
      { name: "American Breakfast", price: "5€" },
      { name: "Thé à la menthe", price: "5€" },
      { name: "Chaï latte", price: "7€" },
    ],
  },
  {
    title: "Eau",
    items: [
      { name: "Orezza", price: "5€" },
      { name: "Eau de coco", price: "5€" },
    ],
  },
  {
    title: "Iced latte",
    image: latteImg,
    imageAlt: "Latte glacé avec dessin en mousse tenu au comptoir",
    imagePosition: "50% 46%",
    items: [
      { name: "Iced coffee latte", price: "6€" },
      { name: "Iced mango latte", price: "7€" },
      { name: "Iced berry latte", price: "7€" },
      { name: "Iced passion latte", price: "8€" },
      { name: "Iced pistachio latte", price: "8€" },
      { name: "Iced nutella latte", price: "8€" },
      { name: "Iced chaï latte", price: "8€" },
    ],
  },
  {
    title: "Matcha latte",
    image: matchaLatteImg,
    imageAlt: "Matcha latte glacé servi avec une fleur",
    imagePosition: "50% 52%",
    items: [
      { name: "Matcha latte", price: "6€" },
      { name: "Iced matcha latte", price: "6€" },
      { name: "Iced berry matcha", price: "7€" },
      { name: "Iced mango matcha", price: "8€" },
      { name: "Iced passion matcha", price: "8€" },
      { name: "Iced yuzu matcha", price: "8€" },
      { name: "Iced coco matcha foam", price: "8€" },
    ],
  },
  {
    title: "Jus",
    items: [
      { name: "Passion", price: "6€" },
      { name: "Fruit du dragon", price: "7€" },
      { name: "Goyave", price: "7€" },
    ],
  },
  {
    title: "Bière",
    items: [{ name: "Corona", price: "6€" }],
  },
  {
    title: "Extras boissons",
    items: [
      { name: "Lait d'avoine", price: "0,70€" },
      { name: "Sirop de vanille", price: "0,70€" },
    ],
  },
];

export const cocktailMenu: DigitalMenuGroup[] = [
  {
    title: "Cocktails signature",
    image: cocktailBlueImg,
    imageAlt: "Cocktail signature bleu servi chez ÉTAT DAME",
    imagePosition: "50% 54%",
    items: [
      { name: "Mango Passion", price: "11€" },
      { name: "Espresso Martini", price: "15€" },
      { name: "Koso Dry", price: "13€" },
      { name: "Ginger'n Matcha", price: "15€" },
      { name: "Pitaya bliss", price: "13€" },
      { name: "Mexican Kick", price: "12€" },
      { name: "Tiramisu", price: "15€" },
      { name: "Miel & Tabac", price: "13€" },
      { name: "Fresh Gin", price: "15€" },
      { name: "Sakura Negroni", price: "15€" },
      { name: "Pink Panther", price: "15€" },
    ],
  },
];

export const hours = [
  ["Lundi", "11:00 - 15:00"],
  ["Mardi", "Fermé"],
  ["Mercredi", "Fermé"],
  ["Jeudi", "11:00 - 15:00  /  18:30 - 23:00"],
  ["Vendredi", "11:00 - 15:00  /  18:30 - 23:00"],
  ["Samedi", "11:00 - 15:00  /  18:30 - 23:00"],
  ["Dimanche", "11:00 - 15:00"],
];

export function euro(cents: number) {
  if (cents === 0) return "+0€";
  const value = cents / 100;
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2).replace(".", ",")}€`;
}

export function reservationHref(message: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Demande de réservation ÉTAT DAME",
  )}&body=${encodeURIComponent(message)}`;
}

export function smsHref(message: string) {
  return `sms:${PHONE}?&body=${encodeURIComponent(message)}`;
}

export function defaultReservationMessage(extraLine?: string) {
  return [
    "Bonjour ÉTAT DAME,",
    "",
    "Je souhaite réserver une table.",
    "Date:",
    "Horaire:",
    "Nombre de personnes:",
    extraLine ? `Choix souhaité: ${extraLine}` : "",
    "",
    "Merci.",
  ]
    .filter(Boolean)
    .join("\n");
}
