// widget-src/components/ui/Background.tsx

// Dependencies
const { Rectangle, Frame, Image } = figma.widget
// Legacy assets (fallback)
import { LatestDark64, LatestLight64, FlatDark64, FlatLight64 } from "@/assets/base64"

interface BackgroundProps
  extends ReqCompProps,
    // запрещаем ширину/высоту извне — размер задаёт родитель (Interface)
    Omit<Partial<FrameProps>, "width" | "height"> {
  /** ЛЕГАСИ: старый пресет обоев */
  type?: "flat" | "latest"
  /** НОВОЕ: внешний вид (тема/цвет/картинка) */
  appearance?: ChatAppearance
  /** НОВОЕ: прямой проброс картинки-обоев (imageHash) */
  imageHash?: string
  /** НОВОЕ: прямой проброс цвета (если appearance не задан) */
  fillColor?: string
}

/**
 * Background
 * Приоритет:
 * 1) appearance.bgKind === "image" && (bgImageSrc || bgImageHash || imageHash)
 *    - если есть bgImageSrc (data URL) → <Image src=...>
 *    - иначе если есть hash → <Image imageHash=...>
 *    - если kind не указан, но есть bgImageSrc/hash → тоже используем картинку
 * 2) solid (appearance.bgColor || fillColor)
 * 3) Легаси: base64-обои по type+theme
 */
export function Background({
  theme,
  type = "latest",
  appearance,
  imageHash,
  fillColor,
  ...props
}: BackgroundProps) {
  const kind = appearance?.bgKind
  const hash = appearance?.bgImageHash ?? imageHash
  const dataUrl = appearance?.bgImageSrc

  const color =
    appearance?.bgColor ??
    fillColor ??
    (appearance?.theme
      ? appearance.theme === "dark"
        ? "#0e0f12"
        : "#ffffff"
      : theme === "dark"
      ? "#0e0f12"
      : "#ffffff")

  const hasAnyImage = !!dataUrl || !!hash
  const useImage = (kind === "image" && hasAnyImage) || (kind !== "solid" && hasAnyImage)
  const useSolid = kind === "solid" || (!!fillColor && !useImage) || (!!appearance?.bgColor && !useImage)

  const legacySrc =
    type === "latest"
      ? theme === "dark"
        ? LatestDark64
        : LatestLight64
      : theme === "dark"
      ? FlatDark64
      : FlatLight64

  return (
    <Frame
      name="Background"
      overflow="hidden"
      // ВАЖНО: никакого width/height здесь — размер приходит от родителя (Interface)
      {...props}
    >
      {useImage ? (
        dataUrl ? (
          <Image
            name="wallpaper-image-src"
            src={dataUrl}
            width={"fill-parent"}
            height={"fill-parent"}
          />
        ) : hash ? (
          <Image
            name="wallpaper-image-hash"
            imageHash={hash}
            width={"fill-parent"}
            height={"fill-parent"}
          />
        ) : (
          <Rectangle name="wallpaper-solid-fallback" width={"fill-parent"} height={"fill-parent"} fill={color} />
        )
      ) : useSolid ? (
        <Rectangle name="wallpaper-solid" width={"fill-parent"} height={"fill-parent"} fill={color} />
      ) : (
        <Image name="wallpaper-legacy" src={legacySrc} width={"fill-parent"} height={"fill-parent"} />
      )}
    </Frame>
  )
}
