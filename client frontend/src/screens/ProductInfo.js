import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Rating from "../components/homeComponents/Rating";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductReview,
  listProductDetails,
} from "../Redux/Actions/ProductActions";
import Loading from "../components/LoadingError/Loading";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from "moment";
import "../CSS/DetailsProduct.css";
import "../CSS/SingleProduct.css";
const SingleProduct = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productId = match.params.id;
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successCreateReview) { 
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  const AddToCartHandle = (e) => {
    e.preventDefault();
    history.push(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(productId, {
        rating,
        comment,
      })
    );
  };
  return (
    <>
      <Header />
      <div className="container single-product">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="container-info">
              <div className="row">
                <div className="col-md-6">
                  <div className="single-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="product-dtl">
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                    </div>

                    <div className="info">
                      <div className="info-status">
                        <h6>Tr???ng th??i:</h6>
                        {product.countInStock > 0 ? (
                          <span>C??n h??ng</span>
                        ) : (
                          <span>H???t h??ng</span>
                        )}
                      </div>

                      <div className="info-price">
                        <h6>Gi??:</h6>
                        <span>{product.price} VND</span>
                      </div>

                      <div className="info-rate">
                        <h6>????nh gi??:</h6>
                        <Rating
                          value={product.rating}
                          text={`${product.numReviews} ????nh gi??`}
                        />
                      </div>
                      {product.countInStock > 0 ? (
                        <>
                          <div className="info-quantity">
                            <h6>S??? l?????ng:</h6>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="info-description">
                      <p>M?? t???: {product.description}</p>
                    </div>
                    <button
                      onClick={AddToCartHandle}
                      className="round-black-btn"
                    >
                      Th??m v??o gi???
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="container-rate">
              <div className="row my-5">
                <div className="col-md-6">
                  <h6 className="mb-3">????nh gi??</h6>
                  {product.reviews.length === 0 && (
                    <Message variant={"alert-info mt-3"}>
                      Hi???n t???i kh??ng c?? ????nh gi?? n??o cho s???n ph???m n??y.
                    </Message>
                  )}
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="mb-5 mb-md-3 p-3 shadow-sm rounded"
                    >
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <span>{moment(review.createdAt).calendar()}</span>
                      <div className="alert alert-info mt-3">
                        {review.comment}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-md-6 ">
                  <h6>Vi???t ????nh gi??</h6>
                  <div className="my-4">
                    {loadingCreateReview && <Loading />}
                    {errorCreateReview && (
                      <Message variant="alert-danger">
                        {errorCreateReview}
                      </Message>
                    )}
                  </div>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <div className="my-4">
                        <strong>????nh gi??</strong>
                        <select
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="col-12 bg-light p-3 mt-2 border-0 rounded"
                        >
                          <option value="">M???c ????? ????nh gi??</option>
                          <option value="1">1 - R???t t???</option>
                          <option value="2">2 - T???</option>
                          <option value="3">3 - T???t</option>
                          <option value="4">4 - R???t t???t</option>
                          <option value="5">5 - Tuy???t v???i</option>
                        </select>
                      </div>
                      <div className="my-4">
                        <strong>B??nh lu???n</strong>
                        <textarea
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="col-12 bg-light p-3 mt-2 border-0 rounded"
                        ></textarea>
                      </div>
                      <div className="my-3">
                        <button
                          disabled={loadingCreateReview}
                          className="btnRate col-12 border-0 rounded"
                        >
                          ????ng
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="my-3">
                      <Message variant={"alert-warning"}>
                        Vui l??ng{" "}
                        <Link to="/login">
                          " <strong>????ng nh???p</strong> "
                        </Link>{" "}
                        ????? ????nh gi??{" "}
                      </Message>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleProduct;
