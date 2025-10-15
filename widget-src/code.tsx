/* This is a Telegram bot chat generator. */
// === Figma Widget API ===
const { widget } = figma
const { AutoLayout } = widget

// === Hooks ===
import { useWidgetMenu, useDynamicState } from "@/hooks"

// === Display components
import { PhoneFrame, Interface, MessagesLayout, MessagePreview } from "@/components/display"

// === Editor
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
  return messages.map(row => row?.map((m, idx) => ({ id: m.id ?? `${Date.now()}_${idx}`, ...m })))
}
const toVpKey = (v: number): "sm" | "md" | "lg" => (v === 0 ? "sm" : v === 1 ? "md" : "lg")

function Widget() {
  const { chatId, displayMode, viewport, theme, isEditMode } = useWidgetMenu()

  // ---- Chat state ----
  const defaultChatState: ChatState = {
    messages: withIds(CHATS[chatId]),
    profile: { name: "Elizabeth", lastSeen: "last seen just now" },
    system: { phoneTime: "9:41", batteryPercent: 58, isCharging: false },
    appearance: { theme, bgKind: "solid", bgColor: theme === "dark" ? "#0e0f12" : "#ffffff" },
    composer: { rounded: true, showMic: true, showAttach: true, placeholder: "Message" },
    paging: { window: 12, offset: 0, autoScrollToEnd: true },
  }
  const [chatState, setChatState] = useDynamicState<ChatState>(defaultChatState)

  // ---- Editor state ----
  const defaultEditorState: EditorState = {
    ...REPLIES[chatId],
    hidePreview: false,
    autoTime: true,
    id: undefined,
    time: undefined,
    imageHash: undefined,
  }
  const [editorState, setEditorState] = useDynamicState<EditorState>(defaultEditorState)

  const showPreview = isEditMode && !editorState.hidePreview

  // Добавление сообщения
  const pushMessage = (msg: Message) => {
    const time = editorState.autoTime ? nowHHMM() : (msg.time ?? nowHHMM())
    const withTime: Message = { ...msg, time, id: msg.id ?? `${Date.now()}` }

    setChatState("messages", (prev = []) => {
      const copy = Array.isArray(prev) ? [...prev] : []
      if (copy.length === 0) copy.push([])
      const lastRow = copy[copy.length - 1] ?? []
      copy[copy.length - 1] = [...lastRow, withTime]
      return copy
    })

    if (chatState.paging?.autoScrollToEnd) setChatState("paging", p => ({ ...p, offset: 0 }))
  }

  return (
    <AutoLayout name="Widget Container" width={"hug-contents"} height={"hug-contents"} overflow="visible" spacing={0}>
      {/* Generated Chat (Displayed Result) */}
      <PhoneFrame renderElements={displayMode <= 0} theme={theme} viewport={toVpKey(viewport)}>
        <Interface
          renderElements={displayMode <= 1}
          chatId={chatId}
          viewport={viewport}
          theme={theme}
          profile={chatState.profile}
          system={chatState.system}
          appearance={chatState.appearance}
          composer={chatState.composer}
        >
          <MessagesLayout
            renderElements={displayMode <= 2}
            messages={chatState.messages}
            paging={chatState.paging}           // ← важно
            theme={theme}
          >
            {showPreview && <MessagePreview editorState={editorState} theme={theme} />}
          </MessagesLayout>
        </Interface>
      </PhoneFrame>

      {/* Editor Mode (New Message Constructor) */}
      <MessageBuilder
        renderElement={isEditMode}
        editorManager={[editorState, setEditorState, setChatState]}
        theme={theme}
      />
    </AutoLayout>
  )
}

widget.register(Widget)
