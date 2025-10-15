// widget-src/components/ui/Header.tsx

// Dependencies
const { AutoLayout, Text, Rectangle, SVG, Input } = figma.widget
// Components
import { remapTokens } from "@/utils"
// Internal
import { IosHeaderStatus, ProfilePic } from "@/components/ui/atoms"

/** Import Changelog
 * - Динамические name/lastSeen из profile
 * - Поддержка avatarHash (imageHash) + fallback на profilePicSrc
 * - Прокидываем system в IosHeaderStatus
 * - Цвета через remapTokens
 */

interface HeaderProps
  extends ReqCompProps,
    Partial<AutoLayoutProps>,
    ContainsEvent<[TextEditEvent]> {
  /** Источник аватарки (готовый src, fallback) */
  profilePicSrc?: string
  /** Профиль чата: name/lastSeen/avatarHash */
  profile: ProfileInfo
  /** Системная строка: время/батарея/зарядка */
  system?: SystemBar
}

export function Header({ value, profilePicSrc, profile, system, onEvent, theme, ...props }: HeaderProps) {
  /** Required by children (Drilled Props) */
  const reqChildProps = { theme }

  // Theme Mode
  const color = remapTokens({
    surface: {
      container: { dark: "#1C1C1D", light: "#F6F6F6" },
    },
    text: {
      primary: { dark: "#FFF", light: "#000" },
      secondary: { dark: "#8D8D8F", light: "#8D8D8F" },
    },
  })[theme]

  const svgPaths = {
    arrowLeft: `<svg width='12' height='21' viewBox='0 0 12 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M3.60206 10.5L11.4062 2.55085C11.9866 1.9597 11.9778 1.00999 11.3867 0.429623C10.7955 -0.150747 9.84583 -0.142006 9.26546 0.449147L0.429623 9.44915C-0.143208 10.0326 -0.143208 10.9674 0.429623 11.5509L9.26546 20.5509C9.84583 21.142 10.7955 21.1507 11.3867 20.5704C11.9778 19.99 11.9866 19.0403 11.4062 18.4491L3.60206 10.5Z' fill='${color.text.primary}'/>
    </svg>`,
  }

  // Значения с безопасными фолбэками
  const nameValue = value ?? profile?.name ?? ""
  const lastSeenValue = profile?.lastSeen ?? "last seen just now"

  return (
    <AutoLayout
      name="Header"
      effect={[
        { type: "drop-shadow", color: "#0000001A", offset: { x: -1, y: 7 }, blur: 16 },
        { type: "drop-shadow", color: "#00000017", offset: { x: -2, y: 29 }, blur: 29 },
        { type: "drop-shadow", color: "#0000000D", offset: { x: -5, y: 66 }, blur: 40 },
        { type: "drop-shadow", color: "#00000003", offset: { x: -9, y: 118 }, blur: 47 },
        { type: "drop-shadow", color: "#0000", offset: { x: -14, y: 184 }, blur: 52 },
      ]}
      direction="vertical"
      width={375}
      {...props}
    >
      <Rectangle
        name="Surface"
        effect={{ type: "drop-shadow", color: "#3D3D3F", offset: { x: 0, y: 0.33 }, blur: 0 }}
        x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
        y={{ type: "top-bottom", topOffset: 0, bottomOffset: 0 }}
        positioning="absolute"
        fill={color.surface.container}
        strokeWidth={0}
        strokeAlign="center"
        width={375}
        height={89}
      />

      {/* Системная строка */}
      <IosHeaderStatus {...reqChildProps} system={system} width={"fill-parent"} name="_ios/HeaderStatus" />

      <AutoLayout
        name="ChatHeader"
        overflow="visible"
        spacing="auto"
        padding={{ vertical: 4, horizontal: 6 }}
        width={"fill-parent"}
        height={45}
        verticalAlignItems="center"
      >
        <AutoLayout name="Back" spacing={7} verticalAlignItems="center">
          <SVG name="Shape" height={21} width={12} src={svgPaths.arrowLeft} />
          <Text
            name="Chats"
            fill={color.text.primary}
            lineHeight={22}
            fontSize={17}
            letterSpacing={-0.4}
            strokeWidth={0}
            strokeAlign="center"
          >
            Chats
          </Text>
        </AutoLayout>

        <ProfilePic
          name="profile-pic/HawkMoney"
          imageHash={profile?.avatarHash}     // ← используем imageHash, если есть
          profilePicSrc={profilePicSrc ?? ""} // ← fallback на src
          strokeWidth={0.925}
          width={37}
          height={37}
        />

        <AutoLayout
          name="Frame 1"
          x={{ type: "left-right", leftOffset: 73, rightOffset: 74 }}
          y={6}
          positioning="absolute"
          direction="vertical"
          spacing={1}
          width={228}
          horizontalAlignItems="center"
        >
          <Input
            name="username"
            placeholder="Username or Group"
            fill={color.text.primary}
            horizontalAlignText="center"
            lineHeight={18}
            fontSize={17}
            letterSpacing={-0.4}
            fontWeight={500}
            strokeWidth={0}
            strokeAlign="center"
            value={nameValue}
            onTextEditEnd={onEvent}
          />
          <Text
            name="last seen"
            fill={color.text.secondary}
            lineHeight={15}
            fontSize={13}
            letterSpacing={-0.05}
            strokeWidth={0}
            strokeAlign="center"
          >
            {lastSeenValue}
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}
