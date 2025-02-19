import BottomNavigationBar from '@/components/BottomNavigationBar'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { Titlebar } from '@/components/Titlebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TPrimaryPageName, usePrimaryPage } from '@/PageManager'
import { useScreenSize } from '@/providers/ScreenSizeProvider'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const PrimaryPageLayout = forwardRef(
  (
    {
      children,
      titlebar,
      pageName,
      displayScrollToTopButton = false
    }: {
      children?: React.ReactNode
      titlebar?: React.ReactNode
      pageName: TPrimaryPageName
      displayScrollToTopButton?: boolean
    },
    ref
  ) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const { isSmallScreen } = useScreenSize()
    const { current } = usePrimaryPage()

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: () => {
          if (isSmallScreen) {
            window.scrollTo({ top: 0 })
            return
          }
          scrollAreaRef.current?.scrollTo({ top: 0 })
        }
      }),
      []
    )

    useEffect(() => {
      if (isSmallScreen) {
        window.scrollTo({ top: 0 })
        setVisible(true)
        return
      }
    }, [current])

    useEffect(() => {
      if (current !== pageName) return

      const handleScroll = () => {
        const atBottom = isSmallScreen
          ? window.innerHeight + window.scrollY >= document.body.offsetHeight - 20
          : scrollAreaRef.current
            ? scrollAreaRef.current?.clientHeight + scrollAreaRef.current?.scrollTop >=
              scrollAreaRef.current?.scrollHeight - 20
            : false
        if (atBottom) {
          setVisible(true)
          return
        }

        const scrollTop = (isSmallScreen ? window.scrollY : scrollAreaRef.current?.scrollTop) || 0
        const diff = scrollTop - lastScrollTop
        if (scrollTop <= 800) {
          setVisible(true)
          setLastScrollTop(scrollTop)
          return
        }

        if (diff > 20) {
          setVisible(false)
          setLastScrollTop(scrollTop)
        } else if (diff < -20) {
          setVisible(true)
          setLastScrollTop(scrollTop)
        }
      }

      if (isSmallScreen) {
        window.addEventListener('scroll', handleScroll)
        return () => {
          window.removeEventListener('scroll', handleScroll)
        }
      }

      scrollAreaRef.current?.addEventListener('scroll', handleScroll)
      return () => {
        scrollAreaRef.current?.removeEventListener('scroll', handleScroll)
      }
    }, [lastScrollTop, isSmallScreen, current])

    return (
      <ScrollArea
        className="sm:h-screen sm:overflow-auto pt-12 sm:pt-0"
        scrollBarClassName="sm:z-50"
        ref={scrollAreaRef}
        style={{
          paddingBottom: isSmallScreen ? 'calc(env(safe-area-inset-bottom) + 3rem)' : ''
        }}
      >
        {titlebar && (
          <PrimaryPageTitlebar visible={!isSmallScreen || visible}>{titlebar}</PrimaryPageTitlebar>
        )}
        <div className="overflow-x-hidden">{children}</div>
        {displayScrollToTopButton && (
          <ScrollToTopButton
            scrollAreaRef={scrollAreaRef}
            visible={visible && lastScrollTop > 800}
          />
        )}
        {isSmallScreen && <BottomNavigationBar visible={visible} />}
      </ScrollArea>
    )
  }
)
PrimaryPageLayout.displayName = 'PrimaryPageLayout'
export default PrimaryPageLayout

export type TPrimaryPageLayoutRef = {
  scrollToTop: () => void
}

function PrimaryPageTitlebar({
  children,
  visible = true
}: {
  children?: React.ReactNode
  visible?: boolean
}) {
  return (
    <Titlebar className="h-12 p-1" visible={visible}>
      {children}
    </Titlebar>
  )
}
