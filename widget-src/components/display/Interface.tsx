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

  /** НОВОЕ (необязательно): прокинутые сверху состояния */
  profile?: ProfileInfo
  appearance?: ChatAppearance
  composer?: ComposerStyle

  /** НОВОЕ: колбэк изменения имени (если хотим синкать наружу) */
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
  onProfileNameChange,
  ...props
}: InterfaceProps) {
  // ==== Совместимость со старым поведением (локальный state, если сверху не дали профиль) ====
  const [recipient, setRecipient] = useDynamicState({
    username: USERNAMES[chatId],
    image: PROFILE_IMAGES[chatId],
  })

  // Размеры из констант
  const vp = DIMENSIONS[viewport]
  const screenW = vp?.width ?? 390
  const screenH = vp?.height ?? 844

  // Размеры зон (как раньше):
  const HEADER_H = 89
  const BOTTOM_H = 80
  const chatAreaH = Math.max(0, screenH - HEADER_H - BOTTOM_H)

  // Данные профиля (снаружи или локально)
  const effectiveProfile: ProfileInfo = {
    name: profile?.name ?? recipient.username ?? "",
    lastSeen: profile?.lastSeen ?? "last seen just now",
    avatarHash: profile?.avatarHash, // если не дали — ProfilePic отрисует дефолтную из profilePicSrc
  }

  // Фоновая тема/вид (по желанию можно расширить Background, здесь просто передаём размеры)
  const effectiveAppearance = appearance ?? ({
    theme,
    bgKind: "solid",
    bgColor: theme === "dark" ? "#0e0f12" : "#ffffff",
  } as ChatAppearance)

  // Стили композера (нижней панели)
  const effectiveComposer = composer ?? ({
    rounded: true,
    showMic: true,
    showAttach: true,
    placeholder: "Message",
  } as ComposerStyle)

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
        // Если у вас Background поддерживает картинку — тут можно прокинуть imageHash/цвет
        // imageHash={effectiveAppearance.bgKind === "image" ? effectiveAppearance.bgImageHash : undefined}
        // fillColor={effectiveAppearance.bgKind === "solid" ? effectiveAppearance.bgColor : undefined}
      />

      {/* Нижняя панель ввода (композер) */}
      <BottomBar
        theme={theme}
        name="ChatInput"
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        y={{ type: "bottom", offset: 0 }}
        width={screenW}
        // НОВОЕ: можно передать стиль композера, если компонент поддерживает
        // composer={effectiveComposer}
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

      {/* Хедер с именем/last seen/аватаром */}
      <Header
        theme={theme}
        name="Header"
        // Если есть avatarHash и ваш ProfilePic умеет imageHash — можно пробросить иначе через profilePicSrc
        profilePicSrc={recipient.image}
        profile={effectiveProfile}
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
