import React from 'react'
import { AcademyItem } from '../../types/academy'
import AcademyIcons from './academyIcons'
import Link from '../common/link'

const AcademyCardComponent = ({
  academyItem,
  currentItem
}: {
  academyItem: AcademyItem
  currentItem?: string
}): JSX.Element => {
  return (
    <>
      {academyItem ? (
        <Link
          href={`/academy/${academyItem.id}`}
          className={`relative ${currentItem === academyItem.id ? '' : ''}`}
        >
          <div className="w-[300px] pb-[57%] relative overflow-hidden rounded-lg">
            <img
              alt="Video Cover Image"
              src={academyItem.image || '/video-cover.jpeg'}
              className=" w-full object-cover self-center h-full absolute"
            />
          </div>
          <div className="absolute top-2 left-2">
            <AcademyIcons academyItem={academyItem} currentItemId={currentItem || null} />
          </div>
          <div className="flex py-4">
            <span className="mr-2">#{academyItem.order - 1}.</span> {academyItem.title}
          </div>
        </Link>
      ) : null}
    </>
  )
}
export default AcademyCardComponent
