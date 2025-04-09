'use client'
import Image from "next/image";
import styles from "./page.module.css";
import CustomerHeader from "./_components/CustomerHeader";
import Footer from "./_components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadLocations();
    loadRestaurants();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer/locations');
      const data = await response.json();
      if (data.success) {
        setLocations(data.result);
      } else {
        toast.error('Failed to load locations');
      }
    } catch (err) {
      setError('Failed to load locations');
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async (params) => {
    try {
      setLoading(true);
      let url = '/api/customer';
      if (params?.location) {
        url += `?location=${params.location}`;
      } else if (params?.restaurant) {
        url += `?restaurant=${params.restaurant}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.result);
      } else {
        toast.error('Failed to load restaurants');
      }
    } catch (err) {
      setError('Failed to load restaurants');
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false);
    loadRestaurants({ location: item });
  };

  return (
    <main className={styles.main}>
      <CustomerHeader />
      <div className={styles.banner}>
        <h1>Discover Amazing Food</h1>
        <div className={styles.searchContainer}>
          <div className={styles.locationInput}>
            <FiMapPin className={styles.icon} />
            <input
              type="text"
              value={selectedLocation}
              onClick={() => setShowLocation(true)}
              className={styles.selectInput}
              placeholder="Select Location"
              readOnly
            />
            {showLocation && (
              <ul className={styles.locationList}>
                {locations.map((item, index) => (
                  <li key={index} onClick={() => handleListItem(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.searchInput}>
            <FiSearch className={styles.icon} />
            <input
              type="text"
              className={styles.searchField}
              onChange={(event) => loadRestaurants({ restaurant: event.target.value })}
              placeholder="Search for restaurants or food"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.restaurantList}>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className={styles.restaurantCard}
              onClick={() => router.push(`/explore/${restaurant.name}?id=${restaurant._id}`)}
            >
              <div className={styles.restaurantInfo}>
                <h3>{restaurant.name}</h3>
                <p className={styles.contact}>Contact: {restaurant.contact}</p>
                <p className={styles.address}>
                  {restaurant.city}, {restaurant.address}
                </p>
                <p className={styles.email}>Email: {restaurant.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </main>
  );
}
