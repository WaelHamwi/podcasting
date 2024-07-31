import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { CarouselProps } from '@/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LoaderSpinner from './ui/LoaderSpinner'

const EmblaCarousel = ({ viewersDetails }: CarouselProps) => {
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay || !("stopOnInteraction" in autoplay.options)) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? (autoplay.reset as () => void)
        : (autoplay.stop as () => void)

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  const slides = viewersDetails && viewersDetails?.filter((item: any) => item.totalPodcasts > 0)

  if (!slides) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-12 h-12">
          <LoaderSpinner />
        </div>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="carousel_box flex flex-col items-center justify-center"
            onClick={() => router.push(`/podcasts/${item.podcasts[0]?.podcastId}`)}
          >
            <div className="relative w-[200px] h-[200px]">
              <Image 
                src={item.imageUrl}
                alt="card"
                layout="fill"
                className="rounded-full object-cover"
              />
            </div>
            <div className="bg-gray-600 p-4 rounded-b-xl mt-2 text-center w-[200px]">
              <h2 className="text-14 font-semibold text-white">{item.podcasts[0]?.podcastTitle}</h2>
              <p className="text-12 font-normal text-white">{item.name}</p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  )
}

export default EmblaCarousel
