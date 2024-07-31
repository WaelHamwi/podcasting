import { NoSuggestionProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const NoSuggestion = ({ title, search, buttonLink, buttonText }: NoSuggestionProps) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image src="/icons/noSuggestion1.webp" width={250} height={250} alt="empty state" />
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white-1">{title}</h1>
        {search && (
          <p className="text-16 text-center font-medium text-white-200">Try searching to find it</p>
        )}
        {buttonLink && (
          <Button className="bg-orange-600 mb-12">
            <Link href={buttonLink} className="gap-1 flex">
              <Image 
                src="/icons/search.svg"
                width={20}
                height={20}
                alt='discover'
              />
              <h1 className="text-16 font-extrabold text-white-1">{buttonText}</h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default NoSuggestion