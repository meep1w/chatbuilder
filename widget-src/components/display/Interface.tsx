// widget-src/components/display/Interface.tsx

// Dependencies
const { Frame } = figma.widget
// Components
import { Background, BottomBar, Header } from "@/components/ui"
import { DIMENSIONS, USERNAMES, PROFILE_IMAGES } from "@/constants"
import { useDynamicState } from "@/hooks"

interface InterfaceProps extends ReqCompProps, OptionalRender, Partial<FrameProps> {
  viewport: number
  chatId: number

  /** Прокинутые сверху состояния */
  profile?: ProfileInfo
  appearance?: ChatAppearance
  composer?: ComposerStyle
  system?: SystemBar

  /** Колбэк изменения имени (если хотим синкать наружу) */
  onProfileNameChange?: (name: string) => void
}

/** Telegram Interface - Header, Chat Input + iOS */
export function Interface({
  children,
  chatId,
  viewport,
  renderElements,
  theme,
  profile,
  appearance,
  composer,
  system,
  onProfileNameChange,
  ...props
}: InterfaceProps) {
  // Совместимость со старым поведением (локальный state, если сверху не дали профиль)
  const [recipient, setRecipient] = useDynamicState({
    username: USERNAMES[chatId],
    image: PROFILE_IMAGES[chatId],
  })

  // Размеры из констант
  const vp = DIMENSIONS[viewport]
  const screenW = vp?.width ?? 390
  const screenH = vp?.height ?? 844

  // Размеры зон
  const HEADER_H = 89
  const BOTTOM_H = 80
  const chatAreaH = Math.max(0, screenH - HEADER_H - BOTTOM_H)

  // Данные профиля (снаружи или локально)
  const effectiveProfile: ProfileInfo = {
    name: profile?.name ?? recipient.username ?? "",
    lastSeen: profile?.lastSeen ?? "last seen just now",
    avatarSrc: profile?.avatarSrc,
    avatarHash: profile?.avatarHash,
  }

  // Фоновая тема/вид
  const effectiveAppearance: ChatAppearance = appearance ?? {
    theme,
    bgKind: "solid",
    bgColor: theme === "dark" ? "#0e0f12" : "#ffffff",
  }

  // Стили композера
  const effectiveComposer: ComposerStyle = composer ?? {
    rounded: true,
    showMic: true,
    showAttach: true,
    placeholder: "Message",
  }

  if (!renderElements) return children

  return (
    <Frame
      name="Interface"
      x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
      y={{ type: "top-bottom", topOffset: 0, bottomOffset: 0 }}
      fill={theme === "dark" ? "#151515" : "#F7F7F7"}
      width={screenW}
      height={screenH}
      {...props}
    >
      {/* Фон чата */}
      <Background
        theme={theme}
        name="chat-bg/latest"
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        y={{ type: "top-bottom", topOffset: HEADER_H, bottomOffset: BOTTOM_H }}
        width={screenW}
        height={chatAreaH}
        appearance={effectiveAppearance}
      />

      {/* Нижняя панель ввода (композер) */}
      <BottomBar
        theme={theme}
        name="ChatInput"
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        y={{ type: "bottom", offset: 0 }}
        width={screenW}
        // composer={effectiveComposer} // включи, если BottomBar принимает
      />

      {/* Прокручиваемая область переписки */}
      <Frame
        name="Viewport Overflow Track"
        overflow="scroll"
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        y={{ type: "top-bottom", topOffset: HEADER_H, bottomOffset: BOTTOM_H }}
        width={screenW}
        height={chatAreaH}
      >
        {children}
      </Frame>

      {/* Хедер + системная строка */}
      <Header
        theme={theme}
        name="Header"
        profilePicSrc={recipient.image}
        profile={effectiveProfile}
        system={system} // ← время/батарея обновляются
        onEvent={(e) => {
          const newName = e.characters
          onProfileNameChange ? onProfileNameChange(newName) : setRecipient("username", newName)
        }}
        value={effectiveProfile.name}
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        width={screenW}
      />
    </Frame>
  )
}
