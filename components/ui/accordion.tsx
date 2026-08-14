'use client'

import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface AccordionProps {
  children: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultIndex?: number
}

export function Accordion({
  children,
  className = '',
  collapsible = false,
  defaultIndex = -1
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const toggle = (index: number) => setActiveIndex(
    collapsible && activeIndex === index ? -1 : index
  )

  return (
    <div className={cn('divide-y', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <AccordionItem
              key={index}
              index={index}
              active={activeIndex === index}
              onToggle={toggle}
            >
              {child}
            </AccordionItem>
          )
        }
        return null
      })}
    </div>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  index: number
  active: boolean
  onToggle: (index: number) => void
}

function AccordionItem({
  children,
  index,
  active,
  onToggle
}: AccordionItemProps) {
  return (
    <>
      <div
        className="cursor-pointer px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        onClick={() => onToggle(index)}
      >
        <h3 className="text-lg font-medium">
          {typeof children === 'string' ? children : 'Accordion Item'}
        </h3>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            active ? 'rotate-180' : ''
          )}
        />
      </div>
      {active && (
        <div className="px-6 py-4 text-sm text-gray-700">
          {children}
        </div>
      )}
    </>
  )
}