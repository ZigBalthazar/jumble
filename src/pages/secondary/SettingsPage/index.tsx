import AboutInfoDialog from '@/components/AboutInfoDialog'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import SecondaryPageLayout from '@/layouts/SecondaryPageLayout'
import { toRelaySettings } from '@/lib/link'
import { cn } from '@/lib/utils'
import { useSecondaryPage } from '@/PageManager'
import { useNostr } from '@/providers/NostrProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { TLanguage } from '@/types'
import { SelectValue } from '@radix-ui/react-select'
import { Check, ChevronRight, Copy, Info, KeyRound, Languages, Server, SunMoon } from 'lucide-react'
import { forwardRef, HTMLProps, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsPage({ index }: { index?: number }) {
  const { t, i18n } = useTranslation()
  const { nsec, ncryptsec } = useNostr()
  const { push } = useSecondaryPage()
  const [language, setLanguage] = useState<TLanguage>(i18n.language as TLanguage)
  const { themeSetting, setThemeSetting } = useTheme()
  const [copiedNsec, setCopiedNsec] = useState(false)
  const [copiedNcryptsec, setCopiedNcryptsec] = useState(false)

  const handleLanguageChange = (value: TLanguage) => {
    i18n.changeLanguage(value)
    setLanguage(value)
  }

  return (
    <SecondaryPageLayout index={index} title={t('Settings')}>
      <SettingItem>
        <div className="flex items-center gap-4">
          <Languages />
          <div>{t('Languages')}</div>
        </div>
        <Select defaultValue="en" value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">简体中文</SelectItem>
          </SelectContent>
        </Select>
      </SettingItem>
      <SettingItem>
        <div className="flex items-center gap-4">
          <SunMoon />
          <div>{t('Theme')}</div>
        </div>
        <Select defaultValue="system" value={themeSetting} onValueChange={setThemeSetting}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">{t('System')}</SelectItem>
            <SelectItem value="light">{t('Light')}</SelectItem>
            <SelectItem value="dark">{t('Dark')}</SelectItem>
          </SelectContent>
        </Select>
      </SettingItem>
      <SettingItem onClick={() => push(toRelaySettings())}>
        <div className="flex items-center gap-4">
          <Server />
          <div>{t('Relays')}</div>
        </div>
        <ChevronRight />
      </SettingItem>
      {!!nsec && (
        <SettingItem
          onClick={() => {
            navigator.clipboard.writeText(nsec)
            setCopiedNsec(true)
            setTimeout(() => setCopiedNsec(false), 2000)
          }}
        >
          <div className="flex items-center gap-4">
            <KeyRound />
            <div>{t('Copy private key')} (nsec)</div>
          </div>
          {copiedNsec ? <Check /> : <Copy />}
        </SettingItem>
      )}
      {!!ncryptsec && (
        <SettingItem
          onClick={() => {
            navigator.clipboard.writeText(ncryptsec)
            setCopiedNcryptsec(true)
            setTimeout(() => setCopiedNcryptsec(false), 2000)
          }}
        >
          <div className="flex items-center gap-4">
            <KeyRound />
            <div>{t('Copy private key')} (ncryptsec)</div>
          </div>
          {copiedNcryptsec ? <Check /> : <Copy />}
        </SettingItem>
      )}
      <AboutInfoDialog>
        <SettingItem>
          <div className="flex items-center gap-4">
            <Info />
            <div>{t('About')}</div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-muted-foreground">
              v{__APP_VERSION__} ({__GIT_COMMIT__})
            </div>
            <ChevronRight />
          </div>
        </SettingItem>
      </AboutInfoDialog>
    </SecondaryPageLayout>
  )
}

const SettingItem = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex clickable justify-between items-center px-4 py-2 h-[52px] rounded-lg [&_svg]:size-4 [&_svg]:shrink-0',
          className
        )}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)
SettingItem.displayName = 'SettingItem'
