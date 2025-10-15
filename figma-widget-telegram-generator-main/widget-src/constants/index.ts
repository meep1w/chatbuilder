import { IMAGE_BOT, IMAGE_CUSTOM, IMAGE_FRIEND } from "@/assets/base64"
import { CHAT_FRIENDS, CHAT_BOT, REPLY_BOT, REPLY_FRIEND, EDITOR_STATE } from "@/constants/messages"

export const THEME_MODES = ["light", "dark"] as const

/** Editor Manager State
 * dir - 0: out, 1: in
 * type - 0: image, 1: text
 */
export const EDITOR_INPUTS = {
   dir: { map: ["In", "Out"], tips: ["Incoming Message", "Outgoing Message"] },
   type: { map: ["File", "Text", "Image"], tips: ["File / Compressed Image", "Text Message", "Uncompressed Image"] },
} as const

// Widget Menu

export const DIMENSIONS = [
   { width: 390 + 19 * 2, height: 844 + 16 * 2 }, // lg
   { width: 390, height: 844 }, // md
   { width: 320, height: 568 }, // sm
]

// Chat

export const CHATS: (Message[] | undefined)[][] = [CHAT_BOT, CHAT_FRIENDS, []]
export const REPLIES: Message[] = [REPLY_BOT, REPLY_FRIEND, EDITOR_STATE]

export const USERNAMES: string[] = ["eMarket Bot", "Elizabeth", "Random User"]
export const PROFILE_IMAGES: string[] = [IMAGE_BOT, IMAGE_FRIEND, IMAGE_CUSTOM]

export { EDITOR_STATE }
