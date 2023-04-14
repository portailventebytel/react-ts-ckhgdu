import * as React from 'react';

import { useEffect, useState } from 'react';
import { Movie } from './interfaces';
import { API_ENDPOINT, IMDB_API_KEY } from './constants';
import axios from 'axios';

const styles = {
  genreLabel: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  },
};

export function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const result = await axios.get(
          `${API_ENDPOINT}upcoming?api_key=${IMDB_API_KEY}`
        );
        const movies = result.data.results;
        const movieDetails = await Promise.all(
          movies.map((movie) => getMovieDetails(movie.id))
        );
        movieDetails.forEach((movieDetail, index) => {
          movies[index].genres = movieDetail.genres;
          movies[index].status = movieDetail.status;
        });
        setMovies(movies);
      } catch (err) {
        console.error(err);
      }
    };
    getMovies();
  }, []);

  const getMovieDetails = async (id: number): Promise<Movie> => {
    const result = await axios.get(
      `${API_ENDPOINT}${id}?api_key=${IMDB_API_KEY}`
    );
    return result.data as Movie;
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-4">Les films :</h2>
        <ul className="list">
          {movies.map((movie) => (
            <li className="listitem" key={movie.id}>
              {movie.title}
              <p className="text is-4">
                <strong>Genres : </strong>
                {movie.genres.map((genre, index) => (
                  <span className="genreLabel" key={genre.id}>
                    {genre.name}
                    {index < movie.genres.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>

        <h2 className="title is-4">Filtrer par genre:</h2>
        <div className="buttons">
          <button className="button is-secondary">Reset</button>
        </div>
      </div>
    </section>
  );
}
