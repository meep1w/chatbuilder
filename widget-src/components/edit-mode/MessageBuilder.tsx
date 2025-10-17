// widget-src/components/edit-mode/MessageBuilder.tsx

// Dependencies
const { AutoLayout, Text } = figma.widget
// Utils & Hooks
import { remapTokens } from "@/utils"
import { type SetterProp, useDynamicState } from "@/hooks"
import { EDITOR_STATE, EDITOR_INPUTS } from "@/constants"
// Internal atoms
import {
  Section, Label, ButtonsRow, Button,
  ButtomSmall, ChatButtonEditable, Selector, TextInput, Icon, Slider
} from "@/components/edit-mode/atoms"

interface MessageBuilderProps extends Partial<AutoLayoutProps>, ReqCompProps {
  renderElement: boolean
  editorManager: [EditorState, SetterProp<EditorState>, SetterProp<ChatState>]
}

// ===== helpers =====
const nowHHMM = (): string => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, "0")
  const m = String(d.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}

/** base64 → Uint8Array */
function base64ToBytes(b64: string): Uint8Array {
  const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  const clean = b64.replace(/[\r\n\s]/g, "")
  const len = clean.length
  const placeHolders = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0
  const arrLen = ((len * 3) >> 2) - placeHolders
  const bytes = new Uint8Array(arrLen)
  let L = 0
  for (let i = 0; i < len; i += 4) {
    const c0 = table.indexOf(clean[i])
    const c1 = table.indexOf(clean[i + 1])
    const c2 = table.indexOf(clean[i + 2])
    const c3 = table.indexOf(clean[i + 3])
    const n = (c0 << 18) | (c1 << 12) | ((c2 & 63) << 6) | (c3 & 63)
    if (L < arrLen) bytes[L++] = (n >> 16) & 0xff
    if (L < arrLen) bytes[L++] = (n >> 8) & 0xff
    if (L < arrLen) bytes[L++] = n & 0xff
  }
  return bytes
}

/** data URL → Uint8Array */
function dataUrlToBytes(dataUrl: string): Uint8Array | null {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) return null
  try { return base64ToBytes(m[2]) } catch { return null }
}

/** Строка похожа на hash (короткая, без префикса data:) */
const looksLikeHash = (v?: string) => !!v && !v.startsWith("data:") && v.trim().length >= 40

/** Извлечь размеры PNG/JPEG/GIF из bytes */
function probeImageSize(bytes: Uint8Array): { w: number; h: number } | null {
  if (bytes.length < 10) return null
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    if (bytes.length >= 24) {
      const w = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19]
      const h = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23]
      return w > 0 && h > 0 ? { w, h } : null
    }
    return null
  }
  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[5] === 0x61) {
    const w = bytes[6] | (bytes[7] << 8)
    const h = bytes[8] | (bytes[9] << 8)
    return w > 0 && h > 0 ? { w, h } : null
  }
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2
    while (i + 9 < bytes.length) {
      if (i >= bytes.length) break
      if (bytes[i] !== 0xff) { i++; continue }
      const marker = bytes[i + 1]
      const len = (bytes[i + 2] << 8) | bytes[i + 3]
      if (marker === 0xc0 || marker === 0xc2) {
        if (i + 9 < bytes.length) {
          const h = (bytes[i + 5] << 8) | bytes[i + 6]
          const w = (bytes[i + 7] << 8) | bytes[i + 8]
          return w > 0 && h > 0 ? { w, h } : null
        }
        return null
      }
      if (len < 2) break
      i += 2 + len
    }
  }
  return null
}

export function MessageBuilder({ editorManager, renderElement, theme, ...props }: MessageBuilderProps) {
  const [
    // editor
    { dir, type, text, name, extension, size, buttons, hidePreview, isImg, time, autoTime, src, imgW, imgH, imageHash },
    setEditorState,
    // chat
    setChatState
  ] = editorManager

  // ===== Локальное UI-состояние для тумблеров (только визуальное) =====
  const [ui, setUI] = useDynamicState({
    rounded: true,
    showAttach: true,
    showMic: true,
    charging: false,
    imageBg: false,
  })

  /** Reset all Inputs to default */
  const resetInputs = () => {
    Object.entries(EDITOR_STATE).forEach(([key, value]) => {
      setEditorState(key as keyof EditorState, value as any)
    })
    setEditorState("autoTime", true)
    setEditorState("src", "" as any)
    setEditorState("imgW", undefined as any)
    setEditorState("imgH", undefined as any)
    setEditorState("imageHash", undefined as any)
  }

  /** Кнопки под сообщением */
  const updateButton = (row: number, id: number, newvals: Partial<Message["buttons"][number][number]>) => {
    setEditorState(
      "buttons",
      buttons.map((buttonRow, rowIndex) =>
        rowIndex === row
          ? buttonRow.map((button, buttonIndex) =>
              buttonIndex === id ? { ...button, ...newvals } : button
            )
          : buttonRow
      )
    )
  }
  const addButtonToRow = (row: number, nextId: number) => {
    setEditorState(
      "buttons",
      buttons.map((buttonsRow, rowIndex) =>
        rowIndex === row ? [...buttonsRow, { id: nextId, text: `Button ${rowIndex + 1}-${nextId}`, hasRef: false }] : buttonsRow
      )
    )
  }
  const removeButtonFromRow = (row: number, id: number) => {
    if (buttons[row].length === 1) {
      setEditorState("buttons", buttons.filter((_, rowIndex) => rowIndex !== row))
    } else {
      setEditorState(
        "buttons",
        buttons.map((buttonsRow, rowIndex) =>
          rowIndex === row ? buttonsRow.filter((button) => button.id !== id) : buttonsRow
        )
      )
    }
  }
  const addRowOfButtons = () => {
    setEditorState("buttons", [...buttons, [{ id: 1, text: `Button ${buttons.length}-1`, hasRef: false }]])
  }

  /** Добавление сообщения: id + время + imageHash/imgW/imgH (для image) + автоскролл; безопасная группировка */
  const addMessageToChat = () => {
    const newMessage: Message = {
      id: `${Date.now()}`,
      dir,
      type,
      text,
      name,
      extension,
      size,
      buttons,
      isImg,
      time: autoTime ? nowHHMM() : (time || nowHHMM()),
      // для скорости не тянем длинные data URL в историю
      src: undefined,
      imageHash: imageHash,
      imgW: imgW as any,
      imgH: imgH as any,
    }

    setChatState("messages", (prev = []) => {
      const copy = Array.isArray(prev) ? [...prev] : []
      const last = copy[copy.length - 1]
      if (last && Array.isArray(last) && last[0]?.dir === dir) {
        last.push(newMessage)
      } else {
        copy.push([newMessage])
      }
      return copy
    })

    setChatState("paging", (p: Paging | undefined) => {
      if (!p) return p as any
      return p.autoScrollToEnd ? { ...p, offset: 0 } : p
    })

    setEditorState("dir", (prev) => ((prev + 1) % EDITOR_INPUTS.dir.map.length) as typeof prev)
  }

  // ===== Обработчики для картинок =====

  /** Image Source: принимает и hash, и data URL */
  const onChangeImageSrc = (value: string) => {
    const v = (value || "").trim()
    if (looksLikeHash(v)) {
      // просто сохраняем hash; src чистим
      setEditorState("imageHash", v as any)
      setEditorState("src", "" as any)
      // размеры неизвестны — оставляем прежние (если были) или undefined
      return
    }

    // data URL → bytes → size → createImage → hash
    setEditorState("src", v as any) // чтобы при необходимости видеть превью до очистки
    const bytes = dataUrlToBytes(v)
    if (!bytes) {
      setEditorState("imgW", undefined as any)
      setEditorState("imgH", undefined as any)
      setEditorState("imageHash", undefined as any)
      return
    }
    const sz = probeImageSize(bytes)
    if (sz) {
      setEditorState("imgW", sz.w as any)
      setEditorState("imgH", sz.h as any)
    } else {
      setEditorState("imgW", undefined as any)
      setEditorState("imgH", undefined as any)
    }
    const img = figma.createImage(bytes)
    setEditorState("imageHash", img.hash as any)
    setEditorState("src", "" as any) // очищаем длинную строку для скорости
  }

  /** Avatar: принимает и hash, и data URL */
  const onChangeAvatar = (value: string) => {
    const v = (value || "").trim()
    if (looksLikeHash(v)) {
      setChatState("profile", (p: ProfileInfo | undefined) => ({
        ...(p ?? { name: "", lastSeen: "last seen just now" }),
        avatarHash: v,
        avatarSrc: undefined,
      }))
      return
    }
    const bytes = dataUrlToBytes(v)
    if (!bytes) {
      // не data URL — оставим как src (на твой fallback)
      setChatState("profile", (p: ProfileInfo | undefined) => ({
        ...(p ?? { name: "", lastSeen: "last seen just now" }),
        avatarSrc: v,
        avatarHash: undefined,
      }))
      return
    }
    const img = figma.createImage(bytes)
    setChatState("profile", (p: ProfileInfo | undefined) => ({
      ...(p ?? { name: "", lastSeen: "last seen just now" }),
      avatarHash: img.hash,
      avatarSrc: undefined,
    }))
  }

  /** Wallpaper: принимает и hash, и data URL */
  const onChangeWallpaper = (value: string) => {
    const v = (value || "").trim()
    setChatState("appearance", (a: ChatAppearance | undefined) => {
      const cur = a ?? { theme, bgKind: "solid", bgColor: theme === "dark" ? "#0e0f12" : "#ffffff" }
      if (looksLikeHash(v)) {
        return { ...cur, bgKind: "image", bgImageHash: v, bgImageSrc: undefined }
      }
      const bytes = dataUrlToBytes(v)
      if (!bytes) {
        return { ...cur, bgImageSrc: v }
      }
      const img = figma.createImage(bytes)
      return { ...cur, bgKind: "image", bgImageHash: img.hash, bgImageSrc: undefined }
    })
  }

  // ===== Theme palette for editor panel =====
  const color = remapTokens({
    surface: {
      primaryHover: { dark: "#EAFFC8", light: "#567FE7" },
      primary: { dark: "#D3FF8D", light: "#2851B7" },
      primary30: { dark: "#D3FF8D4D", light: "#2851B74D" },
      telegramButton: { dark: "#FFF3", light: "#24242487" },
      action: { dark: "#313131", light: "#313131" },
      actionHover: { dark: "#444444", light: "#444444" },
      inputBg: { dark: "#0000004D", light: "#00000015" },
      bg: { dark: "#252525", light: "#FFFFFF" },
    },
    text: {
      default: { dark: "#FFFFFF", light: "#000" },
      inverted: { dark: "#000", light: "#FFF" },
      black: { dark: "#000", light: "#000" },
      white: { dark: "#FFF", light: "#FFF" },
    },
  })[theme]

  // ===== Переключатели (только на Slider.onEvent — без двойных кликов) =====
  const toggleCharging = () => {
    setUI("charging", (v) => !v)
    setChatState("system", (s: SystemBar | undefined) => ({
      ...(s ?? { phoneTime: "9:41", batteryPercent: 58, isCharging: false }),
      isCharging: !(s?.isCharging ?? false),
    }))
  }
  const toggleImageBg = () => {
    setUI("imageBg", (v) => !v)
    setChatState("appearance", (a: ChatAppearance | undefined) => {
      const cur = a ?? { theme, bgKind: "solid", bgColor: theme === "dark" ? "#0e0f12" : "#ffffff" }
      return { ...cur, bgKind: cur.bgKind === "solid" ? "image" : "solid" }
    })
  }
  const toggleRounded = () => {
    setUI("rounded", (v) => !v)
    setChatState("composer", (c: ComposerStyle | undefined) => ({
      ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }),
      rounded: !(c?.rounded ?? true),
    }))
  }
  const toggleShowAttach = () => {
    setUI("showAttach", (v) => !v)
    setChatState("composer", (c: ComposerStyle | undefined) => ({
      ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }),
      showAttach: !(c?.showAttach ?? true),
    }))
  }
  const toggleShowMic = () => {
    setUI("showMic", (v) => !v)
    setChatState("composer", (c: ComposerStyle | undefined) => ({
      ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }),
      showMic: !(c?.showMic ?? true),
    }))
  }

  // ===== Reusable: секция кнопок под сообщением =====
  function ButtonsSection() {
    return (
      <AutoLayout name="Buttons Container" cornerRadius={8} overflow="visible" direction="vertical" spacing={12} width="fill-parent">
        {buttons.map(
          (buttonsRow, rowIndex) =>
            buttonsRow.length > 0 && (
              <ButtonsRow key={rowIndex}>
                <ButtomSmall onEvent={() => removeButtonFromRow(rowIndex, buttonsRow.length - 1)} icon="minus" tooltip="Remove Button From Row" colorPalette={color} />
                {buttonsRow.map((button, buttonIndex) => (
                  <ChatButtonEditable
                    key={buttonIndex}
                    value={button.text}
                    onEvent={(e) => updateButton(rowIndex, buttonIndex, { text: e.characters })}
                    name="chat-button"
                    width="fill-parent"
                    colorPalette={color}
                  />
                ))}
                <ButtomSmall onEvent={() => addButtonToRow(rowIndex, buttonsRow.length + 1)} tooltip="Add Button To Row" colorPalette={color} />
              </ButtonsRow>
            ),
        )}
        <ButtonsRow>
          <ButtomSmall onEvent={() => addRowOfButtons()} colorPalette={color}>
            Add Row of Buttons
          </ButtomSmall>
        </ButtonsRow>
      </AutoLayout>
    )
  }

  return (
    renderElement && (
      <AutoLayout
        name="MessageBuilder"
        positioning="absolute"
        overflow="visible"
        width={390}
        y={16}
        x={{ type: "right", offset: -25 - 390 }}
        effect={[
          { type: "drop-shadow", color: "#00000059", offset: { x: 0, y: 3 }, blur: 26, showShadowBehindNode: false },
          { type: "drop-shadow", color: "#00000040", offset: { x: 0, y: 4 }, blur: 108.5, showShadowBehindNode: false },
        ]}
        fill={color.surface.bg}
        cornerRadius={16}
        direction="vertical"
        spacing={24}
        padding={{ vertical: 32, horizontal: 16 }}
        height={"hug-contents"}
        horizontalAlignItems="center"
        stroke={color.surface.primary30}
        strokeAlign="outside"
        strokeDashPattern={[16, 8]}
        {...props}
      >
        {/* Title */}
        <Section horizontalAlignItems={"center"}>
          <Text name="title" fill={color.text.default} verticalAlignText="center" lineHeight={22} fontSize={22} fontWeight={600} height={46}>
            Add New Message
          </Text>
          <Icon
            tooltip={hidePreview ? "Show Preview Message" : "Hide Preview Message"}
            onEvent={() => setEditorState("hidePreview", (bool) => !bool)}
            icon={hidePreview ? "show" : "hide"}
            theme={theme}
            opacity={hidePreview ? 1 : 0.5}
            x={{ type: "left", offset: 6 }}
            color={hidePreview ? (color.surface.primaryHover as string) : (color.text.default as string)}
          />
          <Icon tooltip="Reset New Message Inputs" onEvent={resetInputs} icon={"reset"} theme={theme} color={color.text.default as string} />
        </Section>

        {/* Direction */}
        <Section>
          <Label colorPalette={color}>Message Direction</Label>
          <Selector
            onEvent={(_, i) => setEditorState("dir", i)}
            value={dir}
            options={[...EDITOR_INPUTS.dir.map]}
            tips={[...EDITOR_INPUTS.dir.tips]}
            colorPalette={color}
          />
        </Section>

        {/* Type */}
        <Section>
          <Label colorPalette={color}>Message Type</Label>
          <Selector
            onEvent={(_, i) => setEditorState("type", i)}
            value={type}
            options={[...EDITOR_INPUTS.type.map]}
            tips={[...EDITOR_INPUTS.type.tips]}
            colorPalette={color}
          />
        </Section>

        {/* Message Type File (index 0) */}
        <Section hidden={type !== 0}>
          <Label colorPalette={color}>Image Details</Label>
          <TextInput onEvent={(e) => setEditorState("name", e.characters)} value={name} placeholder="Image/ File Name" colorPalette={color} />
          <TextInput onEvent={(e) => setEditorState("extension", e.characters)} value={extension} placeholder="Image/ File Extension" colorPalette={color} />
          <TextInput onEvent={(e) => setEditorState("size", e.characters)} value={size} placeholder="Image/ File Size" colorPalette={color} />
          <ButtonsSection />
          <ButtonsRow>
            <Text name="title" fill={color.text.default} width="fill-parent" lineHeight={22} fontSize={17} fontWeight={500}>
              Compressed Image
            </Text>
            <Slider onEvent={() => setEditorState("isImg", (prev) => !prev)} value={isImg} colorPalette={color} />
          </ButtonsRow>
        </Section>

        {/* Message Type Text (index 1) */}
        <Section hidden={type !== 1}>
          <Label colorPalette={color}>Message Content</Label>
          <TextInput
            onEvent={(e) => setEditorState("text", e.characters)}
            value={text}
            placeholder="Text Message..."
            isResizable={true}
            colorPalette={color}
          />
          <ButtonsSection />
        </Section>

        {/* Message Type Image (index 2) */}
        <Section hidden={type !== 2}>
          <Label colorPalette={color}>Message Content</Label>
          <TextInput
            onEvent={(e) => setEditorState("text", e.characters)}
            value={text}
            placeholder="Text Message..."
            isResizable={true}
            colorPalette={color}
          />
          {/* Image Source: hash ИЛИ data URL */}
          <TextInput
            onEvent={(e) => onChangeImageSrc(e.characters)}
            value={looksLikeHash(src as any) ? "" : ((src as any) ?? "")}
            placeholder="Image Source (hash or data URL)"
            isResizable={true}
            colorPalette={color}
          />
          <ButtonsSection />
        </Section>

        {/* ===== Message time ===== */}
        <Section>
          <Label colorPalette={color}>Message time</Label>
          <ButtonsRow>
            <Text fill={color.text.default}>Auto time</Text>
            <Slider onEvent={() => setEditorState("autoTime", (v) => !v)} value={!!autoTime} colorPalette={color} />
          </ButtonsRow>
          <TextInput
            onEvent={(e) => setEditorState("time", e.characters)}
            value={autoTime ? "" : (time ?? "")}
            placeholder="HH:MM"
            opacity={autoTime ? 0.4 : 1}
            isDisabled={!!autoTime}
            colorPalette={color}
          />
        </Section>

        {/* ===== Profile ===== */}
        <Section>
          <Label colorPalette={color}>Profile</Label>
          <TextInput
            onEvent={(e) => setChatState("profile", (p: ProfileInfo | undefined) => ({ ...(p ?? { name: "", lastSeen: "last seen just now" }), name: e.characters }))}
            value={""}
            placeholder="Name (header title)"
            colorPalette={color}
          />
          <TextInput
            onEvent={(e) => setChatState("profile", (p: ProfileInfo | undefined) => ({ ...(p ?? { name: "", lastSeen: "last seen just now" }), lastSeen: e.characters }))}
            value={""}
            placeholder="Last seen / Status (e.g., online)"
            colorPalette={color}
          />
          {/* Avatar: hash или data URL */}
          <TextInput
            onEvent={(e) => onChangeAvatar(e.characters)}
            value={""}
            placeholder="Avatar image (hash or data URL)"
            isResizable={true}
            colorPalette={color}
          />
        </Section>

        {/* ===== System bar ===== */}
        <Section>
          <Label colorPalette={color}>System bar</Label>
          <TextInput
            onEvent={(e) => setChatState("system", (s: SystemBar | undefined) => ({ ...(s ?? { phoneTime: "9:41", batteryPercent: 58, isCharging: false }), phoneTime: e.characters }))}
            value={""}
            placeholder='Phone time (e.g., "9:41")'
            colorPalette={color}
          />
          <TextInput
            onEvent={(e) => {
              const v = Math.max(0, Math.min(100, parseInt(e.characters || "0", 10) || 0))
              setChatState("system", (s: SystemBar | undefined) => ({ ...(s ?? { phoneTime: "9:41", batteryPercent: 58, isCharging: false }), batteryPercent: v }))
            }}
            value={""}
            placeholder="Battery % (0..100)"
            colorPalette={color}
          />
          <ButtonsRow>
            <Text fill={color.text.default}>Charging</Text>
            <Slider onEvent={toggleCharging} value={ui.charging} colorPalette={color} />
          </ButtonsRow>
        </Section>

        {/* ===== Background ===== */}
        <Section>
          <Label colorPalette={color}>Background</Label>

          {/* Wallpaper: hash или data URL */}
          <TextInput
            onEvent={(e) => onChangeWallpaper(e.characters)}
            value={""}
            placeholder="Wallpaper image (hash or data URL)"
            isResizable={true}
            colorPalette={color}
          />

          <ButtonsRow>
            <Text fill={color.text.default}>Image background</Text>
            <Slider onEvent={toggleImageBg} value={ui.imageBg} colorPalette={color} />
          </ButtonsRow>

          <TextInput
            onEvent={(e) =>
              setChatState("appearance", (a: ChatAppearance | undefined) => {
                const cur = a ?? { theme, bgKind: "solid", bgColor: theme === "dark" ? "#0e0f12" : "#ffffff" }
                return { ...cur, bgColor: e.characters }
              })
            }
            value={""}
            placeholder="Solid color (hex, e.g., #0e0f12)"
            colorPalette={color}
          />
        </Section>

        {/* ===== Composer ===== */}
        <Section>
          <Label colorPalette={color}>Composer</Label>
          <ButtonsRow>
            <Text fill={color.text.default}>Rounded</Text>
            <Slider onEvent={toggleRounded} value={ui.rounded} colorPalette={color} />
          </ButtonsRow>
          <ButtonsRow>
            <Text fill={color.text.default}>Show attach</Text>
            <Slider onEvent={toggleShowAttach} value={ui.showAttach} colorPalette={color} />
          </ButtonsRow>
          <ButtonsRow>
            <Text fill={color.text.default}>Show mic</Text>
            <Slider onEvent={toggleShowMic} value={ui.showMic} colorPalette={color} />
          </ButtonsRow>
          <TextInput
            onEvent={(e) => setChatState("composer", (c: ComposerStyle | undefined) => ({ ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }), placeholder: e.characters }))}
            value={""}
            placeholder='Placeholder (e.g., "Message")'
            colorPalette={color}
          />
        </Section>

        {/* Editor Main Event */}
        <Button onEvent={addMessageToChat} colorPalette={color}>
          Add To Chat
        </Button>
      </AutoLayout>
    )
  )
}
