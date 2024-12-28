"use client";
import React, { useEffect, useState, useRef } from "react";
import CardProductAdmin from "./products/CardProductAdmin";
import APIURL from "../URL";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

library.add(fas);

export interface AdminProductType {
  _id: string;
  id?: string;
  title?: string;
  price?: string;
  priceBefore?: string;
  discount?: number;
  category?: { name: string; _id: string };
  devices?: string[];
  image?: string;
}
interface AdminCategoryType {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

const AdminMainPageDetails = () => {
  const [loading, setLoading] = useState(true);
  const [lastProducts, setLastProducts] = useState<AdminProductType[]>([]);
  const [mostPopularProducts, setMostPopularProducts] = useState<
    AdminProductType[]
  >([]);
  const [mostViewedProducts, setMostViewedProducts] = useState<
    AdminProductType[]
  >([]);
  const [lastCategories, setLastCategories] = useState<AdminCategoryType[]>([]);

  const fetchedDataRef = useRef(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        lastProductsRes,
        popularProductsRes,
        mostViewedRes,
        categoriesRes,
      ] = await Promise.all([
        fetch(`${APIURL}/products/lastProducts`, {
          method: "GET",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }),
        fetch(`${APIURL}/products/mostPopularProducts`, {
          method: "GET",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }),
        fetch(`${APIURL}/products/mostViewedProducts`, {
          method: "GET",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }),
        fetch(`${APIURL}/categories/lastCategories`, {
          method: "GET",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }),
      ]);

      const [
        lastProductsData,
        popularProductsData,
        mostViewedData,
        categoriesData,
      ] = await Promise.all([
        lastProductsRes.json(),
        popularProductsRes.json(),
        mostViewedRes.json(),
        categoriesRes.json(),
      ]);

      if (lastProductsData?.products)
        setLastProducts(lastProductsData.products);
      if (popularProductsData?.products)
        setMostPopularProducts(popularProductsData.products);
      if (mostViewedData?.products)
        setMostViewedProducts(mostViewedData.products);
      if (categoriesData?.categories)
        setLastCategories(categoriesData.categories);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedDataRef.current) {
      fetchData();
      fetchedDataRef.current = true;
    }
  }, []);

  const renderContent = (items: any[], loading: boolean, type: string) => {
    if (loading) return <span>Loading...</span>;
    if (items.length === 0) return <span>No {type} available</span>;
    return items.map((item: any, index: number) => (
      <CardProductAdmin
        key={item._id || index}
        id={item._id}
        title={item.name || item.title}
        price={item.price}
        priceBefore={item.priceBefore}
        category={item.category}
        devices={item.devices}
        image={item.image}
        noDelete={true}
      />
    ));
  };

  return (
    <div className="mt-4 mb-8 w-full flex flex-col gap-8">
      <div className="flex mt-12 justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Last Products</h1>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {renderContent(lastProducts, loading, "products")}
        </div>
      </div>

      <div className="flex mt-12 justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Most Popular Products</h1>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {renderContent(mostPopularProducts, loading, "products")}
        </div>
      </div>

      <div className="flex mt-12 justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Most Viewed Products</h1>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {renderContent(mostViewedProducts, loading, "products")}
        </div>
      </div>

      <div className="flex w-full mt-12 justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Last Categories</h1>
        <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <span>Loading...</span>
          ) : lastCategories.length > 0 ? (
            lastCategories.map((category, index) => (
              <Link
                href={`/admin/categories/edit-category/${category._id}`}
                key={index}
                className="bg-secondary hover:shadow-md transition-all hover:scale-105 hover:shadow-primary border border-none shadow-primary rounded-lg shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-2 gap-3">
                    <FontAwesomeIcon icon={category.icon as any} />
                    <h2 className="text-xl font-semibold mr-2">
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <span>No categories available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMainPageDetails;
