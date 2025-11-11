import {
  FETCH_OFFER_ERROR,
  FETCH_OFFERS,
  START_OFFER_FETCHING,
} from "@/features/offerSlice";

export type offerProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: Date;
};

const offers: offerProduct[] = [
  {
    id: 1,
    name: "Wooden Toy Set",
    category: "Toys",
    price: 24.99,
    originalPrice: 45.0,
    image:
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: new Date("07-03-2025"),
  },
  {
    id: 2,
    name: "Kids Winter Outfit",
    category: "Clothing",
    price: 18.99,
    originalPrice: 35.0,
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: new Date("07-06-2025"),
  },
];

const fetchOffers = () => async (dispatch: any) => {
  try {
    dispatch(START_OFFER_FETCHING());

    // API call
    dispatch(FETCH_OFFERS(offers));
  } catch (error) {
    console.log(error);
    dispatch(FETCH_OFFER_ERROR(error));
  }
};

export { fetchOffers };
