// widget-src/components/edit-mode/MessageBuilder.tsx

// Dependencies
const { AutoLayout, Text } = figma.widget
// Utils & Hooks
import { remapTokens } from "@/utils"
import { type SetterProp } from "@/hooks"
import { EDITOR_STATE, EDITOR_INPUTS } from "@/constants"
// Internal atoms
import {
  Section, Label, ButtonsRow, Button,
  ButtomSmall, ChatButtonEditable, Selector, TextInput, Icon, Slider
} from "@/components/edit-mode/atoms"

interface MessageBuilderProps extends Partial<AutoLayoutProps>, ReqCompProps {
  /** Fully Hide from layers tree */
  renderElement: boolean
  /** Editor State Manager (New Message Inputs Centralized State at base code.tsx) & setChatState */
  editorManager: [EditorState, SetterProp<EditorState>, SetterProp<ChatState>]
}

// helpers
const nowHHMM = (): string => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, "0")
  const m = String(d.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}

export function MessageBuilder({ editorManager, renderElement, theme, ...props }: MessageBuilderProps) {
  const [
    // editor
    { dir, type, text, name, extension, size, buttons, hidePreview, isImg, time, autoTime },
    setEditorState,
    // chat
    setChatState
  ] = editorManager

  /** Reset all Inputs to default */
  const resetInputs = () => {
    Object.entries(EDITOR_STATE).forEach(([key, value]) => {
      setEditorState(key as keyof EditorState, value as any)
    })
    setEditorState("autoTime", true)
  }

  /** Overrides values of a specific button */
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
      // Remove row
      setEditorState("buttons", buttons.filter((_, rowIndex) => rowIndex !== row))
    } else {
      // Remove Last Button
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

  /** Добавление сообщения с поддержкой id + времени + автоскролла */
  const addMessageToChat = () => {
    // готовим новое сообщение
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
    }

    // Помещаем в chatState.messages, сохраняя группировку по направлению
    setChatState("messages", (prevMessages) => {
      const allMsgs = [...(prevMessages ?? [])]
      const dirMsgs = allMsgs.pop()

      if (typeof dirMsgs !== "undefined" && dirMsgs[0]?.dir === dir) {
        dirMsgs.push(newMessage)
        allMsgs.push(dirMsgs)
      } else {
        allMsgs.push(dirMsgs)
        allMsgs.push([newMessage])
      }
      return allMsgs
    })

    // Сбросить оффсет пагинации к концу, если включён автоскролл
    setChatState("paging", (p: Paging | undefined) => {
      if (!p) return p as any
      return p.autoScrollToEnd ? { ...p, offset: 0 } : p
    })

    // Переключить сторону (как было)
    setEditorState("dir", (prev) => ((prev + 1) % EDITOR_INPUTS.dir.map.length) as typeof prev)
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

        {/* Message Type File (index 0 в исходном проекте) */}
        <Section hidden={type !== 0}>
          <Label colorPalette={color}>Image Details</Label>
          <TextInput onEvent={(e) => setEditorState("name", e.characters)} value={name} placeholder="Image/ File Name" colorPalette={color} />
          <TextInput onEvent={(e) => setEditorState("extension", e.characters)} value={extension} placeholder="Image/ File Extension" colorPalette={color} />
          <TextInput onEvent={(e) => setEditorState("size", e.characters)} value={size} placeholder="Image/ File Size" colorPalette={color} />
          <ButtonsSection />
          <AutoLayout
            onClick={() => setEditorState("isImg", (prev) => !prev)}
            tooltip="File Preview Is Image"
            width={"fill-parent"}
            spacing={8}
            padding={{ vertical: 0, horizontal: 16 }}
            verticalAlignItems="center"
          >
            <Text name="title" fill={color.text.default} width="fill-parent" lineHeight={22} fontSize={17} fontWeight={500}>
              Compressed Image
            </Text>
            <Slider onEvent={console.log} value={isImg} colorPalette={color} />
          </AutoLayout>
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
          <ButtonsSection />
          <TextInput onEvent={console.log} value={"Preview Image"} placeholder="Image Source" opacity={0.5} colorPalette={color} />
        </Section>

        {/* ===== NEW: Message time ===== */}
        <Section>
          <Label colorPalette={color}>Message time</Label>
          <ButtonsRow>
            <Text fill={color.text.default}>Auto time</Text>
            <Slider
              onEvent={() => setEditorState("autoTime", (v) => !v)}
              value={!!autoTime}
              colorPalette={color}
            />
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

        {/* ===== NEW: Profile (name, last seen) ===== */}
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
          {/* Аватарку добавим через drop-хэндлер отдельно при необходимости */}
        </Section>

        {/* ===== NEW: System bar ===== */}
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
            <Slider
              onEvent={() => setChatState("system", (s: SystemBar | undefined) => ({ ...(s ?? { phoneTime: "9:41", batteryPercent: 58, isCharging: false }), isCharging: !(s?.isCharging ?? false) }))}
              value={false}
              colorPalette={color}
            />
          </ButtonsRow>
        </Section>

        {/* ===== NEW: Background ===== */}
        <Section>
          <Label colorPalette={color}>Background</Label>
          {/* Тип фона: упрощённо — toggler Solid/Image */}
          <ButtonsRow>
            <Text fill={color.text.default}>Image background</Text>
            <Slider
              onEvent={() =>
                setChatState("appearance", (a: ChatAppearance | undefined) => {
                  const cur = a ?? { theme, bgKind: "solid", bgColor: theme === "dark" ? "#0e0f12" : "#ffffff" }
                  return { ...cur, bgKind: cur.bgKind === "solid" ? "image" : "solid" }
                })
              }
              value={false}
              colorPalette={color}
            />
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
          {/* Загрузка картинки как фона можно добавить отдельным дроп-атомом (imageHash) */}
        </Section>

        {/* ===== NEW: Composer ===== */}
        <Section>
          <Label colorPalette={color}>Composer</Label>
          <ButtonsRow>
            <Text fill={color.text.default}>Rounded</Text>
            <Slider
              onEvent={() => setChatState("composer", (c: ComposerStyle | undefined) => ({ ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }), rounded: !(c?.rounded ?? true) }))}
              value={true}
              colorPalette={color}
            />
          </ButtonsRow>
          <ButtonsRow>
            <Text fill={color.text.default}>Show attach</Text>
            <Slider
              onEvent={() => setChatState("composer", (c: ComposerStyle | undefined) => ({ ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }), showAttach: !(c?.showAttach ?? true) }))}
              value={true}
              colorPalette={color}
            />
          </ButtonsRow>
          <ButtonsRow>
            <Text fill={color.text.default}>Show mic</Text>
            <Slider
              onEvent={() => setChatState("composer", (c: ComposerStyle | undefined) => ({ ...(c ?? { rounded: true, showMic: true, showAttach: true, placeholder: "Message" }), showMic: !(c?.showMic ?? true) }))}
              value={true}
              colorPalette={color}
            />
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
