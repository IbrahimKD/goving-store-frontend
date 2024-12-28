"use client";
import React, { useEffect, useRef, useState } from "react";
import { PRODUCTTYPE } from "./ProductDetails";
import { FaRegEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import APIURL from "../URL";
import Cookies from "js-cookie";
import formatDate from "../formatDate";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface StarRatingProps {
  rating: string;
  setRating: (rating: string) => void;
  isInteractive?: boolean;
}


const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  isInteractive = true,
}) => {
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    starIndex: number
  ) => {
    if (!isInteractive) return;
    const starRect = event.currentTarget.getBoundingClientRect();
    const starWidth = starRect.width;
    const mouseX = event.clientX - starRect.left;

    // منع 0.5 ولكن السماح بباقي القيم النصفية
    if (starIndex === 0) {
      setRating("1");
    } else {
      if (mouseX < starWidth / 2) {
        setRating((starIndex + 0.5).toString());
      } else {
        setRating((starIndex + 1).toString());
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    const ratingNumber = parseFloat(rating);
    const fullStars = Math.floor(ratingNumber);
    const hasHalfStar = ratingNumber % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <div
            key={i}
            className="cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={() => {
              if (isInteractive) {
                if (i === 0) setRating("1");
                else setRating((i + 1).toString());
              }
            }}
          >
            <FaStar className="text-yellow-400 text-xl" />
          </div>
        );
      } else if (i === fullStars && hasHalfStar && i !== 0) {
        // السماح بالنجوم النصفية فقط بعد النجمة الأولى
        stars.push(
          <div
            key={i}
            className="cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={() => isInteractive && setRating((i + 0.5).toString())}
          >
            <FaStarHalfAlt className="text-yellow-400 text-xl" />
          </div>
        );
      } else {
        stars.push(
          <div
            key={i}
            className="cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={() => {
              if (isInteractive) {
                if (i === 0) setRating("1");
                else setRating((i + 1).toString());
              }
            }}
          >
            <FaRegStar className="text-yellow-400 text-xl" />
          </div>
        );
      }
    }
    return stars;
  };

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => {
        if (isInteractive) {
          const currentRating = parseFloat(rating);
          // إذا كانت القيمة أقل من 1، نجعلها 1
          if (currentRating < 1) {
            setRating("1");
          }
        }
      }}
    >
      {renderStars()}
      {isInteractive && (
        <span className="text-accent ml-2">
          ({parseFloat(rating).toFixed(1)})
        </span>
      )}
    </div>
  );
};



const ProductReviews = ({ productId }: { productId: string }) => {
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<string>("0");
  const [reviews, setReviews] = useState<PRODUCTTYPE["reviews"]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const userId = useUserStore().user?._id;
  const [reviewDialogId, setReviewDialogId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [ratingDialog, setRatingDialog] = useState("0");
  const [reviewText, setReviewText] = useState("");
  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (rating === "0" || !rating) {
      setSubmitLoading(false);
      return toast.error("Please rate the product");
    }
    if (!review.trim()) {
      setSubmitLoading(false);
      return toast.error("Please enter a review");
    }

    try {
      const res = await fetch(`${APIURL}/reviews`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: review,
          productId,
          user: userId,
          rating,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data && data.message == "Unauthorized, invalid token") {
        return toast.error("Please login before add a review");
      }
      if (
        data &&
        data.error === "You can only submit two reviews per product"
      ) {
        return toast.error(data.error);
      }
      if (data.status === 200) {
        toast.success("Review submitted successfully");
        setReview("");
        setRating("0");
        getReviews();
      } else {
        toast.error(data.message);
      }
      setSubmitLoading(false);
    } catch (e) {
      setSubmitLoading(false);
      console.log(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${APIURL}/reviews/${productId}?page=${page}&limit=5&sort=${sortOrder}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }
      );

      const data = await res.json();
      if (data && data.reviews) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [page, sortOrder]);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Always show first page
    if (totalPages > 0) pageNumbers.push(1);

    // Determine start and end for middle pages
    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage && i < totalPages; i++) {
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };
  useEffect(() => {
    if (scrollRef.current) {
      const savedScrollPosition = localStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        scrollRef.current.scrollTop = parseInt(savedScrollPosition, 10);
      }
    }
  }, []);
  const deleteReview = async (id: string) => {
    const con = window.confirm("Are you sure you want to delete this review?");
    if (!con) return;
    try {
      const res = await fetch(
        `${APIURL}/reviews/${id}?productId=${productId}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      const data = await res.json();
      console.log(data); // تأكد من بيانات الاستجابة
      if (data.status === 200) {
        toast.success("Review deleted successfully");
        getReviews();
      } else {
        toast.error(data.error || "Failed to delete review");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleUpdate = async () => {
    console.log(ratingDialog, reviewText);
    setLoadingDialog(true);
    try {
      console.log("Rating to send:", ratingDialog); // إضافة خطوة لفحص القيمة قبل الإرسال
      const res = await fetch(`${APIURL}/reviews/${reviewDialogId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json", // تأكد من تحديد نوع المحتوى
        },
        body: JSON.stringify({
          rating: ratingDialog.toString(), // تأكد من أنه يتم تحويله إلى string
          comment: reviewText,
          user: userId,
        }),
      });

      const data = await res.json();
      if (data && data.error) {
        setLoadingDialog(false);
        return toast.error(data.error);
      }
      setLoadingDialog(false);
      if (res.ok) {
        setIsDialogOpen(false);
        toast.success("Review edited successfully");
        getReviews();
      }
      console.log(data);
    } catch (e) {
      setLoadingDialog(false);
      console.log(e);
    } finally {
      setLoadingDialog(false);
    }
  };

  const ActionButton = ({ onClick, className, icon }: any) => (
    <button
      onClick={onClick}
      className={`border transition-shadow shadow-sm border-white/50 rounded-md px-6 py-2 text-lg text-white ${className}`}
    >
      {icon}
    </button>
  );
  return (
    <div className="w-full border max-md:px-4 px-7 py-10 border-white/15 flex flex-col gap-3 mt-5 rounded-md mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl max-md:text-xl font-semibold">
          Product Reviews
        </h3>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="bg-[#101924] px-2 py-1 rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <span className="text-lg">Your Rating:</span>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Enter your review"
            className="w-full bg-[#101924] px-3 py-2 rounded-md border border-white/20 focus:border-primary focus:shadow-sm focus:shadow-primary outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className={`
              border max-md:px-4 max-md:text-[15px] max-md:w-max max-w-[230px] hover:shadow-lg hover:shadow-primary transition-shadow shadow-sm shadow-primary border-white/50 rounded-md px-6 py-2 bg-primary text-white
              ${
                submitLoading
                  ? "opacity-50 cursor-not-allowed shadow-none hover:shadow-none"
                  : ""
              }`}
          >
            Create Review
          </button>
        </div>
      </div>

      <hr className="w-full h-[0.5px] border-0 bg-accent/25 mt-2" />

      <div className="flex relative flex-col gap-2 px-2">
        {loading ? (
          <div className="w-full mx-auto pt-32 flex justify-center items-center text-center my-6">
            <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-16 absolute left-[50%] top-[20%] w-16 my-6"></div>
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((reviewItem: any) => {
            const nameParts = reviewItem.user.name.split(" ");
            const initials =
              nameParts.length > 1
                ? nameParts[0].charAt(0) + nameParts[1].charAt(0)
                : nameParts[0].charAt(0) + nameParts[0].charAt(1);
            return (
              <div key={reviewItem._id} className="flex flex-col gap-4 mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      <span>{initials}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">
                        {reviewItem.user.name}
                      </span>
                      <span className="text-sm text-accent">
                        {formatDate(reviewItem.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={reviewItem.rating}
                      setRating={() => {}}
                      isInteractive={false}
                    />
                  </div>
                  <p className="text-sm px-3">{reviewItem.comment}</p>
                </div>
                {user &&
                  (user.role === "admin" || user._id == reviewItem.user.id) && (
                    <>
                      <div className="flex items-center gap-2">
                        <ActionButton
                          onClick={() => {
                            setReviewDialogId(reviewItem._id);
                            setIsDialogOpen(true);
                            setRatingDialog(reviewItem.rating);
                            setReviewText(reviewItem.comment);
                          }}
                          className="hover:shadow-primary hover:bg-primary shadow-primary"
                          icon={<FaRegEdit />}
                        />
                        <ActionButton
                          onClick={() => deleteReview(reviewItem._id)}
                          className="hover:shadow-red-600 hover:bg-red-600 shadow-red-600"
                          icon={<FaTrashAlt />}
                        />
                      </div>
                    </>
                  )}

                <hr className="w-full h-[0.5px] border-0 bg-accent/25 mt-2" />
              </div>
            );
          })
        ) : (
          <span className="text-lg my-8">No reviews found</span>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          {generatePageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded-md ${
                page === pageNum
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-white/20">
          <DialogHeader>
            <DialogTitle>Edit review</DialogTitle>
            <DialogDescription>Edit your review and rating</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Rating
              </Label>
              <StarRating rating={ratingDialog} setRating={setRatingDialog} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Comment
              </Label>
              <textarea
                id="email"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="col-span-3 px-3 py-2 rounded-md bg-[#09090b]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={loadingDialog}
              type="button"
              onClick={() => handleUpdate()}
              className="bg-white/95 hover:bg-primary hover:text-white text-black"
            >
              Update Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductReviews;
