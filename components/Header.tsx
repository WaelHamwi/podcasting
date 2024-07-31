import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

const Header = ({ title, titleClassName}: { title?: string; titleClassName?: string}) => {
  return (
    <header className="flex items-center justify-between">
      {title ? (
        <h2 className={cn('text-8 font-bold text-white-300 ml-1', titleClassName)}>{title}</h2>
      ): <div />}
      <Link href="/explore" className="text-12 font-semibold text-orange-600 mr-2">
        See all
      </Link>
    </header>
  )
}

export default Header