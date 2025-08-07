import NewsCard from "../components/NewsCard";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    async function fetcNews() {
      try {
        const res = await fetch("https://api.sampleapis.com/futurama/episodes");

        const data = await res.json();
        ///console.log(data)
        const newsData = data.slice(0, 5).map((item) => ({
          title: item.title,
          source: "Sample News API",
          date: "2025-08-06",
          url: item.wikiURL || "#",
        }));

        setNews(newsData);
      } catch (err) {
        console.error("Error fetching news: ", err);
      }
    }

    fetcNews();
  }, []);
  return (
    <div>
      <h2>Latest Cybersecurity News</h2>
      {news.map((article, index) => (
        <NewsCard
          key={index}
          title={article.title}
          source={article.source}
          date={article.date}
          url={article.url}
        />
      ))}
    </div>
  );
}
