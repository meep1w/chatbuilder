// widget-src/components/ui/atoms/ProfilePicture.tsx

// Dependencies
const { Frame, Image, Rectangle } = figma.widget
// Fallback картинка (как раньше)
import { PROFILE_IMAGES } from "@/constants"

interface ProfilePicProps
  extends Omit<Partial<FrameProps>, "width" | "height"> {
  /** Предпочтительно: imageHash, полученный через figma.createImage(...) */
  imageHash?: string
  /** Data URL (совместимость; низкий приоритет) */
  avatarSrc?: string
  /** Старый вариант — src/base64 (фолбэк) */
  profilePicSrc?: string
  /** Размер аватарки (по умолчанию 37) */
  size?: number
}

/** Хелпер для image fill под аватар: масштабирование cover (FILL) */
function buildImageFill(hash: string): ImagePaint {
  return {
    type: "image",
    imageHash: hash,
    scaleMode: "FILL", // заполняем целиком, без искажений, по аналогии с object-fit: cover
  }
}

export function ProfilePic({
  imageHash,
  avatarSrc,
  profilePicSrc = PROFILE_IMAGES[1],
  size = 37,
  ...props
}: ProfilePicProps) {
  return (
    <Frame
      name="ProfilePic"
      overflow="hidden"
      // ВАЖНО: сначала спред, потом фиксируем размер
      {...props}
      width={size}
      height={size}
      cornerRadius={size / 2}
    >
      {imageHash ? (
        // Предпочтительный путь: Rectangle с image fill (cover), чтобы не было артефакта "100x100"
        <Rectangle
          name="AvatarHashFill"
          width={"fill-parent"}
          height={"fill-parent"}
          fills={[buildImageFill(imageHash)]}
        />
      ) : avatarSrc ? (
        // Совместимость: если прислали data URL — отображаем напрямую (лучше потом переводить в hash при загрузке)
        <Image
          name="AvatarSrc"
          src={avatarSrc}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      ) : profilePicSrc ? (
        <Image
          name="AvatarFallbackSrc"
          src={profilePicSrc}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      ) : (
        <Rectangle width={"fill-parent"} height={"fill-parent"} fill="#444" />
      )}
    </Frame>
  )
}
