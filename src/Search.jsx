import React, { useEffect, useState, useRef } from 'react';
import './Search.css';
import axios from 'axios';

function Search() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const loader = useRef(null);

  const handleFilter = (value) => {
    const res = FilterData.filter((f) => f.name.toLowerCase().includes(value));
    setData(res);
  };

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=0cc90f412030fda925123d185d9cdf69&format=json&nojsoncallback=1&page=${page}`
      )
      .then((response) => {
        const photos = response.data.photos.photo;
        const imageArray = photos.map((photo) => ({
          id: photo.id,
          title: photo.title,
          url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
        }));
        setImages((prevImages) => [...prevImages, ...imageArray]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.unobserve(loader.current);
    };
  }, []);

  const handleObserver = (entities) => {
    const target = entities[0];

    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="search">
          <input
            type="text"
            placeholder="Search Here.."
            onChange={(e) => handleFilter(e.target.value)}
          />
        </div>
        <div className="image-gallery">
          <div className="photo-gallery">
            {images.map((image, index) => (
              <div className="photo-container" key={index}>
                <img
                  src={image.url}
                  alt={image.title}
                  onClick={() => openPhoto(image)}
                />
              </div>
            ))}
          </div>
          <div ref={loader} className="loading">
            Loading...
          </div>
        </div>
        {selectedPhoto && (
          <div className="overlay" onClick={closePhoto}>
            <div className="modal">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} />
              <p>{selectedPhoto.title}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Search;  
