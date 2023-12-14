const postcode = "TW12";
const axios = require("axios");

const ratingFilter = (data) => {
  const filterData = data.filter(
    (restaurant) =>
      restaurant.Rating.Average > 4.5 && restaurant.Rating.Count >= 100
  );
  return filterData;
};

const etaPizzaFilter = (data) => {
  const filterData = data.filter(
    (restaurant) =>
      restaurant.DeliveryEtaMinutes.RangeUpper <= 45 &&
      restaurant.Cuisines.some((cuisine) => cuisine.Name === "Pizza")
  );
  return filterData;
};

const infoFilter = (data) => {
  const filterData = data.map((restaurant) => {
    return {
      name: restaurant.Name,
      url: restaurant.Url,
      address: `${restaurant.Address.FirstLine} ${restaurant.Address.Postcode}`,
    };
  });
  return filterData;
};

const filterJustEatData = (data) => {
  const ratingData = ratingFilter(data);
  const etaPizzaData = etaPizzaFilter(ratingData);
  const infoData = infoFilter(etaPizzaData);
  return infoData;
};

const justEatData = async () => {
  try {
    const response = await axios.get(
      `https://uk.api.just-eat.io/restaurants/bypostcode/${postcode}`
    );
    const filteredData = filterJustEatData(response.data.Restaurants);
    return filteredData;
  } catch (error) {
    console.error("Error while retrieving data: ", error);
    throw error;
  }
};

(async () => {
  const data = await justEatData();
  console.log(data);
})();
