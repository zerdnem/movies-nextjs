import { useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import InfiniteScroll from "react-infinite-scroll-component";

import Header from "../components/Header";

const BASE_URL = "https://yts.torrentbay.to/";

export async function getServerSideProps() {
  const res = await fetch(`${BASE_URL}api/v2/list_movies.json`);
  const json = await res.json();
  const movies = json.data.movies;
  return {
    props: {
      movies,
    },
  };
}

export default function Home(props) {
  const [movies, setMovies] = useState(props.movies);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);

  const getMoreMovies = async () => {
    const res = await fetch(`/api/hello?page=${page}`);
    const newMovies = await res.json();
    setMovies((movie) => [...movie, ...newMovies.data.movies.filter((e) => e)]);
    setPage((page += 1));
  };

  const submitForm = async (query) => {
    const res = await fetch(`/api/search?query=${query}`);
    const { data } = await res.json();
    setMovies(data.movies);
    setHasMore(false);
  };
  return (
    <div className="">
      <Head>
        <title>Whatever</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header onSubmitForm={(e) => submitForm(e)} />

      <main className={styles.main}>
        <InfiniteScroll
          dataLength={movies.length}
          next={getMoreMovies}
          hasMore={hasMore}
          loader={<h3> Loading...</h3>}
          endMessage={<h4>Nothing more to show</h4>}
        >
          <div className={styles.grid}>
            {movies.map((movie) => (
              <Link
                href={{
                  pathname: "/movie/[id]",
                  query: { id: movie.id, slug: movie.slug },
                }}
                as={`/movie/${movie.id} `}
                key={movie.id}
              >
                <a className={styles.card}>
                  <h2>{movie.title.slice(0, 15)} &rarr;</h2>
                  <Image
                    src={movie.large_cover_image}
                    alt={movie.title}
                    width={230}
                    height={345}
                  />
                  <div className={styles.info}>
                    <p>{movie.year}</p>
                    <p className={styles.rating}>{movie.rating}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}