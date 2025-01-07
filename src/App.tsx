import 'yet-another-react-lightbox/styles.css'
import './index.css'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { PageManager } from './PageManager'
import { FeedProvider } from './providers/FeedProvider'
import { FollowListProvider } from './providers/FollowListProvider'
import { NostrProvider } from './providers/NostrProvider'
import { NoteStatsProvider } from './providers/NoteStatsProvider'
import { RelaySetsProvider } from './providers/RelaySetsProvider'
import { ScreenSizeProvider } from './providers/ScreenSizeProvider'

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <ScreenSizeProvider>
        <NostrProvider>
          <RelaySetsProvider>
            <FeedProvider>
              <FollowListProvider>
                <NoteStatsProvider>
                  <PageManager />
                  <Toaster />
                </NoteStatsProvider>
              </FollowListProvider>
            </FeedProvider>
          </RelaySetsProvider>
        </NostrProvider>
      </ScreenSizeProvider>
    </ThemeProvider>
  )
}
