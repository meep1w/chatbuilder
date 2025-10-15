/* This is a Telegram bot chat generator. */
// === Figma Widget API ===
const { widget } = figma
const { AutoLayout } = widget

// === Hooks ===
import { useWidgetMenu, useDynamicState } from "@/hooks"

// === Display components (пока со старыми пропами) ===
import { PhoneFrame, Interface, MessagesLayout, MessagePreview } from "@/components/display"

// === Editor (пока со старыми пропами) ===
import { MessageBuilder } from "@/components/edit-mode"

// === Presets ===
import { REPLIES, CHATS } from "@/constants"

// ===== helpers =====
function nowHHMM(): string {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, "0")
  const m = String(d.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}
function withIds(messages?: (Message[] | undefined)[]): (Message[] | undefined)[] {
  if (!messages) return []
  return messages.map(row =>
    row?.map((m, idx) => ({ id: m.id ?? `${Date.now()}_${idx}`, ...m }))
  )
}

function Widget() {
  // Меню виджета (как было)
  const { chatId, displayMode, viewport, theme, isEditMode } = useWidgetMenu()

  // ---- Chat state (расширено) ----
  const defaultChatState: ChatState = {
    messages: withIds(CHATS[chatId]),
    profile: {
      name: "Elizabeth",
      lastSeen: "last seen just now",
      // avatarHash добавим позже из редактора/дропа
    },
    system: {
      phoneTime: "9:41",
      batteryPercent: 58,
      isCharging: false,
    },
    appearance: {
      theme,
      bgKind: "solid",
      bgColor: theme === "dark" ? "#0e0f12" : "#ffffff",
      // bgImageHash добавим позже из редактора/дропа
    },
    composer: {
      rounded: true,
      showMic: true,
      showAttach: true,
      placeholder: "Message",
    },
    paging: {
      window: 12,
      offset: 0,
      autoScrollToEnd: true,
    },
  }

  // Состояние чата
  const [chatState, setChatState] = useDynamicState<ChatState>(defaultChatState)

  // ---- Editor state (расширено) ----
  const defaultEditorState: EditorState = {
    ...REPLIES[chatId],
    hidePreview: false,
    autoTime: true,
    // безопасные дефолты для полей сообщения
    id: undefined,
    time: undefined,
    imageHash: undefined,
  }

  // Состояние редактора
  const [editorState, setEditorState] = useDynamicState<EditorState>(defaultEditorState)

  // Показывать превью сообщения
  const showPreview = isEditMode && !editorState.hidePreview

  // === Добавление сообщения с авто-временем (может вызываться из редактора позже) ===
  const pushMessage = (msg: Message) => {
    const time = editorState.autoTime ? nowHHMM() : (msg.time ?? nowHHMM())
    const withTime: Message = { ...msg, time, id: msg.id ?? `${Date.now()}` }

    setChatState("messages", (prev = []) => {
      const copy = Array.isArray(prev) ? [...prev] : []
      // По текущей структуре CHATS/.messages — это массив строк (in/out)
      // Добавим в конец последней строки (или создадим строку, если её нет)
      if (copy.length === 0) copy.push([])
      const lastRow = copy[copy.length - 1] ?? []
      copy[copy.length - 1] = [...lastRow, withTime]
      return copy
    })

    if (chatState.paging?.autoScrollToEnd) {
      setChatState("paging", (p) => ({ ...p, offset: 0 }))
    }
  }

  return (
    <AutoLayout
      name="Widget Container"
      width={"hug-contents"}
      height={"hug-contents"}
      overflow="visible"
      spacing={0}
    >
      {/* Generated Chat (Displayed Result) */}
      <PhoneFrame renderElements={displayMode <= 0} theme={theme}>
        <Interface renderElements={displayMode <= 1} chatId={chatId} viewport={viewport} theme={theme}>
          <MessagesLayout renderElements={displayMode <= 2} messages={chatState.messages} theme={theme}>
            {/* Preview Message */}
            {showPreview && <MessagePreview editorState={editorState} theme={theme} />}
          </MessagesLayout>
        </Interface>
      </PhoneFrame>

      {/* Editor Mode (New Message Constructor) */}
      <MessageBuilder
        renderElement={isEditMode}
        // Передаём как и раньше — редактор будет использовать setChatState.
        // Позже обновим его, чтобы вызывать pushMessage() и управлять новым состоянием.
        editorManager={[editorState, setEditorState, setChatState]}
        theme={theme}
      />
    </AutoLayout>
  )
}

widget.register(Widget)
