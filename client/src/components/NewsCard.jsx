import './NewsCard.css'
import React from 'react'
export default function NewsCard({title, source, date,url}) {
  return (
    <div className="news-card">
        <h3>{title}</h3>
        <p className='meta'>{source} • {date}</p>
        <a href={url} target="_blank" rel="noopener noreferrer">         Read More →
</a>

    </div>
  )
}
