// widget-src/types/chat.d.ts
import { EDITOR_INPUTS } from "@/constants"

declare global {
  /** Кнопка под сообщением (одна ячейка в строке кнопок) */
  type MessageButtonCell = {
    id: number
    text: string
    hasRef: boolean
  }

  /** Одна строка кнопок под сообщением */
  type MessageButtonsRow = MessageButtonCell[]

  /** Message: остаётся совместимым с текущей логикой + новые опции */
  type Message = {
    /** Направление (индекс из EDITOR_INPUTS.dir.map) */
    dir: IndexesOf<typeof EDITOR_INPUTS.dir.map>
    /** Тип сообщения (индекс из EDITOR_INPUTS.type.map) */
    type: IndexesOf<typeof EDITOR_INPUTS.type.map>

    /** Текст сообщения (для text) */
    text: string

    /** Имя файла (для file) */
    name: string
    /** Размер файла (для file) */
    size: string
    /** Расширение (для file) */
    extension: string
    /** Показывать иконку как картинку (для file) */
    isImg: boolean

    /** Ряды кнопок под сообщением (совместимо с текущим UI) */
    buttons: MessageButtonsRow[][]

    /** НОВОЕ: уникальный id сообщения (нужен для списков/скролла) */
    id?: string
    /** НОВОЕ: время сообщения HH:MM (если не задано — можно подставлять авто) */
    time?: string
    /** НОВОЕ: hash картинки (для типа image) */
    imageHash?: string
  }

  /** НОВОЕ: профиль чата (хедер) */
  type ProfileInfo = {
    name: string            // Заголовок (имя/название чата)
    lastSeen: string        // "online" | "last seen just now" | любое
    avatarHash?: string     // Хеш аватарки (figma.createImageAsync(...).hash)
  }

  /** НОВОЕ: системная строка телефона (время/батарея) */
  type SystemBar = {
    phoneTime: string       // "9:41"
    batteryPercent: number  // 0..100
    isCharging: boolean     // идёт зарядка
  }

  /** НОВОЕ: внешний вид фон/тема */
  type ChatAppearance = {
    theme: "light" | "dark"
    bgKind: "solid" | "image"
    bgColor: string
    bgImageHash?: string
  }

  /** НОВОЕ: стили нижней панели (композер) */
  type ComposerStyle = {
    rounded: boolean
    showMic: boolean
    showAttach: boolean
    placeholder: string
  }

  /** НОВОЕ: пагинация/листание истории */
  type Paging = {
    window: number            // сколько сообщений показывать за раз
    offset: number            // смещение от конца (0 — показываем последние)
    autoScrollToEnd: boolean  // прыгать в конец при добавлении нового
  }

  /** Состояние чата (расширено) */
  type ChatState = {
    /** Сообщения (как и было) */
    messages?: (Message[] | undefined)[]

    /** НОВОЕ: профиль */
    profile: ProfileInfo
    /** НОВОЕ: системная строка */
    system: SystemBar
    /** НОВОЕ: внешний вид */
    appearance: ChatAppearance
    /** НОВОЕ: нижняя панель */
    composer: ComposerStyle
    /** НОВОЕ: пагинация */
    paging: Paging
  }

  /** Состояние редактора: добавили авто-время и флаг скрытия превью */
  type EditorState = Message & {
    hidePreview: boolean
    /** НОВОЕ: если true — время подставляем автоматически при добавлении */
    autoTime: boolean
  }
}

export {}
