import CountdownTimer from "@/components/CountdownTimer";
import Loader from "@/components/Loader";
import { fetchOffers, type offerProduct } from "@/services/offer";
import type { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Offers = () => {
  const loading = useSelector((state: RootState) => state.offer.loading);
  const dispatch = useDispatch<AppDispatch>();
  const offers: offerProduct[] = useSelector(
    (state: RootState) => state.offer.offers
  );

  useEffect(() => {
    dispatch(fetchOffers());
  }, []);
  return (
    <div
      className={`relative ${loading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {loading && <Loader />}

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-emerald-700">
          Live Offers
        </h1>

        {offers.length === 0 ? (
          <p className="text-gray-500">No active offers available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {offers.map((offer) => {
              const discount = Math.round(
                ((offer.originalPrice - offer.price) / offer.originalPrice) *
                  100
              );
              const formattedDate = new Date(offer.duration).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={offer.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg">{offer.name}</h2>
                    <p className="text-sm text-gray-600 capitalize">
                      {offer.category}
                    </p>
                    <p className="text-gray-800 text-sm">
                      ₹{offer.price}{" "}
                      <span className="text-sm line-through text-gray-400 ml-2">
                        ₹{offer.originalPrice}
                      </span>
                    </p>
                    <p className="text-green-600 text-sm font-semibold">
                      {discount}% OFF
                    </p>
                    <CountdownTimer endTime={offer.duration} />
                    <p className="text-xs text-gray-500">
                      Expires on: {formattedDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
