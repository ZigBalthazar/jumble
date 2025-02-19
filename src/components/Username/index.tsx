import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchProfile } from '@/hooks'
import { toProfile } from '@/lib/link'
import { cn } from '@/lib/utils'
import { SecondaryPageLink } from '@/PageManager'
import ProfileCard from '../ProfileCard'

export default function Username({
  userId,
  showAt = false,
  className,
  skeletonClassName
}: {
  userId: string
  showAt?: boolean
  className?: string
  skeletonClassName?: string
}) {
  const { profile } = useFetchProfile(userId)
  if (!profile) return <Skeleton className={cn('w-16 my-1', skeletonClassName)} />

  const { username, pubkey } = profile

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={cn('max-w-fit', className)}>
          <SecondaryPageLink
            to={toProfile(pubkey)}
            className="truncate hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {showAt && '@'}
            {username}
          </SecondaryPageLink>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfileCard pubkey={pubkey} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function SimpleUsername({
  userId,
  showAt = false,
  className,
  skeletonClassName
}: {
  userId: string
  showAt?: boolean
  className?: string
  skeletonClassName?: string
}) {
  const { profile } = useFetchProfile(userId)
  if (!profile) return <Skeleton className={cn('w-16 my-1', skeletonClassName)} />

  const { username } = profile

  return (
    <div className={cn('max-w-fit', className)}>
      {showAt && '@'}
      {username}
    </div>
  )
}
