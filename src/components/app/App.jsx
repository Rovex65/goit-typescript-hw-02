import SearchBar from "../searchBar/SearchBar";
import ImageGallery from "../imageGallery/ImageGallery";
import Loader from "../loader/Loader";
import ErrorMessage from "../errorMessage/ErrorMessage";
import LoadMoreBtn from "../loadMoreBtn/LoadMoreBtn";
import ImageModal from "../imageModal/ImageModal";

import { animateScroll } from "react-scroll";
import { useState, useEffect } from "react";
import { fetchImagesWithQuery } from "/src/images-api.js";
import "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState();
  const [showBtn, setShowBtn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState();

  function onSearch(query) {
    setQuery(query);
    setShowBtn(false);
    setImages([]);
    setPage(1);
    setMaxPage();
  }

  function loadMore() {
    setPage(page + 1);
  }

  function openModal(image) {
    setImage(image);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    async function fetchImages() {
      if (!query) {
        return;
      }
      if (page === maxPage) {
        setShowBtn(false);
        setError("No images more");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchImagesWithQuery(query, page);
        const totalPages = data.total_pages;
        setImages([...images, ...data.results]);
        setMaxPage(totalPages);
        setShowBtn(page < totalPages);
        setError(false);
        if (page > 1) {
          animateScroll.scrollMore(480, { duration: 500, smooth: true });
        }
        if (totalPages === 0) {
          setError("No images");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [query, page]);

  return (
    <>
      <SearchBar onSubmit={onSearch} />
      {images.length > 0 && (
        <ImageGallery openModal={openModal} images={images}></ImageGallery>
      )}
      {loading && <Loader />}
      {showBtn && <LoadMoreBtn onLoadMore={loadMore} />}
      {image && (
        <ImageModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          image={image}
        />
      )}
      {error && <ErrorMessage error={error} />}
      {/* <Toaster position="top-right" /> */}
    </>
  );
}

export default App;
