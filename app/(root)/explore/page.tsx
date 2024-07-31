"use client"
import NoSuggestion from '@/components/NoSuggestion'
import PodcastCard from '@/components/PodcastCard'
import Searchbar from '@/components/ui/SearchBar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Explore = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Explore Trending Podcasts' : 'Search results for '}
          {search && <span className="text-white-200">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
              {podcastsData?.map(({ _id, title, description, thumbnailUrl }) => (
                <PodcastCard 
                  key={_id}
                  title={title!}
                  thumbnailUrl={thumbnailUrl}
                  description={description}
                  podcastId={_id}
                />
              ))}
            </div>
            ) : <NoSuggestion title="No results found" />}
          </>
        ) :    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 font-extrabold text-orange-600">
         searching......
      </div>}
      </div>
    </div>
  )
}

export default Explore