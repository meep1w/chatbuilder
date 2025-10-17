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
    /** НОВОЕ: источник картинки (data URL) для типа image=2 */
    src?: string
    /** НОВОЕ: естественные размеры картинки (для авто-масштаба) */
    imgW?: number
    imgH?: number
    /** Совместимость: hash картинки (если используется createImageAsync) */
    imageHash?: string
  }

  /** Профиль чата (хедер) */
  type ProfileInfo = {
    /** Заголовок (имя/название чата) */
    name: string
    /** "online" | "last seen just now" | произвольное */
    lastSeen: string
    /** НОВОЕ: аватар как data URL */
    avatarSrc?: string
    /** Совместимость: хеш аватарки (figma.createImageAsync(...).hash) */
    avatarHash?: string
  }

  /** Системная строка телефона (время/батарея) */
  type SystemBar = {
    phoneTime: string       // "9:41"
    batteryPercent: number  // 0..100
    isCharging: boolean     // идёт зарядка
  }

  /** Внешний вид: фон/тема */
  type ChatAppearance = {
    theme: "light" | "dark"
    bgKind: "solid" | "image"
    bgColor: string
    /** НОВОЕ: фон как data URL */
    bgImageSrc?: string
    /** Совместимость: хеш фоновой картинки */
    bgImageHash?: string
  }

  /** Стили нижней панели (композер) */
  type ComposerStyle = {
    rounded: boolean
    showMic: boolean
    showAttach: boolean
    placeholder: string
  }

  /** Пагинация/листание истории */
  type Paging = {
    window: number            // сколько сообщений показывать за раз
    offset: number            // смещение от конца (0 — показываем последние)
    autoScrollToEnd: boolean  // прыгать в конец при добавлении нового
  }

  /** Состояние чата (расширено) */
  type ChatState = {
    /** Сообщения (как и было) */
    messages?: (Message[] | undefined)[]

    /** Профиль */
    profile: ProfileInfo
    /** Системная строка */
    system: SystemBar
    /** Внешний вид */
    appearance: ChatAppearance
    /** Нижняя панель */
    composer: ComposerStyle
    /** Пагинация */
    paging: Paging
  }

  /** Состояние редактора: добавили авто-время и флаг скрытия превью */
  type EditorState = Message & {
    hidePreview: boolean
    /** Если true — время подставляем автоматически при добавлении */
    autoTime: boolean
    /** Ручное время HH:MM (используется если autoTime=false) */
    time?: string
    /** НОВОЕ: естественные размеры картинки для предпросмотра/сообщения */
    imgW?: number
    imgH?: number
  }
}

export {}
